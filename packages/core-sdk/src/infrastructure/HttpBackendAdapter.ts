import { BackendPort, VerificationRequest, VerificationResponse } from '../ports/BackendPort';
import { LoggerPort, ConsoleLogger } from '../ports/LoggerPort';

export interface HttpBackendConfig {
  baseUrl: string;
  authToken?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * HTTP-based backend adapter using fetch API
 * Implements retry logic, timeout, and error handling
 */
export class HttpBackendAdapter implements BackendPort {
  private logger: LoggerPort;

  constructor(
    private config: HttpBackendConfig,
    logger?: LoggerPort
  ) {
    this.logger = logger || new ConsoleLogger('warn');
  }

  async verify(request: VerificationRequest): Promise<VerificationResponse> {
    const { code, codeType = 'QR', retailerId } = request;
    const url = `${this.config.baseUrl}/api/verify`;

    this.logger.info('Verifying product code', { code, codeType });

    try {
      const response = await this.fetchWithRetry(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.authToken ? { Authorization: `Bearer ${this.config.authToken}` } : {}),
        },
        body: JSON.stringify({ code, codeType, retailerId }),
      });

      if (!response.ok) {
        this.logger.error('Verification API error', undefined, {
          status: response.status,
          statusText: response.statusText,
        });

        return {
          status: 'error',
          message: 'Verification service unavailable',
          errorCode: response.status,
        };
      }

      const data: VerificationResponse = await response.json();
      this.logger.info('Verification completed', { status: data.status });

      return data;
    } catch (error) {
      this.logger.error('Verification failed', error as Error);

      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    attempt: number = 0
  ): Promise<Response> {
    const maxAttempts = this.config.retryAttempts ?? 3;
    const retryDelay = this.config.retryDelay ?? 1000;
    const timeout = this.config.timeout ?? 30000;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Retry on 5xx errors
      if (response.status >= 500 && attempt < maxAttempts - 1) {
        this.logger.warn(`Server error, retrying (${attempt + 1}/${maxAttempts})`, {
          status: response.status,
        });

        await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        return this.fetchWithRetry(url, options, attempt + 1);
      }

      return response;
    } catch (error) {
      if (attempt < maxAttempts - 1) {
        this.logger.warn(`Request failed, retrying (${attempt + 1}/${maxAttempts})`);
        await this.delay(retryDelay * Math.pow(2, attempt));
        return this.fetchWithRetry(url, options, attempt + 1);
      }

      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

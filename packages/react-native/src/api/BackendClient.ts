import { BackendPort, VerificationRequest, VerificationResponse } from '../ports/BackendPort';
import { HttpBackendAdapter } from '../infrastructure/HttpBackendAdapter';
import { LoggerPort } from '../ports/LoggerPort';

export interface BackendClientConfig {
  baseUrl: string;
  authToken?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  logger?: LoggerPort;
}

/**
 * BackendClient wraps the HTTP adapter for easy use
 * Maintains backward compatibility while using new architecture
 */
export class BackendClient {
  private adapter: BackendPort;

  constructor(config: BackendClientConfig) {
    this.adapter = new HttpBackendAdapter(
      {
        baseUrl: config.baseUrl,
        authToken: config.authToken,
        timeout: config.timeout,
        retryAttempts: config.retryAttempts,
        retryDelay: config.retryDelay,
      },
      config.logger
    );
  }

  /**
   * Verify a product code
   * @deprecated Use adapter.verify() directly for better control
   */
  async verify(
    code: string,
    codeType?: 'QR' | 'DataMatrix' | 'EAN' | 'UPC'
  ): Promise<VerificationResponse> {
    const request: VerificationRequest = { code, codeType };
    return this.adapter.verify(request);
  }

  /**
   * Get the underlying adapter for advanced usage
   */
  getAdapter(): BackendPort {
    return this.adapter;
  }
}

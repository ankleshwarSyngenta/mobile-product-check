/**
 * Port interface for analytics tracking
 */
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
  timestamp?: number;
}

export interface AnalyticsPort {
  /**
   * Track an event
   */
  track(event: AnalyticsEvent): void;

  /**
   * Identify user (optional)
   */
  identify?(userId: string, traits?: Record<string, unknown>): void;
}

/**
 * No-op analytics implementation
 */
export class NoOpAnalytics implements AnalyticsPort {
  track(_event: AnalyticsEvent): void {
    // No operation
  }
}

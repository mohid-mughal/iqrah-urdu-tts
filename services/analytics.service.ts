/**
 * Analytics Service for tracking user interactions with Vercel Analytics
 * Provides silent error handling to prevent analytics failures from affecting UX
 */

import { track } from '@vercel/analytics';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export class AnalyticsService {
  /**
   * Track a synthesis action
   * @param model - The model used for synthesis ('standard' or 'phoneme')
   * @param hasReferenceAudio - Whether reference audio was used for voice cloning
   */
  trackSynthesis(model: string, hasReferenceAudio: boolean): void {
    this.safeTrack('synthesis', {
      model,
      hasReferenceAudio,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track a model tab switch
   * @param model - The model that was switched to ('standard' or 'phoneme')
   */
  trackModelSwitch(model: string): void {
    this.safeTrack('model_switch', {
      model,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track voice cloning usage
   * @param method - The method used for voice cloning ('upload' or 'recording')
   */
  trackVoiceCloning(method: 'upload' | 'recording'): void {
    this.safeTrack('voice_cloning', {
      method,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track a custom event with properties
   * @param event - The event to track
   */
  trackEvent(event: AnalyticsEvent): void {
    this.safeTrack(event.name, event.properties);
  }

  /**
   * Safely track an event with silent error handling
   * Prevents analytics failures from disrupting user experience
   * @param name - Event name
   * @param properties - Event properties
   */
  private safeTrack(name: string, properties?: Record<string, any>): void {
    try {
      // Call Vercel Analytics track function
      track(name, properties);
    } catch (error) {
      // Silent error handling - log to console but don't throw
      // This ensures analytics failures never affect the user experience
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Analytics tracking failed for event "${name}":`, error);
      }
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

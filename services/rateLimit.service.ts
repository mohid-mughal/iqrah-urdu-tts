/**
 * Rate Limiting Service
 * Implements client-side rate limiting using device fingerprinting and IP tracking
 * Limits: 5 requests/minute, 24 requests/hour, 60 requests/day
 */

interface RateLimitRecord {
  requests: number[];
  deviceId: string;
}

class RateLimitService {
  private readonly STORAGE_KEY = 'iqrah_rate_limit';
  private readonly LIMITS = {
    perMinute: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_PER_MINUTE || '5'),
    perHour: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_PER_HOUR || '24'),
    perDay: parseInt(process.env.NEXT_PUBLIC_RATE_LIMIT_PER_DAY || '60'),
  };

  /**
   * Generate a device fingerprint for tracking
   */
  private async generateDeviceId(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      navigator.platform,
    ];

    const fingerprint = components.join('|');
    
    // Create a simple hash
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return `device_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Get or create device ID
   */
  private async getDeviceId(): Promise<string> {
    let deviceId = localStorage.getItem('iqrah_device_id');
    
    if (!deviceId) {
      deviceId = await this.generateDeviceId();
      localStorage.setItem('iqrah_device_id', deviceId);
    }
    
    return deviceId;
  }

  /**
   * Get rate limit record from storage
   */
  private getRateLimitRecord(): RateLimitRecord | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      
      const record = JSON.parse(stored) as RateLimitRecord;
      return record;
    } catch {
      return null;
    }
  }

  /**
   * Save rate limit record to storage
   */
  private saveRateLimitRecord(record: RateLimitRecord): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(record));
    } catch (error) {
      console.error('Failed to save rate limit record:', error);
    }
  }

  /**
   * Clean up old requests from the record
   */
  private cleanupOldRequests(requests: number[]): number[] {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    // Keep only requests from the last 24 hours
    return requests.filter(timestamp => timestamp > oneDayAgo);
  }

  /**
   * Count requests within a time window
   */
  private countRequestsInWindow(requests: number[], windowMs: number): number {
    const now = Date.now();
    const cutoff = now - windowMs;
    return requests.filter(timestamp => timestamp > cutoff).length;
  }

  /**
   * Check if request is allowed under rate limits
   */
  async checkRateLimit(): Promise<{ allowed: boolean; reason?: string; retryAfter?: number }> {
    const deviceId = await this.getDeviceId();
    let record = this.getRateLimitRecord();

    // Initialize record if it doesn't exist or device changed
    if (!record || record.deviceId !== deviceId) {
      record = {
        deviceId,
        requests: [],
      };
    }

    // Clean up old requests
    record.requests = this.cleanupOldRequests(record.requests);

    const now = Date.now();
    
    // Check per-minute limit
    const requestsPerMinute = this.countRequestsInWindow(record.requests, 60 * 1000);
    if (requestsPerMinute >= this.LIMITS.perMinute) {
      const oldestInMinute = record.requests
        .filter(t => t > now - 60 * 1000)
        .sort((a, b) => a - b)[0];
      const retryAfter = Math.ceil((oldestInMinute + 60 * 1000 - now) / 1000);
      
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${this.LIMITS.perMinute} requests per minute. Please wait ${retryAfter} seconds.`,
        retryAfter,
      };
    }

    // Check per-hour limit
    const requestsPerHour = this.countRequestsInWindow(record.requests, 60 * 60 * 1000);
    if (requestsPerHour >= this.LIMITS.perHour) {
      const oldestInHour = record.requests
        .filter(t => t > now - 60 * 60 * 1000)
        .sort((a, b) => a - b)[0];
      const retryAfter = Math.ceil((oldestInHour + 60 * 60 * 1000 - now) / 1000);
      
      return {
        allowed: false,
        reason: `Rate limit exceeded: ${this.LIMITS.perHour} requests per hour. Please wait ${Math.ceil(retryAfter / 60)} minutes.`,
        retryAfter,
      };
    }

    // Check per-day limit
    const requestsPerDay = this.countRequestsInWindow(record.requests, 24 * 60 * 60 * 1000);
    if (requestsPerDay >= this.LIMITS.perDay) {
      const oldestInDay = record.requests
        .filter(t => t > now - 24 * 60 * 60 * 1000)
        .sort((a, b) => a - b)[0];
      const retryAfter = Math.ceil((oldestInDay + 24 * 60 * 60 * 1000 - now) / 1000);
      
      return {
        allowed: false,
        reason: `Daily limit exceeded: ${this.LIMITS.perDay} requests per day. Please wait ${Math.ceil(retryAfter / 3600)} hours.`,
        retryAfter,
      };
    }

    return { allowed: true };
  }

  /**
   * Record a new request
   */
  async recordRequest(): Promise<void> {
    const deviceId = await this.getDeviceId();
    let record = this.getRateLimitRecord();

    if (!record || record.deviceId !== deviceId) {
      record = {
        deviceId,
        requests: [],
      };
    }

    record.requests = this.cleanupOldRequests(record.requests);
    record.requests.push(Date.now());
    
    this.saveRateLimitRecord(record);
  }

  /**
   * Get current usage statistics
   */
  async getUsageStats(): Promise<{
    perMinute: number;
    perHour: number;
    perDay: number;
    limits: {
      perMinute: number;
      perHour: number;
      perDay: number;
    };
  }> {
    const record = this.getRateLimitRecord();
    
    if (!record) {
      return {
        perMinute: 0,
        perHour: 0,
        perDay: 0,
        limits: this.LIMITS,
      };
    }

    const cleanRequests = this.cleanupOldRequests(record.requests);

    return {
      perMinute: this.countRequestsInWindow(cleanRequests, 60 * 1000),
      perHour: this.countRequestsInWindow(cleanRequests, 60 * 60 * 1000),
      perDay: this.countRequestsInWindow(cleanRequests, 24 * 60 * 60 * 1000),
      limits: this.LIMITS,
    };
  }
}

export const rateLimitService = new RateLimitService();

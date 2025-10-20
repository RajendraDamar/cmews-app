// Error Handling Service
// Provides error handling utilities including retry logic with exponential backoff
// Used for network requests and API calls

/**
 * Custom API Error class
 * Extends Error with additional context for API failures
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Error Handling Service
 * Provides utilities for handling errors with retry logic
 */
export class ErrorHandlingService {
  /**
   * Retry an async operation with exponential backoff
   * @param operation - Async function to retry
   * @param maxRetries - Maximum number of retry attempts (default: 3)
   * @param initialDelayMs - Initial delay in milliseconds before first retry (default: 1000ms)
   * @returns Result of the operation
   * @throws Last error if all retries fail
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    initialDelayMs = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) break;

        const delayMs = initialDelayMs * Math.pow(2, attempt - 1);
        console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw lastError!;
  }

  /**
   * Check if an error is a network error
   * @param error - Error to check
   * @returns True if error is network-related
   */
  static isNetworkError(error: any): boolean {
    return (
      error?.message?.includes('network') ||
      error?.message?.includes('fetch') ||
      error?.code === 'NETWORK_ERROR' ||
      error?.name === 'NetworkError'
    );
  }

  /**
   * Check if an error is a BMKG API error
   * @param error - Error to check
   * @returns True if error is from BMKG API
   */
  static isBMKGError(error: any): boolean {
    return (
      error?.message?.includes('BMKG') ||
      error instanceof APIError ||
      (error?.statusCode >= 400 && error?.statusCode < 500)
    );
  }

  /**
   * Get user-friendly error message
   * @param error - Error to format
   * @returns User-friendly error message
   */
  static getUserFriendlyMessage(error: any): string {
    if (this.isNetworkError(error)) {
      return 'Koneksi internet bermasalah. Silakan periksa koneksi Anda.';
    }

    if (error instanceof APIError) {
      if (error.statusCode === 404) {
        return 'Data tidak ditemukan.';
      }
      if (error.statusCode === 429) {
        return 'Terlalu banyak permintaan. Silakan coba lagi nanti.';
      }
      if (error.statusCode && error.statusCode >= 500) {
        return 'Server bermasalah. Silakan coba lagi nanti.';
      }
    }

    return 'Terjadi kesalahan. Silakan coba lagi.';
  }
}

// Network Service
// Provides network utilities and helpers for API calls
// Handles request configuration, headers, and basic network operations

import { APIError, ErrorHandlingService } from './ErrorHandlingService';

/**
 * Network request configuration
 */
export interface NetworkRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

/**
 * Network Service
 * Provides utilities for making network requests with error handling
 */
export class NetworkService {
  private baseTimeout = 10000; // 10 seconds default timeout

  /**
   * Make a network request with timeout and error handling
   * @param url - Request URL
   * @param config - Request configuration
   * @returns Response data
   * @throws APIError on failure
   */
  async request<T>(url: string, config: NetworkRequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.baseTimeout,
    } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new APIError(
          `Request failed: ${response.statusText}`,
          response.status,
          url
        );
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408, url);
      }

      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        error.message || 'Network request failed',
        undefined,
        url
      );
    }
  }

  /**
   * Make a GET request
   * @param url - Request URL
   * @param headers - Optional headers
   * @returns Response data
   */
  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: 'GET', headers });
  }

  /**
   * Make a POST request
   * @param url - Request URL
   * @param body - Request body
   * @param headers - Optional headers
   * @returns Response data
   */
  async post<T>(
    url: string,
    body: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(url, { method: 'POST', body, headers });
  }

  /**
   * Check network connectivity
   * @returns True if network is available
   */
  async checkConnectivity(): Promise<boolean> {
    try {
      // Use a lightweight endpoint to check connectivity
      await fetch('https://www.google.com/generate_204', {
        method: 'HEAD',
        mode: 'no-cors',
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Make a request with automatic retry on failure
   * @param url - Request URL
   * @param config - Request configuration
   * @param maxRetries - Maximum retry attempts
   * @returns Response data
   */
  async requestWithRetry<T>(
    url: string,
    config: NetworkRequestConfig = {},
    maxRetries = 3
  ): Promise<T> {
    return ErrorHandlingService.withRetry(
      () => this.request<T>(url, config),
      maxRetries
    );
  }
}

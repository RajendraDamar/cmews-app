// Mock Storage Service
// Simulates local storage using Enhanced Expo File System for frontend development
// Will be replaced with real Firebase/API storage in future

import type { StorageServiceInterface, UserPreferences } from './types';

// Simulated in-memory storage for development
// In real implementation, this would use Expo File System or AsyncStorage
class MockStorageService implements StorageServiceInterface {
  private storage: Map<string, any> = new Map();

  /**
   * Save user preferences to local storage
   * Simulates file write delay
   */
  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    // Simulate storage delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    this.storage.set('user_preferences', {
      ...preferences,
      savedAt: new Date().toISOString(),
    });

    // In real implementation, would use Expo File System:
    // const file = new File(Paths.documentDirectory, 'user_preferences.json');
    // await file.writeAsString(JSON.stringify(preferences));
  }

  /**
   * Get user preferences from local storage
   * Simulates file read delay
   */
  async getUserPreferences(): Promise<UserPreferences | null> {
    // Simulate storage delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    const preferences = this.storage.get('user_preferences');

    if (!preferences) {
      return null;
    }

    return preferences;
  }

  /**
   * Clear all user data from storage
   * Simulates file deletion delay
   */
  async clearUserData(): Promise<void> {
    // Simulate storage delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    this.storage.clear();

    // In real implementation, would use Expo File System:
    // const file = new File(Paths.documentDirectory, 'user_preferences.json');
    // await file.delete();
  }
}

// Export singleton instance
export const storageService = new MockStorageService();

// Export class for testing purposes
export { MockStorageService };

import { notificationService, WeatherNotification } from '../services/NotificationService';
import * as Notifications from 'expo-notifications';

/**
 * Mock Notification Data - Pre-configured weather notifications for testing
 */

// Time constants for better readability
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export const MOCK_NOTIFICATIONS: WeatherNotification[] = [
  {
    title: '⚠️ Peringatan Cuaca Ekstrem',
    body: 'Hujan lebat dan angin kencang diprediksi terjadi di wilayah Jakarta dalam 2 jam ke depan. Harap berhati-hati!',
    data: {
      type: 'weather_alert',
      severity: 'warning',
      location: 'Jakarta',
      validUntil: new Date(Date.now() + TWO_HOURS_MS).toISOString(),
      weatherCondition: 'heavy_rain',
    },
  },
  {
    title: '🌊 Peringatan Maritim',
    body: 'Gelombang tinggi 2.5-4.0 meter di Laut Jawa. Nelayan diminta waspada dan mempertimbangkan untuk tidak melaut.',
    data: {
      type: 'maritime',
      severity: 'warning',
      location: 'Laut Jawa',
      waveHeight: '2.5-4.0 meter',
      validUntil: new Date(Date.now() + SIX_HOURS_MS).toISOString(),
    },
  },
  {
    title: '🌡️ Suhu Tinggi',
    body: 'Suhu udara mencapai 35°C di Surabaya. Hindari aktivitas di luar ruangan pada siang hari.',
    data: {
      type: 'weather_alert',
      severity: 'info',
      location: 'Surabaya',
      temperature: 35,
      humidity: 65,
    },
  },
  {
    title: '⛈️ Potensi Hujan Petir',
    body: 'Potensi hujan disertai petir dan angin kencang di Bandung sore hingga malam hari.',
    data: {
      type: 'forecast',
      severity: 'warning',
      location: 'Bandung',
      weatherCondition: 'thunderstorm',
      timeRange: 'Sore hingga Malam',
    },
  },
  {
    title: '🚨 Peringatan Dini Gempa',
    body: 'Gempa bumi magnitude 5.2 terdeteksi di lepas pantai Bali. Tidak ada potensi tsunami.',
    data: {
      type: 'early_warning',
      severity: 'danger',
      location: 'Bali',
      magnitude: 5.2,
      depth: '10 km',
      tsunamiThreat: false,
    },
  },
  {
    title: '☀️ Cuaca Cerah',
    body: 'Cuaca cerah berawan di Jakarta sepanjang hari. Suhu berkisar 27-32°C.',
    data: {
      type: 'forecast',
      severity: 'info',
      location: 'Jakarta',
      weatherCondition: 'partly_cloudy',
      tempRange: '27-32°C',
    },
  },
  {
    title: '💨 Angin Kencang',
    body: 'Angin kencang hingga 45 km/jam di wilayah Makassar. Waspadai pohon tumbang dan papan reklame.',
    data: {
      type: 'weather_alert',
      severity: 'warning',
      location: 'Makassar',
      windSpeed: 45,
      windDirection: 'Tenggara',
    },
  },
  {
    title: '🌫️ Kabut Tebal',
    body: 'Kabut tebal mengurangi jarak pandang di Bogor pagi ini. Pengemudi diminta berhati-hati.',
    data: {
      type: 'weather_alert',
      severity: 'info',
      location: 'Bogor',
      visibility: '50 meter',
      timeRange: 'Pagi',
    },
  },
];

/**
 * MockNotificationSender - Utility class for sending mock notifications
 */
export class MockNotificationSender {
  /**
   * Send a random mock notification
   */
  static async sendRandomNotification(): Promise<string> {
    const randomNotification = MOCK_NOTIFICATIONS[
      Math.floor(Math.random() * MOCK_NOTIFICATIONS.length)
    ];
    
    return await notificationService.sendLocalNotification(randomNotification);
  }

  /**
   * Send a specific mock notification by index
   */
  static async sendNotificationByIndex(index: number): Promise<string> {
    if (index < 0 || index >= MOCK_NOTIFICATIONS.length) {
      throw new Error(`Invalid notification index: ${index}`);
    }
    
    return await notificationService.sendLocalNotification(MOCK_NOTIFICATIONS[index]);
  }

  /**
   * Send a weather alert notification
   */
  static async sendWeatherAlert(
    location: string,
    condition: string,
    severity: 'info' | 'warning' | 'danger' = 'warning'
  ): Promise<string> {
    const notification: WeatherNotification = {
      title: `${severity === 'danger' ? '🚨' : '⚠️'} Peringatan Cuaca - ${location}`,
      body: `${condition} diprediksi terjadi di wilayah ${location}. Harap waspada dan ikuti perkembangan cuaca.`,
      data: {
        type: 'weather_alert',
        severity,
        location,
        weatherCondition: condition,
        timestamp: new Date().toISOString(),
      },
    };
    
    return await notificationService.sendLocalNotification(notification);
  }

  /**
   * Send a maritime warning notification
   */
  static async sendMaritimeWarning(
    location: string,
    waveHeight: string,
    severity: 'info' | 'warning' | 'danger' = 'warning'
  ): Promise<string> {
    const notification: WeatherNotification = {
      title: `🌊 Peringatan Maritim - ${location}`,
      body: `Gelombang tinggi ${waveHeight} di ${location}. Nelayan diminta waspada.`,
      data: {
        type: 'maritime',
        severity,
        location,
        waveHeight,
        timestamp: new Date().toISOString(),
      },
    };
    
    return await notificationService.sendLocalNotification(notification);
  }

  /**
   * Send an early warning notification
   */
  static async sendEarlyWarning(
    type: string,
    location: string,
    details: string
  ): Promise<string> {
    const notification: WeatherNotification = {
      title: `🚨 Peringatan Dini - ${type}`,
      body: `${details} di ${location}. Segera ambil tindakan pencegahan!`,
      data: {
        type: 'early_warning',
        severity: 'danger',
        location,
        warningType: type,
        timestamp: new Date().toISOString(),
      },
    };
    
    return await notificationService.sendLocalNotification(notification);
  }

  /**
   * Send a daily forecast notification
   */
  static async sendDailyForecast(
    location: string,
    condition: string,
    tempRange: string
  ): Promise<string> {
    const notification: WeatherNotification = {
      title: `☀️ Prakiraan Cuaca - ${location}`,
      body: `${condition} dengan suhu ${tempRange}. Semoga harimu menyenangkan!`,
      data: {
        type: 'forecast',
        severity: 'info',
        location,
        weatherCondition: condition,
        tempRange,
        timestamp: new Date().toISOString(),
      },
    };
    
    return await notificationService.sendLocalNotification(notification);
  }

  /**
   * Schedule multiple notifications for testing
   */
  static async scheduleTestNotifications(): Promise<string[]> {
    const identifiers: string[] = [];
    
    // Send immediate notification
    identifiers.push(await this.sendRandomNotification());
    
    // Schedule notification in 1 minute
    const notification1 = MOCK_NOTIFICATIONS[1];
    const id1 = await notificationService.scheduleNotification(
      notification1,
      { 
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60, 
        repeats: false 
      }
    );
    identifiers.push(id1);
    
    // Schedule notification in 5 minutes
    const notification2 = MOCK_NOTIFICATIONS[2];
    const id2 = await notificationService.scheduleNotification(
      notification2,
      { 
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 300, 
        repeats: false 
      }
    );
    identifiers.push(id2);
    
    console.log('Test notifications scheduled:', identifiers);
    return identifiers;
  }

  /**
   * Get all available mock notifications
   */
  static getAllMockNotifications(): WeatherNotification[] {
    return [...MOCK_NOTIFICATIONS];
  }

  /**
   * Get mock notifications by type
   */
  static getMockNotificationsByType(
    type: 'weather_alert' | 'early_warning' | 'maritime' | 'forecast'
  ): WeatherNotification[] {
    return MOCK_NOTIFICATIONS.filter(n => n.data?.type === type);
  }

  /**
   * Get mock notifications by severity
   */
  static getMockNotificationsBySeverity(
    severity: 'info' | 'warning' | 'danger'
  ): WeatherNotification[] {
    return MOCK_NOTIFICATIONS.filter(n => n.data?.severity === severity);
  }
}

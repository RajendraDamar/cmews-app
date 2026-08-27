import { notificationService, WeatherNotification } from '../services/NotificationService';
import * as Notifications from 'expo-notifications';

/**
 * Mock Notification Data - Pre-configured weather notifications for testing in D.I. Yogyakarta & Coastal Areas
 */

// Time constants for better readability
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export const MOCK_NOTIFICATIONS: WeatherNotification[] = [
  {
    title: '⚠️ Peringatan Cuaca Ekstrem - D.I. Yogyakarta',
    body: 'Hujan lebat disertai angin kencang diprediksi terjadi di wilayah Sleman dan Kota Yogyakarta dalam 2 jam ke depan. Harap berhati-hati!',
    data: {
      type: 'weather_alert',
      severity: 'warning',
      location: 'D.I. Yogyakarta',
      validUntil: new Date(Date.now() + TWO_HOURS_MS).toISOString(),
      weatherCondition: 'heavy_rain',
    },
  },
  {
    title: '🌊 Peringatan Maritim - Pesisir Selatan DIY',
    body: 'Gelombang pasang 2.5-4.0 meter di Pantai Parangtritis & Pantai Glagah. Wisatawan dan nelayan diminta meningkatkan kewaspadaan.',
    data: {
      type: 'maritime',
      severity: 'warning',
      location: 'Pesisir Selatan DIY',
      waveHeight: '2.5-4.0 meter',
      validUntil: new Date(Date.now() + SIX_HOURS_MS).toISOString(),
    },
  },
  {
    title: '🌡️ Suhu Udara - Kota Yogyakarta',
    body: 'Suhu udara mencapai 33°C di Malioboro siang ini. Jaga hidrasi tubuh Anda.',
    data: {
      type: 'weather_alert',
      severity: 'info',
      location: 'Kota Yogyakarta',
      temperature: 33,
      humidity: 65,
    },
  },
  {
    title: '⛈️ Potensi Hujan Petir - Lereng Merapi',
    body: 'Potensi hujan lebat disertai petir di kawasan Kaliurang dan Cangkringan sore hingga malam hari.',
    data: {
      type: 'forecast',
      severity: 'warning',
      location: 'Kabupaten Sleman',
      weatherCondition: 'thunderstorm',
      timeRange: 'Sore hingga Malam',
    },
  },
  {
    title: '🚨 Peringatan Dini Gelombang - Pantai Baron & Timang',
    body: 'Angin kencang 35 knot dan ombak tinggi di pesisir Gunungkidul. Aktivitas melaut ditunda sementara.',
    data: {
      type: 'early_warning',
      severity: 'danger',
      location: 'Kabupaten Gunungkidul',
      magnitude: 0,
      depth: '0 km',
      tsunamiThreat: false,
    },
  },
  {
    title: '☀️ Cuaca Cerah Berawan - Pantai Depok & Samas',
    body: 'Cuaca cerah berawan di pesisir Bantul. Suhu berkisar 28-31°C dengan hembusan angin laut sepoi-sepoi.',
    data: {
      type: 'forecast',
      severity: 'info',
      location: 'Kabupaten Bantul',
      weatherCondition: 'partly_cloudy',
      tempRange: '28-31°C',
    },
  },
  {
    title: '💨 Angin Kencang - Kawasan YIA Kulon Progo',
    body: 'Hembusan angin mencapai 32 km/jam di sekitar Pantai Glagah dan Bandara YIA.',
    data: {
      type: 'weather_alert',
      severity: 'warning',
      location: 'Kabupaten Kulon Progo',
      windSpeed: 32,
      windDirection: 'Selatan',
    },
  },
  {
    title: '🌫️ Kabut Lereng - Kaliurang Pakem',
    body: 'Kabut tebal membatasi jarak pandang hingga 100 meter di kawasan wisata Kaliurang.',
    data: {
      type: 'weather_alert',
      severity: 'info',
      location: 'Kaliurang, Sleman',
      visibility: '100 meter',
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

/**
 * Quick Start Examples for Firebase Cloud Messaging
 * 
 * This file contains practical examples of how to use the notification
 * system in the CMEWS app. Copy and paste these examples into your components.
 * 
 * Note: Some variables in examples are intentionally unused as they demonstrate
 * the API surface but are not used in the minimal examples.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNotifications } from '~/hooks/useNotifications';
import { MockNotificationSender } from '~/lib/data/notification-mock';
import { notificationService } from '~/lib/services/NotificationService';
import * as Notifications from 'expo-notifications';

// ============================================================================
// Example 1: Basic Setup in a Component
// ============================================================================

export function BasicNotificationSetup() {
  const { 
    permissionStatus, 
    pushToken, 
    requestPermission, 
    sendNotification 
  } = useNotifications({
    onReceived: (notification) => {
      console.log('Notification received:', notification);
    },
    onTapped: (response) => {
      console.log('Notification tapped:', response);
      // Navigate to relevant screen based on notification data
    }
  });

  useEffect(() => {
    // Request permission on mount if not granted
    if (permissionStatus !== 'granted') {
      requestPermission();
    }
  }, [permissionStatus, requestPermission]);

  const handleSendTestNotification = async () => {
    await sendNotification(
      '🌡️ Weather Update',
      'Temperature is 32°C in Jakarta',
      { type: 'weather_alert', location: 'Jakarta' }
    );
  };

  return null; // Your component JSX here
}

// ============================================================================
// Example 2: Send Weather Alert
// ============================================================================

export async function sendWeatherAlertExample() {
  // Send weather alert for specific location
  await MockNotificationSender.sendWeatherAlert(
    'Jakarta',
    'Hujan lebat dan petir',
    'warning'
  );
}

// ============================================================================
// Example 3: Send Maritime Warning
// ============================================================================

export async function sendMaritimeWarningExample() {
  await MockNotificationSender.sendMaritimeWarning(
    'Laut Jawa',
    '2.5-4.0 meter',
    'warning'
  );
}

// ============================================================================
// Example 4: Schedule Daily Forecast Notification
// ============================================================================

export async function scheduleDailyForecastExample() {
  // Schedule notification for 7 AM daily
  await notificationService.scheduleNotification(
    {
      title: '☀️ Good Morning!',
      body: 'Check today\'s weather forecast',
      data: { type: 'forecast' }
    },
    {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 7,
      minute: 0
    }
  );
}

// ============================================================================
// Example 5: Handle Notification Navigation
// ============================================================================

export function NotificationNavigationExample() {
  useEffect(() => {
    const subscription = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        
        // Navigate based on notification type
        switch (data.type) {
          case 'weather_alert':
            // router.push('/forecast');
            break;
          case 'maritime':
            // router.push('/maps');
            break;
          case 'early_warning':
            // router.push('/warnings');
            break;
          default:
            // router.push('/');
            break;
        }
      }
    );

    return () => {
      notificationService.removeNotificationSubscription(subscription);
    };
  }, []);

  return null;
}

// ============================================================================
// Example 6: Permission Check Before Sending
// ============================================================================

export async function checkPermissionBeforeSendExample() {
  const { status } = await Notifications.getPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Please enable notifications to receive weather alerts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Enable', 
          onPress: async () => {
            await notificationService.requestPermissions();
          }
        }
      ]
    );
    return;
  }

  // Send notification
  await MockNotificationSender.sendRandomNotification();
}

// ============================================================================
// Example 7: Send Multiple Test Notifications
// ============================================================================

export async function sendMultipleTestNotificationsExample() {
  // Send immediate notification
  await MockNotificationSender.sendNotificationByIndex(0);
  
  // Schedule one for 1 minute from now
  await notificationService.scheduleNotification(
    {
      title: '⚠️ Weather Alert',
      body: 'Rain expected in 1 hour',
      data: { type: 'weather_alert' }
    },
    {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60,
      repeats: false
    }
  );
  
  // Schedule one for 5 minutes from now
  await notificationService.scheduleNotification(
    {
      title: '🌊 Maritime Update',
      body: 'Wave height increasing',
      data: { type: 'maritime' }
    },
    {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 300,
      repeats: false
    }
  );
}

// ============================================================================
// Example 8: Cancel All Scheduled Notifications
// ============================================================================

export async function cancelAllNotificationsExample() {
  const scheduled = await notificationService.getScheduledNotifications();
  console.log(`Cancelling ${scheduled.length} scheduled notifications`);
  
  await notificationService.cancelAllNotifications();
  
  Alert.alert('Success', 'All scheduled notifications have been cancelled');
}

// ============================================================================
// Example 9: Get and Display Scheduled Notifications
// ============================================================================

export async function getScheduledNotificationsExample() {
  const scheduled = await notificationService.getScheduledNotifications();
  
  if (scheduled.length === 0) {
    console.log('No scheduled notifications');
    return;
  }
  
  scheduled.forEach((notif, index) => {
    console.log(`[${index + 1}] ${notif.content.title}`);
    console.log(`    Body: ${notif.content.body}`);
    console.log(`    ID: ${notif.identifier}`);
  });
}

// ============================================================================
// Example 10: Custom Notification with Specific Severity
// ============================================================================

export async function sendCustomSeverityNotificationExample() {
  // Danger level (red)
  await notificationService.sendLocalNotification({
    title: '🚨 Critical Warning',
    body: 'Severe weather approaching. Take immediate action!',
    data: {
      type: 'early_warning',
      severity: 'danger',
      location: 'Jakarta'
    }
  });

  // Warning level (orange)
  await notificationService.sendLocalNotification({
    title: '⚠️ Weather Warning',
    body: 'Heavy rain expected this afternoon.',
    data: {
      type: 'weather_alert',
      severity: 'warning',
      location: 'Surabaya'
    }
  });

  // Info level (blue)
  await notificationService.sendLocalNotification({
    title: '☀️ Weather Info',
    body: 'Sunny weather throughout the day.',
    data: {
      type: 'forecast',
      severity: 'info',
      location: 'Bali'
    }
  });
}

// ============================================================================
// Example 11: Integration in App Layout
// ============================================================================

export function AppLayoutNotificationSetup() {
  useEffect(() => {
    async function setupNotifications() {
      // Register for push notifications
      const token = await notificationService.registerForPushNotifications();
      console.log('Push token:', token);
      
      // You can send this token to your backend to store for the user
      // await sendTokenToBackend(token);
    }
    
    setupNotifications();
  }, []);

  return null;
}

// ============================================================================
// Example 12: Send Notification Based on Weather Data
// ============================================================================

export async function sendNotificationBasedOnWeatherExample(
  temperature: number,
  location: string
) {
  // Send heat warning if temperature is high
  if (temperature > 35) {
    await MockNotificationSender.sendWeatherAlert(
      location,
      `Suhu sangat tinggi: ${temperature}°C. Hindari aktivitas outdoor!`,
      'warning'
    );
  }
  
  // Send normal forecast update
  else if (temperature >= 27 && temperature <= 35) {
    await MockNotificationSender.sendDailyForecast(
      location,
      'Cerah berawan',
      `${temperature}°C`
    );
  }
  
  // Send cool weather info
  else {
    await notificationService.sendLocalNotification({
      title: `🌤️ Cuaca Sejuk - ${location}`,
      body: `Suhu saat ini ${temperature}°C. Cocok untuk aktivitas outdoor!`,
      data: {
        type: 'forecast',
        severity: 'info',
        location,
        temperature
      }
    });
  }
}

// ============================================================================
// Example 13: Test All Mock Notifications Sequentially
// ============================================================================

export async function testAllMockNotificationsExample() {
  const notifications = MockNotificationSender.getAllMockNotifications();
  
  for (let i = 0; i < notifications.length; i++) {
    await MockNotificationSender.sendNotificationByIndex(i);
    
    // Wait 2 seconds between notifications
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  Alert.alert('Complete', `Sent ${notifications.length} test notifications`);
}

// ============================================================================
// Example 14: Filter and Send Notifications by Type
// ============================================================================

export async function sendNotificationsByTypeExample(
  type: 'weather_alert' | 'maritime' | 'early_warning' | 'forecast'
) {
  const notifications = MockNotificationSender.getMockNotificationsByType(type);
  
  if (notifications.length === 0) {
    console.log(`No notifications found for type: ${type}`);
    return;
  }
  
  // Send the first matching notification
  await notificationService.sendLocalNotification(notifications[0]);
}

// ============================================================================
// Example 15: Simple Permission Check Hook
// ============================================================================

export function SimplePermissionCheck() {
  const { 
    permissionStatus, 
    requestPermission 
  } = useNotifications();

  useEffect(() => {
    if (permissionStatus !== 'granted') {
      Alert.alert(
        'Enable Notifications',
        'Get weather alerts and updates',
        [
          { text: 'Not Now', style: 'cancel' },
          { text: 'Enable', onPress: requestPermission }
        ]
      );
    }
  }, [permissionStatus, requestPermission]);

  return null;
}

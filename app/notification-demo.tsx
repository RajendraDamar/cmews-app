import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { notificationService } from '~/lib/services/NotificationService';
import { MockNotificationSender, MOCK_NOTIFICATIONS } from '~/lib/data/notification-mock';

export default function NotificationDemoScreen() {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const [scheduledNotifications, setScheduledNotifications] = useState<
    Notifications.NotificationRequest[]
  >([]);

  const initializeNotifications = useCallback(async () => {
    // Check permission status
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);

    // Register for push notifications
    const token = await notificationService.registerForPushNotifications();
    setPushToken(token);

    // Load scheduled notifications
    await loadScheduledNotifications();
  }, []);

  useEffect(() => {
    // Initialize notification service
    initializeNotifications();

    // Add listeners
    const receivedListener = notificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    const responseListener = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        Alert.alert(
          'Notification Tapped',
          `You tapped: ${response.notification.request.content.title}`
        );
      }
    );

    return () => {
      notificationService.removeNotificationSubscription(receivedListener);
      notificationService.removeNotificationSubscription(responseListener);
    };
  }, [initializeNotifications]);

  const loadScheduledNotifications = async () => {
    const scheduled = await notificationService.getScheduledNotifications();
    setScheduledNotifications(scheduled);
  };

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermissions();
    setPermissionStatus(granted ? 'granted' : 'denied');
    
    if (granted) {
      const token = await notificationService.registerForPushNotifications();
      setPushToken(token);
      Alert.alert('Success', 'Notification permissions granted!');
    } else {
      Alert.alert('Permission Denied', 'You need to grant notification permissions.');
    }
  };

  const handleSendRandomNotification = async () => {
    try {
      await MockNotificationSender.sendRandomNotification();
      Alert.alert('Success', 'Random notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
      console.error(error);
    }
  };

  const handleSendSpecificNotification = async (index: number) => {
    try {
      await MockNotificationSender.sendNotificationByIndex(index);
      Alert.alert('Success', `Notification "${MOCK_NOTIFICATIONS[index].title}" sent!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
      console.error(error);
    }
  };

  const handleScheduleTestNotifications = async () => {
    try {
      const ids = await MockNotificationSender.scheduleTestNotifications();
      await loadScheduledNotifications();
      Alert.alert(
        'Success',
        `Scheduled ${ids.length} test notifications:\n- 1 immediate\n- 1 in 1 minute\n- 1 in 5 minutes`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notifications');
      console.error(error);
    }
  };

  const handleCancelAllNotifications = async () => {
    try {
      await notificationService.cancelAllNotifications();
      await loadScheduledNotifications();
      Alert.alert('Success', 'All scheduled notifications cancelled');
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel notifications');
      console.error(error);
    }
  };

  const handleSendWeatherAlert = async () => {
    try {
      await MockNotificationSender.sendWeatherAlert(
        'Jakarta',
        'Hujan lebat dan petir',
        'warning'
      );
      Alert.alert('Success', 'Weather alert sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send weather alert');
      console.error(error);
    }
  };

  const handleSendMaritimeWarning = async () => {
    try {
      await MockNotificationSender.sendMaritimeWarning(
        'Laut Jawa',
        '2.5-4.0 meter',
        'warning'
      );
      Alert.alert('Success', 'Maritime warning sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send maritime warning');
      console.error(error);
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'danger':
        return 'bg-red-500';
      case 'warning':
        return 'bg-orange-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'weather_alert':
        return '⚠️ Weather Alert';
      case 'maritime':
        return '🌊 Maritime';
      case 'early_warning':
        return '🚨 Early Warning';
      case 'forecast':
        return '☀️ Forecast';
      default:
        return '📱 Notification';
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            🔔 Notification Demo
          </Text>
          <Text className="text-muted-foreground">
            Test Firebase Cloud Messaging and local notifications
          </Text>
        </View>

        {/* Permission Status */}
        <View className="bg-card rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-foreground mb-2">
            Permission Status
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground">
              Status: {permissionStatus}
            </Text>
            {permissionStatus !== 'granted' && (
              <TouchableOpacity
                onPress={handleRequestPermission}
                className="bg-primary px-4 py-2 rounded-md"
              >
                <Text className="text-primary-foreground font-medium">
                  Request Permission
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {pushToken && (
            <View className="mt-2">
              <Text className="text-xs text-muted-foreground">
                Push Token: {pushToken.substring(0, 40)}...
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="bg-card rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Quick Actions
          </Text>
          <View className="gap-2">
            <TouchableOpacity
              onPress={handleSendRandomNotification}
              className="bg-blue-500 p-3 rounded-md"
            >
              <Text className="text-white font-medium text-center">
                📱 Send Random Notification
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSendWeatherAlert}
              className="bg-orange-500 p-3 rounded-md"
            >
              <Text className="text-white font-medium text-center">
                ⚠️ Send Weather Alert
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSendMaritimeWarning}
              className="bg-cyan-500 p-3 rounded-md"
            >
              <Text className="text-white font-medium text-center">
                🌊 Send Maritime Warning
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleScheduleTestNotifications}
              className="bg-purple-500 p-3 rounded-md"
            >
              <Text className="text-white font-medium text-center">
                ⏰ Schedule Test Notifications
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scheduled Notifications */}
        {scheduledNotifications.length > 0 && (
          <View className="bg-card rounded-lg p-4 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-foreground">
                Scheduled ({scheduledNotifications.length})
              </Text>
              <TouchableOpacity
                onPress={handleCancelAllNotifications}
                className="bg-red-500 px-3 py-1 rounded-md"
              >
                <Text className="text-white text-sm font-medium">
                  Cancel All
                </Text>
              </TouchableOpacity>
            </View>
            {scheduledNotifications.map((notif, index) => (
              <View
                key={notif.identifier}
                className="bg-muted p-3 rounded-md mb-2"
              >
                <Text className="text-foreground font-medium">
                  {notif.content.title}
                </Text>
                <Text className="text-muted-foreground text-sm">
                  {notif.content.body}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* All Mock Notifications */}
        <View className="bg-card rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Available Mock Notifications
          </Text>
          <Text className="text-muted-foreground text-sm mb-3">
            Tap any notification to send it immediately
          </Text>
          {MOCK_NOTIFICATIONS.map((notif, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSendSpecificNotification(index)}
              className="mb-3 border border-border rounded-lg p-3"
            >
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1">
                  <Text className="text-foreground font-medium mb-1">
                    {notif.title}
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    {notif.body}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2 mt-2">
                <View
                  className={`${getSeverityColor(notif.data?.severity)} px-2 py-1 rounded-full`}
                >
                  <Text className="text-white text-xs font-medium">
                    {notif.data?.severity?.toUpperCase() || 'INFO'}
                  </Text>
                </View>
                <Text className="text-muted-foreground text-xs">
                  {getTypeLabel(notif.data?.type)}
                </Text>
                {notif.data?.location && (
                  <Text className="text-muted-foreground text-xs">
                    📍 {notif.data.location}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Platform Info */}
        <View className="bg-muted rounded-lg p-4 mb-4">
          <Text className="text-sm text-muted-foreground">
            Platform: {Platform.OS}
          </Text>
          <Text className="text-sm text-muted-foreground">
            FCM Support: {Platform.OS === 'web' ? 'Web Messaging' : 'Expo Push Notifications'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

import { useEffect, useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService } from '~/lib/services/NotificationService';

/**
 * useNotifications - Custom hook for managing notifications in React components
 * 
 * Features:
 * - Automatic listener setup/cleanup
 * - Permission management
 * - Push token retrieval
 * - Notification state tracking
 */

export interface NotificationState {
  permissionStatus: 'unknown' | 'granted' | 'denied';
  pushToken: string | null;
  lastNotification: Notifications.Notification | null;
  isLoading: boolean;
}

export interface NotificationHandlers {
  onReceived?: (notification: Notifications.Notification) => void;
  onTapped?: (response: Notifications.NotificationResponse) => void;
}

export function useNotifications(handlers?: NotificationHandlers) {
  const [state, setState] = useState<NotificationState>({
    permissionStatus: 'unknown',
    pushToken: null,
    lastNotification: null,
    isLoading: true,
  });

  // Initialize notifications
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        // Check current permission status
        const { status } = await Notifications.getPermissionsAsync();
        
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            permissionStatus: status as 'granted' | 'denied',
            isLoading: false,
          }));
        }

        // Get push token if permission granted
        if (status === 'granted') {
          const token = await notificationService.registerForPushNotifications();
          if (isMounted) {
            setState((prev) => ({ ...prev, pushToken: token }));
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
        if (isMounted) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    }

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  // Setup notification listeners
  useEffect(() => {
    // Listener for when notification is received
    const receivedSubscription = notificationService.addNotificationReceivedListener(
      (notification) => {
        setState((prev) => ({ ...prev, lastNotification: notification }));
        handlers?.onReceived?.(notification);
      }
    );

    // Listener for when user taps notification
    const responseSubscription = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        handlers?.onTapped?.(response);
      }
    );

    return () => {
      notificationService.removeNotificationSubscription(receivedSubscription);
      notificationService.removeNotificationSubscription(responseSubscription);
    };
  }, [handlers]);

  // Request permission callback
  const requestPermission = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      const granted = await notificationService.requestPermissions();
      const newStatus: 'granted' | 'denied' = granted ? 'granted' : 'denied';
      
      setState((prev) => ({
        ...prev,
        permissionStatus: newStatus,
        isLoading: false,
      }));

      if (granted) {
        const token = await notificationService.registerForPushNotifications();
        setState((prev) => ({ ...prev, pushToken: token }));
      }

      return granted;
    } catch (error) {
      console.error('Error requesting permission:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  // Send local notification
  const sendNotification = useCallback(
    async (title: string, body: string, data?: any) => {
      try {
        const identifier = await notificationService.sendLocalNotification({
          title,
          body,
          data,
        });
        return identifier;
      } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
      }
    },
    []
  );

  // Schedule notification
  const scheduleNotification = useCallback(
    async (
      title: string,
      body: string,
      trigger: Notifications.NotificationTriggerInput,
      data?: any
    ) => {
      try {
        const identifier = await notificationService.scheduleNotification(
          { title, body, data },
          trigger
        );
        return identifier;
      } catch (error) {
        console.error('Error scheduling notification:', error);
        throw error;
      }
    },
    []
  );

  // Get scheduled notifications
  const getScheduled = useCallback(async () => {
    try {
      return await notificationService.getScheduledNotifications();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }, []);

  // Cancel notification
  const cancelNotification = useCallback(async (identifier: string) => {
    try {
      await notificationService.cancelNotification(identifier);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }, []);

  // Cancel all notifications
  const cancelAll = useCallback(async () => {
    try {
      await notificationService.cancelAllNotifications();
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    requestPermission,
    sendNotification,
    scheduleNotification,
    getScheduled,
    cancelNotification,
    cancelAll,
  };
}

/**
 * useNotificationPermission - Simplified hook for just managing permissions
 */
export function useNotificationPermission() {
  const [status, setStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkPermission() {
      try {
        const { status: permStatus } = await Notifications.getPermissionsAsync();
        setStatus(permStatus as 'granted' | 'denied');
      } catch (error) {
        console.error('Error checking permission:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkPermission();
  }, []);

  const request = useCallback(async () => {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermissions();
      setStatus(granted ? 'granted' : 'denied');
      return granted;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    status,
    isLoading,
    isGranted: status === 'granted',
    isDenied: status === 'denied',
    request,
  };
}

# 🔔 Firebase Cloud Messaging - Quick Start

## Instant Testing (No Setup Required!)

### 1. Start the App
```bash
npm start
```

### 2. Navigate to Notification Demo
Open the app and go to: `/notification-demo`

### 3. Request Permission
Tap the **"Request Permission"** button and allow notifications.

### 4. Send a Test Notification
Tap any of these buttons:
- 📱 **Send Random Notification** - Sends one of 8 weather notifications
- ⚠️ **Send Weather Alert** - "Heavy rain in Jakarta"
- 🌊 **Send Maritime Warning** - "High waves in Java Sea"
- ⏰ **Schedule Test Notifications** - Schedule 3 notifications (immediate, +1min, +5min)

### 5. See Your Notification!
The notification appears immediately. Tap it to see the alert.

---

## Using in Your Code

### Quick Example
```typescript
import { MockNotificationSender } from '~/lib/data/notification-mock';

// Send a weather alert
await MockNotificationSender.sendWeatherAlert(
  'Jakarta',
  'Hujan lebat dan petir',
  'warning'
);
```

### With React Hook
```typescript
import { useNotifications } from '~/hooks/useNotifications';

function MyComponent() {
  const { sendNotification } = useNotifications();
  
  const sendAlert = async () => {
    await sendNotification(
      '🌡️ High Temperature',
      'Temperature reached 35°C',
      { type: 'weather_alert', severity: 'warning' }
    );
  };
  
  return <Button onPress={sendAlert} title="Send Alert" />;
}
```

---

## 8 Pre-configured Notifications

You can send any of these instantly:

1. **⚠️ Extreme Weather Warning**
   - "Heavy rain and strong winds predicted in Jakarta"
   - Severity: Warning

2. **🌊 Maritime Warning**
   - "High waves 2.5-4.0 meters in Java Sea"
   - Severity: Warning

3. **🌡️ High Temperature**
   - "Air temperature reaches 35°C in Surabaya"
   - Severity: Info

4. **⛈️ Thunderstorm Potential**
   - "Potential rain with lightning in Bandung"
   - Severity: Warning

5. **🚨 Earthquake Early Warning**
   - "Magnitude 5.2 earthquake detected off Bali coast"
   - Severity: Danger

6. **☀️ Clear Weather**
   - "Partly cloudy weather in Jakarta all day"
   - Severity: Info

7. **💨 Strong Wind**
   - "Strong winds up to 45 km/h in Makassar"
   - Severity: Warning

8. **🌫️ Dense Fog**
   - "Dense fog reduces visibility in Bogor"
   - Severity: Info

---

## Common Tasks

### Schedule Daily Forecast
```typescript
import { notificationService } from '~/lib/services/NotificationService';
import * as Notifications from 'expo-notifications';

await notificationService.scheduleNotification(
  {
    title: '☀️ Good Morning!',
    body: "Check today's weather forecast",
    data: { type: 'forecast' }
  },
  {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: 7,
    minute: 0,
    repeats: true
  }
);
```

### Send Custom Notification
```typescript
await notificationService.sendLocalNotification({
  title: 'Custom Title',
  body: 'Custom message',
  data: {
    type: 'weather_alert',
    severity: 'warning',
    location: 'Your Location',
    customField: 'custom value'
  }
});
```

### Check Permission Status
```typescript
const { status } = await Notifications.getPermissionsAsync();
if (status !== 'granted') {
  await notificationService.requestPermissions();
}
```

---

## File Locations

| What | Where |
|------|-------|
| Service | `/lib/services/NotificationService.ts` |
| Mock Data | `/lib/data/notification-mock.ts` |
| Hooks | `/hooks/useNotifications.ts` |
| Demo Screen | `/app/notification-demo.tsx` |
| Examples | `/lib/services/notification-examples.ts` |
| Setup Guide | `/lib/services/README_NotificationService.md` |
| Testing Guide | `/TESTING_NOTIFICATIONS.md` |

---

## Next Steps

1. ✅ **Test Now** - Use `/notification-demo` screen
2. 📖 **Read Setup Guide** - `lib/services/README_NotificationService.md`
3. 🎯 **Try Examples** - Copy from `notification-examples.ts`
4. 🔧 **Configure Firebase** - When ready for production
5. 🧪 **Run Tests** - Follow `TESTING_NOTIFICATIONS.md`

---

## Need Help?

- **Testing Issues**: See `TESTING_NOTIFICATIONS.md`
- **Setup Questions**: See `README_NotificationService.md`
- **Code Examples**: See `notification-examples.ts`
- **Implementation Details**: See `FCM_IMPLEMENTATION_SUMMARY.md`

---

**That's it! Start sending notifications in under 1 minute! 🚀**

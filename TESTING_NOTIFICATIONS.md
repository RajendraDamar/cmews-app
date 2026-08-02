# Firebase Cloud Messaging - Testing Guide

This guide walks you through testing the Firebase Cloud Messaging (FCM) implementation in the CMEWS app.

## Prerequisites

Before testing, ensure:
- [ ] `expo-notifications` package is installed
- [ ] App is running (`npm start`)
- [ ] You have access to a device or emulator (notifications don't work well in web browser)

## Testing Checklist

### 1. Basic Setup Tests

#### Test 1.1: App Starts Without Errors
```bash
npm start
```
**Expected Result:** App starts without notification-related errors in console.

#### Test 1.2: Notification Demo Screen Loads
1. Navigate to `/notification-demo` route
2. Check that the screen loads without errors

**Expected Result:** Demo screen displays with permission status and buttons.

### 2. Permission Tests

#### Test 2.1: Check Initial Permission Status
1. Open `/notification-demo`
2. Look at "Permission Status" section

**Expected Result:** Shows current permission status (unknown/granted/denied).

#### Test 2.2: Request Notification Permission
1. Tap "Request Permission" button (if permission not granted)
2. Accept the permission dialog

**Expected Result:** 
- System dialog appears asking for notification permission
- Permission status updates to "granted"
- Push token is displayed (truncated)

### 3. Local Notification Tests

#### Test 3.1: Send Random Notification
1. Tap "📱 Send Random Notification" button

**Expected Result:** 
- Notification appears immediately
- Shows one of 8 pre-configured weather notifications
- Success alert confirms notification sent

#### Test 3.2: Send Weather Alert
1. Tap "⚠️ Send Weather Alert" button

**Expected Result:**
- Weather alert notification appears
- Title: "⚠️ Peringatan Cuaca - Jakarta"
- Body: Weather alert message
- Orange color badge (warning severity)

#### Test 3.3: Send Maritime Warning
1. Tap "🌊 Send Maritime Warning" button

**Expected Result:**
- Maritime notification appears
- Title: "🌊 Peringatan Maritim - Laut Jawa"
- Body: Wave height information
- Cyan color badge

### 4. Scheduled Notification Tests

#### Test 4.1: Schedule Test Notifications
1. Tap "⏰ Schedule Test Notifications" button
2. Check the "Scheduled" section

**Expected Result:**
- Success message shows: "Scheduled 3 test notifications"
- Scheduled section shows 2 pending notifications (1 at +1min, 1 at +5min)
- First notification arrives immediately
- Second notification arrives after ~1 minute
- Third notification arrives after ~5 minutes

#### Test 4.2: View Scheduled Notifications
1. After scheduling, check the "Scheduled" section

**Expected Result:**
- List shows all scheduled notifications
- Each item displays title and body
- Shows count of scheduled notifications

#### Test 4.3: Cancel All Scheduled Notifications
1. Schedule some notifications first
2. Tap "Cancel All" button in Scheduled section

**Expected Result:**
- Success message confirms cancellation
- Scheduled section becomes empty
- Scheduled notifications don't fire

### 5. Notification Interaction Tests

#### Test 5.1: Tap Notification While App is Open
1. Send a notification
2. Tap the notification

**Expected Result:**
- Alert appears showing "Notification Tapped"
- Shows the notification title

#### Test 5.2: Tap Notification While App is in Background
1. Send a notification
2. Put app in background (home button)
3. Tap the notification from notification tray

**Expected Result:**
- App opens
- Notification tap handler is called (check console logs)

### 6. Mock Notification Tests

#### Test 6.1: Send All Mock Notifications
1. Scroll to "Available Mock Notifications" section
2. Tap each notification card

**Expected Result:**
- Each tap sends that specific notification immediately
- Success alert confirms which notification was sent
- All 8 notification types work:
  - ⚠️ Weather Extreme Warning
  - 🌊 Maritime Warning
  - 🌡️ High Temperature
  - ⛈️ Thunderstorm Potential
  - 🚨 Earthquake Early Warning
  - ☀️ Clear Weather
  - 💨 Strong Wind
  - 🌫️ Dense Fog

#### Test 6.2: Verify Notification Badges
Check that each notification shows correct severity badge:
- **Red** (danger): Earthquake warning
- **Orange** (warning): Weather warnings, maritime alerts
- **Blue** (info): Forecasts, general updates

### 7. Platform-Specific Tests

#### Test 7.1: Android Tests
1. Run on Android device/emulator: `npm run android`
2. Test all notification features
3. Check notification sound plays
4. Verify notification icon appears in status bar
5. Check notification color matches severity

**Expected Result:**
- Notifications appear in Android notification shade
- Custom color based on severity
- Sound plays (if volume is on)
- Vibration works

#### Test 7.2: iOS Tests
1. Run on iOS device/simulator: `npm run ios`
2. Test all notification features
3. Verify notification appears in Notification Center
4. Check notification sound

**Expected Result:**
- Notifications appear in iOS Notification Center
- Sound plays
- Badge count updates (if enabled)

**Note:** iOS Simulator may not support all notification features. Test on real device for full functionality.

#### Test 7.3: Web Tests
1. Run on web: `npm run web`
2. Test notification permissions
3. Send local notification

**Expected Result:**
- Browser asks for notification permission
- Local notifications work
- Web push notifications require additional setup

### 8. Integration Tests

#### Test 8.1: Test Custom Hook
Create a test component:
```typescript
import { useNotifications } from '~/hooks/useNotifications';

function TestComponent() {
  const { 
    permissionStatus, 
    pushToken, 
    sendNotification 
  } = useNotifications();

  return (
    <View>
      <Text>Status: {permissionStatus}</Text>
      <Button 
        title="Send Test" 
        onPress={() => sendNotification('Test', 'Message')} 
      />
    </View>
  );
}
```

**Expected Result:**
- Hook returns correct permission status
- `sendNotification` works
- Push token is available if permission granted

#### Test 8.2: Test Notification Service Directly
```typescript
import { notificationService } from '~/lib/services/NotificationService';

// In component
const sendTest = async () => {
  await notificationService.sendLocalNotification({
    title: 'Direct Test',
    body: 'Testing service directly',
    data: { test: true }
  });
};
```

**Expected Result:**
- Notification sends successfully
- Returns notification identifier

### 9. Error Handling Tests

#### Test 9.1: Test Without Permission
1. Deny notification permission
2. Try to send notification

**Expected Result:**
- App handles gracefully
- Error logged to console
- User sees appropriate message

#### Test 9.2: Test Invalid Notification Data
```typescript
// Try sending with missing data
await notificationService.sendLocalNotification({
  title: '',
  body: '',
  data: undefined
});
```

**Expected Result:**
- Doesn't crash
- Handles empty values gracefully

### 10. Performance Tests

#### Test 10.1: Send Multiple Notifications Quickly
1. Tap "Send Random Notification" 10 times rapidly

**Expected Result:**
- All notifications sent successfully
- No crashes or freezes
- Each notification appears

#### Test 10.2: Schedule Many Notifications
```typescript
for (let i = 0; i < 50; i++) {
  await notificationService.scheduleNotification(
    { title: `Test ${i}`, body: 'Test', data: {} },
    { type: 'timeInterval', seconds: i * 60, repeats: false }
  );
}
```

**Expected Result:**
- All notifications scheduled successfully
- Can retrieve list of scheduled notifications
- Can cancel all

## Common Issues and Solutions

### Issue 1: "Permission denied"
**Solution:** 
1. Go to device Settings > Apps > CMEWS
2. Enable notifications
3. Restart app

### Issue 2: "Push token not generated"
**Solution:**
1. Check Firebase config in `.env`
2. Verify `google-services.json` is in place (Android)
3. Verify `GoogleService-Info.plist` is in place (iOS)
4. Restart app

### Issue 3: "Notifications not showing"
**Solution:**
1. Check notification permissions
2. Verify notification handler is set up
3. Check device Do Not Disturb settings
4. Look for notifications in notification center/tray

### Issue 4: "Scheduled notifications not firing"
**Solution:**
1. Verify notifications were scheduled (check count)
2. Wait full duration (timing is approximate)
3. Check app isn't being killed by system
4. Enable background app refresh (iOS)

### Issue 5: "Web notifications not working"
**Solution:**
1. Use HTTPS (required for web push)
2. Check browser notification permissions
3. Some browsers block notifications in incognito mode
4. Firebase Messaging on web requires service worker

## Automated Testing

### Unit Tests Example
```typescript
import { notificationService } from '~/lib/services/NotificationService';
import { MockNotificationSender } from '~/lib/data/notification-mock';

describe('NotificationService', () => {
  it('should send local notification', async () => {
    const id = await notificationService.sendLocalNotification({
      title: 'Test',
      body: 'Test body',
      data: {}
    });
    
    expect(id).toBeDefined();
  });
  
  it('should schedule notification', async () => {
    const id = await notificationService.scheduleNotification(
      { title: 'Test', body: 'Test', data: {} },
      { type: 'timeInterval', seconds: 60, repeats: false }
    );
    
    expect(id).toBeDefined();
  });
});

describe('MockNotificationSender', () => {
  it('should have 8 mock notifications', () => {
    const notifications = MockNotificationSender.getAllMockNotifications();
    expect(notifications).toHaveLength(8);
  });
  
  it('should filter by type', () => {
    const alerts = MockNotificationSender.getMockNotificationsByType('weather_alert');
    expect(alerts.length).toBeGreaterThan(0);
  });
});
```

## Test Report Template

After completing tests, fill out this report:

```markdown
## Notification Testing Report

**Date:** ___________
**Tester:** ___________
**Platform:** ___________
**Device/Emulator:** ___________

### Test Results

- [ ] Basic Setup Tests (2/2 passed)
- [ ] Permission Tests (2/2 passed)
- [ ] Local Notification Tests (3/3 passed)
- [ ] Scheduled Notification Tests (3/3 passed)
- [ ] Notification Interaction Tests (2/2 passed)
- [ ] Mock Notification Tests (2/2 passed)
- [ ] Platform-Specific Tests (1/3 passed)
- [ ] Integration Tests (2/2 passed)
- [ ] Error Handling Tests (2/2 passed)
- [ ] Performance Tests (2/2 passed)

### Issues Found
1. ___________
2. ___________

### Notes
___________
```

## Next Steps

After testing:
1. ✅ All tests pass - Ready for production
2. ⚠️ Some tests fail - Review and fix issues
3. 📝 Document any platform-specific quirks
4. 🔄 Re-test after fixes

## Production Readiness Checklist

Before deploying to production:
- [ ] All notification tests pass
- [ ] Tested on real iOS device
- [ ] Tested on real Android device
- [ ] Firebase project configured correctly
- [ ] Push tokens being saved to backend
- [ ] Notification icons created
- [ ] Notification sounds tested
- [ ] Error handling verified
- [ ] Privacy policy updated to mention notifications
- [ ] User can opt-out of notifications

---

**Happy Testing! 🧪🔔**

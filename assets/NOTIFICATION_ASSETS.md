# Notification Assets Guide

This guide explains the notification icon and sound assets required for the CMEWS app.

## Required Assets

The following assets should be placed in the `assets` directory:

### 1. notification-icon.png
**Location:** `assets/notification-icon.png`
**Purpose:** Icon shown in Android notification tray
**Specifications:**
- Size: 96x96 pixels (xxxhdpi) or 192x192 pixels
- Format: PNG with transparency
- Style: Simple, monochrome white icon on transparent background
- Design: Should be recognizable weather symbol (e.g., cloud, sun, or app logo)

**Creating the Icon:**
```bash
# Using ImageMagick to create a simple placeholder (96x96)
convert -size 96x96 xc:transparent \
  -fill white \
  -draw "circle 48,48 48,24" \
  assets/notification-icon.png
```

### 2. notification-sound.wav (Optional)
**Location:** `assets/notification-sound.wav`
**Purpose:** Custom notification sound
**Specifications:**
- Duration: 1-3 seconds (keep it short)
- Format: WAV or MP3
- Sample rate: 44.1kHz recommended
- Channels: Mono or Stereo

**Note:** This asset is optional. If not provided, the system default notification sound will be used.

## Current Configuration

The `app.json` is configured to use these assets:

```json
{
  "plugins": [
    [
      "expo-notifications",
      {
        "icon": "./assets/notification-icon.png",
        "color": "#ffffff",
        "sounds": ["./assets/notification-sound.wav"]
      }
    ]
  ],
  "notification": {
    "icon": "./assets/notification-icon.png",
    "color": "#FF6B35",
    "androidMode": "default",
    "androidCollapsedTitle": "CMEWS Weather Alert"
  }
}
```

## For Development

During development, you can:

1. **Skip the assets**: The app will work without these assets and use system defaults.

2. **Use placeholders**: Create simple placeholder icons for testing:
   - Use the app icon as notification icon
   - Skip the custom sound file

3. **Test with system defaults**: Android and iOS will use their default notification icons and sounds.

## For Production

Before releasing to production:

1. **Create proper notification icon**: 
   - Design a clean, simple icon that represents your app
   - Use the CMEWS logo or a weather symbol
   - Follow Android notification icon design guidelines
   - Ensure it's visible against different backgrounds

2. **Add custom notification sound** (optional):
   - Create a distinctive but not annoying sound
   - Keep it short (1-2 seconds)
   - Test on multiple devices
   - Consider accessibility (not too loud or harsh)

3. **Test on real devices**:
   - Test notifications on both Android and iOS
   - Verify the icon is clearly visible
   - Check that the sound is appropriate
   - Test in different scenarios (silent mode, DND, etc.)

## Asset Variations

### Android
Android uses the notification icon specified in the config. For different screen densities, you can provide:
- `drawable-mdpi`: 24x24 pixels
- `drawable-hdpi`: 36x36 pixels
- `drawable-xhdpi`: 48x48 pixels
- `drawable-xxhdpi`: 72x72 pixels
- `drawable-xxxhdpi`: 96x96 pixels

Expo will handle the scaling automatically if you provide a high-resolution version (96x96 or larger).

### iOS
iOS uses the app icon for notifications by default. You can customize the badge icon in the Info.plist if needed.

## Troubleshooting

### Icon not showing on Android
- Ensure the icon is white on transparent background
- Check that the path in app.json is correct
- Verify the icon meets size requirements
- Run `expo prebuild` to regenerate native projects

### Custom sound not playing
- Verify the sound file exists at the specified path
- Check the audio format is supported (WAV or MP3)
- Ensure the file is not too large
- Test with a simple beep sound first

### Assets not updating
- Clear Expo cache: `expo start -c`
- Delete and reinstall the app
- Run `expo prebuild --clean` for native projects

## References

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Android Notification Icon Design](https://developer.android.com/training/notify-user/build-notification#SimpleNotification)
- [iOS Human Interface Guidelines - Notifications](https://developer.apple.com/design/human-interface-guidelines/notifications)

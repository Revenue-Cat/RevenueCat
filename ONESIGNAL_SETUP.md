# OneSignal Setup Guide

## ✅ Implementation Completed

The following OneSignal integration has been implemented:

### 1. Package Installation ✅
```bash
npm install --save react-native-onesignal
```

### 2. App.tsx Configuration ✅
- OneSignal initialization added
- Debug logging enabled for development
- **TODO: Replace `'YOUR_APP_ID'` with your actual OneSignal App ID**

### 3. Custom Permission Dialog ✅
- Native-like permission dialog created
- Integrated with NotificationPermission screen
- Multi-language support (EN, ES, UK)

### 4. Translation Keys Added ✅
```json
"permissionDialog": {
  "title": "\"QuitBuddy\" Would Like To Send\nYou Notifications",
  "message": "Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.",
  "dontAllow": "Don't Allow",
  "allow": "Allow"
}
```

## Next Steps Required

### 1. OneSignal Dashboard Setup
1. Create account at [OneSignal.com](https://onesignal.com)
2. Create a new app
3. Get your **App ID** and **API Key**
4. Replace `'YOUR_APP_ID'` in `App.tsx` with your actual App ID

### 2. Platform Configuration
Follow the official guides for platform-specific setup:
- **iOS**: [React Native iOS Setup](https://documentation.onesignal.com/docs/react-native-sdk-setup#ios-setup)
- **Android**: [React Native Android Setup](https://documentation.onesignal.com/docs/react-native-sdk-setup#android-setup)

### 3. User Segments
Create user segments in your OneSignal dashboard for targeted notifications.

### 4. Send Test Notification
Use the OneSignal dashboard or API to send test notifications:

```bash
curl -X POST --url 'https://api.onesignal.com/notifications' \
 --header 'content-type: application/json; charset=utf-8' \
 --header 'authorization: Key YOUR_APP_API_KEY' \
 --data '{
  "app_id": "YOUR_APP_ID",
  "target_channel": "push",
  "name": "Testing basic setup",
  "headings": {
    "en": "👋"
  },
  "contents": {
    "en": "Hello world!"
  },
  "included_segments": [
    "Test Users"
  ],
  "ios_attachments": {
    "onesignal_logo": "https://avatars.githubusercontent.com/u/11823027?s=200&v=4"
  },
  "big_picture": "https://avatars.githubusercontent.com/u/11823027?s=200&v=4"
}'
```

## Implementation Details

### Flow
1. User clicks "Let's do it!" button
2. Custom permission dialog appears (native iOS/Android style)
3. User selects "Allow" or "Don't Allow"
4. If "Allow": OneSignal permission request is triggered
5. User is navigated to Home page regardless of choice

### Files Modified
- `App.tsx` - OneSignal initialization
- `src/screens/NotificationPermission.tsx` - Button integration
- `src/components/NotificationPermissionModal.tsx` - Custom permission dialog
- `src/i18n/locales/*.json` - Translation keys

### Production Notes
- Remove `OneSignal.Debug.setLogLevel(LogLevel.Verbose);` in production builds
- Test on physical devices (notifications don't work in simulators)
- Configure proper certificates and keys for iOS push notifications
- Set up proper Firebase configuration for Android

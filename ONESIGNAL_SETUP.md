# OneSignal Setup Guide

This guide will help you set up OneSignal for push notifications in your React Native app.

## Prerequisites

- OneSignal account (sign up at [onesignal.com](https://onesignal.com))
- iOS Developer Account (for iOS push notifications)
- Google Firebase project (for Android push notifications)

## Step 1: Create OneSignal App

1. Go to [OneSignal Dashboard](https://app.onesignal.com)
2. Click "New App/Website"
3. Choose "Mobile App (iOS & Android)"
4. Enter your app name (e.g., "Zero Poofs")
5. Select your platform (iOS/Android)

## Step 2: Configure iOS Push Notifications

### 2.1 Create iOS Push Certificate

1. In OneSignal dashboard, go to Settings → Keys & IDs
2. Click "Add iOS Push Certificate"
3. Upload your `.p12` certificate file
4. Enter the certificate password

### 2.2 Get OneSignal App ID

1. In OneSignal dashboard, go to Settings → Keys & IDs
2. Copy your **OneSignal App ID**

## Step 3: Configure Android Push Notifications

### 3.1 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Add Android app to your Firebase project
4. Download `google-services.json` and place it in `android/app/`

### 3.2 Get Firebase Server Key

1. In Firebase Console, go to Project Settings → Cloud Messaging
2. Copy the **Server key**

### 3.3 Configure OneSignal

1. In OneSignal dashboard, go to Settings → Keys & IDs
2. Paste the Firebase Server key in the "Firebase Server Key" field

## Step 4: Update Your App Configuration

### 4.1 Update OneSignal App ID

Replace `YOUR_ONESIGNAL_APP_ID` in `src/services/oneSignalService.ts` with your actual OneSignal App ID:

```typescript
const ONESIGNAL_APP_ID = 'your-actual-onesignal-app-id-here';
```

### 4.2 iOS Configuration

Add the following to your `ios/YourApp/Info.plist`:

```xml
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

### 4.3 Android Configuration

Make sure your `android/app/src/main/AndroidManifest.xml` includes:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

## Step 5: Test Push Notifications

### 5.1 Send Test Notification

1. In OneSignal dashboard, go to Messages → New Push
2. Create a test message
3. Send to your test device

### 5.2 Verify Integration

Check the console logs for:
- "OneSignal initialized successfully"
- "Prompt response: true" (when permission is granted)

## Step 6: Customize Notification Content

You can customize the notification content by modifying the OneSignal service methods in `src/services/oneSignalService.ts`.

## Troubleshooting

### Common Issues

1. **"No iOS devices available"**: Make sure you have iOS runtimes installed in Xcode
2. **Permission denied**: Check device settings and ensure notifications are enabled
3. **Notifications not received**: Verify OneSignal App ID and certificate configuration

### Debug Mode

Enable debug logging by adding this to your OneSignal service:

```typescript
OneSignal.setLogLevel(OneSignal.LOG_LEVEL.VERBOSE);
```

## Additional Features

### User Segmentation

Use tags to segment your users:

```typescript
await oneSignalService.addTag('user_type', 'premium');
await oneSignalService.addTag('quit_stage', 'week_1');
```

### External User ID

Set external user ID for better tracking:

```typescript
await oneSignalService.setExternalUserId('user_123');
```

## Support

For more information, visit:
- [OneSignal Documentation](https://documentation.onesignal.com)
- [React Native OneSignal SDK](https://github.com/OneSignal/react-native-onesignal)

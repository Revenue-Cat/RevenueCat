# Google Authentication Setup Guide

This guide will help you set up Google Sign-In for your RevenueCat app.

## Prerequisites

1. A Google Cloud Console project
2. Firebase project configured
3. Expo development environment

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### 1.2 Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "RevenueCat"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `openid`, `profile`, `email`
5. Add test users (your email)

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `https://auth.expo.io/@your-expo-username/revenuecat`
   - `revenuecat://`
5. Copy the Client ID

## Step 2: Update Firebase Configuration

### 2.1 Enable Google Sign-In in Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to "Authentication" > "Sign-in method"
4. Enable "Google" provider
5. Add your Google Client ID from Step 1.3
6. Save the configuration

### 2.2 Update Firebase Config
Update `src/config/firebase.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 3: Update Google Auth Service

### 3.1 Update Client ID
In `src/services/googleAuth.ts`, replace the placeholder with your actual Google Client ID:

```typescript
const GOOGLE_CLIENT_ID = 'your-actual-google-client-id.apps.googleusercontent.com';
```

### 3.2 Update Expo Username
If you're using Expo Go, update the redirect URI in the Google Cloud Console:
- Replace `@your-expo-username` with your actual Expo username
- The URI should be: `https://auth.expo.io/@your-actual-username/revenuecat`

## Step 4: Test the Setup

### 4.1 Development Testing
1. Start your Expo development server:
   ```bash
   npm start
   ```

2. Test on different platforms:
   - **Expo Go**: Scan QR code with Expo Go app
   - **iOS Simulator**: `npm run ios`
   - **Android Emulator**: `npm run android`
   - **Web**: `npm run web`

### 4.2 Production Build
For production builds, you'll need to:

1. **iOS**: Add your bundle identifier to Google Cloud Console
2. **Android**: Add your package name to Google Cloud Console
3. **Web**: Add your domain to authorized origins

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Ensure the redirect URI in Google Cloud Console matches exactly
   - For Expo Go: `https://auth.expo.io/@username/revenuecat`
   - For standalone: `revenuecat://`

2. **"Client ID not found" error**
   - Verify the Client ID is correct in `googleAuth.ts`
   - Ensure the OAuth consent screen is configured

3. **"Sign-in failed" error**
   - Check Firebase Authentication is enabled for Google
   - Verify the Google Client ID is added to Firebase

4. **"Network error" on web**
   - Add your domain to authorized origins in Google Cloud Console
   - Ensure HTTPS is used in production

### Debug Steps

1. Check console logs for detailed error messages
2. Verify all configuration values are correct
3. Test with a simple Google sign-in flow first
4. Ensure all required APIs are enabled in Google Cloud Console

## Security Notes

1. **Never commit sensitive credentials** to version control
2. **Use environment variables** for production builds
3. **Restrict OAuth consent screen** to necessary scopes only
4. **Regularly review** authorized redirect URIs and origins

## Environment Variables (Recommended)

For production, use environment variables:

```typescript
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'your-client-id';
```

Create a `.env` file:
```
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Support

If you encounter issues:
1. Check the [Expo AuthSession documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
2. Review [Firebase Authentication docs](https://firebase.google.com/docs/auth)
3. Check [Google OAuth 2.0 documentation](https://developers.google.com/identity/protocols/oauth2) 
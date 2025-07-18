# RevenueCat - React Native App with Firebase Authentication

A React Native app built with Expo that demonstrates Firebase authentication with login, registration, and Google sign-in functionality.

## Features

- 🔐 Firebase Authentication (Email/Password)
- 📝 User Registration with email/password
- 🌐 Google Sign-In integration
- 📱 Cross-platform (iOS, Android, Web)
- 🎨 Modern UI with clean design
- 🔄 Real-time authentication state management
- 📊 User dashboard with logout functionality
- ⚡ Built with Expo for easy development

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Firebase project
- Google Cloud Console project (for Google Sign-In)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd RevenueCat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   
   Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   - Go to Project Settings
   - Add a new app (Web app)
   - Copy the Firebase configuration
   
   Update the Firebase configuration in `src/config/firebase.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Enable Authentication**
   
   In Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - Enable Google authentication (see GOOGLE_SETUP.md for detailed instructions)

5. **Google Sign-In Setup** (Optional)
   
   Follow the detailed guide in `GOOGLE_SETUP.md` to configure Google authentication.

## Running the App

### Development
```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Production Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## Project Structure

```
RevenueCat/
├── src/
│   ├── components/
│   │   └── LoadingScreen.tsx
│   ├── config/
│   │   ├── firebase.ts
│   │   └── firebase.example.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── HomeScreen.tsx
│   └── services/
│       └── googleAuth.ts
├── App.tsx
├── app.json
├── GOOGLE_SETUP.md
├── package.json
└── README.md
```

## Key Components

### Firebase Configuration (`src/config/firebase.ts`)
- Firebase app initialization
- Authentication service setup
- Registration, login, and logout functions
- Google authentication integration
- Auth state listener

### Authentication Context (`src/contexts/AuthContext.tsx`)
- Global authentication state management
- User state provider
- Loading state handling

### Login Screen (`src/screens/LoginScreen.tsx`)
- Email/password authentication
- Google sign-in integration
- Form validation and error handling
- Navigation to registration

### Registration Screen (`src/screens/RegisterScreen.tsx`)
- Email/password registration
- Password confirmation validation
- Google sign-in integration
- Navigation to login

### Home Screen (`src/screens/HomeScreen.tsx`)
- User information display
- Logout functionality with confirmation
- Dashboard layout

### Google Authentication (`src/services/googleAuth.ts`)
- Google OAuth integration using Expo AuthSession
- Cross-platform Google sign-in
- Firebase integration

## Authentication Flow

1. **App Launch**: App checks authentication state
2. **Not Authenticated**: Shows login screen with options to:
   - Sign in with email/password
   - Sign in with Google
   - Navigate to registration
3. **Registration**: User can create account with:
   - Email/password registration
   - Google sign-in
4. **Login**: User authenticates with:
   - Email/password
   - Google sign-in
5. **Authenticated**: App navigates to home screen
6. **Logout**: User confirms logout, Firebase signs out, returns to login

## Customization

### Styling
- All styles are defined using StyleSheet
- Colors and spacing can be customized in individual component files
- Theme colors: Primary (#007AFF), Error (#FF3B30)

### Firebase Features
- Easy to extend with additional Firebase services
- Add Firestore for data storage
- Implement push notifications
- Add more social authentication providers (Facebook, Apple, etc.)

### Google Authentication
- Follow `GOOGLE_SETUP.md` for detailed configuration
- Supports both development and production environments
- Cross-platform compatibility

## Troubleshooting

### Common Issues

1. **Firebase Configuration Error**
   - Ensure Firebase config is correct
   - Check if Authentication is enabled in Firebase Console

2. **Google Sign-In Issues**
   - Follow the `GOOGLE_SETUP.md` guide
   - Verify Google Client ID and redirect URIs
   - Check OAuth consent screen configuration

3. **Expo Build Issues**
   - Clear cache: `expo r -c`
   - Update Expo CLI: `npm install -g @expo/cli`

4. **Authentication Not Working**
   - Verify Firebase project settings
   - Check if Email/Password auth is enabled
   - Ensure test user exists in Firebase Console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team. 
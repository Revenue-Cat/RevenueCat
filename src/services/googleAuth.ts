import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { signInWithGoogle } from '../config/firebase';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const GOOGLE_CLIENT_ID = 'your-google-client-id.apps.googleusercontent.com'; // Replace with your Google Client ID
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: 'revenuecat', // Updated to match app.json scheme
});

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: GOOGLE_REDIRECT_URI,
      discovery,
    },
    discovery
  );

  const signInWithGoogleAsync = async () => {
    try {
      const result = await promptAsync();
      
      if (result.type === 'success') {
        // Exchange the authorization code for an ID token
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: GOOGLE_CLIENT_ID,
            code: result.params.code,
            redirectUri: GOOGLE_REDIRECT_URI,
            extraParams: {
              code_verifier: request?.codeVerifier || '',
            },
          },
          discovery
        );

        if (tokenResponse.idToken) {
          // Sign in to Firebase with the Google ID token
          await signInWithGoogle(tokenResponse.idToken);
          return { success: true };
        }
      }
      
      return { success: false, error: 'Google sign-in was cancelled or failed' };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    signInWithGoogleAsync,
    request,
    response,
  };
}; 
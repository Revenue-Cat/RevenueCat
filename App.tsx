import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import OnboardingScreen from './src/screens/OnboardingScreen';
import OnboardingProfileScreen from './src/screens/OnboardingProfileScreen';
import OnboardingQuantityScreen from './src/screens/OnboardingQuantityScreen';
import OnboardingThemeScreen from './src/screens/OnboardingThemeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoadingScreen from './src/components/LoadingScreen';

const Stack = createStackNavigator();

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Onboarding"
      >
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="OnboardingProfile" component={OnboardingProfileScreen} />
            <Stack.Screen name="OnboardingQuantity" component={OnboardingQuantityScreen} />
            <Stack.Screen name="OnboardingTheme" component={OnboardingThemeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

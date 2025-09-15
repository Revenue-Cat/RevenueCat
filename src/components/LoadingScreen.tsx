import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ActivityIndicator size="large" color={isDark ? "#60A5FA" : "#007AFF"} />
      <Text style={[styles.text, isDark && styles.textDark]}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  textDark: {
    color: '#94A3B8',
  },
});

export default LoadingScreen; 
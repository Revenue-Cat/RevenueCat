import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface WelcomeProps {
  onNext: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to QuitQly!</Text>
          <Text style={styles.subtitle}>
            Your friendly guide to quitting smoking — one small step at a time.
          </Text>
        </View>

        {/* Placeholder for illustration */}
        <View style={styles.illustration}>
          <Text style={styles.emoji}>🚭</Text>
        </View>

        {/* CTA Button */}
        <Pressable style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Let's start</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 64,
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  illustration: {
    width: width * 0.8,
    height: 400,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    marginBottom: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 96,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 18,
    width: width * 0.8,
    height: 56,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default Welcome; 
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

interface NotificationPermissionProps {
  onNext: () => void;
}

const NotificationPermission: React.FC<NotificationPermissionProps> = ({ onNext }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Enable Notifications</Text>
          <Text style={styles.subtitle}>
            We'll send you reminders to stay on track and celebrate your progress.
          </Text>
        </View>

        {/* Notification Icon */}
        <View style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={120} color="#000000" />
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color="#000000" />
            <Text style={styles.benefitText}>Daily motivation reminders</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color="#000000" />
            <Text style={styles.benefitText}>Celebrate your milestones</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={24} color="#000000" />
            <Text style={styles.benefitText}>Stay on track with your goals</Text>
          </View>
        </View>

        {/* CTA Button */}
        <Pressable style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Enable Notifications</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </Pressable>

        {/* Skip Option */}
        <Pressable style={styles.skipButton} onPress={onNext}>
          <Text style={styles.skipText}>Skip for now</Text>
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
    marginBottom: 48,
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
  notificationIcon: {
    width: 150,
    height: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 75,
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitsContainer: {
    marginBottom: 48,
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#000000',
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
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
    textDecorationLine: 'underline',
  },
});

export default NotificationPermission; 
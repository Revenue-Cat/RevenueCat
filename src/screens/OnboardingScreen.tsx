import React from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface OnboardingScreenProps {
  onNext?: () => void;
}

const { width } = Dimensions.get('window');

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onNext,
}) => {
  const navigation = useNavigation();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigation.navigate('OnboardingPath' as never);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Main Heading */}
        <Text style={styles.mainHeading}>
          Welcome to QuitQly!
        </Text>

        {/* Subheading */}
        <Text style={styles.subheading}>
          Your friendly guide to quitting smoking — one small step at a time.
        </Text>

        {/* Illustration Placeholder */}
        <View style={styles.illustrationPlaceholder}>
          {/* Placeholder for illustration or animation */}
        </View>

        {/* Primary Button */}
        <Pressable
          style={styles.primaryButton}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>Let's start</Text>
          <View style={styles.buttonContent}>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 16,
  },
  subheading: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  illustrationPlaceholder: {
    width: 300,
    height: 400,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    marginBottom: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    width: width * 0.8,
    height: 56,
    backgroundColor: 'black',
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff0000',
  },
});

export default OnboardingScreen; 
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

interface OnboardingScreenProps {
  onNext?: () => void;
  onLogin?: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onNext,
  onLogin,
}) => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState<string>('Так, я готовий');

  const options = [
    'Так, я готовий',
    'Я вже зупинився',
    'Пізніше',
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigation.navigate('OnboardingProfile' as never);
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigation.navigate('Login' as never);
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d', '#0f4c3a']}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#22d3ee', '#14b8a6']}
              style={styles.logoOuter}
            >
              <View style={styles.logoInner}>
                <LinearGradient
                  colors={['#22d3ee', '#14b8a6']}
                  style={styles.logoCenter}
                >
                  <Ionicons name="heart" size={16} color="white" />
                </LinearGradient>
              </View>
            </LinearGradient>
          </View>
          
          <Text style={styles.primaryQuestion}>
            Готові ви відмовитися від куріння і стати колишнім курцем зараз?
          </Text>
          
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => handleOptionSelect(option)}
                style={[
                  styles.optionButton,
                  selectedOption === option && styles.selectedOptionButton
                ]}
              >
                <Text style={styles.optionText}>
                  {option}
                </Text>
                <View style={[
                  styles.optionIcon,
                  selectedOption === option && styles.selectedOptionIcon
                ]}>
                  {selectedOption === option && (
                    <Ionicons 
                      name="checkmark" 
                      size={16} 
                      color="#0891b2" 
                    />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
          
          {/* Action Button */}
          <Pressable
            onPress={handleNext}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>
              Далі
            </Text>
          </Pressable>
          
          {/* Footer Link */}
          <View style={styles.footerLink}>
            <Text style={styles.footerText}>
              Вже маєте обліковий запис?{' '}
            </Text>
            <Pressable onPress={handleLogin}>
              <Text style={styles.loginLink}>
                Log In
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 96,
    height: 96,
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  logoInner: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCenter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryQuestion: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 28,
    paddingHorizontal: 16,
  },
  optionsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  optionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
    backgroundColor: '#374151',
  },
  selectedOptionButton: {
    borderColor: '#22d3ee',
  },
  optionText: {
    color: 'white',
    fontSize: 18, // 18pt font size as specified
    fontWeight: '500',
    flex: 1,
  },
  optionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  selectedOptionIcon: {
    backgroundColor: 'white',
    borderWidth: 0,
  },
  actionButton: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 32,
    alignSelf: 'center',
    minWidth: 120,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18, // 18pt font size as specified
    fontWeight: '600',
    textAlign: 'center',
  },
  footerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  footerText: {
    color: 'white',
    fontSize: 15, // 15pt font size as specified
  },
  loginLink: {
    color: '#22d3ee',
    fontSize: 15, // 15pt font size as specified
    fontWeight: '600',
  },
});

export default OnboardingScreen; 
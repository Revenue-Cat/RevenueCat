import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

interface OnboardingProfileScreenProps {
  onNext?: () => void;
  onBack?: () => void;
}

const OnboardingProfileScreen: React.FC<OnboardingProfileScreenProps> = ({
  onNext,
  onBack,
}) => {
  const navigation = useNavigation();
  const [selectedGender, setSelectedGender] = useState<string>('Чоловіча');
  const [username, setUsername] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const genderOptions = [
    'Чоловіча',
    'Жіноча',
    'Не вказано',
  ];

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      // Navigate to quantity screen after profile setup
      navigation.navigate('OnboardingQuantity' as never);
    }
  };

  const handleTermsToggle = () => {
    setAcceptTerms(!acceptTerms);
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d', '#0f4c3a']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Back Button */}
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>

            {/* Profile Picture Section */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                  <Ionicons name="person" size={60} color="#666" />
                </View>
                <Pressable style={styles.editButton}>
                  <Ionicons name="create-outline" size={20} color="white" />
                </Pressable>
              </View>
            </View>

            {/* Gender Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Стать</Text>
              <View style={styles.genderOptions}>
                {genderOptions.map((gender, index) => (
                  <Pressable
                    key={index}
                    style={styles.genderOption}
                    onPress={() => handleGenderSelect(gender)}
                  >
                    <View style={styles.radioContainer}>
                      <View style={[
                        styles.radioButton,
                        selectedGender === gender && styles.radioButtonSelected
                      ]}>
                        {selectedGender === gender && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    </View>
                    <Text style={styles.genderText}>{gender}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Username Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ваше ім'я користувача</Text>
              <TextInput
                style={styles.usernameInput}
                placeholder="Виберіть псевдонім"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Terms and Conditions */}
            <View style={styles.section}>
              <View style={styles.termsContainer}>
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>
                    Я прочитав і я приймаю
                  </Text>
                  <Pressable style={styles.termsLink}>
                    <Text style={styles.linkText}>
                      Умови та положення використання
                    </Text>
                  </Pressable>
                  <Pressable style={styles.termsLink}>
                    <Text style={styles.linkText}>
                      Політика конфіденційності
                    </Text>
                  </Pressable>
                </View>
                <Pressable
                  style={[
                    styles.toggleSwitch,
                    acceptTerms && styles.toggleSwitchActive
                  ]}
                  onPress={handleTermsToggle}
                >
                  <View style={[
                    styles.toggleThumb,
                    acceptTerms && styles.toggleThumbActive
                  ]} />
                </Pressable>
              </View>
            </View>

            {/* Next Button */}
            <Pressable
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Далі</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    marginTop: 16,
    marginLeft: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 32,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4b5563',
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4b5563',
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  radioContainer: {
    marginRight: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4b5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#22d3ee',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22d3ee',
  },
  genderText: {
    color: 'white',
    fontSize: 16,
  },
  usernameInput: {
    height: 56,
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  termsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  termsTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  termsText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  termsLink: {
    marginBottom: 4,
  },
  linkText: {
    color: '#22d3ee',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#374151',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#22d3ee',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#6b7280',
  },
  toggleThumbActive: {
    backgroundColor: 'white',
    transform: [{ translateX: 20 }],
  },
  nextButton: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 120,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingProfileScreen; 
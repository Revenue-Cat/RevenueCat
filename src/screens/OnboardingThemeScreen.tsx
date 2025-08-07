import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

interface OnboardingThemeScreenProps {
  onNext?: () => void;
  onBack?: () => void;
}

interface ColorSwatch {
  id: string;
  color: string;
  isSelected?: boolean;
}

const OnboardingThemeScreen: React.FC<OnboardingThemeScreenProps> = ({
  onNext,
  onBack,
}) => {
  const navigation = useNavigation();
  const [selectedMode, setSelectedMode] = useState<'light' | 'dark'>('dark');
  const [selectedColor, setSelectedColor] = useState<string>('#E7A1B0');

  const lightModeColors: ColorSwatch[] = [
    { id: 'light1', color: '#48D1CC' },
    { id: 'light2', color: '#9370DB' },
    { id: 'light3', color: '#FFA07A' },
    { id: 'light4', color: '#FFB347' },
    { id: 'light5', color: '#3CB371' },
    { id: 'light6', color: '#F08080' },
  ];

  const darkModeColors: ColorSwatch[] = [
    { id: 'dark1', color: '#00FFFF' },
    { id: 'dark2', color: '#C71585' },
    { id: 'dark3', color: '#E7A1B0', isSelected: true },
    { id: 'dark4', color: '#FFD700' },
    { id: 'dark5', color: '#55AE84' },
    { id: 'dark6', color: '#DC143C' },
  ];

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
      // Navigate to next screen or complete onboarding
      navigation.navigate('Login' as never);
    }
  };

  const handleModeSelect = (mode: 'light' | 'dark') => {
    setSelectedMode(mode);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const renderColorSwatch = (swatch: ColorSwatch, isDarkMode: boolean) => (
    <Pressable
      key={swatch.id}
      style={[
        styles.colorSwatch,
        { backgroundColor: swatch.color },
        swatch.color === selectedColor && styles.selectedColorSwatch
      ]}
      onPress={() => handleColorSelect(swatch.color)}
    />
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={selectedMode === 'dark' ? ['#008080', '#008080'] : ['#008080', '#008080']}
        style={styles.background}
      >
        <View style={styles.radialGradient} />
      </LinearGradient>
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Back Arrow */}
            <Pressable
              style={styles.backButton}
              onPress={handleBack}
            >
              <Ionicons name="chevron-back" size={30} color="white" />
            </Pressable>

            {/* Header Text */}
            <Text style={styles.headerText}>
              Оберіть режим відображення та кольори
            </Text>

            {/* Light Mode Section */}
            <View style={[
              styles.modeContainer,
              selectedMode === 'light' ? styles.darkModeContainer : styles.lightModeContainer,
              selectedMode === 'light' && styles.selectedModeContainer
            ]}>
              <Pressable
                style={styles.modePressable}
                onPress={() => handleModeSelect('light')}
              >
                {/* UI Preview Placeholder */}
                <View style={styles.uiPreview}>
                  <View style={styles.lightModePreview}>
                    <View style={styles.previewHeader} />
                    <View style={styles.previewContent}>
                      <View style={styles.previewElement} />
                      <View style={styles.previewElement} />
                      <View style={styles.previewElement} />
                    </View>
                  </View>
                </View>

                {/* Text & Colors */}
                <View style={styles.modeContent}>
                  <Text style={styles.modeTitle}>Світлий режим</Text>
                  <View style={styles.colorGrid}>
                    {lightModeColors.map((swatch) => renderColorSwatch(swatch, false))}
                  </View>
                </View>
              </Pressable>
            </View>

            {/* Dark Mode Section */}
            <View style={[
              styles.modeContainer,
              selectedMode === 'light' ? styles.lightModeContainer : styles.darkModeContainer,
              selectedMode === 'dark' && styles.selectedModeContainer
            ]}>
              <Pressable
                style={styles.modePressable}
                onPress={() => handleModeSelect('dark')}
              >
                {/* UI Preview Placeholder */}
                <View style={styles.uiPreview}>
                  <View style={styles.darkModePreview}>
                    <View style={styles.previewHeader} />
                    <View style={styles.previewContent}>
                      <View style={styles.previewElement} />
                      <View style={styles.previewElement} />
                      <View style={styles.previewElement} />
                    </View>
                  </View>
                </View>

                {/* Text & Colors */}
                <View style={styles.modeContent}>
                  <Text style={styles.modeTitle}>Темний режим</Text>
                  <View style={styles.colorGrid}>
                    {darkModeColors.map((swatch) => renderColorSwatch(swatch, true))}
                  </View>
                </View>
              </Pressable>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  radialGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#004d40',
    opacity: 0.3,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  backButton: {
    marginTop: 40,
    marginLeft: 20,
    width: 30,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  modeContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  lightModeContainer: {
    backgroundColor: '#3a3a3c',
    borderWidth: 3,
    borderColor: '#545458',
  },
  darkModeContainer: {
    backgroundColor: '#008080',
  },
  selectedModeContainer: {
    borderWidth: 3,
    borderColor: '#22d3ee',
    backgroundColor: '#008080',
  },
  modePressable: {
    flexDirection: 'row',
    padding: 15,
    minHeight: 120,
  },
  uiPreview: {
    width: 120,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  lightModePreview: {
    width: 120,
    height: 160,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  darkModePreview: {
    width: 120,
    height: 160,
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 10,
  },
  previewHeader: {
    height: 15,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: 8,
  },
  previewContent: {
    flex: 1,
    gap: 6,
  },
  previewElement: {
    height: 20,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
  },
  modeContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  modeTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  selectedColorSwatch: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  nextButton: {
    width: 150,
    height: 50,
    backgroundColor: '#48484a',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'normal',
  },
});

export default OnboardingThemeScreen; 
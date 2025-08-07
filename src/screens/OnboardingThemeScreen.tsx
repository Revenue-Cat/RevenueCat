import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
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
  backgroundColor?: string;
  isSelected?: boolean;
}

interface ModeData {
  id: 'light' | 'dark';
  title: string;
  colors: ColorSwatch[];
  previewStyle: object;
}

// Extracted reusable components
const ColorSwatchComponent: React.FC<{
  swatch: ColorSwatch;
  isSelected: boolean;
  onSelect: (color: string) => void;
}> = React.memo(({ swatch, isSelected, onSelect }) => (
  <Pressable
    style={[
      styles.colorSwatch,
      { backgroundColor: swatch.backgroundColor || swatch.color },
      isSelected && styles.selectedColorSwatch
    ]}
    onPress={() => onSelect(swatch.color)}
  />
));

const UIPreview: React.FC<{ mode: 'light' | 'dark' }> = React.memo(({ mode }) => (
  <View style={styles.uiPreview}>
    <View style={[
      styles.previewContainer,
      mode === 'light' ? styles.lightModePreview : styles.darkModePreview
    ]}>
      <View style={styles.previewHeader} />
      <View style={styles.previewContent}>
        <View style={styles.previewElement} />
        <View style={styles.previewElement} />
        <View style={styles.previewElement} />
      </View>
    </View>
  </View>
));

const ModeSection: React.FC<{
  modeData: ModeData;
  isSelected: boolean;
  onSelect: (mode: 'light' | 'dark') => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}> = React.memo(({ modeData, isSelected, onSelect, selectedColor, onColorSelect }) => (
  <View style={[
    styles.modeContainer,
    isSelected ? styles.selectedModeContainer : styles.unselectedModeContainer,
    {
      backgroundColor: modeData.id === 'light' 
        ? '#3a3a3c' 
        : '#008080'
    }
  ]}>
    <Pressable
      style={styles.modePressable}
      onPress={() => onSelect(modeData.id)}
    >
      <UIPreview mode={modeData.id} />
      
      <View style={styles.modeContent}>
        <Text style={styles.modeTitle}>{modeData.title} </Text>
        <View style={styles.colorGrid}>
          {modeData.colors.map((swatch) => (
            <ColorSwatchComponent
              key={swatch.id}
              swatch={swatch}
              isSelected={swatch.color === selectedColor}
              onSelect={onColorSelect}
            />
          ))}
        </View>
      </View>
    </Pressable>
  </View>
));

const OnboardingThemeScreen: React.FC<OnboardingThemeScreenProps> = ({
  onNext,
  onBack,
}) => {
  const navigation = useNavigation();
  const [selectedMode, setSelectedMode] = useState<'light' | 'dark'>('dark');
  const [selectedColor, setSelectedColor] = useState<string>('#E7A1B0');

  // Memoized data to prevent unnecessary re-renders
  const modeData: ModeData[] = useMemo(() => [
    {
      id: 'light',
      title: 'Світлий режим',
      colors: [
        { id: 'light1', color: '#48D1CC' },
        { id: 'light2', color: '#9370DB' },
        { id: 'light3', color: '#FFA07A' },
        { id: 'light4', color: '#FFB347' },
        { id: 'light5', color: '#3CB371' },
        { id: 'light6', color: '#F08080' },
      ],
      previewStyle: styles.lightModePreview,
    },
    {
      id: 'dark',
      title: 'Темний режим',
      colors: [
        { id: 'dark1', color: '#00FFFF' },
        { id: 'dark2', color: '#C71585' },
        { id: 'dark3', color: '#E7A1B0' },
        { id: 'dark4', color: '#FFD700' },
        { id: 'dark5', color: '#55AE84' },
        { id: 'dark6', color: '#DC143C' },
      ],
      previewStyle: styles.darkModePreview,
    },
  ], []);

  // Memoized handlers to prevent unnecessary re-renders
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  }, [onBack, navigation]);

  const handleNext = useCallback(() => {
    if (onNext) {
      onNext();
    } else {
      navigation.navigate('Login' as never);
    }
  }, [onNext, navigation]);

  const handleModeSelect = useCallback((mode: 'light' | 'dark') => {
    setSelectedMode(mode);
  }, []);

  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#008080', '#008080']}
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
            {/* Back Button */}
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

            {/* Mode Sections */}
            {modeData.map((mode) => (
              <ModeSection
                key={mode.id}
                modeData={mode}
                isSelected={selectedMode === mode.id}
                onSelect={handleModeSelect}
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
              />
            ))}

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
    paddingHorizontal: 20,
    paddingTop: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  modeContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  unselectedModeContainer: {
    backgroundColor: '#3a3a3c',
    borderWidth: 3,
    borderColor: '#545458',
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
  previewContainer: {
    width: 120,
    height: 160,
    borderRadius: 10,
    padding: 10,
  },
  lightModePreview: {
    backgroundColor: '#f0f0f0',
  },
  darkModePreview: {
    backgroundColor: '#1c1c1e',
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
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
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
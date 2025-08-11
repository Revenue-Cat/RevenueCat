import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface SetupData {
  smokeType: string;
  dailyAmount: string;
  packPrice: string;
  goal: string;
  [key: string]: string;
}

interface SetupProps {
  onNext: () => void;
  onBack: () => void;
}

const Setup: React.FC<SetupProps> = ({ onNext, onBack }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  
  const [setupData, setSetupData] = useState<SetupData>({
    smokeType: '',
    dailyAmount: '',
    packPrice: '',
    goal: ''
  });
  
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  const allFieldsCompleted = Object.values(setupData).every(value => value !== '');

  const handleFieldClick = (field: string) => {
    setCurrentStep(field);
  };

  const handleSelection = (field: keyof SetupData, value: string) => {
    setSetupData(prev => ({ ...prev, [field]: value }));
    setCurrentStep(null);
  };

  const setupFields = [
    {
      id: "smokeType",
      label: t('setup.fields.smokeType.label'),
      icon: "remove-circle-outline" as keyof typeof Ionicons.glyphMap,
      value: setupData.smokeType,
      options: [
        { value: "cigarettes", label: t('setup.fields.smokeType.options.cigarettes') },
        { value: "tobacco-heater", label: t('setup.fields.smokeType.options.tobacco-heater') },
        { value: "roll-your-own", label: t('setup.fields.smokeType.options.roll-your-own') }
      ]
    },
    {
      id: "dailyAmount",
      label: t('setup.fields.dailyAmount.label'),
      icon: "reader-outline" as keyof typeof Ionicons.glyphMap,
      value: setupData.dailyAmount,
      options: [
        { value: "1-5", label: t('setup.fields.dailyAmount.options.1-5') },
        { value: "5-10", label: t('setup.fields.dailyAmount.options.5-10') },
        { value: "11-15", label: t('setup.fields.dailyAmount.options.11-15') },
        { value: "16-20", label: t('setup.fields.dailyAmount.options.16-20') },
        { value: "21-30", label: t('setup.fields.dailyAmount.options.21-30') },
        { value: "31-40", label: t('setup.fields.dailyAmount.options.31-40') }
      ]
    },
    {
      id: "packPrice",
      label: t('setup.fields.packPrice.label'),
      icon: "wallet-outline" as keyof typeof Ionicons.glyphMap,
      value: setupData.packPrice,
      options: [
        { value: "3", label: t('setup.fields.packPrice.options.3') },
        { value: "4", label: t('setup.fields.packPrice.options.4') },
        { value: "5", label: t('setup.fields.packPrice.options.5') },
        { value: "6", label: t('setup.fields.packPrice.options.6') },
        { value: "7", label: t('setup.fields.packPrice.options.7') }
      ]
    },
    {
      id: "goal",
      label: t('setup.fields.goal.label'),
      icon: "navigate-circle-outline" as keyof typeof Ionicons.glyphMap,
      value: setupData.goal,
      options: [
        { value: "quit-completely", label: t('setup.fields.goal.options.quit-completely') },
        { value: "reduce-gradually", label: t('setup.fields.goal.options.reduce-gradually') },
        { value: "save-money", label: t('setup.fields.goal.options.save-money') },
        { value: "improve-health", label: t('setup.fields.goal.options.improve-health') },
        { value: "gain-control", label: t('setup.fields.goal.options.gain-control') },
        { value: "doesnt-matter", label: t('setup.fields.goal.options.doesnt-matter') }
      ]
    }
  ];

  const currentField = setupFields.find(field => field.id === currentStep);

  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 40 }}>
        {/* Header */}
        <View className="items-center mb-8">
          <Text className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
            {t('setup.header.title')}
          </Text>
          <Text className={`text-base text-center leading-6 px-5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            {t('setup.header.description')}
          </Text>
        </View>

        {/* Stats Card */}
        <View className={`rounded-2xl p-6 items-center mb-8 ${isDark ? 'bg-dark-surface' : 'bg-light-surface'}`}>
          <Text className={`text-5xl font-bold mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>70%</Text>
          <Text className={`text-base text-center ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
            {t('setup.stats.description')}
          </Text>
        </View>

        {/* Setup Fields */}
        <View className="gap-4 mb-8">
          {setupFields.map((field) => (
            <Pressable
              key={field.id}
              className={`w-11/12 h-14 rounded-xl flex-row justify-between items-center px-5 self-center ${
                setupData[field.id] 
                  ? (isDark ? 'bg-dark-surface' : 'bg-gray-200') 
                  : (isDark ? 'bg-dark-surface' : 'bg-gray-100')
              }`}
              onPress={() => handleFieldClick(field.id)}
            >
              <Text className={`text-base font-medium flex-1 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                {setupData[field.id] ? (
                  <Text>
                    {field.id === "smokeType" && t('setup.fields.smokeType.selected', { value: field.options.find(opt => opt.value === setupData[field.id])?.label || setupData[field.id] })}
                    {field.id === "dailyAmount" && t('setup.fields.dailyAmount.selected', { value: field.options.find(opt => opt.value === setupData[field.id])?.label || setupData[field.id] })}
                    {field.id === "packPrice" && t('setup.fields.packPrice.selected', { value: `$${setupData[field.id]}` })}
                    {field.id === "goal" && t('setup.fields.goal.selected', { value: field.options.find(opt => opt.value === setupData[field.id])?.label || setupData[field.id] })}
                  </Text>
                ) : (
                  field.label
                )}
              </Text>
              <Ionicons 
                name={field.icon} 
                size={24} 
                color={isDark ? '#94a3b8' : '#6b7280'} 
              />
            </Pressable>
          ))}
        </View>

        {/* Next Button */}
        <View className="items-center">
          <Pressable
            className={`flex-row items-center justify-between px-6 py-4 rounded-2xl w-4/5 h-14 ${
              allFieldsCompleted 
                ? (isDark ? 'bg-dark-accent' : 'bg-light-primary') 
                : 'bg-gray-400'
            }`}
            onPress={onNext}
            disabled={!allFieldsCompleted}
          >
            <Text className={`text-lg font-semibold ${isDark ? 'text-dark-background' : 'text-light-background'}`}>
              {t('setup.nextButton.text')}
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={isDark ? '#0f172a' : '#ffffff'} 
            />
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal for Options */}
      {currentStep && currentField && (
        <Modal visible={true} transparent={true} animationType="slide">
          <View className="flex-1 bg-black/50 justify-end">
            <View className={`${isDark ? 'bg-dark-background' : 'bg-light-background'} rounded-t-3xl max-h-4/5`}>
              <View className="px-5 pt-6 pb-10">
                <Text className={`text-lg font-bold text-center mb-6 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                  {currentField.label}
                </Text>
                
                <ScrollView className="max-h-96">
                  {currentField.options.map((option) => (
                    <Pressable
                      key={option.value}
                      className={`w-11/12 h-14 rounded-xl flex-row justify-between items-center px-5 self-center mb-3 ${
                        setupData[currentStep as keyof SetupData] === option.value 
                          ? (isDark ? 'bg-dark-accent' : 'bg-light-primary') 
                          : (isDark ? 'bg-dark-surface' : 'bg-gray-100')
                      }`}
                      onPress={() => handleSelection(currentStep as keyof SetupData, option.value)}
                    >
                      <Text className={`text-base font-medium flex-1 ${
                        setupData[currentStep as keyof SetupData] === option.value 
                          ? (isDark ? 'text-dark-background' : 'text-light-background') 
                          : (isDark ? 'text-dark-text' : 'text-light-text')
                      }`}>
                        {option.label}
                      </Text>
                      <Ionicons 
                        name={currentField.icon} 
                        size={24} 
                        color={setupData[currentStep as keyof SetupData] === option.value 
                          ? (isDark ? '#0f172a' : '#ffffff') 
                          : (isDark ? '#94a3b8' : '#6b7280')} 
                      />
                    </Pressable>
                  ))}
                </ScrollView>
                
                <Pressable 
                  className={`w-15 h-15 rounded-full justify-center items-center self-center mt-6 ${
                    isDark ? 'bg-dark-surface' : 'bg-gray-100'
                  }`} 
                  onPress={() => setCurrentStep(null)}
                >
                  <Text className={`text-2xl font-bold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>✕</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Setup; 
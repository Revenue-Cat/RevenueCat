import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import SlideModal from './SlideModal';

interface DailyAmountModalProps {
  visible: boolean;
  onClose: () => void;
  selectedValue: string;
  onSelect: (value: string) => void;
  smokeType?: string;
}

const DailyAmountModal: React.FC<DailyAmountModalProps> = ({
  visible,
  onClose,
  selectedValue,
  onSelect,
  smokeType = 'cigarettes',
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  // Get options based on smoke type
  const getOptions = () => {
    const smokeTypeOptions = t(`setup.fields.dailyAmount.options.${smokeType}`, { returnObjects: true }) as Record<string, string>;
    
    if (smokeType === 'vaping') {
      return [
        { value: "light", label: smokeTypeOptions.light },
        { value: "moderate", label: smokeTypeOptions.moderate },
        { value: "heavy", label: smokeTypeOptions.heavy }
      ];
    } else {
      return [
        { value: "1-5", label: smokeTypeOptions["1-5"] },
        { value: "6-10", label: smokeTypeOptions["6-10"] },
        { value: "11-20", label: smokeTypeOptions["11-20"] },
        { value: "21+", label: smokeTypeOptions["21+"] }
      ];
    }
  };

  const options = getOptions();

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={t(`setup.fields.dailyAmount.modalTitle.${smokeType}`)}
    >
      <ScrollView>
        <View className="gap-4">
          {options.map((option) => (
            <Pressable
              key={option.value}
              className={`w-11/12 h-16 rounded-3xl flex-row items-center justify-between px-5 self-center ${
                selectedValue === option.value 
                  ? (isDark ? 'bg-slate-600' : 'bg-indigo-100') 
                  : (isDark ? 'bg-slate-700' : 'bg-indigo-50')
              }`}
              onPress={() => handleSelect(option.value)}
            >
              <View className="flex-row items-center">
                <Text className={`text-base ${selectedValue === option.value ? 'font-bold' : 'font-medium'} ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
                  {option.label}
                </Text>
              </View>
              {selectedValue === option.value && (
                <Ionicons 
                  name="checkmark" 
                  size={24} 
                  color={isDark ? "#CBD5E1" : "#4f46e5"} 
                />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SlideModal>
  );
};

export default DailyAmountModal;

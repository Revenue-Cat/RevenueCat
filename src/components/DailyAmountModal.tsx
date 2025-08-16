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
}

const DailyAmountModal: React.FC<DailyAmountModalProps> = ({
  visible,
  onClose,
  selectedValue,
  onSelect,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const options = [
    { value: "1-5", label: t('setup.fields.dailyAmount.options.1-5') },
    { value: "5-10", label: t('setup.fields.dailyAmount.options.5-10') },
    { value: "11-15", label: t('setup.fields.dailyAmount.options.11-15') },
    { value: "16-20", label: t('setup.fields.dailyAmount.options.16-20') },
    { value: "21-30", label: t('setup.fields.dailyAmount.options.21-30') },
    { value: "31-40", label: t('setup.fields.dailyAmount.options.31-40') }
  ];

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={t('setup.fields.dailyAmount.modalTitle')}
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
                  color="#4f46e5" 
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

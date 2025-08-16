import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import SlideModal from './SlideModal';
import SmokeIcon from '../assets/icons/smoke.svg';
import RollIcon from '../assets/icons/roll.svg';
import HeatedIcon from '../assets/icons/heated.svg';
import VapeIcon from '../assets/icons/vape.svg';

interface SmokeTypeModalProps {
  visible: boolean;
  onClose: () => void;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const SmokeTypeModal: React.FC<SmokeTypeModalProps> = ({
  visible,
  onClose,
  selectedValue,
  onSelect,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const iconColor = selectedValue ? '#312E81' : (isDark ? '#CBD5E1' : '#1E1B4B');

  const options = [
    { value: "cigarettes", label: t('setup.fields.smokeType.options.cigarettes'), icon: <SmokeIcon width={20} height={20} color={iconColor} /> },
    { value: "tobacco-heater", label: t('setup.fields.smokeType.options.tobacco-heater'), icon: <RollIcon width={20} height={20} color={iconColor} /> },
    { value: "roll-your-own", label: t('setup.fields.smokeType.options.roll-your-own'), icon: <HeatedIcon width={20} height={20} color={iconColor} /> },
    { value: "vaping", label: t('setup.fields.smokeType.options.vaping'), icon: <VapeIcon width={20} height={20} color={iconColor} />}
  ];

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={t('setup.fields.smokeType.modalTitle')}
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
                {option.icon}
                <Text className={`text-base pl-2 ${selectedValue === option.value ? 'font-bold' : 'font-medium'} ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
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

export default SmokeTypeModal;

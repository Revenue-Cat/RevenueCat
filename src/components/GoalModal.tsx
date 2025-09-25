import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import SlideModal from './SlideModal';
import QuitIcon from '../assets/icons/quit.svg';
import ChartDownIcon from '../assets/icons/chart_down.svg';
import SaveMoneyIcon from '../assets/icons/save-money.svg';
import HearthIcon from '../assets/icons/heart.svg';
import BrainIcon from '../assets/icons/brain.svg';
import NoMeterIcon from '../assets/icons/no-mater.svg';

interface GoalModalProps {
  visible: boolean;
  onClose: () => void;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const GoalModal: React.FC<GoalModalProps> = ({
  visible,
  onClose,
  selectedValue,
  onSelect,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const iconColor = isDark ? '#CBD5E1' : (selectedValue ? '#312E81' : '#1E1B4B');

  const options = [
    { value: "quit-completely", label: t('setup.fields.goal.options.quit-completely'), icon: <QuitIcon width={20} height={20} color={iconColor} /> },
    { value: "reduce-gradually", label: t('setup.fields.goal.options.reduce-gradually'), icon: <ChartDownIcon width={20} height={20} color={iconColor} /> },
    { value: "save-money", label: t('setup.fields.goal.options.save-money'), icon: <SaveMoneyIcon width={20} height={20} color={iconColor} /> },
    { value: "improve-health", label: t('setup.fields.goal.options.improve-health'), icon: <HearthIcon width={20} height={20} color={iconColor} /> },
    { value: "gain-control", label: t('setup.fields.goal.options.gain-control'), icon: <BrainIcon width={20} height={20} color={iconColor} /> },
    { value: "doesnt-matter", label: t('setup.fields.goal.options.doesnt-matter'), icon: <NoMeterIcon width={20} height={20} color={iconColor} /> }
  ];

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={t('setup.fields.goal.modalTitle')}
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

export default GoalModal;

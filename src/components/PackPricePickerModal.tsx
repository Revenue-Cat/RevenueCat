import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import SlideModal from './SlideModal';

interface PackPricePickerModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  pickerValue: number;
  pickerCurrency: string;
  onValueChange: (value: number) => void;
  onCurrencyChange: (currency: string) => void;
  onConfirm: () => void;
}

const PackPricePickerModal: React.FC<PackPricePickerModalProps> = ({
  visible,
  onClose,
  title,
  pickerValue,
  pickerCurrency,
  onValueChange,
  onCurrencyChange,
  onConfirm,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={title}
      showCloseButton={false}
    >
      {/* Picker Container */}
      <View className="flex-row justify-center items-center mb-8">
        {/* Number Picker */}
        <View className="w-32 h-48 overflow-hidden">
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 96 }}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((number) => (
              <Pressable
                key={number}
                onPress={() => onValueChange(number)}
                className={`h-12 items-center justify-center ${
                  pickerValue === number ? 'bg-indigo-100 rounded-lg' : ''
                }`}
              >
                <Text className={`text-2xl font-bold ${
                  pickerValue === number 
                    ? 'text-indigo-600' 
                    : isDark ? 'text-slate-400' : 'text-slate-300'
                }`}>
                  {number}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Currency Picker */}
        <View className="w-20 h-48 overflow-hidden">
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 96 }}
          >
            {['$', '€', '£'].map((currency, index) => (
              <Pressable
                key={currency}
                onPress={() => onCurrencyChange(currency)}
                className={`h-12 items-center justify-center ${
                  pickerCurrency === currency ? 'bg-indigo-100 rounded-lg' : ''
                }`}
              >
                <Text className={`text-2xl font-bold ${
                  pickerCurrency === currency 
                    ? 'text-indigo-600' 
                    : isDark ? 'text-slate-400' : 'text-slate-300'
                }`}>
                  {currency}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-center gap-4">
        <Pressable 
          className={`w-12 h-12 rounded-2xl justify-center items-center ${
            isDark ? 'bg-slate-700' : 'bg-slate-200'
          }`} 
          onPress={onClose}
        >
          <Text className="text-2xl font-bold text-slate-600">✕</Text>
        </Pressable>
        
        <Pressable 
          className="w-12 h-12 rounded-2xl justify-center items-center bg-indigo-600"
          onPress={handleConfirm}
        >
          <Text className="text-2xl font-bold text-white">✓</Text>
        </Pressable>
      </View>
    </SlideModal>
  );
};

export default PackPricePickerModal;

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
      <View className="flex-row justify-center items-center gap-0 relative">

        {/* Number Picker */}
        <View className="w-20 h-50 items-center justify-center p-0 m-0">
          <Picker
            selectedValue={pickerValue}
            onValueChange={(value) => onValueChange(Number(value))}
            style={{
              width: 90,
              height: 220,
              color: isDark ? '#0c68e7' : '#07033f',
            }}
            itemStyle={{
              fontSize: 24,
              fontWeight: 'bold',
              color: isDark ? '#0c68e7' : '#07033f',
            }}
            selectionColor={isDark ? '#1e40af' : '#0b3ee6'} // Custom selection background
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((number) => (
              <Picker.Item
                key={number}
                label={number.toString()}
                value={number}
                color={pickerValue === number ? '#1E1B4B' : '#1E1B4B'}
              />
            ))}
          </Picker>
        </View>

        {/* Currency Picker */}
        <View className="w-16 h-50 items-center justify-center p-0 m-0">
          <Picker
            selectedValue={pickerCurrency}
            onValueChange={(value) => onCurrencyChange(value)}
            style={{
              width: 70,
              height: 220,
              color: isDark ? '#0c68e7' : '#e6710b',
            }}
            itemStyle={{
              fontSize: 24,
              fontWeight: 'bold',
              color: isDark ? '#0c68e7' : '#e45a1a',
            }}
            selectionColor={isDark ? '#1e40af' : '#0235e0'} // Custom selection background
          >
            {['$', '€', '£'].map((currency) => (
              <Picker.Item
                key={currency}
                label={currency}
                value={currency}
                color={pickerCurrency === currency ? '#1E1B4B' : '#1E1B4B'}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-center gap-4">
        <Pressable 
          className={`w-16 h-16 rounded-2xl justify-center items-center ${
            isDark ? 'bg-slate-700' : 'bg-slate-200'
          }`} 
          onPress={onClose}
        >
          <Text className="text-2xl font-bold text-slate-600">✕</Text>
        </Pressable>
        
        <Pressable 
          className="w-16 h-16 rounded-2xl justify-center items-center bg-indigo-600"
          onPress={handleConfirm}
        >
          <Text className="text-2xl font-bold text-white">✓</Text>
        </Pressable>
      </View>
    </SlideModal>
  );
};

export default PackPricePickerModal;

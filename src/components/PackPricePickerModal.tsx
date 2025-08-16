import React, { useRef } from 'react';
import { View, Text, Pressable, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
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
  const numberScrollViewRef = useRef<ScrollView>(null);
  const currencyScrollViewRef = useRef<ScrollView>(null);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleNumberScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    const itemHeight = 48; // Height of each number item
    const centerOffset = 96; // Padding to center the selection
    
    const scrollPosition = contentOffset.y + centerOffset;
    const selectedIndex = Math.round(scrollPosition / itemHeight);
    const selectedNumber = Math.max(1, Math.min(20, selectedIndex + 1));
    
    if (selectedNumber !== pickerValue) {
      onValueChange(selectedNumber);
    }
  };

  const handleCurrencyScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    const itemHeight = 48; // Height of each currency item
    const centerOffset = 96; // Padding to center the selection
    
    const scrollPosition = contentOffset.y + centerOffset;
    const selectedIndex = Math.round(scrollPosition / itemHeight);
    const currencies = ['$', '€', '£'];
    const selectedCurrency = currencies[Math.max(0, Math.min(2, selectedIndex))];
    
    if (selectedCurrency !== pickerCurrency) {
      onCurrencyChange(selectedCurrency);
    }
  };

  const handleNumberPress = (number: number) => {
    onValueChange(number);
    // Scroll to the selected number - use same calculation as scroll handler
    const itemHeight = 48;
    const centerOffset = 96;
    const targetScrollY = (number - 1) * itemHeight;
    
    numberScrollViewRef.current?.scrollTo({
      y: targetScrollY,
      animated: true
    });
  };

  const handleCurrencyPress = (currency: string) => {
    onCurrencyChange(currency);
    // Scroll to the selected currency - use same calculation as scroll handler
    const itemHeight = 48;
    const centerOffset = 96;
    const currencies = ['$', '€', '£'];
    const currencyIndex = currencies.indexOf(currency);
    const targetScrollY = currencyIndex * itemHeight;
    
    currencyScrollViewRef.current?.scrollTo({
      y: targetScrollY,
      animated: true
    });
  };

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={title}
      showCloseButton={false}
    >
      {/* Picker Container with Fixed Selection Area */}
      <View className="flex-row justify-center items-center mb-8 relative">
        {/* Fixed Selection Highlight Overlay - 50% width and centered */}
        <View className="absolute top-1/2 left-1/4 right-1/4 h-12 bg-indigo-100/30 rounded-lg -translate-y-6 z-0" />
        
        {/* Number Picker - Scrollable with Numbers Visible in Selection Area */}
        <View className="w-22 h-48 overflow-hidden relative z-10">
          <ScrollView 
            ref={numberScrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 96 }}
            onScroll={handleNumberScroll}
            scrollEventThrottle={16}
            snapToInterval={48}
            decelerationRate="fast"
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((number) => (
              <Pressable
                key={number}
                onPress={() => handleNumberPress(number)}
                className="h-12 items-center justify-center"
              >
                <Text className={`text-2xl font-bold ${
                  pickerValue === number 
                    ? 'text-indigo-800 font-black' 
                    : isDark ? 'text-slate-400' : 'text-slate-300'
                }`}>
                  {number}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Currency Picker - Scrollable with Currencies Visible in Selection Area */}
        <View className="w-10 h-48 overflow-hidden relative z-10">
          <ScrollView 
            ref={currencyScrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 96 }}
            onScroll={handleCurrencyScroll}
            scrollEventThrottle={16}
            snapToInterval={48}
            decelerationRate="fast"
          >
            {['$', '€', '£'].map((currency, index) => (
              <Pressable
                key={currency}
                onPress={() => handleCurrencyPress(currency)}
                className="h-12 items-center justify-center"
              >
                <Text className={`text-2xl font-bold ${
                  pickerCurrency === currency 
                    ? 'text-indigo-800 font-black' 
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

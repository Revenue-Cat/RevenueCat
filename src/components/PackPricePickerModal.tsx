import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Platform, ScrollView, Dimensions } from 'react-native';
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

// Custom Picker Component for Android
const CustomPicker: React.FC<{
  items: Array<{ label: string; value: string | number }>;
  selectedValue: string | number;
  onValueChange: (value: string | number) => void;
  width: number;
  height: number;
  isDark: boolean;
}> = ({ items, selectedValue, onValueChange, width, height, isDark }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const itemHeight = 50;
  const selectedIndex = items.findIndex(item => item.value === selectedValue);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const index = Math.round(scrollY / itemHeight);
    if (index >= 0 && index < items.length && items[index].value !== selectedValue && !isScrolling) {
      onValueChange(items[index].value);
    }
  };

  const handleScrollBeginDrag = () => {
    setIsScrolling(true);
  };

  const handleScrollEndDrag = () => {
    setIsScrolling(false);
  };

  const scrollToSelected = () => {
    if (scrollViewRef.current && selectedIndex >= 0) {
      const targetY = selectedIndex * itemHeight;
      scrollViewRef.current.scrollTo({
        y: targetY,
        animated: true,
      });
    }
  };

  React.useEffect(() => {
    // Delay to ensure ScrollView is mounted
    setTimeout(() => {
      scrollToSelected();
    }, 100);
  }, [selectedValue]);

  return (
    <View style={{ 
      width, 
      height, 
      backgroundColor: isDark ? '#1f2937' : '#f9fafb', 
      borderRadius: 8, 
      overflow: 'hidden',
    }}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: height / 2 - itemHeight / 2,
          paddingBottom: height / 2 - itemHeight / 2,
        }}
        style={{ flex: 1 }}
      >
        {items.map((item, index) => (
          <Pressable
            key={item.value}
            onPress={() => {
              onValueChange(item.value);
              scrollToSelected();
            }}
            style={{
              height: itemHeight,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: item.value === selectedValue 
                ? (isDark ? '#374151' : '#e5e7eb') 
                : 'transparent',
              marginHorizontal: 4,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: item.value === selectedValue 
                  ? (isDark ? '#0c68e7' : '#07033f')
                  : (isDark ? '#9ca3af' : '#6b7280'),
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

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
      onConfirm={handleConfirm}
      confirmText="✓"
    >
      {/* Picker Container */}
      <View className="flex-row justify-center items-center gap-0 relative">

        {/* Number Picker */}
        <View className="w-20 h-50 items-center justify-center p-0 m-0">
          {Platform.OS === 'android' ? (
            <CustomPicker
              items={Array.from({ length: 20 }, (_, i) => ({ 
                label: (i + 1).toString(), 
                value: i + 1 
              }))}
              selectedValue={pickerValue}
              onValueChange={(value) => onValueChange(Number(value))}
              width={90}
              height={200}
              isDark={isDark}
            />
          ) : (
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
              selectionColor={isDark ? '#1e40af' : '#0b3ee6'}
              mode="dialog"
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
          )}
        </View>

        {/* Currency Picker */}
        <View className="w-16 h-50 items-center justify-center p-0 m-0">
          {Platform.OS === 'android' ? (
            <CustomPicker
              items={['$', '€', '£'].map(currency => ({ 
                label: currency, 
                value: currency 
              }))}
              selectedValue={pickerCurrency}
              onValueChange={(value) => onCurrencyChange(value as string)}
              width={72}
              height={200}
              isDark={isDark}
            />
          ) : (
            <Picker
              selectedValue={pickerCurrency}
              onValueChange={(value) => onCurrencyChange(value)}
              style={{
                width: 72,
                height: 220,
                color: isDark ? '#0c68e7' : '#e6710b',
              }}
              itemStyle={{
                fontSize: 24,
                fontWeight: 'bold',
                color: isDark ? '#0c68e7' : '#e45a1a',
              }}
              selectionColor={isDark ? '#1e40af' : '#0235e0'}
              mode="dialog"
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
          )}
        </View>
      </View>

      {/* Footer handled by SlideModal via onConfirm/showCloseButton */}
    </SlideModal>
  );
};

export default PackPricePickerModal;

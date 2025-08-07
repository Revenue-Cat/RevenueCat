import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface OnboardingQuantityScreenProps {
  onNext?: () => void;
  onBack?: () => void;
}

interface CurrencyOption {
  id: string;
  symbol: string;
  icon: string;
  name: string;
}

const OnboardingQuantityScreen: React.FC<OnboardingQuantityScreenProps> = ({
  onNext,
  onBack,
}) => {
  const navigation = useNavigation();
  const [cigarettesPerDay, setCigarettesPerDay] = useState<number>(20);
  const [packSize, setPackSize] = useState<number>(20);
  const [pricePerPack, setPricePerPack] = useState<string>('83.0');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>({
    id: 'usd',
    symbol: '$',
    icon: 'currency-dollar',
    name: 'USD'
  });
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState<boolean>(false);

  const packSizeOptions = [10, 20, 25];

  const currencyOptions: CurrencyOption[] = [
    { id: 'usd', symbol: '$', icon: 'currency-dollar', name: 'USD' },
    { id: 'eur', symbol: '€', icon: 'currency-euro', name: 'EUR' },
    { id: 'gbp', symbol: '£', icon: 'currency-pound', name: 'GBP' },
    { id: 'jpy', symbol: '¥', icon: 'currency-yen', name: 'JPY' },
  ];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigation.navigate('OnboardingTheme' as never);
    }
  };

  const handleDecreaseCigarettes = () => {
    if (cigarettesPerDay > 1) {
      setCigarettesPerDay(cigarettesPerDay - 1);
    }
  };

  const handleIncreaseCigarettes = () => {
    setCigarettesPerDay(cigarettesPerDay + 1);
  };

  const handlePackSizeSelect = (size: number) => {
    setPackSize(size);
  };

  const handleCurrencySelect = (currency: CurrencyOption) => {
    setSelectedCurrency(currency);
    setShowCurrencyDropdown(false);
  };

  const calculateDailyCost = () => {
    const price = parseFloat(pricePerPack) || 0;
    const packsPerDay = cigarettesPerDay / packSize;
    return (price * packsPerDay).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#0f4c3a']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <View style={styles.content}>
              {/* Back Button */}
              <Pressable style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </Pressable>

              {/* Main Heading */}
              <Text style={styles.mainHeading}>
                Скільки сигарет ви курили на день?
              </Text>

              {/* Quantity Selector */}
              <View style={styles.quantitySelector}>
                <Pressable style={styles.quantityButton} onPress={handleDecreaseCigarettes}>
                  <Ionicons name="remove" size={24} color="white" />
                </Pressable>
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityText}>{cigarettesPerDay}</Text>
                </View>
                <Pressable style={styles.quantityButton} onPress={handleIncreaseCigarettes}>
                  <Ionicons name="add" size={24} color="white" />
                </Pressable>
              </View>

              {/* Pack Size Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Кількість цигарок в пачці?</Text>
                <View style={styles.packSizeOptions}>
                  {packSizeOptions.map((size, index) => (
                    <Pressable
                      key={index}
                      style={[
                        styles.packSizeButton,
                        packSize === size && styles.packSizeButtonSelected
                      ]}
                      onPress={() => handlePackSizeSelect(size)}
                    >
                      <Text style={styles.packSizeText}>{size}</Text>
                      {packSize === size && (
                        <View style={styles.checkmarkContainer}>
                          <Ionicons name="checkmark" size={16} color="#22d3ee" />
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Price Input */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ціна за пакунок?</Text>
                <View style={styles.priceInputRow}>
                  <TextInput
                    style={styles.priceInput}
                    value={pricePerPack}
                    onChangeText={setPricePerPack}
                    keyboardType="decimal-pad"
                    placeholder="83.0"
                    placeholderTextColor="#999"
                    returnKeyType="done"
                    autoFocus={false}
                  />
                  <View style={styles.currencyDisplay}>
                    <Text style={styles.currencyDisplayText}>{selectedCurrency.symbol}</Text>
                  </View>
                  <View style={styles.currencyPickerContainer}>
                    <Pressable 
                      style={styles.currencyPicker}
                      onPress={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                    >
                      <View style={styles.currencyPickerContent}>
                        <Ionicons name={selectedCurrency.icon as any} size={16} color="white" />
                        <Text style={styles.currencyPickerText}>{selectedCurrency.name}</Text>
                        <Ionicons 
                          name={showCurrencyDropdown ? "chevron-up" : "chevron-down"} 
                          size={16} 
                          color="white" 
                        />
                      </View>
                    </Pressable>
                    
                    {showCurrencyDropdown && (
                      <View style={styles.dropdownContainer}>
                        {currencyOptions.map((currency) => (
                          <Pressable
                            key={currency.id}
                            style={[
                              styles.dropdownOption,
                              selectedCurrency.id === currency.id && styles.dropdownOptionSelected
                            ]}
                            onPress={() => handleCurrencySelect(currency)}
                          >
                            <View style={styles.dropdownOptionContent}>
                              <Ionicons name={currency.icon as any} size={20} color="white" />
                              <Text style={[
                                styles.dropdownOptionText,
                                selectedCurrency.id === currency.id && styles.dropdownOptionTextSelected
                              ]}>
                                {currency.symbol} - {currency.name}
                              </Text>
                            </View>
                            {selectedCurrency.id === currency.id && (
                              <Ionicons name="checkmark" size={16} color="#22d3ee" />
                            )}
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Daily Cost Summary */}
              <View style={styles.section}>
                <View style={styles.costSummary}>
                  <View style={styles.costSummaryLeft}>
                    <Text style={styles.costSummaryTitle}>Ціна / день</Text>
                    <Text style={styles.costSummarySubtitle}>Автоматично розраховано</Text>
                  </View>
                  <View style={styles.costSummaryRight}>
                    <Text style={styles.costSummaryAmount}>{calculateDailyCost()} {selectedCurrency.symbol} </Text>
                  </View>
                </View>
              </View>

              {/* Next Button */}
              <Pressable style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Далі</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 300,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    marginTop: 16,
    marginLeft: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
  },
  mainHeading: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  quantitySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
  },
  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  quantityDisplay: {
    width: 80,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  quantityText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  packSizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  packSizeButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4b5563',
    position: 'relative',
  },
  packSizeButtonSelected: {
    borderColor: '#22d3ee',
    borderWidth: 2,
  },
  packSizeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  priceInput: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'white',
    borderWidth: 2,
    borderColor: '#22d3ee',
  },
  currencyDisplay: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyDisplayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyPickerContainer: {
    position: 'relative',
  },
  currencyPicker: {
    width: 120,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  currencyPickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    width: '100%',
  },
  currencyPickerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 55,
    right: 0,
    backgroundColor: '#374151',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
    minWidth: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4b5563',
  },
  dropdownOptionSelected: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownOptionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownOptionTextSelected: {
    color: '#22d3ee',
    fontWeight: '600',
  },
  costSummary: {
    height: 70,
    backgroundColor: '#374151',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  costSummaryLeft: {
    flex: 1,
  },
  costSummaryTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costSummaryTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  costSummarySubtitle: {
    color: '#9ca3af',
    fontSize: 10,
  },
  costSummaryRight: {
    alignItems: 'flex-end',
  },
  costSummaryAmount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  nextButton: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 120,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingQuantityScreen; 
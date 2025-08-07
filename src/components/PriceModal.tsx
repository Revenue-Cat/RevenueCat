import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PriceModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (price: string) => void;
}

const { width, height } = Dimensions.get('window');

const priceNumbers = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

const PriceModal: React.FC<PriceModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [selectedPrice, setSelectedPrice] = useState<string>('5');
  const scrollViewRef = useRef<ScrollView>(null);

  const handlePriceSelect = (price: string) => {
    setSelectedPrice(price);
    onSelect(price);
  };

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const itemHeight = 64; // Height of each option + margin
    const centerY = contentOffset.y + 140; // Center of the picker view (280/2)
    const selectedIndex = Math.round(centerY / itemHeight);
    
    if (selectedIndex >= 0 && selectedIndex < priceNumbers.length) {
      const newSelectedPrice = priceNumbers[selectedIndex];
      if (newSelectedPrice !== selectedPrice) {
        setSelectedPrice(newSelectedPrice);
        onSelect(newSelectedPrice);
      }
    }
  };

  const getOptionStyle = (price: string, index: number) => {
    const selectedIndex = priceNumbers.indexOf(selectedPrice);
    const distance = Math.abs(index - selectedIndex);
    
    if (distance === 0) {
      return styles.selectedPriceOption;
    } else if (distance === 1) {
      return styles.adjacentPriceOption;
    } else if (distance === 2) {
      return styles.farPriceOption;
    } else {
      return styles.distantPriceOption;
    }
  };

  const getTextStyle = (price: string, index: number) => {
    const selectedIndex = priceNumbers.indexOf(selectedPrice);
    const distance = Math.abs(index - selectedIndex);
    
    if (distance === 0) {
      return styles.selectedPriceText;
    } else if (distance === 1) {
      return styles.adjacentPriceText;
    } else if (distance === 2) {
      return styles.farPriceText;
    } else {
      return styles.distantPriceText;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* First Layer: Main Screen Content */}
        <SafeAreaView style={styles.backgroundLayer}>
        </SafeAreaView>

        {/* Conditional Overlay */}
        <View style={styles.overlay} />

        {/* Second Layer: Modal */}
        <View style={styles.modalLayer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <Text style={styles.modalTitle}>
              How much do you usually pay for a pack of cigarettes?
            </Text>

            {/* Number Picker Container */}
            <View style={styles.pickerContainer}>
              {/* Top Fade Mask */}
              <View style={styles.topMask} />
              
              {/* Number Picker */}
              <View style={styles.pickerView}>
                <ScrollView 
                  ref={scrollViewRef}
                  style={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  snapToInterval={64} // Height of each option + margin
                  decelerationRate="normal" // Changed from "fast" to "normal"
                  onScroll={handleScroll}
                  scrollEventThrottle={8} // Increased from 16 to 8 for smoother events
                  bounces={false} // Disable bouncing for smoother snap
                  overScrollMode="never" // Prevent over-scrolling
                >
                  {priceNumbers.map((price, index) => (
                    <Pressable
                      key={price}
                      style={[
                        styles.priceOption,
                        getOptionStyle(price, index)
                      ]}
                      onPress={() => handlePriceSelect(price)}
                    >
                      <Text style={[
                        styles.priceText,
                        getTextStyle(price, index)
                      ]}>
                        {price}
                      </Text>
                      {selectedPrice === price && (
                        <Text style={styles.currencySymbol}>$</Text>
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
              
              {/* Bottom Fade Mask */}
              <View style={styles.bottomMask} />
            </View>

            {/* Close Button */}
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundLayer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(235, 225, 225, 0.2)',
  },
  modalLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6, // Dynamic height up to 60% of screen
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  scrollContainer: {
    flex: 1,
 
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 140, // Center the selected number (280/2 = 140)
    paddingHorizontal: 20,
  },
  priceOption: {
    width: 80,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    flexDirection: 'row',
    gap: 4,
  },
  selectedPriceOption: {
    backgroundColor: 'black',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  priceText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedPriceText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  currencySymbol: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  priceListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  adjacentPriceOption: {
    paddingHorizontal: 12,
    opacity: 0.8,
  },
  farPriceOption: {
    paddingHorizontal: 12,
    opacity: 0.6,
  },
  distantPriceOption: {
    paddingHorizontal: 12,
    opacity: 0.4,
  },
  adjacentPriceText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  farPriceText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
  },
  distantPriceText: {
    fontSize: 12,
    color: '#ccc',
    fontWeight: '400',
  },
  pickerContainer: {
    height: 280, // Increased from 200 to 280
    position: 'relative',
    marginBottom: 24,
  },
  topMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'white',
    zIndex: 1,
  },
  pickerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'white',
    zIndex: 1,
  },
});

export default PriceModal; 
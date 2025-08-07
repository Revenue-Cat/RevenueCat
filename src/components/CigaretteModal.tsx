import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CigaretteModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
}

const { width, height } = Dimensions.get('window');

interface CigaretteOption {
  id: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const cigaretteOptions: CigaretteOption[] = [
  {
    id: '1-5',
    text: '1-5',
    icon: 'remove-circle-outline',
  },
  {
    id: '6-10',
    text: '6-10',
    icon: 'remove-circle-outline',
  },
  {
    id: '11-15',
    text: '11-15',
    icon: 'remove-circle-outline',
  },
  {
    id: '16-20',
    text: '16-20 (1 pack)',
    icon: 'cube-outline',
  },
  {
    id: '21-30',
    text: '21-30',
    icon: 'remove-circle-outline',
  },
  {
    id: '31-40',
    text: '31-40 (2 packs)',
    icon: 'cube-outline',
  },
];

const CigaretteModal: React.FC<CigaretteModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    onSelect(optionId);
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
              How many cigarettes do you usually smoke per day?
            </Text>

            {/* Options List */}
            <View style={styles.optionsContainer}>
              {cigaretteOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.optionCard,
                    selectedOption === option.id && styles.selectedOptionCard
                  ]}
                  onPress={() => handleOptionSelect(option.id)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedOption === option.id && styles.selectedOptionText
                  ]}>
                    {option.text}
                  </Text>
                  <Ionicons 
                    name={option.icon} 
                    size={24} 
                    color={selectedOption === option.id ? '#48484a' : '#666'} 
                  />
                </Pressable>
              ))}
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
  backgroundContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  backgroundSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },

  backgroundNumber: {
    fontSize: 72,
    fontWeight: 'bold',
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
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 4,
    marginBottom: 24,
  },
  optionCard: {
    width: width * 0.9,
    height: 56,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  selectedOptionCard: {
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#48484a',
  },
  optionText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  closeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
});

export default CigaretteModal; 
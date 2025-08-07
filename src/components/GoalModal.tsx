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

interface GoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (goal: string) => void;
}

const { width, height } = Dimensions.get('window');

interface GoalOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const goalOptions: GoalOption[] = [
  {
    id: 'quit-completely',
    title: 'Quit completely',
    icon: 'close-circle-outline',
  },
  {
    id: 'reduce-gradually',
    title: 'Reduce gradually',
    icon: 'remove-circle-outline',
  },
  {
    id: 'save-money',
    title: 'Save money',
    icon: 'wallet-outline',
  },
  {
    id: 'improve-health',
    title: 'Improve health',
    icon: 'medical-outline',
  },
  {
    id: 'gain-control',
    title: 'Gain control',
    icon: 'settings-outline',
  },
  {
    id: 'doesnt-matter',
    title: "Doesn't matter",
    icon: 'document-outline',
  },
];

const GoalModal: React.FC<GoalModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string>('quit-completely');

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    onSelect(goalId);
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
              What's your goal?
            </Text>

            {/* Goal Options */}
            <View style={styles.optionsContainer}>
              {goalOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.optionCard,
                    selectedGoal === option.id && styles.selectedOptionCard
                  ]}
                  onPress={() => handleGoalSelect(option.id)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedGoal === option.id && styles.selectedOptionText
                  ]}>
                    {option.title}
                  </Text>
                  <Ionicons 
                    name={option.icon} 
                    size={24} 
                    color={selectedGoal === option.id ? 'white' : '#666'} 
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
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 32,
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
    backgroundColor: 'black',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  selectedOptionText: {
    color: 'white',
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
});

export default GoalModal; 
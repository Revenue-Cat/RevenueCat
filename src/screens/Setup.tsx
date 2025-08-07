import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface SetupData {
  smokeType: string;
  dailyAmount: string;
  packPrice: string;
  goal: string;
}

interface SetupProps {
  onNext: () => void;
  onBack: () => void;
}

const Setup: React.FC<SetupProps> = ({ onNext, onBack }) => {
  const [setupData, setSetupData] = useState<SetupData>({
    smokeType: '',
    dailyAmount: '',
    packPrice: '',
    goal: ''
  });
  
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  const allFieldsCompleted = Object.values(setupData).every(value => value !== '');

  const handleFieldClick = (field: string) => {
    setCurrentStep(field);
  };

  const handleSelection = (field: keyof SetupData, value: string) => {
    setSetupData(prev => ({ ...prev, [field]: value }));
    setCurrentStep(null);
  };

  const setupFields = [
    {
      id: "smokeType",
      label: "What do you usually smoke?",
      icon: "remove-circle-outline" as keyof typeof Ionicons.glyphMap,
      value: setupData.smokeType,
      options: [
        { value: "cigarettes", label: "Cigarettes" },
        { value: "tobacco-heater", label: "Tobacco heater" },
        { value: "roll-your-own", label: "Roll-your-own" }
      ]
    },
    {
      id: "dailyAmount",
      label: "How much do you use daily?",
      icon: "reader-outline" as keyof typeof Ionicons.glyphMap,
      value: setupData.dailyAmount,
      options: [
        { value: "1-5", label: "1-5 cigarettes per day" },
        { value: "5-10", label: "5-10 cigarettes per day" },
        { value: "11-15", label: "11-15 cigarettes per day" },
        { value: "16-20", label: "16-20 cigarettes per day (1 pack)" },
        { value: "21-30", label: "21-30 cigarettes per day" },
        { value: "31-40", label: "31-40 cigarettes per day (2 packs)" }
      ]
    },
    {
      id: "packPrice",
      label: "How much do you pay for one unit?",
      icon: "wallet-outline" as keyof typeof Ionicons.glyphMap,
      value: setupData.packPrice,
      options: [
        { value: "3", label: "$3" },
        { value: "4", label: "$4" },
        { value: "5", label: "$5" },
        { value: "6", label: "$6" },
        { value: "7", label: "$7" }
      ]
    },
    {
      id: "goal",
      label: "What's your main goal?",
      icon: "navigate-circle-outline" as keyof typeof Ionicons.glyphMap,
      value: setupData.goal,
      options: [
        { value: "quit-completely", label: "Quit completely" },
        { value: "reduce-gradually", label: "Reduce gradually" },
        { value: "save-money", label: "Save money" },
        { value: "improve-health", label: "Improve health" },
        { value: "gain-control", label: "Gain control" },
        { value: "doesnt-matter", label: "Doesn't matter" }
      ]
    }
  ];

  const currentField = setupFields.find(field => field.id === currentStep);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Set your path to quitting</Text>
          <Text style={styles.subtitle}>
            Answer a few quick questions to personalize your quitting plan. It won't take more than 20 seconds.
          </Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>70%</Text>
          <Text style={styles.statsText}>
            of smokers say they want to quit — you're not alone.
          </Text>
        </View>

        {/* Setup Fields */}
        <View style={styles.fieldsContainer}>
          {setupFields.map((field) => (
            <Pressable
              key={field.id}
              style={[
                styles.field,
                setupData[field.id] ? styles.fieldCompleted : styles.fieldEmpty
              ]}
              onPress={() => handleFieldClick(field.id)}
            >
              <Text style={styles.fieldText}>
                {setupData[field.id] ? (
                  <Text>
                    {field.id === "smokeType" && "I am smoking "}
                    {field.id === "dailyAmount" && "I smoke "}
                    {field.id === "packPrice" && "One pack cost me "}
                    {field.id === "goal" && "I want "}
                    <Text style={styles.fieldValue}>
                      {field.options.find(opt => opt.value === setupData[field.id])?.label || setupData[field.id]}
                    </Text>
                    {field.id === "packPrice" && setupData[field.id] && `$${setupData[field.id]}`}
                  </Text>
                ) : (
                  field.label
                )}
              </Text>
              <Ionicons name={field.icon} size={24} color="#666666" />
            </Pressable>
          ))}
        </View>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.button,
              allFieldsCompleted ? styles.buttonEnabled : styles.buttonDisabled
            ]}
            onPress={onNext}
            disabled={!allFieldsCompleted}
          >
            <Text style={styles.buttonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal for Options */}
      {currentStep && currentField && (
        <Modal visible={true} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{currentField.label}</Text>
                
                <ScrollView style={styles.optionsContainer}>
                  {currentField.options.map((option) => (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.option,
                        setupData[currentStep as keyof SetupData] === option.value ? styles.optionSelected : styles.optionUnselected
                      ]}
                      onPress={() => handleSelection(currentStep as keyof SetupData, option.value)}
                    >
                      <Text style={[
                        styles.optionText,
                        setupData[currentStep as keyof SetupData] === option.value ? styles.optionTextSelected : styles.optionTextUnselected
                      ]}>
                        {option.label}
                      </Text>
                      <Ionicons 
                        name={currentField.icon} 
                        size={24} 
                        color={setupData[currentStep as keyof SetupData] === option.value ? 'white' : '#666666'} 
                      />
                    </Pressable>
                  ))}
                </ScrollView>
                
                <Pressable style={styles.closeButton} onPress={() => setCurrentStep(null)}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  statsNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  fieldsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  field: {
    width: width * 0.9,
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  fieldEmpty: {
    backgroundColor: '#f5f5f5',
  },
  fieldCompleted: {
    backgroundColor: '#e5e5e5',
  },
  fieldText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  fieldValue: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 18,
    width: width * 0.8,
    height: 56,
  },
  buttonEnabled: {
    backgroundColor: '#000000',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.7,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    maxHeight: height * 0.5,
  },
  option: {
    width: width * 0.9,
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 12,
  },
  optionUnselected: {
    backgroundColor: '#f5f5f5',
  },
  optionSelected: {
    backgroundColor: '#000000',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  optionTextUnselected: {
    color: '#000000',
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  closeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default Setup; 
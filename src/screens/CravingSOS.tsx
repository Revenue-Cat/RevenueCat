import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface CravingSOSProps {
  onClose: () => void;
}

const CravingSOS: React.FC<CravingSOSProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Take a Deep Breath",
      description: "Inhale slowly for 4 counts, hold for 4, exhale for 4",
      icon: "leaf-outline",
      action: "I'm breathing",
    },
    {
      title: "Drink Some Water",
      description: "Stay hydrated and give your mouth something to do",
      icon: "water-outline",
      action: "I'm drinking water",
    },
    {
      title: "Take a Walk",
      description: "Get moving and change your environment",
      icon: "walk-outline",
      action: "I'm going for a walk",
    },
    {
      title: "Call a Friend",
      description: "Reach out to someone who supports your journey",
      icon: "call-outline",
      action: "I'm calling someone",
    },
    {
      title: "You're Doing Great!",
      description: "The craving will pass. You're stronger than this urge.",
      icon: "heart-outline",
      action: "I'm staying strong",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Craving SOS</Text>
          <Text style={styles.subtitle}>
            Let's get through this together. Follow these steps:
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + 1) / steps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>

        {/* Current Step */}
        <View style={styles.stepContainer}>
          <View style={styles.stepIcon}>
            <Ionicons name={currentStepData.icon as keyof typeof Ionicons.glyphMap} size={64} color="#000000" />
          </View>
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepDescription}>{currentStepData.description}</Text>
        </View>

        {/* Action Button */}
        <Pressable style={styles.actionButton} onPress={handleNext}>
          <Text style={styles.actionButtonText}>{currentStepData.action}</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </Pressable>

        {/* Skip Option */}
        <Pressable style={styles.skipButton} onPress={onClose}>
          <Text style={styles.skipText}>I need more help</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 64,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
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
  progressContainer: {
    width: '100%',
    marginBottom: 48,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  stepIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 18,
    width: width * 0.8,
    height: 56,
    marginBottom: 16,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
    textDecorationLine: 'underline',
  },
});

export default CravingSOS; 
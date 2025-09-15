import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

interface CravingSOSProps {
  onClose: () => void;
}

const CravingSOS: React.FC<CravingSOSProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();

  const steps = [
    {
      title: t("cravingSOS.steps.breathe.title"),
      description: t("cravingSOS.steps.breathe.description"),
      icon: "leaf-outline",
      action: t("cravingSOS.steps.breathe.action"),
    },
    {
      title: t("cravingSOS.steps.water.title"),
      description: t("cravingSOS.steps.water.description"),
      icon: "water-outline",
      action: t("cravingSOS.steps.water.action"),
    },
    {
      title: t("cravingSOS.steps.walk.title"),
      description: t("cravingSOS.steps.walk.description"),
      icon: "walk-outline",
      action: t("cravingSOS.steps.walk.action"),
    },
    {
      title: t("cravingSOS.steps.friend.title"),
      description: t("cravingSOS.steps.friend.description"),
      icon: "call-outline",
      action: t("cravingSOS.steps.friend.action"),
    },
    {
      title: t("cravingSOS.steps.encourage.title"),
      description: t("cravingSOS.steps.encourage.description"),
      icon: "heart-outline",
      action: t("cravingSOS.steps.encourage.action"),
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
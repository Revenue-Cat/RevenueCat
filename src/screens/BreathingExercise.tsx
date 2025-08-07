import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface BreathingExerciseProps {
  onClose: () => void;
  onBack: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose, onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next phase
            if (currentPhase === 'inhale') {
              setCurrentPhase('hold');
              return 4;
            } else if (currentPhase === 'hold') {
              setCurrentPhase('exhale');
              return 4;
            } else {
              setCurrentPhase('inhale');
              setCycle(prev => prev + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentPhase]);

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(4);
    setCurrentPhase('inhale');
    setCycle(1);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(4);
    setCurrentPhase('inhale');
    setCycle(1);
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      default:
        return 'Inhale';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return '#4CAF50';
      case 'hold':
        return '#FF9800';
      case 'exhale':
        return '#2196F3';
      default:
        return '#4CAF50';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </Pressable>
          <Text style={styles.title}>Breathing Exercise</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Breathing Circle */}
        <View style={styles.breathingContainer}>
          <View 
            style={[
              styles.breathingCircle,
              { 
                backgroundColor: getPhaseColor(),
                transform: [{ scale: isActive ? 1.2 : 1 }]
              }
            ]}
          >
            <Text style={styles.phaseText}>{getPhaseText()}</Text>
            <Text style={styles.timeText}>{timeLeft}</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>4-4-4 Breathing Technique</Text>
          <Text style={styles.instructionsText}>
            Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds
          </Text>
        </View>

        {/* Cycle Counter */}
        <View style={styles.cycleContainer}>
          <Text style={styles.cycleText}>Cycle {cycle}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!isActive ? (
            <Pressable style={styles.startButton} onPress={handleStart}>
              <Ionicons name="play" size={24} color="white" />
              <Text style={styles.startButtonText}>Start Exercise</Text>
            </Pressable>
          ) : (
            <View style={styles.controlButtons}>
              <Pressable style={styles.pauseButton} onPress={handlePause}>
                <Ionicons name="pause" size={24} color="white" />
                <Text style={styles.pauseButtonText}>Pause</Text>
              </Pressable>
              <Pressable style={styles.resetButton} onPress={handleReset}>
                <Ionicons name="refresh" size={24} color="#000000" />
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  placeholder: {
    width: 40,
  },
  breathingContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  cycleContainer: {
    marginBottom: 32,
  },
  cycleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  controlsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  pauseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  pauseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  resetButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666666',
    textDecorationLine: 'underline',
  },
});

export default BreathingExercise; 
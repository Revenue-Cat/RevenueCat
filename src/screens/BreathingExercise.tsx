import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  Animated,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import CTAButton from '../components/CTAButton';

const BreathingBg = require('../assets/breathing/breathing_bg.png');
const Slide1 = require('../assets/breathing/fox/slide1.png');
const Slide2 = require('../assets/breathing/fox/slide2.png');
const Slide3 = require('../assets/breathing/fox/slide3.png');
const BuddyIcon = require('../assets/breathing/fox/fox.png');

interface BreathingExerciseProps {
  onClose: () => void;
  onBack: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose, onBack }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isPhaseTransitioning, setIsPhaseTransitioning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(5);
  const [cycle, setCycle] = useState(1);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  // Animation for slide images movement
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [currentSlide, setCurrentSlide] = useState<'slide1' | 'slide2' | 'slide3'>('slide1');
  
  // Store current animation reference to stop it mid-way
  const currentAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  
  // Animation for BuddyIcon fade out
  const buddyIconOpacity = useRef(new Animated.Value(1)).current;
  
  // Animation for text transitions
  const textOpacity = useRef(new Animated.Value(1)).current;
  const textScale = useRef(new Animated.Value(1)).current;
  
  // Animation for motivational text during countdown
  const motivationalTextOpacity = useRef(new Animated.Value(1)).current;
  
  // Animation for completion state
  const completionOpacity = useRef(new Animated.Value(0)).current;
  const completionScale = useRef(new Animated.Value(0.8)).current;

  // Countdown effect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Animate transition from countdown to breathing exercise
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(textScale, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        // Start the actual breathing exercise
        setCountdown(null);
        setIsActive(true);
        setTimeLeft(5);
        setCurrentPhase('inhale');
        setCycle(1);
        // Fade in new text
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(textScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      });
    }
  }, [countdown]);

  useEffect(() => {
    let interval: number;
    
    if (isActive && timeLeft > 0 && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next phase
            setIsPhaseTransitioning(true);
            if (currentPhase === 'inhale') {
              setCurrentPhase('hold');
              return 5;
            } else if (currentPhase === 'hold') {
              setCurrentPhase('exhale');
              return 5;
            } else {
              setCurrentPhase('inhale');
              setCycle(prev => {
                const newCycle = prev + 1;
                // TODO FIX IT to 5
                if (newCycle > 1) {
                  // Complete the breathing exercise (defer updates to next frame)
                  requestAnimationFrame(() => {
                    setCompletedSessionsCount(prevCount => prevCount + 1);
                    buddyIconOpacity.setValue(1);
                    completionOpacity.setValue(1);
                    setIsCompleted(true);
                    setIsActive(false);
                    setIsPaused(false);
                  });
                }
                return newCycle;
              });
              return 5;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentPhase, isPaused]);

  // Animation effect for slide images during different phases
  useEffect(() => {
    if (isActive && !isPaused && !isResuming) {
      if (currentPhase === 'inhale') {
        setCurrentSlide('slide1');
        // Reset animation to bottom position
        slideAnimation.setValue(0);

        // Animate from bottom to middle over 5 seconds (matching inhale duration)
        currentAnimationRef.current = Animated.timing(slideAnimation, {
          toValue: 0.5,
          duration: 5000, // 5 seconds for inhale phase
          useNativeDriver: true,
        });
        currentAnimationRef.current.start(() => {
          setIsPhaseTransitioning(false);
        });
      } else if (currentPhase === 'hold') {
        setCurrentSlide('slide2');
        // Only set to middle position if we're transitioning naturally
        // This prevents jumping when transitioning from paused inhale/exhale to hold
        if (isPhaseTransitioning) {
          slideAnimation.setValue(0.5);
          setIsPhaseTransitioning(false);
        }
      } else if (currentPhase === 'exhale') {
        setCurrentSlide('slide3');
        // Only set to middle position if we're transitioning naturally
        // This prevents jumping when transitioning from paused inhale to exhale
        if (isPhaseTransitioning) {
          slideAnimation.setValue(0.5);
        }

        // Animate from middle to bottom over 5 seconds (matching exhale duration)
        currentAnimationRef.current = Animated.timing(slideAnimation, {
          toValue: 1,
          duration: 5000, // 5 seconds for exhale phase
          useNativeDriver: true,
        });
        currentAnimationRef.current.start(() => {
          setIsPhaseTransitioning(false);
        });
      }
    }
  }, [isActive, currentPhase, slideAnimation, isPaused, isResuming, isPhaseTransitioning]);

  // Completion animation effect
  useEffect(() => {
    if (isCompleted) {

      // Animate BuddyIcon to full opacity and ensure it ends at 1
      Animated.timing(buddyIconOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        buddyIconOpacity.setValue(1);
      });
      
      // Animate completion content with delay
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(completionOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(completionScale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          })
        ]).start(() => {
          // Ensure BuddyIcon opacity stays at 1 after completion content shows
          buddyIconOpacity.setValue(1);
        });
      }, 300);
    }
  }, [isCompleted, buddyIconOpacity, completionOpacity, completionScale]);

  const handleStart = () => {
    const proceedToCountdown = () => {
      // Fade out BuddyIcon smoothly
      Animated.timing(buddyIconOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Animate text transition to countdown
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(textScale, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        setCountdown(3); // Start countdown from 3
        // Fade in new text
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(textScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      });
    };

    if (isCompleted) {
      // Smoothly hide completion messages before starting
      Animated.parallel([
        Animated.timing(completionOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(completionScale, {
          toValue: 0.9,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start(() => {
        proceedToCountdown();
      });
    } else {
      proceedToCountdown();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    // Stop the current animation mid-way
    if (currentAnimationRef.current) {
      currentAnimationRef.current.stop();
      currentAnimationRef.current = null;
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsResuming(true);
    setIsActive(true);
    
    // Resume animation from current position
    if (currentPhase === 'inhale') {
      // Continue inhale animation from current position to middle
      currentAnimationRef.current = Animated.timing(slideAnimation, {
        toValue: 0.5,
        duration: timeLeft * 1000, // Remaining time in milliseconds
        useNativeDriver: true,
      });
      currentAnimationRef.current.start(() => {
        setIsResuming(false);
      });
    } else if (currentPhase === 'exhale') {
      // Continue exhale animation from current position to bottom
      currentAnimationRef.current = Animated.timing(slideAnimation, {
        toValue: 1,
        duration: timeLeft * 1000, // Remaining time in milliseconds
        useNativeDriver: true,
      });
      currentAnimationRef.current.start(() => {
        setIsResuming(false);
      });
    } else {
      // For 'hold' phase, no animation needed as it's static
      setIsResuming(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsResuming(false);
    setIsPhaseTransitioning(false);
    setTimeLeft(5);
    setCurrentPhase('inhale');
    setCycle(1);
    setCountdown(null);
    
    // Stop any running animation
    if (currentAnimationRef.current) {
      currentAnimationRef.current.stop();
      currentAnimationRef.current = null;
    }
    
    // Reset text animations
    textOpacity.setValue(1);
    textScale.setValue(1);
    motivationalTextOpacity.setValue(1);
    
    // Fade in BuddyIcon smoothly
    Animated.timing(buddyIconOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const handleStartNew = () => {
    setIsCompleted(false);
    setIsActive(false);
    setIsPaused(false);
    setIsResuming(false);
    setIsPhaseTransitioning(false);
    setTimeLeft(5);
    setCurrentPhase('inhale');
    setCycle(1);
    setCountdown(null);
    
    // Stop any running animation
    if (currentAnimationRef.current) {
      currentAnimationRef.current.stop();
      currentAnimationRef.current = null;
    }
    
    // Reset text animations
    textOpacity.setValue(1);
    textScale.setValue(1);
    motivationalTextOpacity.setValue(1);
    
    // Reset completion animations
    completionOpacity.setValue(0);
    completionScale.setValue(0.8);
    
    // Fade in BuddyIcon smoothly
    Animated.timing(buddyIconOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe out';
      default:
        return 'Relax';
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

  const getCurrentSlideSource = () => {
    switch (currentSlide) {
      case 'slide1':
        return Slide1;
      case 'slide2':
        return Slide2;
      case 'slide3':
        return Slide3;
      default:
        return Slide1;
    }
  };

  return (
    <ImageBackground
      source={BreathingBg}
      className="absolute inset-0"
      resizeMode="cover"
    >
      {/* Animated slide images */}
      {(countdown !== null || isActive) && (
        <View className="absolute inset-0 items-center justify-end">
          <Animated.Image
            source={countdown !== null ? Slide1 : getCurrentSlideSource()}
            className="w-120 h-150"
            style={{
              transform: [
                {
                  translateY: countdown !== null
                    ? 400 // Static position during countdown
                    : slideAnimation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [400, 0, 400], // Bottom -> Upper Middle -> Bottom
                      }),
                },
              ],
            }}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Header - positioned at top - only show when not in countdown and not active */}
      <View className="flex-row justify-between items-center w-full mt-12 pt-5">
        {countdown === null && !isActive && (
          <>
            <Pressable
              className="w-10 h-10 rounded-full justify-center items-center"
              onPress={onBack}
            >
               <Ionicons 
                name="arrow-back" 
                size={20} 
                color={isDark ? "#f1f5f9" : "#1e1b4b"}
              />
            </Pressable>
            <Animated.Text 
              className={`text-2xl font-bold text-indigo-950`}
              style={{
                opacity: textOpacity,
                transform: [{ scale: textScale }]
              }}
            >
              Breathing place
            </Animated.Text>
            <View className="w-10" />
            </>
          )}
        </View>
     

      {/* Motivational text during countdown */}
      {countdown !== null && (
        <View className="flex-row justify-between items-center w-full px-5">
          <Animated.Text 
            className={`text-2xl font-bold text-indigo-950 text-center`}
            style={{
              opacity: motivationalTextOpacity,
            }}
          >
            You don't need a cigarette! You need a moment
          </Animated.Text>
        </View>
      )}

        {/* Breathing Circle - show when active (including paused state) */}
        {isActive && (
          <View className="items-center w-full mb-12 pt-4">
            <View
              className="w-100 h-50 rounded-full justify-center items-center shadow-lg"
           
            >
              <Animated.Text 
                className="text-5xl font-bold text-indigo-950 mb-2"
                style={{
                  opacity: textOpacity,
                  transform: [{ scale: textScale }]
                }}
              >
                {getPhaseText()}
              </Animated.Text>
              <View className="mb-8">
                {isActive && (
                  <Text className={`text-lg font-semibold text-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Breathe {cycle}
                  </Text>
                )}
              </View>
              <Text className="text-6xl font-bold text-black">{timeLeft}</Text>
            </View>
          </View>
      )}

        {/* Main Content - centered in available space and BuddyIcon icon */}
      <View className="flex-1 items-center justify-center px-6" >
      {countdown !== null ? (
        // During countdown, show countdown number at top
          <View className="absolute top-[12%] items-center">
            <Text className={`text-8xl text-indigo-950`}>
              {countdown}
            </Text>
          </View>
        ) : null }
            {countdown === null && !isActive && (
              <Animated.View 
                className="absolute top-[45%]"
                style={{ opacity: buddyIconOpacity }}
              >
                <Image source={BuddyIcon} className="w-50 h-70" resizeMode="contain"/>
              </Animated.View>
        )}
        
        {isCompleted && !isActive && countdown === null && !isPaused && <Animated.View 
            className="absolute bottom-20 left-0 right-0 items-center space-y-4"
            style={{
              opacity: completionOpacity,
              transform: [{ scale: completionScale }],
              zIndex: 300
            }}
          >
            {/* Completion Messages */}
            <View className="flex-row items-center gap-4 mx-4">
              {/* First Box - 5 Breaths done */}
              <View className="flex-1 items-center justify-center bg-indigo-50 p-4 rounded-xl">
                <Text className={`text-2xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  {completedSessionsCount * 5}
                </Text>
                <Text className={`text-xs text-slate-500`}>Breaths done</Text>
              </View>
              
              {/* Second Box - 5 Coins earned */}
              <View className="flex-1 items-center justify-center bg-indigo-50 p-4 rounded-xl">
                <Text className={`text-lg font-semibold ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                  {completedSessionsCount * 5}
                </Text>
                <Text className={`text-xs text-slate-500`}>Coins earned</Text>
              </View>
            </View>
                       
          </Animated.View>}
        </View>

      {/* Controls - positioned at bottom */}
      <View className="pb-6">
        
        {!isActive && countdown === null && !isPaused ? (
          <CTAButton
              label={isCompleted ? "Take new 5 breaths" : "Take 5 breaths"}
              onPress={handleStart}
              rightIconName={null}
              containerClassName="absolute bottom-0 left-0 right-0 z-[200]"
            />
        ) : (
          <View className="items-center">
            <View className="w-auto">
              <View className="flex-row gap-2">
                  {/* Reset Button */}
                <Pressable
                  className="flex-row items-center justify-center py-3 px-4 rounded-xl  bg-indigo-50"
                  onPress={handleReset}
                >
                  <Ionicons name="close" size={24} color={'black'} />
                </Pressable>
                {/* Primary Action Button */}
                <Pressable
                  className={`flex-row items-center justify-center py-3 px-4 rounded-2xl ${
                    isPaused ? 'bg-indigo-700' : 'bg-indigo-700'
                  }`}
                  onPress={isPaused ? handleResume : handlePause}
                >
                  <Ionicons 
                    name={isPaused ? "play" : "pause"} 
                    size={24} 
                    color="white" 
                  />
                </Pressable>
                
               
              </View>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default BreathingExercise; 
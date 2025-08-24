import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  showSeconds?: boolean;
  textColor?: string;
  textSize?: 'sm' | 'md' | 'lg' | 'xl';
  countUp?: boolean; // If true, count up from targetDate (elapsed time)
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onComplete,
  showSeconds = false,
  textColor = 'text-indigo-950',
  textSize = 'lg',
  countUp = false
}) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      
      console.log('CountdownTimer Debug:', {
        now: new Date(now).toISOString(),
        target: new Date(target).toISOString(),
        countUp,
        difference: countUp ? now - target : target - now,
        differenceInDays: countUp ? (now - target) / (1000 * 60 * 60 * 24) : (target - now) / (1000 * 60 * 60 * 24)
      });
      
      let difference;
      if (countUp) {
        // Count up: elapsed time since targetDate
        difference = now - target;
        // For countUp, if target is in the future, show 0
        if (difference < 0) {
          console.log('CountdownTimer: Target is in the future for countUp, setting to 0');
          setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }
      } else {
        // Count down: time remaining until targetDate
        difference = target - now;
        // For countDown, if target is in the past, show 0
        if (difference <= 0) {
          console.log('CountdownTimer: Target is in the past for countDown, setting to 0');
          setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          onComplete?.();
          return;
        }
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Ensure we don't show negative values
      const safeTime = {
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds)
      };

      console.log('CountdownTimer: Calculated time:', safeTime);
      setTimeRemaining(safeTime);
      
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const getTextSizeClass = () => {
    switch (textSize) {
      case 'sm': return 'text-lg';
      case 'md': return 'text-2xl';
      case 'lg': return 'text-3xl';
      case 'xl': return 'text-4xl';
      default: return 'text-3xl';
    }
  };

  const getLabelSizeClass = () => {
    switch (textSize) {
      case 'sm': return 'text-xs';
      case 'md': return 'text-xs';
      case 'lg': return 'text-xs';
      case 'xl': return 'text-sm';
      default: return 'text-xs';
    }
  };

  return (
    <View className="flex-row gap-1">
      {/* Days */}
      <View className="items-center">
        <Text className={`${getTextSizeClass()} font-semibold ${textColor} leading-9 text-center`}>
          {timeRemaining.days.toString().padStart(2, '0')}
        </Text>
        <Text className={`${getLabelSizeClass()} font-medium ${textColor}/50 leading-4 text-center`}>
          Days
        </Text>
      </View>
      
      {/* Hours */}
      <View className="items-center">
        <Text className={`${getTextSizeClass()} font-semibold ${textColor} leading-9 text-center`}>
          {timeRemaining.hours.toString().padStart(2, '0')}
        </Text>
        <Text className={`${getLabelSizeClass()} font-medium ${textColor}/50 leading-4 text-center`}>
          Hours
        </Text>
      </View>
      
      {/* Minutes */}
      <View className="items-center">
        <Text className={`${getTextSizeClass()} font-semibold ${textColor} leading-9 text-center`}>
          {timeRemaining.minutes.toString().padStart(2, '0')}
        </Text>
        <Text className={`${getLabelSizeClass()} font-medium ${textColor}/50 leading-4 text-center`}>
          Minutes
        </Text>
      </View>

      {/* Seconds (optional) */}
      {showSeconds && (
        <View className="items-center">
          <Text className={`${getTextSizeClass()} font-semibold ${textColor} leading-9 text-center`}>
            {timeRemaining.seconds.toString().padStart(2, '0')}
          </Text>
          <Text className={`${getLabelSizeClass()} font-medium ${textColor}/50 leading-4 text-center`}>
            Seconds
          </Text>
        </View>
      )}
    </View>
  );
};

export default CountdownTimer;

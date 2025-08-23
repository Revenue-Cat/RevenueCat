import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  showSeconds?: boolean;
  textColor?: string;
  textSize?: 'sm' | 'md' | 'lg' | 'xl';
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onComplete,
  showSeconds = false,
  textColor = 'text-indigo-950',
  textSize = 'lg'
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
      const difference = target - now;

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
      
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

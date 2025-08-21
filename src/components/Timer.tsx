import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const Timer: React.FC = () => {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 32
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newSeconds = prev.seconds + 1;
        if (newSeconds >= 60) {
          const newMinutes = prev.minutes + 1;
          if (newMinutes >= 60) {
            const newHours = prev.hours + 1;
            if (newHours >= 24) {
              return {
                days: prev.days + 1,
                hours: 0,
                minutes: 0,
                seconds: 0
              };
            }
            return { ...prev, hours: newHours, minutes: 0, seconds: 0 };
          }
          return { ...prev, minutes: newMinutes, seconds: 0 };
        }
        return { ...prev, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View className="flex-row gap-6">
      {/* Days */}
      <View className="items-center">
        <Text className="text-4xl font-bold text-white">{timeElapsed.days}</Text>
        <Text className="text-sm text-white opacity-80">Days</Text>
      </View>
      
      {/* Hours */}
      <View className="items-center">
        <Text className="text-4xl font-bold text-white">{timeElapsed.hours}</Text>
        <Text className="text-sm text-white opacity-80">Hours</Text>
      </View>
      
      {/* Minutes */}
      <View className="items-center">
        <Text className="text-4xl font-bold text-white">{timeElapsed.minutes}</Text>
        <Text className="text-sm text-white opacity-80">Minutes</Text>
      </View>
    </View>
  );
};

export default Timer;

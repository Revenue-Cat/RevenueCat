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
    <View className="flex-row gap-1">
      {/* Days */}
      <View className="items-center">
        <Text className="text-3xl font-semibold text-indigo-950  text-center">{timeElapsed.days}</Text>
        <Text className="text-xs font-medium text-indigo-950/50 text-center">Days</Text>
      </View>
      
      {/* Hours */}
      <View className="items-center">
        <Text className="text-3xl font-semibold text-indigo-950  text-center">{timeElapsed.hours}</Text>
        <Text className="text-xs font-medium text-indigo-950/50  text-center">Hours</Text>
      </View>
      
      {/* Minutes */}
      <View className="items-center">
        <Text className="text-3xl font-semibold text-indigo-950  text-center">{timeElapsed.minutes}</Text>
        <Text className="text-xs font-medium text-indigo-950/50  text-center">Minutes</Text>
      </View>
    </View>
  );
};

export default Timer;

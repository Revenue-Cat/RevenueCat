import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useApp } from "../contexts/AppContext";
import { useTheme } from "../contexts/ThemeContext";

const Timer: React.FC = () => {
  const { startDate } = useApp();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  console.log("startDate", startDate);
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateElapsedTime = () => {
      if (!startDate) {
        setTimeElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const now = new Date().getTime();
      const start = new Date(startDate).getTime();
      const difference = now - start;

      if (difference < 0) {
        setTimeElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateElapsedTime();

    // Update every second
    const timer = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <View className="flex-row gap-1">
      {/* Days */}
      <View className="items-center">
        <Text className={`text-3xl font-semibold text-center ${isDark ? 'text-indigo-200' : 'text-indigo-950'}`}>
          {timeElapsed.days.toString().padStart(2, "0")}
        </Text>
        <Text className={`text-s font-medium text-center ${isDark ? 'text-indigo-300/70' : 'text-indigo-950/50'}`}>
          Days
        </Text>
      </View>

      {/* Hours */}
      <View className="items-center">
        <Text className={`text-3xl font-semibold text-center ${isDark ? 'text-indigo-200' : 'text-indigo-950'}`}>
          {timeElapsed.hours.toString().padStart(2, "0")}
        </Text>
        <Text className={`text-s font-medium text-center ${isDark ? 'text-indigo-300/70' : 'text-indigo-950/50'}`}>
          Hours
        </Text>
      </View>

      {/* Minutes */}
      <View className="items-center">
        <Text className={`text-3xl font-semibold text-center ${isDark ? 'text-indigo-200' : 'text-indigo-950'}`}>
          {timeElapsed.minutes.toString().padStart(2, "0")}
        </Text>
        <Text className={`text-s font-medium text-center ${isDark ? 'text-indigo-300/70' : 'text-indigo-950/50'}`}>
          Minutes
        </Text>
      </View>
    </View>
  );
};

export default Timer;

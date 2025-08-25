import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';

const ComingSoon: React.FC = () => {
  const { selectedBackground } = useApp();
  
  // Helper function to parse gradient string and return colors
  const parseGradient = (gradientString: string): [string, string] => {
    // Extract colors from linear-gradient string - handle both formats
    const colorMatch = gradientString.match(/#[A-Fa-f0-9]{6}/g);
    if (colorMatch && colorMatch.length >= 2) {
      return [colorMatch[0], colorMatch[1]]; // Return first two colors
    }
    // Fallback: try to extract any hex colors
    const fallbackMatch = gradientString.match(/#[A-Fa-f0-9]{3,6}/g);
    if (fallbackMatch && fallbackMatch.length >= 2) {
      return [fallbackMatch[0], fallbackMatch[1]];
    }
    return ['#1F1943', '#4E3EA9']; // Default fallback
  };
  
  const gradientColors = parseGradient(selectedBackground.backgroundColor);
  
  return (
    <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: gradientColors[0] }}>
      {/* Background decorative elements */}
      <View className="absolute top-20 left-10 opacity-20">
        <Ionicons name="star" size={40} color="#8B5CF6" />
      </View>
      <View className="absolute top-40 right-8 opacity-15">
        <Ionicons name="star" size={30} color="#6366F1" />
      </View>
      <View className="absolute bottom-40 left-8 opacity-20">
        <Ionicons name="star" size={35} color="#8B5CF6" />
      </View>
      
      {/* Main content */}
      <View className="items-center">
        {/* Icon */}
        <View className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full justify-center items-center mb-8">
          <Ionicons name="construct" size={60} color="white" />
        </View>
        
        {/* Title */}
        <Text className="text-3xl font-bold text-white text-center mb-4">
          Coming Soon
        </Text>
        
        {/* Subtitle */}
        <Text className="text-lg text-white/70 text-center mb-6 leading-6">
          Exclusive achievements are under construction
        </Text>
        
        {/* Description */}
        <Text className="text-base text-white/50 text-center leading-6 max-w-xs">
          We're working hard to bring you amazing exclusive achievements. Stay tuned for updates!
        </Text>
        
      </View>
    </View>
  );
};

export default ComingSoon;

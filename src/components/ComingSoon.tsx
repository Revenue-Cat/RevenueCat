import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ComingSoon: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center bg-[#1F1943] px-6">
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

import React from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface WelcomeProps {
  onNext: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext }) => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6 py-16">
        {/* Header */}
        <View className="items-center mb-16">
          <Text className="text-3xl font-bold text-black mb-3 text-center">
            Welcome to QuitQly!
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6 px-5">
            Your friendly guide to quitting smoking — one small step at a time.
          </Text>
        </View>

        {/* Placeholder for illustration */}
        <View
          className="bg-gray-100 rounded-3xl mb-16 items-center justify-center"
          style={{ width: width * 0.8, height: 400 }}
        >
          <Text className="text-6xl">🚭</Text>
        </View>

        {/* CTA Button */}
        <Pressable
          className="bg-black rounded-2xl px-6 py-4 items-center justify-center flex-row"
          style={{ width: width * 0.8, height: 56 }}
          onPress={onNext}
        >
          <Text className="text-white font-semibold text-xl mr-2">Let's start</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default Welcome; 
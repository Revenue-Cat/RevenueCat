import React from 'react';
import { View, Text } from 'react-native';

const HomeStats: React.FC = () => {
  return (
    <>
      <View className="flex-row gap-1 mb-1">
        <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-white">145</Text>
          <Text className="text-xs font-medium text-white">Cigs avoided</Text>
        </View>
        <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-white">127$</Text>
          <Text className="text-xs font-medium text-white">Money saved</Text>
        </View>
      </View>
      <View className="flex-row gap-1 mb-6">
        <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-white">2h</Text>
          <Text className="text-xs font-medium text-white">Time saved</Text>
        </View>
        <View className="flex-1 bg-white/10 rounded-xl p-4 items-center">
          <Text className="text-2xl font-bold text-white">8/20</Text>
          <Text className="text-xs font-medium text-white">Slips</Text>
        </View>
      </View>
    </>
  );
};

export default HomeStats;

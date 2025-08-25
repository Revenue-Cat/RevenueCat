import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';

interface SceneModalActionsProps {
  scene: any;
  userCoins: number;
  onPurchase: () => void;
  onClose: () => void;
}

const SceneModalActions: React.FC<SceneModalActionsProps> = ({
  scene,
  userCoins,
  onPurchase,
  onClose,
}) => {
  const { ownedBackgrounds, selectedBackground, setSelectedBackground } = useApp();
  const isOwned = ownedBackgrounds?.includes(scene.id) || false;
  const isSelected = selectedBackground.id === scene.id;
  const canAfford = userCoins >= (scene.coin || 0);

  const handleSelect = () => {
    if (isOwned) {
      setSelectedBackground(scene);
      onClose();
    }
  };

  const handlePurchase = () => {
    if (canAfford && !isOwned) {
      onPurchase();
      // Don't close immediately, let the parent handle it
    }
  };

  return (
    <View className="my-6 flex-row justify-center gap-4">
      {/* Close Button */}
       <Pressable 
        className="w-15 h-15 rounded-2xl justify-center items-center bg-indigo-50"
        onPress={onClose}
      >
        <Text className="text-2xl rounded-2xl px-4 py-2 font-bold text-indigo-900 bg-indigo-50">✕</Text>
      </Pressable>
      {/* Select Button - Only show if owned and not selected */}
      {isOwned && !isSelected && (
        <Pressable 
          className="flex-1 rounded-2xl justify-center items-center bg-indigo-600"
          onPress={handleSelect}
        >
          <Text className="text-2xl font-bold text-white px-4 py-2">Select</Text>
        </Pressable>
      )}

      {/* Purchase Button - Only show if not owned */}
      {!isOwned && (
        <Pressable 
          className={`flex-1 rounded-2xl justify-center items-center ${canAfford ? 'bg-indigo-600' : 'bg-gray-400'}`}
          onPress={handlePurchase}
          disabled={!canAfford}
        >
          <Text className={`text-2xl font-bold px-4 py-2 ${canAfford ? 'text-white' : 'text-gray-200'}`}>
            {canAfford ? `Buy for ${scene.coin} coins` : `Purchase`}
          </Text>
        </Pressable>
      )}

  
    </View>
  );
};

export default SceneModalActions;

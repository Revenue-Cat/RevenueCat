import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CoinIcon from "../assets/icons/coins.svg";
import { useApp } from '../contexts/AppContext';

interface SceneModalContentProps {
  scene: any;
  userCoins: number;
}

const SceneModalContent: React.FC<SceneModalContentProps> = ({
  scene,
  userCoins,
}) => {
  const { ownedBackgrounds, selectedBackground } = useApp();
  const isOwned = ownedBackgrounds?.includes(scene.id) || false;
  const isSelected = selectedBackground.id === scene.id;

  // Helper function to render scene preview
  const renderScenePreview = () => {
    return (
      <View className="w-full h-full relative rounded-2xl overflow-hidden">
        <Image 
          source={scene.background}
          className='w-full h-full'
          resizeMode="stretch"
        />
        
        {/* Status Badges */}
        {isSelected && (
          <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-8 h-8 justify-center items-center">
            <Ionicons name="checkmark" size={16} color="white" />
          </View>
        )}
        {isOwned && !isSelected && (
          <View className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-8 h-8 justify-center items-center">
            <Ionicons name="checkmark-circle" size={16} color="white" />
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      {/* Price Banner */}
      <View className="items-center my-2">
        <View className="flex-row items-center px-4 py-2 rounded-3xl border-2 border-amber-500">
          <Text className="text-amber-500 font-bold text-base mr-2 text-xl">
            {isOwned ? (isSelected ? 'Selected' : 'Owned') : `Balance ${scene.coin || 0}`}
          </Text>
          {!isOwned && <CoinIcon width={18} height={18} />}
        </View>
      </View>
      <View className="items-center my-4">
        {/* Scene Title */}
        <Text className="text-2xl font-bold text-indigo-950 text-center">
          {scene.name}
        </Text>

        {/* Scene Description */}
        <Text className="text-sm text-slate-500 text-center mb-4">
          {scene.description || "A beautiful background to enhance your quit smoking journey."}
        </Text>
      </View>
      {/* Card Content */}
      <View className="h-64 my-4 rounded-3xl bg-indigo-50/50 justify-center items-center overflow-hidden">
      
        {/* Scene Preview */}
          {renderScenePreview()}
      </View>
    </>
  );
};

export default SceneModalContent;

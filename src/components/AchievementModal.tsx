import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CoinIcon from "../assets/icons/coins.svg";
import SlideModal from './SlideModal';

const LockIcon = require('../assets/achievements/lock.png');

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  icon?: any;
  unlocked: boolean;
  notificationCount?: number;
  coins?: number;
}

interface AchievementModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
  onShare?: (achievement: Achievement) => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  visible,
  achievement,
  onClose,
  onShare
}) => {
  if (!achievement) return null;

  const handleShare = () => {
    if (onShare) {
      onShare(achievement);
    } else {
      // Default share functionality
      console.log('Share achievement:', achievement.name);
    }
  };
    
    const handleUpdate = () => {
      console.log('Update achievement:', achievement.name);
    }

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={""}
      showCloseButton={false}
      confirmText="Share"
    >
      {/* Achievement Celebration Content */}
      {achievement.unlocked ? (
        <>
          {/* Reward Banner */}
          <View className="items-center my-6">
            <View className="flex-row items-center px-4 py-2 rounded-3xl border-2 border-amber-500">
              <Text 
                className="text-amber-500 font-bold text-base mr-2 text-xl"
              >
                Reward {achievement.coins || 0}
              </Text>
              <CoinIcon width={18} height={18} />
            </View>
          </View>

          {/* Card Content */}
          <View className="gap-4 rounded-3xl p-8 bg-indigo-50/50 justify-center items-center">
            {/* Achievement Title */}
            <Text className="text-2xl font-bold text-indigo-950 text-center pt-7">
              {achievement.name}
            </Text>
            
            {/* Achievement Description */}
            <Text className="text-sm text-slate-500 text-center">
              {achievement.description}
            </Text>

            {/* Achievement Icon */}
            <View className="items-center mb-6 pb-7">
              <View className="w-32 h-32 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full justify-center items-center  border-4 border-green-500 relative">
                {achievement.icon ? (
                  <Image 
                    source={achievement.icon} 
                    className='w-36 h-36'
                    resizeMode="cover" 
                  />
                ) : (
                  <Text className="text-6xl">{achievement.emoji}</Text>
                )}
                {/* Notification Badge */}
                <View className="absolute -top-2 -right-2 bg-green-500 rounded-full w-8 h-8 justify-center items-center border-2 border-white">
                  <Text className="text-sm font-bold text-white">13</Text>
                </View>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Reward Banner */}
          <View className="items-center my-6">
            <View className="flex-row items-center px-4 py-2 rounded-3xl border-2 border-amber-500">
              <Text 
                className="text-amber-500 font-bold text-base mr-2 text-xl"
              >
                Reward {achievement.coins || 0}
              </Text>
              <CoinIcon width={18} height={18} />
            </View>
          </View>

          {/* Card Content */}
        <View className="gap-4 rounded-3xl p-8 bg-indigo-50/50 justify-center items-center">
            {/* Achievement Title */}
            <Text className="text-2xl font-bold text-indigo-950 text-center pt-7">
              {achievement.name}
            </Text>
            
            {/* Achievement Description */}
            <Text className="text-sm text-slate-500 text-center">
              {achievement.description}
            </Text>

            {/* Achievement Icon */}
            <View className="items-center mb-6 pb-4">
              <View className="w-32 h-32 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full justify-center items-center border-4 border-white/90 relative">
                {achievement.icon ? (
                  <Image 
                    source={achievement.icon} 
                    className='w-36 h-36'
                    resizeMode="cover" 
                  />
                ) : (
                  <Text className="text-6xl">{achievement.emoji}</Text>
                )}
                {/* Notification Badge */}
                <View className="absolute -top-2 -right-2 bg-white/20 rounded-full w-8 h-8 justify-center items-center border-2 border-white">
                  <Image source={LockIcon} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
                </View>
              </View>
            </View>
        </View>
        <View className='flex-row justify-center items-center mt-4'>
           <Ionicons name="information-circle" size={16} color="#64748B" />
           <Text className='text-xs text-slate-500 text-center ml-2'>
             Locked. Update your plan to unlock this achivemet.
           </Text>
         </View>
        </>
          )}
          <View className={`my-6 flex-row justify-center gap-4`}>
               <Pressable 
                    className={`w-15 h-15 rounded-2xl justify-center items-center ${
                       'bg-indigo-50'
                    }`} 
                    onPress={onClose}
                  >
                    <Text className={`text-2xl rounded-2xl px-4 py-2 font-bold  'text-indigo-900 bg-indigo-50`}>✕</Text>
                  </Pressable>

                  <Pressable 
                    className={`flex-1 rounded-2xl justify-center items-center bg-indigo-600`}
                    onPress={achievement.unlocked ? handleShare : handleUpdate}
                  >
                    <Text className="text-2xl font-bold text-white px-4 py-2 font-bold">{achievement.unlocked ? "Share" : "Update"}</Text>
                  </Pressable>
                 
              </View>
    </SlideModal>
  );
};

export default AchievementModal;

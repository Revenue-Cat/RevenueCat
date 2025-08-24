import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CoinIcon from "../assets/icons/coins.svg";
import SlideModal from './SlideModal';
import { Achievement } from '../services/achievementService';
import CountdownTimer from './CountdownTimer';
import { useApp } from '../contexts/AppContext';

// Helper function to format time remaining
const formatTimeRemaining = (daysRemaining: number): string => {
  if (daysRemaining <= 0) return 'Ready to unlock!';
  
  if (daysRemaining === 1) return '1 day left';
  if (daysRemaining < 7) return `${daysRemaining} days left`;
  if (daysRemaining < 30) return `${Math.ceil(daysRemaining / 7)} weeks left`;
  if (daysRemaining < 365) return `${Math.ceil(daysRemaining / 30)} months left`;
  return `${Math.ceil(daysRemaining / 365)} years left`;
};

const LockIcon = require('../assets/achievements/lock.png');

// Helper function to identify regular achievements
const isRegularAchievement = (achievementId: string): boolean => {
  const regularAchievementIds = [
    'first-spark',
    'hold-on', 
    'steel-week',
    'bright-moon',
    'fresh-path',
    'freedom',
    'hero',
    'legend'
  ];
  return regularAchievementIds.includes(achievementId);
};

interface AchievementModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
  onShare?: (achievement: Achievement) => void;
  progress?: { current: number; max: number; percentage: number };
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  visible,
  achievement,
  onClose,
  progress
}) => {
  const { startDate } = useApp();
  
  if (!achievement) return null;

  const handleShare = async () => {
    console.log('Share button pressed for achievement:', achievement.name);
    
    // Test share functionality directly
    try {
      const message = `🎉 I just unlocked the "${achievement.name}" achievement! ${achievement.description}${achievement.coins ? `\n💰 Reward: ${achievement.coins} coins` : ''}`;
      
      console.log('Attempting to share message:', message);
      
      const result = await Share.share({
        message: message,
        title: 'Achievement Unlocked!'
      });
      
    } catch (error) {
      console.error('Error sharing achievement:', error);
      alert('Share failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
                <View className="absolute -top-1 -right-1 bg-green-500 rounded-full w-8 h-8 justify-center items-center border-2 border-white">
                  {isRegularAchievement(achievement.id) ? (
                    <Ionicons name="checkmark" size={16} color="white" />
                  ) : (
                    <Text className="text-sm font-bold text-white">{achievement.notificationCount || 1}</Text>
                  )}
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
            <View className="items-center pb-4">
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
                <View className="absolute -top-1 -right-1 bg-white/20 rounded-full w-8 h-8 justify-center items-center border-2 border-white">
                  <Image source={LockIcon} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
                </View>
              </View>
              </View>
              {/* Time Left Section - Only for Regular Achievements */}
              {progress && !achievement.unlocked && isRegularAchievement(achievement.id) && (
                <View>
                  <View className="flex-row items-center justify-center mb-3">
                    <Text className="text-indigo-950 font-semibold text-center ml-2">
                      Time left
                    </Text>
                  </View>
                  
                  {/* Countdown Timer */}
                  <View className="items-center">
                     <CountdownTimer
                        targetDate={(() => {
                          // Calculate target date based on start date + required days
                          if (!startDate) return new Date();
                          
                          const targetDate = new Date(startDate);
                          targetDate.setDate(targetDate.getDate() + progress.max);
                          
                          return targetDate;
                        })()}
                        textColor="text-indigo-950"
                        textSize="md"
                        showSeconds={true}
                      />
                  </View>
                </View>
              )}
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
                    onPress={() => {
                      console.log('Button pressed! Achievement unlocked:', achievement.unlocked);
                      if (achievement.unlocked) {
                        handleShare();
                      } else if (isRegularAchievement(achievement.id)) {
                        // Regular achievements don't have Update button when locked
                        console.log('Regular achievement locked - no action');
                      } else {
                        // Exclusive achievements have Update button when locked
                        handleUpdate();
                      }
                    }}
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.7 : 1,
                        backgroundColor: pressed ? '#4F46E5' : '#4F46E5'
                      }
                    ]}
                  >
                    <Text className="text-2xl font-bold text-white px-4 py-2 font-bold">
                      {achievement.unlocked ? "Share" : (isRegularAchievement(achievement.id) ? "Close" : "Update")}
                    </Text>
                  </Pressable>
                 
              </View>
    </SlideModal>
  );
};

export default AchievementModal;

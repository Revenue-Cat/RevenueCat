import React from 'react';
import { View, Text, Pressable, Image, Share, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { ChallengeData } from '../data/challengesData';
import ProgressRing from './ProgressRing';
import CoinIcon from '../assets/icons/coins.svg';
import CountdownTimer from './CountdownTimer';
import SlideModal from './SlideModal';
import ExclusiveAchievementsModalActions from './ExclusiveAchievementsModalActions';
import LockLight from "../assets/icons/lock.svg";
import TimeIcon1 from "../assets/icons/time.svg";

const AchievementLockedIcon = require('../assets/achievements/achievement-locked.png');
const LockIcon = require('../assets/achievements/lock.png');
const TimeIcon = require('../assets/achievements/time.png');

interface ExclusiveAchievementsModalProps {
  visible: boolean;
  challenge: ChallengeData | null;
  onClose: () => void;
  progress?: any;
  getProgressForAchievement?: (achievementId: string) => { current: number; max: number; percentage: number };
}

const ExclusiveAchievementsModal: React.FC<ExclusiveAchievementsModalProps> = ({
  visible,
  challenge,
  onClose,
  progress,
  getProgressForAchievement
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { startDate, getChallengeStatus } = useApp();

  if (!challenge) return null;

  const status = getChallengeStatus(challenge.id);
  const isCompleted = progress?.percentage === 100;
  const isInProgress = status === 'inprogress';
  const isLocked = status === 'locked';
  const borderColor = isDark ? "#475569" : "#d7d9df";

  // Helper function to render challenge icon and badges
  const renderChallengeIcon = () => {
    return (
      <View className="w-32 h-32 relative">
        {/* Progress Ring */}
         <ProgressRing
            progress={isCompleted ? 100 : challenge.timeBasedProgress+1}
            size={110}
            strokeWidth={4}
            color={
                isCompleted ||  isInProgress  
                ? "#22C55E" 
                : "transparent"
            }
            borderColor={
                isCompleted ? "#22C55E" : "#d7d9df"
            }
            />

        {/* Challenge Icon Background */}
        <View className="absolute inset-0 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full justify-center items-center">
          {challenge.achievementIcon && !isLocked ? (
            <Image
              source={challenge.achievementIcon}
              className="w-36 h-36"
              resizeMode="contain"
            />
          ) : (
            <Image
              source={AchievementLockedIcon}
              className="w-36 h-36"
              resizeMode="contain"
            />
          )}

          {/* Notification Badges */}
          {isCompleted && (
            <View className="absolute top-0 -right-1 bg-green-500 rounded-full w-8 h-8 justify-center items-center">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          )}
          {isInProgress && !isCompleted && (
            <View className="absolute top-0 -right-1 bg-black/50 rounded-full w-7 h-7 justify-center items-center">
              <Image
                source={TimeIcon}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </View>
          )}
          {isLocked && (
            <View className="absolute -top-0 -right-1 bg-black/50 rounded-full w-7 h-7 justify-center items-center">
              <LockLight width={14} height={14} color="white" />
            </View>
          )}
        </View>
      </View>
    );
  };

  const handleShare = async () => {
    try {
      const message = `🎉 I just completed the "${challenge.title}" challenge! ${challenge.shortDescription}\n💰 Reward: 100 coins`;
            
      const result = await Share.share({
        message: message,
        title: 'Challenge Completed!'
      });
      
    } catch (error) {
      console.error('Error sharing challenge:', error);
      alert('Share failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleUpdate = () => {
    console.log('Update challenge:', challenge.title);
  };

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
    >
      <ScrollView className="flex-1">
          {/* Reward Banner */}
          <View className="items-center my-2">
            <View className="flex-row items-center px-2 py-1 rounded-3xl border-2 border-amber-500">
              <Text className="text-amber-500 font-bold text-base mr-2 text-xl">
                {t("shop.reward", { coins: 100 })}
              </Text>
              <CoinIcon width={18} height={18} />
            </View>
          </View>

          {/* Card Content */}
          <View
            className={`gap-4 rounded-3xl py-4 mt-2 justify-center items-center ${
              isDark ? "bg-slate-700/50" : "bg-indigo-50/50"
            }`}
          >
            {/* Challenge Title */}
            <Text
              className={`text-2xl font-bold text-center ${
                isDark ? "text-slate-50" : "text-indigo-950"
              }`}
            >
              {challenge.title}
            </Text>

            {/* Challenge Description */}
            <Text
              className={`text-sm text-center ${
                isDark ? "text-slate-100" : "text-slate-500"
              }`}
            >
              {challenge.shortDescription}
            </Text>

            {/* Challenge Icon */}
            <View className="items-center pb-4">{renderChallengeIcon()}</View>

            {/* Completed Date - Only for completed challenges */}
            {isCompleted && (
              <View className="items-center">
                <Text
                  className={`text-s ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {t("achievements.completedOn")}{" "}
                  {new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Text>
              </View>
            )}
          </View>

          {/* Locked message - Only for locked challenges */}
          {isLocked && (
            <View className="flex-row justify-center items-center mt-4">
              <Ionicons
                name="information-circle"
                size={16}
                color={isDark ? "#485569" : "#64748B"}
              />
              <Text
                className={`text-s text-center ml-2 ${
                  isDark ? "text-slate-100" : "text-slate-500"
                }`}
              >
                {t("achievements.locked")}
              </Text>
            </View>
          )}
        </ScrollView>

        <ExclusiveAchievementsModalActions
          challenge={challenge}
          progress={progress}
          onClose={onClose}
        />
    </SlideModal>
  );
};

export default ExclusiveAchievementsModal;

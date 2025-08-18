import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import NotificationIcon from '../assets/notification/notification.svg';
import NotificationPermissionModal from '../components/NotificationPermissionModal';

const { width } = Dimensions.get('window');

interface NotificationPermissionProps {
  onNext: () => void;
}

const NotificationPermission: React.FC<NotificationPermissionProps> = ({ onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Get current time for timestamp
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const handleButtonPress = () => {
    setShowPermissionModal(true);
  };

  const handlePermissionAllow = () => {
    setShowPermissionModal(false);
    onNext(); // Navigate to home
  };

  const handlePermissionDontAllow = () => {
    setShowPermissionModal(false);
    onNext(); // Navigate to home anyway
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>
      <ScrollView className="flex-1 px-6 pt-16">
          <View className="items-center mb-9">
             <Text className={`text-3xl font-bold mb-3 text-center ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
               {t('notificationPermission.mainTitle')}
             </Text>
             <Text className={`text-md font-medium text-center leading-6 px-5 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
               {t('notificationPermission.mainSubtitle')}
             </Text>
           </View>

          {/* Notification Icon with Preview Card overlay */}
          <View className="relative">
            {/* Notification Icon Background */}
            <View className="rounded-3xl pt-16 relative">
              <LinearGradient
                colors={['#776FF7', '#15123D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 100,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                }}
              />
              <NotificationIcon width="auto" preserveAspectRatio="none"/>
            </View>

            {/* Notification Preview Card - Positioned on top */}
            <View className="absolute top-4 left-0 right-0 px-4">
              <View className="bg-white/90 backdrop-blur-lg rounded-2xl border-2 border-slate-50 p-4 shadow-lg">
                <View className="flex-row items-center gap-3">
                {/* Gradient Icon */}
                <LinearGradient
                colors={['#8890F3', '#F377B5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  height: 52,
                  width: 52,
                  borderRadius: 8
                }}
              />
                  {/* Content */}
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-800">
                      {t('notificationPermission.preview.title')}
                    </Text>
                    <Text className="text-sm font-semibold text-gray-800">
                      {t('notificationPermission.preview.message')}
                    </Text>
                  </View>
                  
                  {/* Timestamp */}
                  <Text className="text-xs text-gray-500 font-semibold">
                    {currentTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>

    </ScrollView>
       {/* Next Button - Fixed at bottom */}
      <View className="px-6 pb-8 items-center">
                 <Pressable
           className={'rounded-2xl px-6 py-4 items-center justify-center flex-row bg-indigo-600'}
           onPress={handleButtonPress}
         >
                     <Text className="font-semibold text-xl mr-2 text-white">
             {t('notificationPermission.actionButton')}
           </Text>
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color="#ffffff" 
          />
        </Pressable>
      </View>

      {/* Notification Permission Modal */}
      <NotificationPermissionModal
        visible={showPermissionModal}
        onAllow={handlePermissionAllow}
        onDontAllow={handlePermissionDontAllow}
      />
    </View>
  );
};

export default NotificationPermission; 
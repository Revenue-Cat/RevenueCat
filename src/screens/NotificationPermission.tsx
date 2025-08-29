import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import NotificationIcon from '../assets/notification/notification.svg';
import oneSignalService from '../services/oneSignalService';

const { width } = Dimensions.get('window');

interface NotificationPermissionProps {
  onNext: () => void;
}

const NotificationPermission: React.FC<NotificationPermissionProps> = ({ onNext }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Get current time for timestamp
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  // Check permission status on component mount
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const permissionStatus = await oneSignalService.getNotificationPermissionStatus();
      setHasPermission(permissionStatus);
    } catch (error) {
      console.error('Error checking permission status:', error);
    }
  };

  const handleRequestPermission = async () => {
    setShowPermissionModal(true);
  };

  const handleAllowPermission = async () => {
    setShowPermissionModal(false);
    setIsRequestingPermission(true);
    
    try {
      const granted = await oneSignalService.requestNotificationPermission();
      setHasPermission(granted);
      
      // Continue to next screen regardless of permission result
      onNext();
    } catch (error) {
      console.error('Error requesting permission:', error);
      // Continue to next screen even if there's an error
      onNext();
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleDenyPermission = () => {
    setShowPermissionModal(false);
    // User denied permission, continue without notifications
    onNext();
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
          className={`rounded-2xl px-6 py-4 items-center justify-center flex-row ${
            hasPermission ? 'bg-green-600' : 'bg-indigo-600'
          } ${isRequestingPermission ? 'opacity-50' : ''}`}
          onPress={hasPermission ? onNext : handleRequestPermission}
          disabled={isRequestingPermission}
        >
          <Text className="font-semibold text-xl mr-2 text-white">
            {t('notificationPermission.actionButton')}
          </Text>
          {!isRequestingPermission && (
            <Ionicons 
              name={hasPermission ? "checkmark" : "arrow-forward"} 
              size={24} 
              color="#ffffff" 
            />
          )}
        </Pressable>
        
        {hasPermission && (
          <Text className={`text-sm mt-3 text-center ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            {t('notificationPermission.permissionGranted', '✅ Notifications enabled!')}
          </Text>
        )}
      </View>

      {/* Custom Permission Modal */}
      <Modal
        visible={showPermissionModal}
        transparent={true}
        animationType="fade"
      >
         <View className="flex-1 justify-center items-center bg-black/50">
            <View className={`px-6 pt-6 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
            {/* Title */}
            <Text className={`text-xl font-bold text-center mb-3 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
              Quitqly Would Like To Send You Notifications
            </Text>
            
            {/* Description */}
            <Text className={`text-base text-center mb-6 leading-5 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
              Notifications may include alerts, sounds, and icon badges.
            </Text>
            
            {/* Buttons */}
            <View className="border-t border-gray-200 -mx-6">
              <View className="flex-row">
                {/* Don't Allow Button */}
                <Pressable
                  className={`flex-1 p-5 border-r border-gray-200`}
                  onPress={handleDenyPermission}
                >
                  <Text className={`text-center font-semibold text-indigo-600`}>
                    Don't Allow
                  </Text>
                </Pressable>
                
                {/* Allow Button */}
                <Pressable
                  className="flex-1 p-5"
                  onPress={handleAllowPermission}
                >
                  <Text className="text-center font-semibold text-indigo-600">
                    Allow
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NotificationPermission; 
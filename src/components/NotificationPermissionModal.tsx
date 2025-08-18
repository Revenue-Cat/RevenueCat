import React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { OneSignal } from 'react-native-onesignal';

const { width } = Dimensions.get('window');

interface NotificationPermissionModalProps {
  visible: boolean;
  onAllow: () => void;
  onDontAllow: () => void;
}

const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  visible,
  onAllow,
  onDontAllow,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const handleAllow = async () => {
    try {
      // Request notification permission through OneSignal
      await OneSignal.Notifications.requestPermission(true);
      onAllow();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      onAllow(); // Still call onAllow to continue the flow
    }
  };

  const handleDontAllow = () => {
    // User declined notifications
    onDontAllow();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View 
          className={`mx-6 rounded-2xl p-6 shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'}`}
          style={{ width: width - 48 }}
        >
          {/* App Icon Placeholder */}
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-2xl bg-indigo-600 items-center justify-center mb-3">
              <Text className="text-white text-2xl font-bold">QB</Text>
            </View>
          </View>

          {/* Title */}
          <Text 
            className={`text-lg font-semibold text-center mb-3 leading-6 ${
              isDark ? 'text-slate-100' : 'text-gray-800'
            }`}
          >
            {t('notificationPermission.permissionDialog.title')}
          </Text>

          {/* Message */}
          <Text 
            className={`text-sm text-center mb-8 leading-5 ${
              isDark ? 'text-slate-300' : 'text-gray-600'
            }`}
          >
            {t('notificationPermission.permissionDialog.message')}
          </Text>

          {/* Buttons */}
          <View className="flex-row gap-3">
            {/* Don't Allow Button */}
            <Pressable
              className="flex-1 py-3 px-4 rounded-lg bg-gray-200 items-center"
              onPress={handleDontAllow}
            >
              <Text className="text-gray-800 font-semibold text-base">
                {t('notificationPermission.permissionDialog.dontAllow')}
              </Text>
            </Pressable>

            {/* Allow Button */}
            <Pressable
              className="flex-1 py-3 px-4 rounded-lg bg-indigo-600 items-center"
              onPress={handleAllow}
            >
              <Text className="text-white font-semibold text-base">
                {t('notificationPermission.permissionDialog.allow')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationPermissionModal;

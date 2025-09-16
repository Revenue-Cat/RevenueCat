import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getBuddyById } from '../data/buddiesData';
import oneSignalScheduler from '../services/oneSignalScheduler';

interface NotificationTestPanelProps {
  onClose: () => void;
}

const NotificationTestPanel: React.FC<NotificationTestPanelProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === 'dark';
  const {
    startDate,
    buddyName,
    gender,
    selectedBuddyId,
    initializeNotifications,
    scheduleUserNotifications,
    sendTestNotification,
    getNotificationStats,
    areNotificationsEnabled,
    updateNotificationSettings,
    // Notification preferences
    notificationsEnabled,
    setNotificationsEnabled,
    morningNotificationTime,
    setMorningNotificationTime,
  } = useApp();

  const [stats, setStats] = useState<{
    totalScheduled: number;
    sent: number;
    pending: number;
    nextNotification?: Date;
    oneSignal?: {
      totalScheduled: number;
      totalSent: number;
      totalPending: number;
    };
  } | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
    checkEnabled();
  }, []);

  const loadStats = async () => {
    try {
      const notificationStats = await getNotificationStats();
      setStats(notificationStats);
    } catch (error) {
      console.error('Error loading notification stats:', error);
    }
  };

  const checkEnabled = async () => {
    try {
      const enabled = await areNotificationsEnabled();
      setIsEnabled(enabled);
    } catch (error) {
      console.error('Error checking notification permissions:', error);
    }
  };

  const handleInitialize = async () => {
    setLoading(true);
    try {
      await initializeNotifications();
      Alert.alert('Success', 'Notifications initialized successfully!');
      await checkEnabled();
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize notifications');
      console.error('Error initializing notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!startDate) {
      Alert.alert('Error', 'No start date set. Complete onboarding first.');
      return;
    }

    setLoading(true);
    try {
      await scheduleUserNotifications();
      Alert.alert('Success', 'Notifications scheduled successfully!');
      await loadStats();
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notifications');
      console.error('Error scheduling notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setLoading(true);
    try {
      await sendTestNotification();
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
      console.error('Error sending test notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    setLoading(true);
    try {
      await updateNotificationSettings({
        morningTime: '09:00',
        eveningTime: '21:00',
      });
      Alert.alert('Success', 'Notification settings updated!');
      await loadStats();
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings');
      console.error('Error updating notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <View className={`flex-1 p-6 ${isDark ? 'bg-dark-background' : 'bg-light-background'}`}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
          Notification Test Panel
        </Text>
        <Pressable
          onPress={onClose}
          className={`px-4 py-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-indigo-100'}`}
        >
          <Text className={`font-semibold ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
            Close
          </Text>
        </Pressable>
      </View>

      {/* User Info */}
      <View className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-slate-800' : 'bg-indigo-50'}`}>
        <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
          Current User Settings
        </Text>
        <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Start Date: {startDate ? formatDate(startDate) : 'Not set'}
        </Text>
        <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Selected Buddy ID: {selectedBuddyId || 'Not set'}
        </Text>
        <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Buddy Name: {buddyName || 'Not set'}
        </Text>
        <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Actual Buddy Name: {(() => {
            const selectedBuddy = getBuddyById(selectedBuddyId);
            return selectedBuddy?.name || 'Not found';
          })()}
        </Text>
        <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Gender: {gender || 'Not set'}
        </Text>
        <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Language: {language} (Notification: {language === 'uk' ? 'ua' : language})
        </Text>
        <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Notifications Enabled: {isEnabled ? '✅' : '❌'}
        </Text>
      </View>

      {/* Stats */}
      {stats && (
        <View className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-slate-800' : 'bg-indigo-50'}`}>
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
            Notification Stats
          </Text>
          <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Total Scheduled: {stats.totalScheduled}
          </Text>
          <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Sent: {stats.sent}
          </Text>
          <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Pending: {stats.pending}
          </Text>
          {stats.nextNotification && (
            <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Next: {formatDate(stats.nextNotification)}
            </Text>
          )}
          {stats.oneSignal && (
            <>
              <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mt-2 font-medium`}>
                OneSignal Scheduler:
              </Text>
              <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'} ml-2`}>
                Scheduled: {stats.oneSignal.totalScheduled}
              </Text>
              <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'} ml-2`}>
                Sent: {stats.oneSignal.totalSent}
              </Text>
              <Text className={`${isDark ? 'text-slate-300' : 'text-slate-600'} ml-2`}>
                Pending: {stats.oneSignal.totalPending}
              </Text>
            </>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View className="space-y-4">
        <Pressable
          onPress={handleInitialize}
          disabled={loading}
          className={`py-4 px-6 rounded-lg ${loading ? 'opacity-50' : ''} ${isDark ? 'bg-slate-700' : 'bg-indigo-200'}`}
        >
          <Text className={`text-center font-semibold ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
            Initialize Notifications
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSchedule}
          disabled={loading || !startDate}
          className={`py-4 px-6 rounded-lg ${loading || !startDate ? 'opacity-50' : ''} ${isDark ? 'bg-slate-700' : 'bg-indigo-200'}`}
        >
          <Text className={`text-center font-semibold ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
            Schedule User Notifications
          </Text>
        </Pressable>

        <Pressable
          onPress={handleTestNotification}
          disabled={loading}
          className={`py-4 px-6 rounded-lg ${loading ? 'opacity-50' : ''} ${isDark ? 'bg-green-700' : 'bg-green-200'}`}
        >
          <Text className={`text-center font-semibold ${isDark ? 'text-slate-100' : 'text-green-950'}`}>
            Send Test Notification
          </Text>
        </Pressable>

        <Pressable
          onPress={handleUpdateSettings}
          disabled={loading}
          className={`py-4 px-6 rounded-lg ${loading ? 'opacity-50' : ''} ${isDark ? 'bg-blue-700' : 'bg-blue-200'}`}
        >
          <Text className={`text-center font-semibold ${isDark ? 'text-slate-100' : 'text-blue-950'}`}>
            Update Settings (9AM/9PM)
          </Text>
        </Pressable>

        <Pressable
          onPress={loadStats}
          disabled={loading}
          className={`py-4 px-6 rounded-lg ${loading ? 'opacity-50' : ''} ${isDark ? 'bg-purple-700' : 'bg-purple-200'}`}
        >
          <Text className={`text-center font-semibold ${isDark ? 'text-slate-100' : 'text-purple-950'}`}>
            Refresh Stats
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            // Toggle notification preferences to trigger saveState
            setNotificationsEnabled(!notificationsEnabled);
            setMorningNotificationTime(morningNotificationTime === '08:00' ? '09:00' : '08:00');
            Alert.alert('Success', `Notification preferences updated!\n\nThis will create/update data in Firebase:\n• users/{userId}/appState (with notification preferences)\n\nCheck Firebase console after a few seconds!`);
          }}
          disabled={loading}
          className={`py-4 px-6 rounded-lg ${loading ? 'opacity-50' : ''} ${isDark ? 'bg-green-600' : 'bg-green-300'}`}
        >
          <Text className={`text-center font-semibold ${isDark ? 'text-slate-100' : 'text-green-900'}`}>
            💾 Save Notification Settings to Firebase
          </Text>
        </Pressable>
      </View>

      {loading && (
        <View className="mt-6">
          <Text className={`text-center ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Loading...
          </Text>
        </View>
      )}
    </View>
  );
};

export default NotificationTestPanel;

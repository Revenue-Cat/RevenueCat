import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  ScrollView,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import NotificationIcon from "../assets/notification/notification.svg";
import oneSignalService from "../services/oneSignalService";
import CTAButton from "../components/CTAButton";

const { width } = Dimensions.get("window");

interface NotificationPermissionProps {
  onNext: () => void;
}

const NotificationPermission: React.FC<NotificationPermissionProps> = ({
  onNext,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // Get current time for timestamp
  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Initialize OneSignal and check permission status on component mount
  useEffect(() => {
    // Initialize OneSignal when user reaches this screen
    oneSignalService.initialize();
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const permissionStatus =
        await oneSignalService.getNotificationPermissionStatus();
      setHasPermission(permissionStatus);
    } catch (error) {
      console.error("Error checking permission status:", error);
    }
  };

  const handleRequestPermission = async () => {
    setIsRequestingPermission(true);

    try {
      const granted = await oneSignalService.requestNotificationPermission();
      setHasPermission(granted);

      // Continue to next screen regardless of permission result
      onNext();
    } catch (error) {
      console.error("Error requesting permission:", error);
      // Continue to next screen even if there's an error
      onNext();
    } finally {
      setIsRequestingPermission(false);
    }
  };

  return (
    <View
      className={`flex-1 ${
        isDark ? "bg-dark-background" : "bg-light-background"
      }`}
  >
      <View className="items-center pt-2">
          <Text
            className={`text-2xl font-bold text-center mb-1 ${
              isDark ? "text-slate-100" : "text-indigo-950"
            }`}
          >
            {t("notificationPermission.mainTitle")}
          </Text>
          <Text
            className={`text-md font-medium text-center px-5 ${
              isDark ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {t("notificationPermission.mainSubtitle")}
          </Text>
        </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
          <View className="w-full">

          {/* Notification Icon with Preview Card overlay */}
           <View className="relative w-full items-center">
              {/* Notification Icon Background */}
             <Image 
               source={require("../assets/icons/rip.png")} 
               style={{ width: '90%', height: 400 }} 
               resizeMode="contain" 
             />

            {/* Notification Preview Card - Positioned on top */}
            <View className="absolute top-12 left-10 right-10">
              <View className="bg-white/80 backdrop-blur-lg rounded-2xl border-2 border-slate-50 p-4 shadow-lg">
                <View className="flex-row items-center gap-3">
              
                  <Image 
                    source={require("../assets/icons/logo.png")} 
                    className="w-16 h-16"
                    resizeMode="contain" 
                  />
                  {/* Content */}
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-800">
                      {t("notificationPermission.preview.title")}
                    </Text>
                    <Text className="text-sm font-semibold text-gray-800">
                      {t("notificationPermission.preview.message")}
                    </Text>
                  </View>

                  {/* Timestamp */}
                  <Text className="text-s text-gray-500 font-semibold">
                    {currentTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Next Button - Fixed at bottom */}
      <View>
        <CTAButton
            label={t("notificationPermission.actionButton")}
            onPress={handleRequestPermission}
            disabled={isRequestingPermission}
            containerClassName="pb-0" 
          />

      </View>
    </View>
  );
};

export default NotificationPermission;

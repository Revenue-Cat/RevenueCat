import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import FlagEn from "../assets/icons/flag-en.svg";
import FlagEs from "../assets/icons/flag-es.svg";
import FlagUk from "../assets/icons/flag-uk.svg";
import LanguageSlide from "../components/LanguageSlide";

interface WelcomeProps {
  onNext: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNext }) => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const languages = [
    { code: "en", name: t("languages.english"), flag: FlagEn },
    { code: "es", name: t("languages.spanish"), flag: FlagEs },
    { code: "uk", name: t("languages.ukrainian"), flag: FlagUk },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <View
      className={`flex-1 ${
        isDark ? "bg-dark-background" : "bg-light-background"
      }`}
    >
      <ScrollView className="flex-1 px-6 pt-16">
        {/* Header */}
        <View className="items-center mb-9">
          <Text
            className={`text-2xl font-bold mb-3 text-center ${
              isDark ? "text-slate-100" : "text-indigo-950"
            }`}
          >
            {t("welcome.title")}
          </Text>
          <Text
            className={`text-center font-medium leading-6 px-5 ${
              isDark ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {t("welcome.subtitle")}
          </Text>

          {/* Language Dropdown */}
          <Pressable
            className={`mt-6 p-2 rounded-full ${
              isDark ? "bg-slate-700" : "bg-indigo-50"
            } flex-row items-center justify-between`}
            onPress={() => setShowLanguageModal(true)}
          >
            <View className="w-6 h-6 mr-2 rounded-full items-center justify-center overflow-hidden">
              {currentLanguage?.flag && (
                <currentLanguage.flag width={24} height={24} />
              )}
            </View>
            <Ionicons name="chevron-down" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* Placeholder for illustration */}
        <View className="items-center justify-center mb-8">
          <Image source={require("../assets/icons/welcome.png")} />
        </View>

        {/* Will you quit text */}
        <Text
          className={`text-3xl font-bold text-center mb-16 ${
            isDark ? "text-slate-300" : "text-slate-800"
          }`}
        >
          {t("welcome.willYouQuit")}
        </Text>
      </ScrollView>

      {/* CTA Button - Fixed at bottom */}
      <View className="px-6 pb-8">
        <Pressable
          className="rounded-2xl px-6 py-4 items-center justify-center flex-row bg-indigo-600"
          onPress={onNext}
        >
          <Text className="font-semibold text-xl mr-2 text-white">
            {t("welcome.ctaButton")}
          </Text>
          <Ionicons name="arrow-forward" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* Language Selection Modal */}
      <LanguageSlide
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </View>
  );
};

export default Welcome;

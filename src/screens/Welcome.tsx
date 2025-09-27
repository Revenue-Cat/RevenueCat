import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import FlagEn from "../assets/icons/flag-en.svg";
import FlagEs from "../assets/icons/flag-es.svg";
import FlagFr from "../assets/icons/flag-fr.svg";
import FlagUk from "../assets/icons/flag-uk.svg";
import LanguageSlide from "../components/LanguageSlide";
import CTAButton from "../components/CTAButton";

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
    { code: "fr", name: t("languages.french"), flag: FlagFr },
    { code: "uk", name: t("languages.ukrainian"), flag: FlagUk },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <View
      className={`flex-1 ${
        isDark ? "bg-dark-background" : "bg-light-background"
      }`}
    >
      <ScrollView className="flex-1 pt-2" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="items-center mb-9">
          <Text
            className={`text-2xl font-bold mb-1 text-center ${
              isDark ? "text-slate-100" : "text-indigo-950"
            }`}
          >
            {t("welcome.title")}
          </Text>
          <Text
            className={`text-center font-md px-14 ${
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
        
        {/* Box for illustration - Vertically centered */}
        <View className="flex-1 justify-center">
          {/* Placeholder for illustration */}
          <View className="items-center justify-center h-60">
            <Image source={require("../assets/icons/welcome.png")} resizeMode="center" width={200} height={200} />
          </View>

          {/* Will you quit text */}
          <Text
            className={`text-3xl font-bold text-center mb-16 mt-10 ${
              isDark ? "text-slate-300" : "text-slate-800"
            }`}
          >
            {t("welcome.willYouQuit")}
          </Text>
        </View>
      </ScrollView>

      {/* CTA Button - Fixed at bottom */}
      <CTAButton label={t("welcome.ctaButton")} onPress={onNext} containerClassName="pb-0" />

      {/* Language Selection Modal */}
      <LanguageSlide
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </View>
  );
};

export default Welcome;

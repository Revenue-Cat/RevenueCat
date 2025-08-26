// src/components/LanguageSlide.tsx
import React, { useMemo } from "react";
import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import SlideModal from "./SlideModal";

// flags
import FlagEn from "../assets/icons/flag-en.svg";
import FlagEs from "../assets/icons/flag-es.svg";
import FlagUk from "../assets/icons/flag-uk.svg";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const LanguageSlide: React.FC<Props> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const systemIconColor = isDark ? "#CBD5E1" : "#1e1b4b";

  const languages = useMemo(
    () =>
      [
        { code: "en", name: t("languages.english"), flag: FlagEn },
        { code: "es", name: t("languages.spanish"), flag: FlagEs },
        { code: "uk", name: t("languages.ukrainian"), flag: FlagUk },
      ] as const,
    [t]
  );

  const handleSelect = (code: string) => {
    setLanguage(code as "en" | "es" | "uk");
    onClose();
  };

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={t("welcome.selectLanguage")}
    >
      <View className="gap-3">
        {languages.map(({ code, name, flag: Flag }) => {
          const selected = code === language;
          return (
            <Pressable
              key={code}
              onPress={() => handleSelect(code)}
              className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between ${
                selected
                  ? isDark
                    ? "bg-slate-600"
                    : "bg-indigo-100"
                  : isDark
                  ? "bg-slate-700"
                  : "bg-indigo-50"
              }`}
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full items-center justify-center overflow-hidden mr-3">
                  <Flag width={32} height={21} />
                </View>
                <Text
                  className={`${isDark ? "text-slate-100" : "text-indigo-950"}`}
                  style={{ fontWeight: "600" }}
                >
                  {name}
                </Text>
              </View>

              {selected && (
                <Ionicons name="checkmark" size={18} color={systemIconColor} />
              )}
            </Pressable>
          );
        })}
      </View>
    </SlideModal>
  );
};

export default LanguageSlide;

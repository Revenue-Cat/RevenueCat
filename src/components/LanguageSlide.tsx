// src/components/LanguageSlide.tsx
import React, { useMemo } from "react";
import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import SlideModal from "./SlideModal";
import SetupField from "./SetupField";

// flags
import FlagEn from "../assets/icons/flag-en.svg";
import FlagEs from "../assets/icons/flag-es.svg";
import FlagUk from "../assets/icons/flag-uk.svg";
import FlagFr from "../assets/icons/flag-fr.svg";

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
        { code: "fr", name: t("languages.french"), flag: FlagFr },
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
            <SetupField
              key={code}
              id={code}
              label={name}
              icon={
                <View className="w-8 h-8 rounded-full items-center justify-center overflow-hidden mr-3">
                  <Flag width={32} height={21} />
                </View>
              }
              value={name}
              showCheckmark={selected}
              onPress={() => handleSelect(code)}
            />
          );
        })}
      </View>
    </SlideModal>
  );
};

export default LanguageSlide;

import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import SlideModal from "./SlideModal";

// icons (colored brands) + right chevrons
import TelegramIcon from "../assets/icons/telegram.svg";
import EmailIcon from "../assets/icons/email.svg";
import ArrowRightLight from "../assets/icons/arrow-right.svg";
import ArrowRightDark from "../assets/icons/arrow-right-d.svg";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SupportSlide: React.FC<Props> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t } = useTranslation();

  const Right = isDark ? ArrowRightDark : ArrowRightLight;
  const systemIconColor = isDark ? "#CBD5E1" : "#1e1b4b";

  const rows = [
    {
      key: "tg",
      Icon: TelegramIcon,
      label: t("support.telegram", "Message us on Telegram"),
      onPress: () => Alert.alert("Telegram", "Mock: open Telegram chat"),
    },
    {
      key: "email",
      Icon: EmailIcon,
      label: t("support.email", "Write to us by email"),
      onPress: () => Alert.alert("Email", "Mock: open email composer"),
    },
  ] as const;

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={t("support.title", "Need support?")}
    >
      <Text
        className={`text-center mb-5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        style={{ fontSize: 16, lineHeight: 22, fontWeight: "600" }}
      >
        {t(
          "support.subtitle",
          "Our team is here to help you — choose your preferred way to contact us."
        )}
      </Text>

      <View className="gap-4">
        {rows.map(({ key, Icon, label, onPress }) => (
          <Pressable
            key={key}
            onPress={onPress}
            className={`w-full h-16 rounded-3xl px-4 flex-row items-center justify-between ${
              isDark ? "bg-slate-700" : "bg-indigo-50"
            }`}
          >
            <View className="flex-row items-center">
              <Icon width={28} height={28} />
              <Text
                className={`ml-3 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
              >
                {label}
              </Text>
            </View>
            <Right width={18} height={12} color={systemIconColor} />
          </Pressable>
        ))}
      </View>
    </SlideModal>
  );
};

export default SupportSlide;

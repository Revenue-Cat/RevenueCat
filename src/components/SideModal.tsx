import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SlideModal from "./SlideModal";

import SunLight from "../assets/icons/sun.svg";
import SunDark from "../assets/icons/sun-d.svg";
import MoonLight from "../assets/icons/moon.svg";
import MoonDark from "../assets/icons/moon-d.svg";
import { t } from "i18next";

type Side = "bright" | "dark";

type Props = {
  visible: boolean;
  isDark: boolean;
  side: Side;
  onSelect: (s: Side) => void;
  onClose: () => void;
};

const SideModal: React.FC<Props> = ({
  visible,
  isDark,
  side,
  onSelect,
  onClose,
}) => {
  const systemIconColor = isDark ? "#CBD5E1" : "#1e1b4b";
  const Icons = {
    Sun: isDark ? SunDark : SunLight,
    Moon: isDark ? MoonDark : MoonLight,
  };

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={t("sideModal.title", "Bright or dark side?")}
    >
      {(
        [
          {
            key: "bright",
            label: t("sideModal.options.bright", "Bright side"),
            Icon: Icons.Sun,
          },
          {
            key: "dark",
            label: t("sideModal.options.dark", "Dark side"),
            Icon: Icons.Moon,
          },
        ] as const
      ).map(({ key, label, Icon }) => {
        const selected = side === key;
        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            className={`w-full h-14 rounded-2xl px-4 flex-row items-center justify-between mb-3 ${
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
              <Icon width={20} height={20} color={systemIconColor} />
              <Text
                className={`ml-3 ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
                style={{ fontWeight: "600" }}
              >
                {label}
              </Text>
            </View>
            {selected && (
              <Ionicons name="checkmark" size={18} color={systemIconColor} />
            )}
          </Pressable>
        );
      })}

      <Text
        className={`text-center text-s mt-1 ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {t(
          "sideModal.hint",
          "This selection will set your app’s theme to light or dark."
        )}
      </Text>
    </SlideModal>
  );
};

export default SideModal;

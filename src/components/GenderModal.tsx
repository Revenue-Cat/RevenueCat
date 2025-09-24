import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import SlideModal from "./SlideModal";

import GenderLight from "../assets/icons/gander.svg";
import GenderDark from "../assets/icons/gander-d.svg";
import ManLight from "../assets/icons/man.svg";
import ManDark from "../assets/icons/man-d.svg";
import WomanLight from "../assets/icons/woman.svg";
import WomanDark from "../assets/icons/woman-d.svg";
import IncognitoLight from "../assets/icons/incognito.svg";
import IncognitoDark from "../assets/icons/incognito-d.svg";

type Gender = "man" | "lady" | "any";

type Props = {
  visible: boolean;
  isDark: boolean;
  gender: Gender;
  onSelect: (g: Gender) => void;
  onClose: () => void;
};

const GenderModal: React.FC<Props> = ({
  visible,
  isDark,
  gender,
  onSelect,
  onClose,
}) => {
  const systemIconColor = isDark ? "#CBD5E1" : "#1e1b4b";
  const Icons = {
    Gender: isDark ? GenderDark : GenderLight,
    Man: isDark ? ManDark : ManLight,
    Woman: isDark ? WomanDark : WomanLight,
    Incognito: isDark ? IncognitoDark : IncognitoLight,
  };
  const { t } = useTranslation();

  const getGenderLabel = (g:string) => {
    return g === "man"
            ? t("profile.gender.man", "Man")
            : g === "lady"
            ? t("profile.gender.woman", "Woman")
            : t("profile.gender.nonBinary", "Isn't important")
  }

  return (
    <SlideModal visible={visible} onClose={onClose} title="Gender">
      {(
        [
          { key: "man", label: getGenderLabel("man"), Icon: Icons.Man },
          { key: "lady", label: getGenderLabel("lady"), Icon: Icons.Woman },
          { key: "any", label: getGenderLabel("any"), Icon: Icons.Incognito },
        ] as const
      ).map(({ key, label, Icon }) => {
        const selected = gender === key;
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
                className={`ml-3 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
                style={{ fontWeight: "600" }}
              >
                {label}
              </Text>
            </View>
            {selected && (
              <Ionicons
                name="checkmark"
                size={18}
                color={systemIconColor}
              />
            )}
          </Pressable>
        );
      })}

    </SlideModal>
  );
};

export default GenderModal;

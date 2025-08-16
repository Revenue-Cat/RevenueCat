import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className={`${isDark ? "bg-dark-background" : "bg-light-background"} rounded-t-3xl`}
        >
          <View className="px-5 pt-6 pb-8">
            <Text
              className={`text-lg font-bold text-center mb-4 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
            >
              Gender
            </Text>

            {(
              [
                { key: "man", label: "Man", Icon: Icons.Man },
                { key: "lady", label: "Woman", Icon: Icons.Woman },
                { key: "any", label: "Isn't important", Icon: Icons.Incognito },
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

            <Pressable
              onPress={onClose}
              className={`${isDark ? "bg-dark-surface" : "bg-gray-100"} w-12 h-12 rounded-full items-center justify-center self-center mt-2`}
            >
              <Ionicons name="close" size={20} color={systemIconColor} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GenderModal;

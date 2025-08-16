import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SunLight from "../assets/icons/sun.svg";
import SunDark from "../assets/icons/sun-d.svg";
import MoonLight from "../assets/icons/moon.svg";
import MoonDark from "../assets/icons/moon-d.svg";

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
              Bright or dark side?
            </Text>

            {(
              [
                { key: "bright", label: "Bright side", Icon: Icons.Sun },
                { key: "dark", label: "Dark side", Icon: Icons.Moon },
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

            <Text
              className={`text-center mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              style={{ fontSize: 12 }}
            >
              This selection will set your app’s theme to light or dark.
            </Text>

            <Pressable
              onPress={onClose}
              className={`${isDark ? "bg-dark-surface" : "bg-gray-100"} w-12 h-12 rounded-full items-center justify-center self-center mt-3`}
            >
              <Ionicons name="close" size={20} color={systemIconColor} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SideModal;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  isDark: boolean;
  initialName: string;
  onClose: () => void;
  onConfirm: (name: string) => void;
};

const BuddyNameModal: React.FC<Props> = ({
  visible,
  isDark,
  initialName,
  onClose,
  onConfirm,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, visible]);

  const systemIconColor = isDark ? "#CBD5E1" : "#1e1b4b";

  const handleConfirm = () => {
    const finalName = (name || "").trim();
    onConfirm(finalName);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            className={`${isDark ? "bg-dark-background" : "bg-light-background"} rounded-t-3xl`}
          >
            <View className="px-5 pt-6 pb-8">
              <Text
                className={`text-lg font-bold text-center mb-4 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
              >
                Buddy name
              </Text>

              <View
                className={`rounded-2xl px-3 py-2 ${
                  isDark
                    ? "bg-slate-700 border border-slate-600"
                    : "bg-indigo-50 border border-indigo-200"
                }`}
              >
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Type a name"
                  placeholderTextColor="#94A3B8"
                  className={`h-12 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
                  style={{ fontSize: 16 }}
                  returnKeyType="done"
                  onSubmitEditing={handleConfirm}
                />
              </View>

              <View className="flex-row justify-center gap-4 mt-4">
                <Pressable
                  onPress={onClose}
                  className={`${isDark ? "bg-dark-surface" : "bg-gray-100"} w-12 h-12 rounded-full items-center justify-center`}
                >
                  <Ionicons name="close" size={20} color={systemIconColor} />
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  className="bg-indigo-600 w-12 h-12 rounded-full items-center justify-center"
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default BuddyNameModal;

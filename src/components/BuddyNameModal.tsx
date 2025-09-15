import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SlideModal from "./SlideModal";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setName(initialName);
  }, [initialName, visible]);

  const systemIconColor = isDark ? "#CBD5E1" : "#1e1b4b";

  const handleConfirm = () => {
    const finalName = (name || "").trim();
    onConfirm(finalName);
  };

  const keyboardOffset = (insets.top || 0) + 56;

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={t("buddy.nameModal.title")}
      onConfirm={handleConfirm}
      confirmText="✓"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? keyboardOffset : 0}
      >
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
            placeholder={t("buddy.nameModal.placeholder")}
            placeholderTextColor="#94A3B8"
            className={`h-12 ${isDark ? "text-slate-100" : "text-indigo-950"}`}
            style={{ fontSize: 16 }}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
            autoFocus
          />
        </View>

        {/* Footer handled by SlideModal via onConfirm/showCloseButton */}
      </KeyboardAvoidingView>
    </SlideModal>
  );
};

export default BuddyNameModal;

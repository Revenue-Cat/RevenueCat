import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface SlideModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  onConfirm?: () => void | null;
  confirmText?: string;
}

const SlideModal: React.FC<SlideModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  onConfirm,
  confirmText = "✓",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const hasConfirm = typeof onConfirm === "function";
  const { height: screenHeight } = Dimensions.get("screen"); // Changed to "screen" for Android compatibility
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const easeOut = Easing.bezier(0, 0, 0.2, 1);
  const easeIn = Easing.bezier(0.4, 0, 1, 1);

  useEffect(() => {
    if (visible && !modalVisible) {
      setModalVisible(true);
    }
  }, [visible, modalVisible]);

  useEffect(() => {
    if (modalVisible && visible) {
      // Reset values and animate in (slide up + fade in)
      slideAnim.setValue(screenHeight);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          easing: easeOut,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          easing: easeOut,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (modalVisible && !visible) {
      // Animate out (slide down + fade out), then hide
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          easing: easeIn,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          easing: easeIn,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
      });
    }
  }, [modalVisible, visible, slideAnim, fadeAnim, screenHeight]);

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Dark Overlay - Smooth fade in/out */}
      <Animated.View
        className="flex-1 bg-black"
        style={{
          opacity: Animated.multiply(fadeAnim, 0.5),
        }}
      />

      {/* Modal Content - Slides from bottom with smooth animation */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0"
        style={{
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View
          className={`${
            isDark ? "bg-dark-background" : "bg-light-background"
          } rounded-t-3xl`}
        >
          <View className="px-5 pt-6 pb-10">
            {title && (
              <Text
                className={`text-xl font-bold text-center px-8 mt-6 mb-6 ${
                  isDark ? "text-slate-100" : "text-indigo-950"
                }`}
              >
                {title}
              </Text>
            )}

            {children}

            {/* Footer actions: confirm and/or close buttons */}
            {(hasConfirm || showCloseButton) && (
              <View
                className={`mt-6 ${
                  hasConfirm && showCloseButton
                    ? "flex-row justify-center gap-4"
                    : ""
                }`}
              >
                {hasConfirm && (
                  <Pressable
                    className={`w-15 h-15 rounded-2xl justify-center items-center ${
                      hasConfirm && showCloseButton ? "" : "self-center"
                    } bg-indigo-600`}
                    onPress={onConfirm}
                    accessibilityRole="button"
                    accessibilityLabel="Confirm"
                  >
                    <Text className="text-2xl font-bold text-white px-4 py-2">
                      {confirmText}
                    </Text>
                  </Pressable>
                )}
                {showCloseButton && (
                  <Pressable
                    className={`w-15 h-15 rounded-2xl justify-center items-center ${
                      hasConfirm && showCloseButton ? "" : "self-center"
                    } ${isDark ? "bg-slate-700" : "bg-indigo-50"}`}
                    onPress={onClose}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                  >
                    <Text
                      className={`text-2xl rounded-2xl px-4 py-2 font-bold ${
                        isDark
                          ? "text-slate-100 bg-slate-700"
                          : "text-indigo-900 bg-indigo-50"
                      }`}
                    >
                      ✕
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default SlideModal;
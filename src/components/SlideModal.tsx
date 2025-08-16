import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Animated,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SlideModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

const SlideModal: React.FC<SlideModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      // Show modal and slide up from bottom
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down to bottom first, then hide modal
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Hide modal after animation completes
        setModalVisible(false);
      });
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Dark Overlay - Fades in */}
      <View className="flex-1 bg-black/50" />
      
      {/* Modal Content - Slides from bottom with smooth animation */}
      <Animated.View 
        className="absolute bottom-0 left-0 right-0"
        style={{
          transform: [{ translateY: slideAnim }]
        }}
      >
        <View className={`${isDark ? 'bg-dark-background' : 'bg-light-background'} rounded-t-3xl`}>
          <View className="px-5 pt-6 pb-10">
            <Text className={`text-xl font-bold text-center px-8 mt-6 mb-6 ${isDark ? 'text-slate-100' : 'text-indigo-950'}`}>
              {title}
            </Text>
            
            {children}
            
            {showCloseButton && (
              <Pressable 
                className={`w-15 h-15 rounded-full justify-center items-center self-center mt-6 ${
                  isDark ? 'bg-slate-700' : 'bg-indigo-50'
                }`} 
                onPress={onClose}
              >
                <Text className={`text-2xl rounded-2xl px-4 py-2 font-bold ${isDark ? 'text-slate-50 bg-slate-700' : 'text-indigo-900 bg-indigo-50'}`}>✕</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default SlideModal;

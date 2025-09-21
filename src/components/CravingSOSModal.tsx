import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  Text,
  View,
  Modal,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import SlideModal from "./SlideModal";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { useApp } from "../contexts/AppContext";
import { CHALLENGES_DATA } from "../data/challengesData";
import HeartIcon from "../assets/strategies/heart.svg";
import LockLight from "../assets/icons/lock.svg";
import SmokeIcon from "../assets/icons/smoke.svg";
interface CravingSOSModalProps {
  visible: boolean;
  onClose: () => void;
  onStartBreathing: () => void;
  onOpenSlipsLog: () => void;
}

const CravingSOSModal: React.FC<CravingSOSModalProps> = ({
  visible,
  onClose,
  onStartBreathing,
  onOpenSlipsLog,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { setStartDate, getChallengeStatus } = useApp();
  const isDark = theme === "dark";
  const { width } = Dimensions.get("window");
  const ITEM_WIDTH = width * 0.7; // center card width (~70%)
  const SIDE_GUTTER = width * 0.1; // side visibility (~10% each side)

  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDontGiveUpModal, setShowDontGiveUpModal] = useState(false);
  const flatListRef = useRef<Animated.FlatList>(null);

  // Use original data instead of tripling it for better performance
  const data = useMemo(() => CHALLENGES_DATA.filter(item => item.titleKey), []);

  const handleISmoked = () => {
    setShowDontGiveUpModal(true);
  };

  const handleDontGiveUpOk = async () => {
    setShowDontGiveUpModal(false);
    onClose(); // Close the CravingSOS modal

    // Reset start date to current date and time
    const newStartDate = new Date();
    await setStartDate(newStartDate);

    console.log("Start date reset to:", newStartDate.toISOString());
  };

  // Reset to first card when modal becomes visible
  useEffect(() => {
    if (visible) {
      setActiveIndex(0);
      scrollX.setValue(0);
      // Add a small delay to ensure the modal is fully rendered
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 5);
    }
  }, [visible, scrollX]);

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={""}
      showCloseButton={false}
    >
      <Text
        className={`text-xl font-bold text-center px-8 mt-3 mb-2`}
      >
        {t("cravingSOS.modal.title")}
      </Text>

      <Text
        className={`${
          isDark ? "text-slate-300" : "text-slate-500"
        } text-center`}
      >
        {t("cravingSOS.modal.subtitle")}
      </Text>

      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        pagingEnabled={false}
        initialNumToRender={3}
        maxToRenderPerBatch={2}
        windowSize={5}
        removeClippedSubviews
        contentContainerStyle={{
          paddingHorizontal: SIDE_GUTTER,
          paddingVertical: 16,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={32}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
          setActiveIndex(index);
        }}
        renderItem={useCallback(
          ({ item, index }: { item: any; index: number }) => {
            const inputRange = [
              (index - 1) * ITEM_WIDTH,
              index * ITEM_WIDTH,
              (index + 1) * ITEM_WIDTH,
            ];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.9, 1, 0.9],
              extrapolate: "clamp",
            });
            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [9, 0, 9],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                style={{
                  width: ITEM_WIDTH,
                  transform: [{ scale }, { translateY }],
                }}
              >
                <View
                  className={`${
                    isDark ? "bg-slate-700" : "bg-indigo-50"
                    } rounded-2xl px-6 py-4 justify-between`}

                >
                  {/* iconPreview Icon */}
                  <View className="items-center mb-1 p-2 justify-center">
                    <View className="bg-indigo-100 p-2 rounded-full">
                      <item.iconPreview
                        width={24}
                        height={24}
                        color={isDark ? "#CBD5E1" : "#1e1b4b"}
                      />
                    </View>
                  </View>

                  {/* Title */}
                  <Text
                    className={`${
                      isDark ? "text-slate-100" : "text-indigo-950"
                    } mb-1 text-base text-center font-bold`}
                  >
                    {t(item.titleKey)}
                  </Text>

                  {/* Description */}
                  <Text
                    className={`${
                      isDark ? "text-slate-300" : "text-slate-700"
                      } text-sm mb-4`}
                    style={{ minHeight: 90, height: 90 }}
                   
                  >
                    {t(item.descriptionKey)}
                  </Text>

                  {/* Challenge Box */}
                  <View
                    className={`bg-indigo-100 rounded-xl p-1 flex-row justify-between items-center relative`}
                  >
                    {/* Lock Icon - Top Right Corner */}
                    {getChallengeStatus(item.id) === 'locked' && <View className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-1">
                      <LockLight width={12} height={12} color="white" />
                    </View>}

                    <View className="flex-1 p-3">
                      <Text
                        className={`${
                          isDark ? "text-slate-100" : "text-indigo-950"
                        }`}
                        style={{
                          fontWeight: "700",
                          fontSize: 14,
                          lineHeight: 18,
                        }}
                      >
                        {t(item.challengeKey)}
                      </Text>
                      <Text
                        className={`${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                        style={{
                          fontWeight: "500",
                          fontSize: 12,
                          lineHeight: 16,
                        }}
                      >
                        {t(item.duration)} {t("challenges.challenge")}
                      </Text>
                    </View>
                    <View className="ml-3 mr-1">
                      {item.iconStrategy ? (
                        <item.iconStrategy
                          width={52}
                          height={52}
                          color={isDark ? "#CBD5E1" : "#1e1b4b"}
                        />
                      ) : (
                        <HeartIcon
                          width={52}
                          height={52}
                          color={isDark ? "#CBD5E1" : "#1e1b4b"}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </Animated.View>
            );
          },
          [ITEM_WIDTH, isDark, scrollX, t]
        )}
      />

      {/* Indicators */}
      <View className="flex-row justify-center">
        <View className="flex-row bg-indigo-50 h-4 rounded-full px-2 py-1 gap-1">
          {data.map((_, i) => {
            const position = Animated.divide(scrollX, ITEM_WIDTH);
            const scale = position.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [1, 1.2, 1],
              extrapolate: "clamp",
            });
            const opacity = position.interpolate({
              inputRange: [i - 0.5, i, i + 0.5],
              outputRange: [0.5, 1, 0.5],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  borderRadius: 4,
                  backgroundColor: "#312e81",
                  marginHorizontal: 0.5,
                  transform: [{ scale }],
                  opacity,
                }}
              />
            );
          })}
        </View>
      </View>

      <LinearGradient
        colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.5)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          marginHorizontal: -40,
          marginBottom: -40,
          paddingBottom: 40,
          paddingHorizontal: 40,
          paddingVertical: 16,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <View className="flex-row items-center gap-4 justify-center w-full">
          {/* Close (✕) — made 48x48 to match smoke button */}
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
            className={`${
              isDark ? "bg-slate-700" : "bg-indigo-50"
            } rounded-2xl justify-center items-center`}
            style={{ width: 48, height: 48 }}
          >
            <Text
              className={`${
                isDark ? "text-slate-50" : "text-indigo-900"
              } font-bold`}
              style={{ fontSize: 20, lineHeight: 20 }}
            >
              ✕
            </Text>
          </Pressable>

        {/* Take 5 breaths Button */}
          <Pressable
            className="bg-indigo-600 rounded-2xl justify-center items-center px-6 py-2.5 flex-1"
             style={{ height: 48 }}
            onPress={() => {
              onClose(); // Close modal first
              onStartBreathing(); // Then navigate to breathing exercise
            }}
          >
            <Text className="text-white font-bold text-lg">{t('breathing.controls.takeBreaths', { count: 5 })}</Text>
          </Pressable>

          {/* I smoked button — 48x48, rounded-2xl, white 24x24 icon */}
          <Pressable
            onPress={onOpenSlipsLog}
            className="bg-red-500 rounded-2xl justify-center items-center"
            style={{ width: 48, height: 48 }}
          >
            <SmokeIcon width={24} height={24} color="#ffffff" />
          </Pressable>
        </View>
      </LinearGradient>

      {/* Don't Give Up Modal */}
      <Modal
        visible={showDontGiveUpModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            className={`mx-6 p-6 rounded-2xl ${
              isDark ? "bg-slate-800" : "bg-white"
            } shadow-xl`}
          >
            {/* Title */}
            <Text
              className={`text-xl font-bold text-center mb-4 ${
                isDark ? "text-slate-100" : "text-gray-900"
              }`}
            >
              {t("cravingSOS.dontGiveUp.title")}
            </Text>

            {/* Description */}
            <Text
              className={`text-base text-center mb-6 leading-6 ${
                isDark ? "text-slate-300" : "text-gray-600"
              }`}
            >
              {t("cravingSOS.dontGiveUp.description")}
            </Text>

            {/* Ok Button */}
            <Pressable
              className="bg-indigo-600 py-3 px-6 rounded-xl"
              onPress={handleDontGiveUpOk}
            >
              <Text className="text-center font-semibold text-white text-lg">
                {t("cravingSOS.dontGiveUp.okButton")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SlideModal>
  );
};

export default CravingSOSModal;

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Animated, Dimensions, Pressable, Text, View } from 'react-native';
import SlideModal from './SlideModal';
import { useTheme } from '../contexts/ThemeContext';
import SipAndBreathe from '../assets/strategies/sip-and-breathe.svg';
import WalkToReset from '../assets/strategies/walk-to-reset.svg';
import SnackInstead from '../assets/strategies/snack-instead.svg';
import MeditateAndListen from '../assets/strategies/meditate-listen.svg';
import SplashAndRefresh from '../assets/strategies/splash-refresh.svg';
import GripAndRelease from '../assets/strategies/grip-release.svg';
import HeartIcon from '../assets/strategies/heart.svg';
import CrumpleCravings from '../assets/strategies/crumple-cravings.svg';
import StretchAndRelax from '../assets/strategies/stretch-relax.svg';

interface CravingSOSModalProps {
  visible: boolean;
  onClose: () => void;
  onStartBreathing: () => void;
}

const strategies = [
  {
    id: 'sip-breathe',
    title: 'Sip and breathe',
    description: 'Replace the craving with a glass of water. Slowly drink the water, focusing on the taste and sensations. Take a few deep breaths and relax. If the craving returns --- Repeat the steps.',
    challenge: 'Hydro hero',
    days: '10 Days challenge',
    icon: SipAndBreathe,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'walk-reset',
    title: 'Walk to reset',
    description: 'When you feel the urge to smoke, walk 500 steps to clear your mind and reset your body. This helps distract you from cravings and feel in control.',
    challenge: 'Step slayer',
    days: '10 Days challenge',
    icon: WalkToReset,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'snack-instead',
    title: 'Snack instead',
    description: 'When you feel the urge to smoke, grab a healthy snack instead. Chew slowly, focus on the taste and texture, and take a sip of water. If the craving comes back, repeat the steps.',
    challenge: 'Snack break',
    days: '10 Days challenge',
    icon: SnackInstead,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'meditate-listen',
    title: 'Meditate and listen',
    description: 'Replace a craving with a short meditation and music. Focus on your breathing, relax your body, and let the craving pass.',
    challenge: 'Calm power',
    days: '10 Days challenge',
    icon: MeditateAndListen,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'splash-refresh',
    title: 'Splash and refresh',
    description: 'When you feel the urge to smoke, splash cold water on your face or wrists. Breathe deeply, focus on the sensations, and let your body refresh. If the craving returns, repeat the steps.',
    challenge: 'Refresh',
    days: '10 Days challenge',
    icon: SplashAndRefresh,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'grip-release',
    title: 'Grip and release',
    description: 'When you feel the urge to smoke, squeeze your fists 20 times. Focus on the sensations, breathe deeply, and let the urge pass. Repeat if needed.',
    challenge: 'Fist flow',
    days: '10 Days challenge',
    icon: GripAndRelease,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'crumple-cravings',
    title: 'Crumple cravings',
    description: 'When you feel the urge to smoke, draw or write your craving on a piece of paper. Focus on the feeling, then crumple the paper. Breathe deeply and let the craving go. If it comes back, repeat the steps.',
    challenge: 'Crave crusher',
    days: '10 Days challenge',
    icon: CrumpleCravings,
    bgColor: 'bg-indigo-100',
  },
  {
    id: 'stretch-relax',
    title: 'Stretch and relax',
    description: 'When you feel tension or stiffness, gently stretch your neck, shoulders, and back for 2-3 minutes. Breathe deeply, focus on the sensations, and let your body relax. If tension returns, repeat the steps.',
    challenge: 'Flow minute',
    days: '10 Days challenge',
    icon: StretchAndRelax,
    bgColor: 'bg-indigo-100',
  },
];

const CravingSOSModal: React.FC<CravingSOSModalProps> = ({ visible, onClose, onStartBreathing }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { width } = Dimensions.get('window');
  const ITEM_WIDTH = width * 0.7; // center card width (~70%)
  const SIDE_GUTTER = width * 0.1; // side visibility (~10% each side)

  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<Animated.FlatList>(null);

  // Create looped data for infinite scrolling
  const loopedData = useMemo(() => {
    return [...strategies, ...strategies, ...strategies]; // Triple the data for smooth looping
  }, [strategies]);

  // Reset to first card when modal becomes visible
  useEffect(() => {
    if (visible) {
      setActiveIndex(0);
      // Start at the middle section so first card is active and last card is on the left
      const initialOffset = strategies.length * ITEM_WIDTH;
      scrollX.setValue(initialOffset);
      // Add a small delay to ensure the modal is fully rendered
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: initialOffset, animated: false });
      }, 50);
    }
  }, [visible, scrollX, strategies.length, ITEM_WIDTH]);

  return (
    <SlideModal visible={visible} onClose={onClose} title="Want to smoke?" showCloseButton>
      <Text
        className={`${isDark ? 'text-slate-300' : 'text-slate-500'} text-center`}
        style={{ fontSize: 14, lineHeight: 20 }}
      >
        Use breathing exercises or quick tips
      </Text>

      <Animated.FlatList
        ref={flatListRef}
        data={loopedData}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        pagingEnabled={false}
        contentContainerStyle={{ paddingHorizontal: SIDE_GUTTER, paddingVertical: 16 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
          const actualIndex = index % strategies.length; // Get the actual index within the original array
          setActiveIndex(actualIndex);

          // Recenter to middle section for seamless looping
          if (index < strategies.length || index >= strategies.length * 2) {
            const targetOffset = (strategies.length + actualIndex) * ITEM_WIDTH;
            flatListRef.current?.scrollToOffset({ offset: targetOffset, animated: false });
          }
        }}
        renderItem={({ item, index }) => {
          const actualIndex = index % strategies.length; // Get the actual index within the original array
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.94, 1, 0.94],
            extrapolate: 'clamp',
          });
          const heightScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.9], // 160/240 = 0.67 for side cards, 1 for active
            extrapolate: 'clamp',
          });
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [9, 0, 9],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              style={{
                width: ITEM_WIDTH,
                transform: [{ scale }, { scaleY: heightScale }, { translateY }],
              }}
            >
              <View
                className={`${isDark ? 'bg-slate-700' : 'bg-indigo-50'} rounded-2xl px-3 py-4`}
                style={{ minHeight: 320, justifyContent: 'space-between' }}
              >
                {/* Heart Icon */}
                <View className="items-center mb-1">
                  <HeartIcon width={40} height={40} color={isDark ? '#CBD5E1' : '#1e1b4b'} />
                </View>

                {/* Title */}
                <Text
                  className={`${isDark ? 'text-slate-100' : 'text-indigo-950'} mb-1`}
                  style={{ fontWeight: '700', fontSize: 16, lineHeight: 22, textAlign: 'center' }}
                >
                  {item.title}
                </Text>

                {/* Description */}
                <Text
                  className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                  style={{ fontWeight: '500', fontSize: 14, lineHeight: 20, marginBottom: 16 }}
                >
                  {item.description}
                </Text>

                {/* Challenge Box */}
                <View className={`${item.bgColor} rounded-xl p-1 flex-row justify-between items-center`}>
                  <View className="flex-1 p-3">
                    <Text
                      className={`${isDark ? 'text-slate-100' : 'text-indigo-950'}`}
                      style={{ fontWeight: '700', fontSize: 14, lineHeight: 18 }}
                    >
                      {item.challenge}
                    </Text>
                    <Text
                      className={`${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                      style={{ fontWeight: '500', fontSize: 12, lineHeight: 16 }}
                    >
                      {item.days}
                    </Text>
                  </View>
                  <View className="ml-3 mr-1">
                    <item.icon width={48} height={48} color={isDark ? '#CBD5E1' : '#1e1b4b'} />
                  </View>
                </View>
              </View>
            </Animated.View>
          );
        }}
      />

      {/* Indicators */}
      {/* <View className="flex-row justify-center">
        <View className="flex-row bg-indigo-50 h-3 rounded-full px-1 py-0.5 gap-1">
          {strategies.map((_, i) => {
            const active = i === activeIndex;
            return (
              <View
                key={i}
                className={`w-2 h-2 rounded-full ${
                  active ? "bg-indigo-900" : "bg-indigo-300"
                }`}
              />
            );
          })}
        </View>
      </View> */}
    </SlideModal>
  );
};

export default CravingSOSModal;

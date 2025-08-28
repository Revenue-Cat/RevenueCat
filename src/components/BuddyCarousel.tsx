// src/components/BuddyCarousel.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from "react-native";
import { FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import LottieView from "lottie-react-native";
import { buddyAssets, BuddyKey, SexKey } from "../assets/buddies";
import LockLight from "../assets/icons/lock.svg";

const { width: SCREEN_W } = Dimensions.get("window");
const IMG_W = 132;
const IMG_H = 168;
const IMG_H_EXPANDED = IMG_H * 1.35;
const CARD_PAD = 8;
const ITEM_W = IMG_W + CARD_PAD * 2;
const ITEM_H = 168;
const GUTTER = 24;
const CELL_W = ITEM_W + GUTTER;
const SIDE_SPACING = Math.max(0, (SCREEN_W - ITEM_W) / 2);
const LOOP_MULTIPLIER = 800;

export type Buddy = {
  id: BuddyKey;
  name: string;
  description: string;
};

type Props = {
  data: Buddy[];
  sex: SexKey;
  isDark?: boolean;
  onChange?: (activeBaseIndex: number) => void;
  isLocked?: (baseIndex: number) => boolean;
  backgrounds?: any[];
  onEditName?: () => void;
};

/** Plays a Lottie after a small random delay when active; pauses/resets when inactive */
const BuddyAnim: React.FC<{
  source: any;
  active: boolean;
  width: number;
  height: number;
  delayMs: number;
}> = ({ source, active, width, height, delayMs }) => {
  const ref = useRef<LottieView>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active) {
      // start after a small random delay
      timer.current && clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        ref.current?.play();
      }, delayMs);
    } else {
      // stop & reset when not active
      timer.current && clearTimeout(timer.current);
      ref.current?.reset();
    }
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, [active, delayMs]);

  return (
    <LottieView
      ref={ref}
      source={source}
      autoPlay={false}
      loop={true}
      style={{ position: "absolute", top: 10, alignSelf: "center", width, height }}
      enableMergePathsAndroidForKitKatAndAbove
    />
  );
};

export default function BuddyCarousel({
  data,
  sex,
  isDark = false,
  onChange,
  isLocked,
  backgrounds,
}: Props) {
  const listRef = useRef<FlatList>(null);

  const mid = Math.floor(LOOP_MULTIPLIER / 2);
  const startIndex = mid * data.length;
  const initialOffset = startIndex * CELL_W;

  const scrollX = useRef(new Animated.Value(initialOffset)).current;

  // swipe sound only (snap removed)
  const swipeSoundRef = useRef<Audio.Sound | null>(null);
  const [soundsReady, setSoundsReady] = useState({ swipe: false });
  const swipePlayedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const swipe = await Audio.Sound.createAsync(
          require("../assets/sounds/swipe.mp3"),
          { volume: 0.5, shouldPlay: false },
          undefined,
          true
        );

        if (!mounted) {
          await swipe.sound.unloadAsync();
          return;
        }
        swipeSoundRef.current = swipe.sound;
        setSoundsReady({ swipe: true });
      } catch {}
    })();

    return () => {
      mounted = false;
      (async () => {
        try {
          await swipeSoundRef.current?.unloadAsync();
        } catch {}
      })();
    };
  }, []);

  const playSwipe = () => {
    if (soundsReady.swipe) swipeSoundRef.current?.replayAsync().catch(() => {});
  };

  const [isSettling, setIsSettling] = useState(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideBadgeNow = () => {
    setIsSettling(true);
    if (settleTimer.current) clearTimeout(settleTimer.current);
  };
  const showBadgeSoon = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => setIsSettling(false), 150);
  };
  useEffect(() => {
    return () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, []);

  const extended = useMemo(
    () =>
      Array.from(
        { length: data.length * LOOP_MULTIPLIER },
        (_, i) => data[i % data.length]
      ),
    [data]
  );

  const [centerExtIndex, setCenterExtIndex] = useState(startIndex);

  useEffect(() => {
    const base = ((centerExtIndex % data.length) + data.length) % data.length;
    onChange?.(base);
  }, [centerExtIndex, data.length, onChange]);

  const getItemLayout = (_: any, index: number) => ({
    length: CELL_W,
    offset: CELL_W * index,
    index,
  });

  const onScrollToIndexFailed = (info: any) => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: info.index, animated: false });
    });
  };

  useEffect(() => {
    scrollX.setValue(initialOffset);
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: startIndex, animated: false });
    });
  }, [initialOffset, startIndex, scrollX]);

  const handleBeginDrag = () => {
    hideBadgeNow();
    if (!swipePlayedRef.current) {
      playSwipe();
      swipePlayedRef.current = true;
    }
  };
  const handleMomentumBegin = () => {
    hideBadgeNow();
  };
  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / CELL_W);
    if (i !== centerExtIndex) setCenterExtIndex(i);

    const cycle = data.length;
    const center = Math.floor(LOOP_MULTIPLIER / 2) * cycle;
    if (Math.abs(i - center) > cycle * 6) {
      const normalized = center + (i % cycle);
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: normalized, animated: false });
        setCenterExtIndex(normalized);
        showBadgeSoon();
        swipePlayedRef.current = false;
      });
    } else {
      showBadgeSoon();
      swipePlayedRef.current = false;
    }
  };

  const scrollTo = (i: number) => {
    hideBadgeNow();
    playSwipe();
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };

  const LockIcon = LockLight;

  // Stable random delays per buddy (200–1400ms)
  const startDelays = useMemo(
    () => Array.from({ length: data.length }, () => 200 + Math.floor(Math.random() * 1200)),
    [data.length]
  );

  const renderItem = ({ index }: { item: Buddy; index: number }) => {
    const baseIdx = ((index % data.length) + data.length) % data.length;
    const animSrc = buddyAssets[data[baseIdx].id][sex];
    const locked = isLocked ? isLocked(baseIdx) : false;
    const bgSrc = backgrounds?.[baseIdx];
    const isCenter = index === centerExtIndex;

    const centerOffset = index * CELL_W;

    const rotate = scrollX.interpolate({
      inputRange: [centerOffset - CELL_W, centerOffset, centerOffset + CELL_W],
      outputRange: ["35deg", "0deg", "-35deg"],
      extrapolate: "clamp",
    });

    const translateY = scrollX.interpolate({
      inputRange: [centerOffset - CELL_W, centerOffset, centerOffset + CELL_W],
      outputRange: [60, 0, 60],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange: [centerOffset - CELL_W, centerOffset, centerOffset + CELL_W],
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp",
    });

    const showBadge = isCenter && !isSettling;

    return (
      <View style={{ width: CELL_W, overflow: "visible" }} className="items-center">
        <Pressable onPress={() => scrollTo(index)}>
          <View className="relative" style={{ width: ITEM_W, height: ITEM_H, overflow: "visible" as any }}>
            <Animated.View
              className="rounded-3xl"
              style={{
                width: ITEM_W,
                height: ITEM_H,
                overflow: "hidden",
                opacity,
                transform: [{ translateY }, { rotate }],
                backgroundColor: bgSrc ? "transparent" : "#93C5FD",
              }}
            >
              {bgSrc && (
                <Image
                  source={bgSrc}
                  resizeMode="cover"
                  style={{ position: "absolute", width: "100%", height: "100%" }}
                />
              )}

              {/* Buddy Lottie: starts after random delay when centered */}
              <BuddyAnim
                source={animSrc}
                active={isCenter}
                width={IMG_W}
                height={IMG_H_EXPANDED}
                delayMs={startDelays[baseIdx]}
              />
            </Animated.View>

            {showBadge && (
              <View
                className={`rounded-full p-1 absolute left-1/2 -translate-x-1/2 shadow ${
                  locked ? "bg-white" : "bg-green-500"
                }`}
                style={{ width: 32, height: 32, bottom: -16, alignItems: "center", justifyContent: "center" }}
              >
                {locked ? <LockIcon width={18} height={18} /> : <Ionicons name="checkmark" size={24} color="#fff" />}
              </View>
            )}
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <Animated.FlatList
      ref={listRef}
      data={extended}
      keyExtractor={(_, i) => `buddy-${i}`}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      ListHeaderComponent={<View style={{ width: SIDE_SPACING }} />}
      ListFooterComponent={<View style={{ width: SIDE_SPACING }} />}
      snapToInterval={CELL_W}
      snapToAlignment="start"
      decelerationRate="fast"
      disableIntervalMomentum
      bounces={false}
      initialScrollIndex={startIndex}
      getItemLayout={getItemLayout}
      onScrollToIndexFailed={onScrollToIndexFailed}
      onScrollBeginDrag={handleBeginDrag}
      onMomentumScrollBegin={handleMomentumBegin}
      onMomentumScrollEnd={handleMomentumEnd}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
      style={{ marginBottom: 16, overflow: "visible" }}
      removeClippedSubviews={false}
    />
  );
}

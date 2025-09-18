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
const LOOP_MULTIPLIER = 20;

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



  const [isSettling, setIsSettling] = useState(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideBadgeNow = () => {
    setIsSettling(true);
    if (settleTimer.current) clearTimeout(settleTimer.current);
  };
  const showBadgeImmediately = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    // No delay - show badge instantly
    setIsSettling(false);
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
  };
  const handleMomentumBegin = () => {
    hideBadgeNow();
  };
  
  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / CELL_W);
    if (i !== centerExtIndex) setCenterExtIndex(i);

    const cycle = data.length;
    const center = Math.floor(LOOP_MULTIPLIER / 2) * cycle;
    if (Math.abs(i - center) > cycle * 2) {
      const normalized = center + (i % cycle);
        requestAnimationFrame(() => {
          listRef.current?.scrollToIndex({ index: normalized, animated: false });
          setCenterExtIndex(normalized);
          showBadgeImmediately();
        });
    } else {
      showBadgeImmediately();
    }
  };

  const scrollTo = (i: number) => {
    hideBadgeNow();
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };

  const LockIcon = LockLight;

  // Deterministic delays per buddy (200–600ms)
  const startDelays = useMemo(
    () => Array.from({ length: data.length }, (_, i) => 200 + (i * 100) % 400),
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

    // Show badge immediately on the center item (settling handled by timer)
    const showBadge = isCenter && !isSettling && centerExtIndex % data.length === baseIdx;

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
                className={`rounded-full p-1 absolute left-1/2 -translate-x-1/2 shadow-lg border-2 ${
                  locked ? "bg-white border-gray-300" : "bg-green-500 border-green-600"
                }`}
                style={{
                  width: 32,
                  height: 32,
                  bottom: -16,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  elevation: 5
                }}
              >
                {locked ? (
                  <LockIcon width={16} height={16} color="#374151" />
                ) : (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                )}
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
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={50}
      windowSize={3}
      initialNumToRender={10}
    />
  );
}

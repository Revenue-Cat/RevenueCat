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
import { buddyAssets, BuddyKey, SexKey } from "../assets/buddies";

const { width: SCREEN_W } = Dimensions.get("window");

const IMG_W = 132;
const IMG_H = 168;
const IMG_H_EXPANDED = IMG_H * 1.5;
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
};

export default function BuddyCarousel({
  data,
  sex,
  isDark = false,
  onChange,
}: Props) {
  const listRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const [isSettling, setIsSettling] = useState(false);
  const settleTimer = useRef<NodeJS.Timeout | null>(null);
  const hideBadgeNow = () => {
    setIsSettling(true);
    if (settleTimer.current) clearTimeout(settleTimer.current);
  };
  const showBadgeSoon = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => setIsSettling(false), 150);
  };
  useEffect(
    () => () => settleTimer.current && clearTimeout(settleTimer.current),
    []
  );

  const extended = useMemo(
    () =>
      Array.from(
        { length: data.length * LOOP_MULTIPLIER },
        (_, i) => data[i % data.length]
      ),
    [data]
  );

  const mid = Math.floor(LOOP_MULTIPLIER / 2);
  const startIndex = mid * data.length;

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

  const handleMomentumBegin = () => {
    hideBadgeNow();
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / CELL_W);
    if (i !== centerExtIndex) setCenterExtIndex(i);

    const cycle = data.length;
    const center = mid * cycle;
    if (Math.abs(i - center) > cycle * 6) {
      const normalized = center + (i % cycle);
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: normalized, animated: false });
        setCenterExtIndex(normalized);
        showBadgeSoon();
      });
    } else {
      showBadgeSoon();
    }
  };

  const scrollTo = (i: number) => {
    hideBadgeNow();
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };

  const renderItem = ({ index }: { item: Buddy; index: number }) => {
    const isCenter = index === centerExtIndex;
    const baseIdx = ((index % data.length) + data.length) % data.length;
    const src = buddyAssets[data[baseIdx].id][sex];

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
      <View
        style={{ width: CELL_W, overflow: "visible" }}
        className="items-center"
      >
        <Pressable onPress={() => scrollTo(index)}>
          <View
            className="relative"
            style={{
              width: ITEM_W,
              height: ITEM_H,
              overflow: "visible" as any,
            }}
          >
            <Animated.View
              className="rounded-3xl bg-blue-300"
              style={{
                width: ITEM_W,
                height: ITEM_H,
                overflow: "hidden",
                opacity,
                transform: [{ translateY }, { rotate }],
              }}
            >
              <Image
                source={src}
                resizeMode="contain"
                className="absolute top-[10px] self-center rounded-3xl"
                style={{ width: IMG_W, height: IMG_H_EXPANDED }}
              />
            </Animated.View>

            {showBadge && (
              <View
                className="bg-green-500 rounded-full p-1 absolute left-1/2 -translate-x-1/2"
                style={{ width: 32, height: 32, bottom: -16 }}
              >
                <Ionicons name="checkmark" size={24} color="#fff" />
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
      onMomentumScrollBegin={handleMomentumBegin}
      onMomentumScrollEnd={handleMomentumEnd}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      style={{ marginBottom: 16, overflow: "visible" }}
      removeClippedSubviews={false}
    />
  );
}

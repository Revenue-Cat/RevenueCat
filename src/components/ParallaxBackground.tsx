import React, { useEffect, useRef, useMemo } from "react";
import { View, Animated } from "react-native";
import { useApp } from "../contexts/AppContext";
import { SCENES_DATA } from "../data/scenesData";

type Anchor = "top" | "middle" | "bottom";

interface ParallaxBackgroundProps {
  scrollY: Animated.Value;
  height?: number;
  children?: React.ReactNode;
  anchor?: Anchor;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  scrollY,
  height = 300,
  children,
  anchor = "top",
}) => {
  const { selectedBackground } = useApp();
  const currentScene = useMemo(() => {
    return (
      SCENES_DATA.find((s) => s.id === selectedBackground.id) || SCENES_DATA[0]
    );
  }, [selectedBackground.id]);

  const parallaxSlices =
    currentScene.parallaxSlices ||
    ({
      slice1: require("../assets/backgrounds/parallax/slice1.png"),
      slice2: require("../assets/backgrounds/parallax/slice2.png"),
      slice3: require("../assets/backgrounds/parallax/slice3.png"),
      slice4: require("../assets/backgrounds/parallax/slice4.png"),
    } as const);
  // Floating animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const floatAnim4 = useRef(new Animated.Value(0)).current;

  // Memoize the transform calculations to prevent recreation
  const layer4Transform = useMemo(
    () => [
      {
        translateY: Animated.add(
          scrollY.interpolate({
            inputRange: [0, 80],
            outputRange: [0, -70],
            extrapolate: "clamp",
          }),
          floatAnim1.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -40],
          })
        ),
      },
    ],
    [scrollY, floatAnim1]
  );

  const layer3Transform = useMemo(
    () => [
      {
        translateY: Animated.add(
          scrollY.interpolate({
            inputRange: [0, 80],
            outputRange: [0, -50],
            extrapolate: "clamp",
          }),
          floatAnim2.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -7],
          })
        ),
      },
      {
        rotate: scrollY.interpolate({
          inputRange: [0, 80],
          outputRange: ["0deg", "2deg"],
          extrapolate: "clamp",
        }),
      },
    ],
    [scrollY, floatAnim2]
  );

  const layer2Transform = useMemo(
    () => [
      {
        translateY: Animated.add(
          scrollY.interpolate({
            inputRange: [0, 80],
            outputRange: [0, -30],
            extrapolate: "clamp",
          }),
          floatAnim3.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -5],
          })
        ),
      },
      {
        rotate: scrollY.interpolate({
          inputRange: [0, 80],
          outputRange: ["0deg", "-1deg"],
          extrapolate: "clamp",
        }),
      },
    ],
    [scrollY, floatAnim3]
  );

  const layer1Transform = useMemo(
    () => [
      {
        translateY: Animated.add(
          scrollY.interpolate({
            inputRange: [0, 80],
            outputRange: [0, -10],
            extrapolate: "clamp",
          }),
          floatAnim4.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -1],
          })
        ),
      },
      {
        rotate: scrollY.interpolate({
          inputRange: [0, 80],
          outputRange: ["0deg", "1deg"],
          extrapolate: "clamp",
        }),
      },
    ],
    [scrollY, floatAnim4]
  );

  // Calculate layer heights based on the provided height
  const getLayerHeight = (layerIndex: number) => {
    // Percentage-based proportions relative to base height
    // Original heights: 390, 350, 325, 320 → Converted to percentages
    const percentages = [118, 106, 98, 94]; // Percentage of base height
    return Math.round(height * (percentages[layerIndex] / 100));
  };

  const edge = (layerH: number) => {
    if (anchor === "top") return { top: 0 } as const;
    if (anchor === "bottom") return { bottom: 0 } as const;
    return { top: (height - layerH) / 2 } as const;
  };

  return (
    <View className="relative w-full z-10 overflow-hidden" style={{ height }}>
      {/* Background Layer 4 - Furthest back (fastest) */}
      <Animated.View
        className="absolute left-0 right-0"
        style={{ zIndex: 40, ...edge(getLayerHeight(0)) }}
      >
        <Animated.Image
          source={parallaxSlices.slice4}
          style={{
            width: "100%",
            height: getLayerHeight(0),
            transform: layer4Transform,
          }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Background Layer 3 - Third layer */}
      <Animated.View
        className="absolute left-0 right-0"
        style={{ zIndex: 30, ...edge(getLayerHeight(1)) }}
      >
        <Animated.Image
          source={parallaxSlices.slice3}
          style={{
            width: "100%",
            height: getLayerHeight(1),
            transform: layer3Transform,
          }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Background Layer 2 - Second layer */}
      <Animated.View
        className="absolute left-0 right-0"
        style={{ zIndex: 20, ...edge(getLayerHeight(2)) }}
      >
        <Animated.Image
          source={parallaxSlices.slice2}
          style={{
            width: "100%",
            height: getLayerHeight(2),
            transform: layer2Transform,
          }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Background Layer 1 - Front layer (slowest) */}
      <Animated.View
        className="absolute left-0 right-0"
        style={{ zIndex: 10, ...edge(getLayerHeight(3)) }}
      >
        <Animated.Image
          source={parallaxSlices.slice1}
          style={{
            width: "100%",
            height: getLayerHeight(3),
            transform: layer1Transform,
          }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Children components (like Buddy Icon) */}
      {children}
    </View>
  );
};

export default React.memo(ParallaxBackground);

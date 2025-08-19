import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface ParallaxBackgroundProps {
  scrollY: Animated.Value;
  height?: number;
  children?: React.ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ 
  scrollY, 
  height = 330,
  children
}) => {
  // Floating animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const floatAnim4 = useRef(new Animated.Value(0)).current;

  // Start floating animations
  useEffect(() => {
    const createFloatAnimation = (animValue: Animated.Value, duration: number, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration,
            delay: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatAnimation(floatAnim1, 3000, 0).start();
    createFloatAnimation(floatAnim2, 2500, 500).start();
    createFloatAnimation(floatAnim3, 3500, 1000).start();
    createFloatAnimation(floatAnim4, 2800, 1500).start();
  }, []);

  return (
    <View 
      className="relative w-full z-10 overflow-hidden" 
      style={{ height }}
    >
      {/* Background Layer 4 - Furthest back (slowest) */}
      <Animated.View className="absolute top-0 left-0 right-0" style={{ zIndex: 40 }}>
        <Animated.Image
          source={require('../assets/backgrounds/parallax/slice4.png')}
          style={{ 
            width: '100%', 
            height: 370,
            opacity: scrollY.interpolate({
              inputRange: [0, 100, 200],
              outputRange: [1, 0.6, 0.3],
              extrapolate: 'clamp'
            }),
            transform: [
              {
                translateY: Animated.add(
                  scrollY.interpolate({
                    inputRange: [0, 200],
                    outputRange: [0, -80],
                    extrapolate: 'clamp'
                  }),
                  floatAnim1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -9]
                  })
                )
              }
            ]
          }}
          resizeMode="cover"
        />
      </Animated.View>
      
      {/* Background Layer 3 - Third layer */}
      <Animated.View className="absolute top-0 left-0 right-0" style={{ zIndex: 30 }}>
        <Animated.Image
          source={require('../assets/backgrounds/parallax/slice3.png')}
          style={{ 
            width: '100%', 
            height: 350,
            opacity: scrollY.interpolate({
              inputRange: [0, 100, 200],
              outputRange: [1, 0.7, 0.4],
              extrapolate: 'clamp'
            }),
            transform: [
              {
                translateY: Animated.add(
                  scrollY.interpolate({
                    inputRange: [0, 200],
                    outputRange: [0, -60],
                    extrapolate: 'clamp'
                  }),
                  floatAnim2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -6]
                  })
                )
              },
              {
                rotate: scrollY.interpolate({
                  inputRange: [0, 200],
                  outputRange: ['0deg', '2deg'],
                  extrapolate: 'clamp'
                })
              }
            ]
          }}
          resizeMode="cover"
        />
      </Animated.View>
      
      {/* Background Layer 2 - Second layer */}
      <Animated.View className="absolute top-0 left-0 right-0" style={{ zIndex: 20 }}>
        <Animated.Image
          source={require('../assets/backgrounds/parallax/slice2.png')}
          style={{ 
            width: '100%', 
            height: 310,
            opacity: scrollY.interpolate({
              inputRange: [0, 100, 200],
              outputRange: [1, 0.8, 0.5],
              extrapolate: 'clamp'
            }),
            transform: [
              {
                translateY: Animated.add(
                  scrollY.interpolate({
                    inputRange: [0, 200],
                    outputRange: [0, -40],
                    extrapolate: 'clamp'
                  }),
                  floatAnim3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -4]
                  })
                )
              },
              {
                rotate: scrollY.interpolate({
                  inputRange: [0, 200],
                  outputRange: ['0deg', '-1.5deg'],
                  extrapolate: 'clamp'
                })
              }
            ]
          }}
          resizeMode="cover"
        />
      </Animated.View>
      
      {/* Background Layer 1 - Front layer (fastest) */}
      <Animated.View className="absolute top-0 left-0 right-0" style={{ zIndex: 10 }}>
        <Animated.Image
          source={require('../assets/backgrounds/parallax/slice1.png')}
          style={{ 
            width: '100%', 
            height: 400,
            opacity: scrollY.interpolate({
              inputRange: [0, 100, 200],
              outputRange: [1, 0.9, 0.6],
              extrapolate: 'clamp'
            }),
            transform: [
              {
                translateY: Animated.add(
                  scrollY.interpolate({
                    inputRange: [0, 200],
                    outputRange: [0, -20],
                    extrapolate: 'clamp'
                  }),
                  floatAnim4.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -2]
                  })
                )
              },
              {
                rotate: scrollY.interpolate({
                  inputRange: [0, 200],
                  outputRange: ['0deg', '1deg'],
                  extrapolate: 'clamp'
                })
              }
            ]
          }}
          resizeMode="cover"
        />
      </Animated.View>
      
      {/* Children components (like Buddy Icon) */}
      {children}
    </View>
  );
};

export default ParallaxBackground;

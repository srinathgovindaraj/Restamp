import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import COLORS from "../constants/colors";
import RestampLogo from "./RestampLogo";

const { width, height } = Dimensions.get("window");

export default function AnimatedSplashScreen({ onAnimationComplete }) {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(18)).current;

  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  const screenOpacity = useRef(new Animated.Value(1)).current;
  const screenScale = useRef(new Animated.Value(1)).current;

  const hasExited = useRef(false);

  // Trigger Exit animation
  const triggerExit = () => {
    if (hasExited.current) return;
    hasExited.current = true;

    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(screenScale, {
        toValue: 1.06,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete?.();
    });
  };

  useEffect(() => {
    // 1. Logo spring entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Pulse ring loop
    Animated.loop(
      Animated.parallel([
        Animated.timing(pulseScale, {
          toValue: 1.45,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Title slide & fade
    Animated.sequence([
      Animated.delay(260),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 4. Tagline fade
    Animated.sequence([
      Animated.delay(450),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // 5. Progress bar fill
    Animated.timing(progressWidth, {
      toValue: 1,
      duration: 1700,
      useNativeDriver: false,
    }).start();

    // 6. Auto exit timer
    const exitTimer = setTimeout(() => {
      triggerExit();
    }, 2200);

    return () => clearTimeout(exitTimer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: screenOpacity,
          transform: [{ scale: screenScale }],
        },
      ]}
    >
      <Pressable style={styles.pressableArea} onPress={triggerExit}>
        {/* CENTER CONTENT */}
        <View style={styles.centerBox}>
          {/* Pulse Ring Behind Logo */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
              },
            ]}
          />

          {/* Logo Card with Spring Animation */}
          <Animated.View
            style={[
              styles.logoCard,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <RestampLogo size={68} />
          </Animated.View>

          {/* App Brand Name */}
          <Animated.View
            style={{
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
              alignItems: "center",
            }}
          >
            <Text style={styles.brandTitle}>
              Restamp<Text style={styles.accentDot}>.</Text>
            </Text>
          </Animated.View>

          {/* Tagline */}
          <Animated.Text style={[styles.brandTagline, { opacity: taglineOpacity }]}>
            DISCOVER THE EXTRAORDINARY
          </Animated.Text>
        </View>

        {/* BOTTOM PROGRESS BAR */}
        <View style={styles.bottomContainer}>
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.tapToSkip}>Tap anywhere to skip</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  pressableArea: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  centerBox: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  pulseRing: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: "rgba(20, 110, 245, 0.4)",
    backgroundColor: "rgba(20, 110, 245, 0.06)",
  },

  logoCard: {
    width: 104,
    height: 104,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 10,
    marginBottom: 8,
  },

  logoImage: {
    width: "100%",
    height: "100%",
  },

  brandTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.8,
    marginTop: 14,
  },

  accentDot: {
    color: COLORS.primary,
  },

  brandTagline: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 2.8,
    textTransform: "uppercase",
    marginTop: 8,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },

  progressBarTrack: {
    width: 120,
    height: 3.5,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },

  tapToSkip: {
    marginTop: 14,
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});

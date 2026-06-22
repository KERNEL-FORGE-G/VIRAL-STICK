/**
 * SplashScreen — Loading screen with logo, animation, and auto-dismiss
 * Viral Stick | KERNEL FORGE — 2026
 */

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";

const SplashScreen = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 400,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />
      <Animated.Image
        source={require("../../assets/logo/logo_sans_fond.png")}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, { opacity: logoOpacity }]}>
        Viral Stick
      </Animated.Text>
      <Animated.View style={{ opacity: textOpacity }}>
        <View style={styles.taglineRow}>
          <View style={styles.dot} />
          <Text style={styles.tagline}>Générateur IA Multimodal</Text>
          <View style={styles.dot} />
        </View>
      </Animated.View>
      <Animated.View
        style={[styles.loader, { transform: [{ scale: pulseAnim }] }]}
      >
        <View style={styles.loaderInner} />
      </Animated.View>
      <Animated.Text style={[styles.footer, { opacity: textOpacity }]}>
        KERNEL FORGE — 2026
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  title: {
    color: "#F3F4F6",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 8,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#7C3AED",
  },
  tagline: {
    color: "#A78BFA",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  loader: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "rgba(124, 58, 237, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  loaderInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#7C3AED",
  },
  footer: {
    position: "absolute",
    bottom: 60,
    color: "#6B7280",
    fontSize: 10,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
});

export default SplashScreen;

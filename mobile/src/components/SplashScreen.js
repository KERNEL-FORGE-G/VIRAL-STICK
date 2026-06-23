import React, { useRef, useEffect } from "react";
import { View, Text, Animated, StatusBar, StyleSheet, Image } from "react-native";
import { colors } from "../theme/tokens";

const SplashScreen = ({ onFinish }) => {
  const scale   = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const textOp  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(textOp, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => onFinish?.(), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <View style={styles.circle}>
          <Image source={require("../../assets/logo/logo_sans_fond.png")} style={styles.logo} resizeMode="contain" />
        </View>
      </Animated.View>
      <Animated.Text style={[styles.title, { opacity }]}>Viral Stick</Animated.Text>
      <Animated.Text style={[styles.tag, { opacity: textOp }]}>Génère. Partage. Viralise.</Animated.Text>
      <Animated.Text style={[styles.footer, { opacity: textOp }]}>KERNEL FORGE — 2026</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center" },
  logoWrap:{ marginBottom: 28 },
  circle:  { width: 130, height: 130, borderRadius: 65, backgroundColor: colors.duoBlueLight, borderWidth: 3, borderColor: `${colors.duoBlue}44`, alignItems: "center", justifyContent: "center" },
  logo:    { width: 90, height: 90 },
  title:   { fontSize: 36, fontWeight: "900", color: colors.duoBlue, letterSpacing: 1, marginBottom: 8 },
  tag:     { fontSize: 15, fontWeight: "700", color: colors.silver, letterSpacing: 0.5, marginBottom: 0 },
  footer:  { position: "absolute", bottom: 48, fontSize: 11, fontWeight: "800", color: colors.silver, letterSpacing: 2, textTransform: "uppercase" },
});

export default SplashScreen;

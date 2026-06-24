import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors, borderRadius, spacing } from "../theme/tokens";
import { wp, rs } from "../theme/responsive";

const COMPANIONS = {
  arch: require("../../assets/companions/arch_sans_fond.png"),
  para: require("../../assets/companions/para_sans_fond.png"),
  secu: require("../../assets/companions/secu_sans_fond.png"),
  data: require("../../assets/companions/data_sans_fond.png"),
  bio: require("../../assets/companions/bio_sans_fond.png"),
  ubu: require("../../assets/companions/ubu_sans_fond.png"),
  art: require("../../assets/companions/art_sans_fond.png"),
};

const COMPANION_NAMES = {
  arch: "Archlord",
  para: "Para",
  secu: "Secu",
  data: "Data",
  bio: "Bio",
  ubu: "Ubu",
  art: "Art",
};

const CompanionAvatar = ({
  companion = "arch",
  size = wp(40),
  message = null,
  floating = false,
  onPress,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const [showBubble, setShowBubble] = useState(!!message);

  useEffect(() => {
    let loop;
    if (floating) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -8,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
    }

    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 80,
      friction: 7,
      useNativeDriver: true,
    }).start();

    return () => {
      if (loop) loop.stop();
    };
  }, [floating, floatAnim, scaleAnim]);

  useEffect(() => {
    setShowBubble(!!message);
  }, [message]);

  const accentColor = colors[companion] || colors.arch;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.wrapper}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: floatAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.outerGlow,
            {
              width: size + 22,
              height: size + 22,
              borderRadius: (size + 22) / 2,
              shadowColor: accentColor,
              backgroundColor: `${accentColor}20`,
            },
          ]}
        />
        <View
          style={[
            styles.ring,
            {
              width: size + 8,
              height: size + 8,
              borderRadius: (size + 8) / 2,
              borderColor: `${accentColor}88`,
            },
          ]}
        />
        <Image
          source={COMPANIONS[companion]}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </Animated.View>

      {showBubble && message && (
        <View style={[styles.bubble, { borderColor: `${accentColor}88` }]}>
          <Text style={[styles.bubbleName, { color: accentColor }]}>
            {COMPANION_NAMES[companion]}
          </Text>
          <Text style={styles.bubbleText}>{message}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  outerGlow: {
    position: "absolute",
    opacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 22,
    elevation: 10,
  },
  ring: {
    position: "absolute",
    borderWidth: 1.2,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  bubble: {
    marginTop: wp(2),
    borderRadius: rs(14),
    borderWidth: 1,
    padding: wp(3.5),
    maxWidth: wp(75),
    backgroundColor: "rgba(12,18,35,0.92)",
  },
  bubbleName: {
    fontWeight: "800",
    fontSize: rs(12),
    marginBottom: 4,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  bubbleText: {
    fontSize: rs(14),
    lineHeight: rs(14) * 1.4,
    color: colors.text,
  },
});

export { COMPANIONS, COMPANION_NAMES };
export default CompanionAvatar;

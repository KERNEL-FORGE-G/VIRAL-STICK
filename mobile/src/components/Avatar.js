import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme, colors } from "../theme";

const Avatar = ({ name = "User", size = 40, bgColor, textColor, style }) => {
  const initials = name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Pick a color from the companions palette if not provided
  const COLORS = [
    colors.duoGreen, colors.skyBlue, colors.grapeSoda,
    colors.bubblegumPink, colors.sunshineYellow
  ];

  const bg = bgColor || COLORS[Math.abs(initials.charCodeAt(0) % COLORS.length)];
  const textCol = textColor || "#ffffff";

  return (
    <View style={[
      styles.container,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      style
    ]}>
      <Text style={[
        styles.text,
        { fontSize: size * 0.4, color: textCol }
      ]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)"
  },
  text: {
    fontWeight: "900",
    fontFamily: "Nunito"
  }
});

export default Avatar;

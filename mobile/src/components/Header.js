import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { spacing, radius, colors } from "../theme";
import { useTheme } from "../theme";
import AppIcon from "./AppIcon";

const Header = ({ title, subtitle, rightElement, onBack, onProfile }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <AppIcon name="chevron-left" color={colors.almostBlack} size={20} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onProfile} style={styles.profileBtn}>
            <AppIcon name="user" color={colors.duoGreen} size={20} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.right}>
        {rightElement}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    height: 70, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: spacing.md, 
    borderBottomWidth: 2,
    borderBottomColor: colors.cloudGray,
    backgroundColor: colors.snowWhite
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: radius.buttons, 
    alignItems: "center", 
    justifyContent: "center", 
    borderWidth: 2,
    borderColor: colors.cloudGray,
    backgroundColor: colors.snowWhite
  },
  profileBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    alignItems: "center", 
    justifyContent: "center", 
    borderWidth: 2,
    borderColor: colors.duoGreen,
    backgroundColor: colors.duoGreenLight
  },
  title: { fontSize: 18, fontWeight: "900", letterSpacing: -0.3, color: colors.almostBlack, fontFamily: 'Nunito' },
  subtitle: { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8, color: colors.silver, fontFamily: 'Nunito' },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
});

export default Header;

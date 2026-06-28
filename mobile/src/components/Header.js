import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { spacing } from "../theme";
import { useTheme } from "../theme";
import AppIcon from "./AppIcon";

const Header = ({ title, subtitle, rightElement, onBack, onProfile }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary, borderBottomColor: theme.border }]}>
      <View style={styles.left}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={[styles.backBtn, { backgroundColor: theme.backgroundCard, borderColor: theme.border }]}>
            <AppIcon name="chevron-left" color={theme.textPrimary} size={20} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onProfile} style={[styles.profileBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
            <AppIcon name="user" color={theme.primary} size={20} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.right}>
        {rightElement}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 65, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.md, borderBottomWidth: 1 },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  profileBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
  title: { fontSize: 18, fontWeight: "900", letterSpacing: -0.3 },
  subtitle: { fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.6 },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
});

export default Header;

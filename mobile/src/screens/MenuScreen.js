import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { useTheme, spacing, radius } from "../theme";
import GlassCard from "../components/GlassCard";
import CompanionAvatar from "../components/CompanionAvatar";
import AppIcon from "../components/AppIcon";

const MenuScreen = ({ navigate }) => {
  const { theme } = useTheme();

  const MENU_OPTIONS = [
    { key: "Profile",       label: "Mon Profil",      icon: "globe", desc: "Voir tes statistiques", color: theme.success },
    { key: "CompanionChat", label: "Chat Compagnons", icon: "chat", desc: "Discute avec tes experts IA", color: theme.primary },
    { key: "MultiChat",     label: "Multi-Chat",      icon: "multichat", desc: "Le board complet de l'IA", color: theme.warning },
    { key: "Settings",      label: "Paramètres",      icon: "settings", desc: "Clés API et préférences", color: theme.textSecondary },
    { key: "About",         label: "À propos",        icon: "about", desc: "L'équipe et le manifeste", color: theme.primary },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <GlassCard style={[styles.banner, { backgroundColor: theme.secondaryLight, borderColor: `${theme.secondary}44` }]}>
          <View style={styles.bannerInner}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitle, { color: theme.textPrimary }]}>Studio Viral</Text>
              <Text style={[styles.bannerSub, { color: theme.secondary }]}>Génère. Partage. Viralise.</Text>
            </View>
            <CompanionAvatar companion="arch" size={70} floating showRing={false} />
          </View>
        </GlassCard>

        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>AUTRES OUTILS & RÉGLAGES</Text>

        <View style={styles.grid}>
          {MENU_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => navigate?.(item.key)}
              activeOpacity={0.8}
              style={styles.menuItem}
            >
              <GlassCard style={{ padding: spacing.md, width: "100%", height: "100%" }}>
                <View style={[styles.iconBox, { backgroundColor: `${item.color}18`, borderColor: item.color }]}>
                  <AppIcon name={item.icon} color={item.color} size={22} />
                </View>
                <Text style={[styles.label, { color: theme.textPrimary }]}>{item.label}</Text>
                <Text style={[styles.desc, { color: theme.textSecondary }]}>{item.desc}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Image source={require("../../assets/logo/logo_sans_fond.png")} style={[styles.logo, { tintColor: theme.textMuted }]} resizeMode="contain" />
          <Text style={[styles.version, { color: theme.textMuted }]}>VIRAL STICK v1.0.0</Text>
          <Text style={[styles.copyright, { color: theme.textMuted }]}>KERNEL FORGE — 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.md },
  banner: { marginBottom: spacing.lg, padding: spacing.md, borderWidth: 2 },
  bannerInner: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  bannerTitle: { fontSize: 24, fontWeight: "900" },
  bannerSub: { fontSize: 13, fontWeight: "700" },
  sectionTitle: { fontSize: 11, fontWeight: "800", letterSpacing: 1.5, marginBottom: spacing.md, marginLeft: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  menuItem: { width: "47.5%", height: 160 },
  iconBox: { width: 44, height: 44, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  label: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  desc: { fontSize: 11, lineHeight: 14, fontWeight: "600" },
  footer: { marginTop: spacing.xxl, alignItems: "center", paddingBottom: 40 },
  logo: { width: 50, height: 50, opacity: 0.25, marginBottom: 10 },
  version: { fontSize: 12, fontWeight: "800" },
  copyright: { fontSize: 10, marginTop: 4 },
});

export default MenuScreen;

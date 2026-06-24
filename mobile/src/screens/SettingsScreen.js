import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, TouchableOpacity, TextInput, Alert, StatusBar, ActivityIndicator } from "react-native";
import axios from "axios";
import { spacing, radius } from "../theme";
import { rs, wp } from "../theme/responsive";
import { colors } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";
import { apiUrl } from "../config/api";

const PROVIDERS = [
  { key: "gemini",   label: "Gemini",   emoji: "💎", color: "#7C3AED", desc: "Provider principal — texte et image." },
  { key: "mistral",  label: "Mistral",  emoji: "🌊", color: "#06B6D4", desc: "Fallback texte — garantit la génération." },
  { key: "deepseek", label: "DeepSeek", emoji: "🔍", color: colors.duoGreen, desc: "Deuxième fallback texte." },
];

const SettingsScreen = ({ navigate }) => {
  const [gemini, setGemini]     = useState("");
  const [mistral, setMistral]   = useState("");
  const [deepseek, setDeepseek] = useState("");
  const [show, setShow]         = useState(false);
  const [status, setStatus]     = useState("");
  const [testing, setTesting]   = useState(false);
  const anim                    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
  }, [anim]);

  const testConnection = async () => {
    setTesting(true);
    setStatus("");
    try {
      const url = apiUrl("/health");
      const res = await axios.get(url, { timeout: 5000 });
      if (res.status === 200) {
        setStatus("✅ Connexion établie avec le backend Vercel.");
      } else {
        setStatus("⚠️ Le serveur a répondu avec un statut inattendu.");
      }
    } catch (err) {
      console.log("Error testing connection:", err);
      setStatus("❌ Impossible de joindre le backend. Vérifie ta connexion internet.");
    } finally {
      setTesting(false);
    }
  };

  const save = () => {
    if (!gemini.trim() && !mistral.trim() && !deepseek.trim()) {
      Alert.alert("Viral Stick", "Entre au moins une clé API avant d'enregistrer."); return;
    }
    setStatus("✅ Clés enregistrées pour cette session.");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [-20,0] }) }] }}>

          {/* Hero */}
          <GlassCard animate style={styles.hero}>
            <View style={styles.badge}><Text style={styles.badgeText}>PARAMÈTRES IA</Text></View>
            <Text style={styles.title}>Configu<Text style={{ color: colors.para }}>ration</Text></Text>
            <Text style={styles.sub}>Gère les clés API pour activer les moteurs d'intelligence artificielle.</Text>
            <View style={{ alignItems: "center", marginTop: spacing.md }}>
              <CompanionAvatar companion="para" size={88} floating message="Je garde les réglages clairs et prêts pour l'exploitation." />
            </View>
          </GlassCard>

          {/* Providers actifs */}
          <GlassCard animate delay={100} style={styles.card}>
            <Text style={styles.sectionTitle}>🧠 Providers actifs</Text>
            {PROVIDERS.map((p) => (
              <View key={p.key} style={[styles.providerRow, { backgroundColor: `${p.color}10`, borderColor: `${p.color}33` }]}>
                <View style={[styles.providerDot, { backgroundColor: p.color }]} />
                <Text style={styles.providerEmoji}>{p.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.providerName}>{p.label}</Text>
                  <Text style={styles.providerDesc}>{p.desc}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          {/* Clés API */}
          <GlassCard animate delay={200} style={styles.card}>
            <View style={styles.keyHeader}>
              <Text style={styles.sectionTitle}>🔑 Clés API</Text>
              <TouchableOpacity
                onPress={() => setShow((v) => !v)}
                style={styles.toggleBtn}
              >
                <Text style={styles.toggleText}>{show ? "🙈 Masquer" : "👁️ Afficher"}</Text>
              </TouchableOpacity>
            </View>

            {[
              ["Gemini API Key", gemini, setGemini, "AIza..."],
              ["Mistral API Key", mistral, setMistral, "mistral-..."],
              ["DeepSeek API Key", deepseek, setDeepseek, "sk-..."],
            ].map(([label, value, setter, ph]) => (
              <View key={label} style={{ marginBottom: 16 }}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <TextInput
                  style={styles.input} value={value} onChangeText={setter}
                  placeholder={ph} placeholderTextColor={colors.silver}
                  secureTextEntry={!show} autoCapitalize="none" autoCorrect={false}
                />
              </View>
            ))}

            <View style={styles.actions}>
              <AnimatedButton title="Enregistrer les clés" onPress={save} size="lg" style={{ flex: 1 }} />
              <TouchableOpacity
                style={[styles.testBtn, { borderColor: testing ? colors.silver : colors.duoGreen }]}
                onPress={testConnection}
                disabled={testing}
              >
                {testing ? <ActivityIndicator size="small" color={colors.silver} /> : <Text style={styles.testBtnText}>Tester Connexion</Text>}
              </TouchableOpacity>
            </View>

            {!!status && (
              <View style={[styles.statusBox, { backgroundColor: status.startsWith("✅") ? colors.duoGreenLight : "#fee2e2", borderColor: status.startsWith("✅") ? `${colors.duoGreen}44` : "#fecaca" }]}>
                <Text style={[styles.statusText, { color: status.startsWith("✅") ? colors.duoGreenDark : "#b91c1c" }]}>{status}</Text>
              </View>
            )}
          </GlassCard>

          {/* Lien à propos */}
          <GlassCard animate delay={300} style={styles.card}>
            <TouchableOpacity onPress={() => navigate?.("About")} activeOpacity={0.8} style={styles.aboutRow}>
              <View>
                <Text style={styles.aboutLabel}>ℹ️ À propos du produit</Text>
                <Text style={styles.aboutDesc}>Identité, stack, équipe et vision.</Text>
              </View>
              <Text style={[styles.arrow, { color: colors.skyBlue }]}>›</Text>
            </TouchableOpacity>
          </GlassCard>

          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: "#ffffff" },
  scroll:      { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  hero:        { padding: spacing.lg, marginBottom: spacing.md },
  badge:       { backgroundColor: colors.duoGreenLight, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start", marginBottom: 10 },
  badgeText:   { fontSize: rs(10), fontWeight: "800", color: colors.duoGreenDark, letterSpacing: 1 },
  title:       { fontSize: rs(32), fontWeight: "900", color: colors.almostBlack, letterSpacing: -0.5 },
  sub:         { fontSize: rs(14), color: colors.graphite, marginTop: 6, lineHeight: rs(20) },
  card:        { marginBottom: spacing.md },
  sectionTitle:{ fontSize: rs(18), fontWeight: "800", color: colors.almostBlack, marginBottom: spacing.md },
  providerRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: radius.md, borderWidth: 2, marginBottom: 8 },
  providerDot: { width: 10, height: 10, borderRadius: 5 },
  providerEmoji:{ fontSize: rs(18) },
  providerName:{ fontSize: rs(15), fontWeight: "800", color: colors.almostBlack },
  providerDesc:{ fontSize: rs(12), color: colors.silver, marginTop: 2, lineHeight: rs(16) },
  keyHeader:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  toggleBtn:   { borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: colors.bgSecondary },
  toggleText:  { fontSize: rs(13), fontWeight: "700", color: colors.charcoal },
  fieldLabel:  { fontSize: rs(14), fontWeight: "800", color: colors.charcoal, marginBottom: 8 },
  input:       { borderWidth: 2, borderColor: colors.cloudGray, borderRadius: radius.md, padding: spacing.md, fontSize: rs(14), color: colors.almostBlack, backgroundColor: colors.bgSecondary },
  actions:     { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  testBtn:     { flex: 1, borderWidth: 2, borderRadius: radius.md, justifyContent: "center", alignItems: "center", backgroundColor: colors.bgSecondary },
  testBtnText: { fontSize: rs(14), fontWeight: "800", color: colors.charcoal },
  statusBox:   { borderWidth: 2, borderRadius: radius.md, padding: 12, marginTop: spacing.md },
  statusText:  { fontSize: rs(14), fontWeight: "700", lineHeight: rs(19) },
  aboutRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  aboutLabel:  { fontSize: rs(16), fontWeight: "800", color: colors.almostBlack },
  aboutDesc:   { fontSize: rs(13), color: colors.silver, marginTop: 4 },
  arrow:       { fontSize: rs(28), fontWeight: "300" },
});

export default SettingsScreen;

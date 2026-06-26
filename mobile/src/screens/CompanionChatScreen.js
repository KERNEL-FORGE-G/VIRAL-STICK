
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, Animated, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image, ActivityIndicator, StatusBar } from "react-native";
import axios from "axios";
import { spacing, radius } from "../theme";
import { colors } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import { COMPANIONS, COMPANION_NAMES } from "../components/CompanionAvatar";
import { apiUrl } from "../config/api";

const LIST = [
  { id: "arch", role: "Direction produit" },
  { id: "data", role: "Support & structure" },
  { id: "para", role: "Réglages & onboarding" },
  { id: "secu", role: "Sécurité & vigilance" },
  { id: "bio",  role: "Énergie visuelle" },
  { id: "ubu",  role: "Humour & imprévu" },
  { id: "art",  role: "Direction artistique" },
];

const FALLBACK = {
  arch: ["Décision nette : on peut améliorer ça.", "Le produit gagne quand le message est clair."],
  data: ["Je reformule : distingue le problème, puis l'action.", "On peut rendre ça lisible immédiatement."],
  para: ["Je te propose l'option la plus simple.", "On peut fluidifier ce parcours."],
  secu: ["Je vois un point de vigilance à traiter.", "Mieux vaut verrouiller l'essentiel maintenant."],
  bio:  ["Il manque un peu de relief, mais la base est là.", "On peut injecter plus de rythme visuel."],
  ubu:  ["Il y a clairement une chute à sortir de ça.", "Avec un angle plus nerveux, ça part."],
  art:  ["La composition mentale est là, mais il faut plus de contraste.", "Je veux une image plus nette."],
};

const fmt = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const Bubble = ({ msg, accentColor }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }).start();
  }, [anim]);
  const isUser = msg.sender === "user";
  return (
    <Animated.View style={[styles.bubbleRow, isUser ? styles.right : styles.left, { opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0,1], outputRange: [0.9,1] }) }] }]}>
      {!isUser && (
        <Image source={COMPANIONS[msg.companion]} style={[styles.bubbleAvatar, { borderColor: accentColor }]} resizeMode="contain" />
      )}
      <View style={[styles.bubble, {
        backgroundColor: isUser ? colors.duoGreen : "#ffffff",
        borderColor: isUser ? colors.duoGreen : colors.cloudGray,
        borderWidth: 2,
        shadowColor: isUser ? colors.duoGreenDark : "#aaa",
        shadowOffset: { width: 0, height: isUser ? 3 : 2 },
        shadowOpacity: 0.3, shadowRadius: 0, elevation: 3,
      }]}>
        {!isUser && (
          <Text style={[styles.compName, { color: accentColor }]}>{COMPANION_NAMES[msg.companion]}</Text>
        )}
        <Text style={styles.bubbleText}>{msg.text}</Text>
        <Text style={styles.bubbleTime}>{msg.time}</Text>
      </View>
    </Animated.View>
  );
};

const CompanionChatScreen = () => {
  const [active, setActive] = useState("arch");
  const [messages, setMessages] = useState([]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const flatRef             = useRef(null);

  useEffect(() => {
    setMessages([]); setLoading(true);
    axios.post(apiUrl("/api/memes/chat/greeting"), { companionId: active })
      .then((r) => setMessages([{ id: `g-${active}`, text: r.data.reply, sender: active, companion: active, time: fmt() }]))
      .catch(() => setMessages([{ id: `g-${active}`, text: "Bonjour ! Je suis prêt.", sender: active, companion: active, time: fmt() }]))
      .finally(() => setLoading(false));
  }, [active]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setMessages((p) => [...p, { id: Date.now().toString(), text: txt, sender: "user", companion: active, time: fmt() }]);
    setInput(""); setLoading(true);
    try {
      const r = await axios.post(apiUrl("/api/memes/chat"), { companionId: active, message: txt });
      setMessages((p) => [...p, { id: `${Date.now()}-r`, text: r.data.reply, sender: active, companion: active, time: fmt() }]);
    } catch {
      const f = FALLBACK[active] || ["Réessaie dans un instant."];
      setMessages((p) => [...p, { id: `${Date.now()}-f`, text: f[Math.floor(Math.random() * f.length)], sender: active, companion: active, time: fmt() }]);
    } finally {
      setLoading(false);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const accent = colors[active] || colors.duoGreen;
  const info   = LIST.find((c) => c.id === active);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.page}>
        {/* Sélecteur compagnons */}
        <View style={styles.selectorWrap}>
          <FlatList
            data={LIST} horizontal keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: spacing.md, paddingBottom: 4 }}
            renderItem={({ item }) => {
              const isA = item.id === active;
              const col = colors[item.id] || colors.duoGreen;
              return (
                <TouchableOpacity
                  onPress={() => setActive(item.id)}
                  style={[styles.selectorItem, { borderColor: isA ? col : colors.cloudGray, backgroundColor: isA ? `${col}18` : "#ffffff", shadowColor: isA ? col : "#aaa", shadowOffset: { width: 0, height: isA ? 3 : 2 }, shadowOpacity: 0.3, shadowRadius: 0, elevation: isA ? 3 : 2 }]}
                >
                  <Image source={COMPANIONS[item.id]} style={styles.selectorAvatar} resizeMode="contain" />
                  <Text style={styles.selectorName}>{COMPANION_NAMES[item.id]}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Header compagnon actif */}
        <View style={[styles.chatHeader, { borderBottomColor: `${accent}44`, backgroundColor: `${accent}0d` }]}>
          <Image source={COMPANIONS[active]} style={[styles.headerAvatar, { borderColor: accent }]} resizeMode="contain" />
          <View>
            <Text style={[styles.headerName, { color: accent }]}>{COMPANION_NAMES[active]}</Text>
            <Text style={styles.headerRole}>{info?.role}</Text>
          </View>
          <View style={[styles.onlineBadge, { backgroundColor: colors.duoGreenLight }]}>
            <View style={[styles.onlineDot, { backgroundColor: colors.duoGreen }]} />
            <Text style={styles.onlineText}>En ligne</Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatRef} data={messages} keyExtractor={(m) => m.id}
          renderItem={({ item }) => <Bubble msg={item} accentColor={accent} />}
          contentContainerStyle={{ padding: spacing.md, gap: 12 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={loading ? (
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color={accent} />
              <Text style={[styles.loadingText, { color: accent }]}>{COMPANION_NAMES[active]} répond...</Text>
            </View>
          ) : null}
        />
      </View>

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input} value={input} onChangeText={setInput}
            placeholder={`Écrire à ${COMPANION_NAMES[active]}…`}
            placeholderTextColor={colors.silver}
            onSubmitEditing={send} returnKeyType="send" editable={!loading}
          />
          <TouchableOpacity
            onPress={send} disabled={loading}
            style={[styles.sendBtn, { backgroundColor: loading ? colors.cloudGray : colors.duoGreen, shadowColor: colors.duoGreenDark, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 0, elevation: 3 }]}
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.sendIcon}>➤</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: "#ffffff" },
  page:         { flex: 1, paddingTop: 0 },
  selectorWrap: { paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: colors.cloudGray },
  selectorItem: { width: 80, borderWidth: 2, borderRadius: radius.md, paddingVertical: 10, paddingHorizontal: 6, alignItems: "center", gap: 6 },
  selectorAvatar:{ width: 40, height: 40 },
  selectorName: { fontSize: 11, fontWeight: "800" },
  chatHeader:   { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: 12, borderBottomWidth: 2 },
  headerAvatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2 },
  headerName:   { fontSize: 17, fontWeight: "900" },
  headerRole:   { fontSize: 12, color: colors.silver, fontWeight: "600", marginTop: 2 },
  onlineBadge:  { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  onlineDot:    { width: 7, height: 7, borderRadius: 3.5 },
  onlineText:   { fontSize: 11, fontWeight: "800", color: colors.duoGreenDark },
  bubbleRow:    { flexDirection: "row", alignItems: "flex-end", marginBottom: 2 },
  left:         { justifyContent: "flex-start" },
  right:        { justifyContent: "flex-end" },
  bubbleAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, marginRight: 8 },
  bubble:       { maxWidth: "80%", borderRadius: 16, padding: 12 },
  compName:     { fontSize: 11, fontWeight: "900", marginBottom: 5, letterSpacing: 0.5 },
  bubbleText:   { fontSize: 14, lineHeight: 20, fontWeight: "600" },
  bubbleTime:   { fontSize: 10, fontWeight: "700", marginTop: 6 },
  loadingBubble:{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, paddingHorizontal: spacing.md },
  loadingText:  { fontSize: 13, fontWeight: "700" },
  inputBar:     { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingVertical: 10, borderTopWidth: 2, borderTopColor: colors.cloudGray, gap: 10, backgroundColor: "#ffffff" },
  input:        { flex: 1, borderWidth: 2, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 11, fontSize: 14, color: colors.almostBlack, borderColor: colors.cloudGray, backgroundColor: colors.bgSecondary },
  sendBtn:      { width: 46, height: 46, borderRadius: 23, justifyContent: "center", alignItems: "center" },
  sendIcon:     { color: "#fff", fontSize: 16, fontWeight: "900" },
});

export default CompanionChatScreen;

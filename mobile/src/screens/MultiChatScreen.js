import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useTheme, spacing, radius, typography, createShadow } from "../theme";
import GlassCard from "../components/GlassCard";
import { COMPANIONS, COMPANION_NAMES } from "../components/CompanionAvatar";

const API_BASE = "https://viral-stick.vercel.app";

const COMPANION_COLORS = {
  arch: "#3B82F6",
  para: "#22C55E",
  secu: "#EF4444",
  data: "#F59E0B",
  bio: "#A855F7",
  ubu: "#84CC16",
  art: "#FB923C",
};

const ALL_COMPANIONS = [
  { id: "arch", name: "Archlord", role: "Cap produit" },
  { id: "data", name: "Data", role: "Analyse" },
  { id: "para", name: "Para", role: "Clarté UX" },
  { id: "secu", name: "Secu", role: "Risque" },
  { id: "bio", name: "Bio", role: "Énergie" },
  { id: "ubu", name: "Ubu", role: "Chute" },
  { id: "art", name: "Art", role: "Visuel" },
];

const MultiChatBubble = ({ msg, theme }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const isUser = msg.sender === "user";
  const companionColor = COMPANION_COLORS[msg.companion] || theme.primary;

  return (
    <Animated.View
      style={[
        styles.bubbleRow,
        isUser ? styles.bubbleRight : styles.bubbleLeft,
        {
          opacity: anim,
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.92, 1],
              }),
            },
          ],
        },
      ]}
    >
      {!isUser && (
        <Image
          source={COMPANIONS[msg.companion]}
          style={[styles.bubbleAvatar, { borderColor: companionColor }]}
          resizeMode="contain"
        />
      )}
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser
              ? `${theme.primary}D9`
              : theme.backgroundCard,
            borderColor: isUser ? "transparent" : `${companionColor}99`,
            borderWidth: isUser ? 0 : 1,
          },
        ]}
      >
        {!isUser && (
          <Text style={[styles.companionName, { color: companionColor }]}>
            {COMPANION_NAMES[msg.companion]}
          </Text>
        )}
        <Text
          style={[
            styles.bubbleText,
            { color: isUser ? "#fff" : theme.textPrimary },
          ]}
        >
          {msg.text}
        </Text>
        <Text
          style={[
            styles.bubbleTime,
            { color: isUser ? "rgba(255,255,255,0.68)" : theme.textMuted },
          ]}
        >
          {msg.time}
        </Text>
      </View>
    </Animated.View>
  );
};

const CompanionStatus = ({ companion, status, theme }) => {
  const color = COMPANION_COLORS[companion.id] || theme.primary;
  const statusColor =
    status === "loading"
      ? "#FCD34D"
      : status === "done"
        ? "#34D399"
        : status === "error"
          ? "#F87171"
          : theme.textMuted;
  const statusLabel =
    status === "loading"
      ? "répond"
      : status === "done"
        ? "ok"
        : status === "error"
          ? "off"
          : "idle";

  return (
    <View
      style={[
        styles.statusItem,
        { borderColor: `${color}35`, backgroundColor: `${color}12` },
      ]}
    >
      <Image
        source={COMPANIONS[companion.id]}
        style={[styles.statusAvatar, { borderColor: color }]}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.statusName, { color }]}>{companion.name}</Text>
        <Text style={[styles.statusRole, { color: theme.textMuted }]}>
          {companion.role}
        </Text>
      </View>
      <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      <Text style={[styles.statusLabel, { color: statusColor }]}>
        {statusLabel}
      </Text>
    </View>
  );
};

const MultiChatScreen = ({ navigate }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [companionStatuses, setCompanionStatuses] = useState(
    Object.fromEntries(ALL_COMPANIONS.map((c) => [c.id, "idle"])),
  );
  const flatRef = useRef(null);

  useEffect(() => {
    loadGreetings();
  }, []);

  const loadGreetings = async () => {
    setLoading(true);
    const greets = [];
    const statuses = { ...companionStatuses };

    await Promise.all(
      ALL_COMPANIONS.map(async (c) => {
        statuses[c.id] = "loading";
        setCompanionStatuses({ ...statuses });
        try {
          const res = await axios.post(`${API_BASE}/api/memes/chat/greeting`, {
            companionId: c.id,
          });
          greets.push({
            id: `g-${c.id}`,
            text: res.data.reply,
            sender: c.id,
            companion: c.id,
            time: "maintenant",
          });
          statuses[c.id] = "done";
        } catch {
          greets.push({
            id: `g-${c.id}`,
            text: `${c.name} est prêt à intervenir.`,
            sender: c.id,
            companion: c.id,
            time: "maintenant",
          });
          statuses[c.id] = "done";
        }
        setCompanionStatuses({ ...statuses });
      }),
    );

    greets.sort(
      (a, b) =>
        ALL_COMPANIONS.findIndex((c) => c.id === a.companion) -
        ALL_COMPANIONS.findIndex((c) => c.id === b.companion),
    );
    setMessages(greets);
    setLoading(false);
  };

  const sendToAll = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input.trim();
    const now = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: currentInput,
        sender: "user",
        companion: "user",
        time: now,
      },
    ]);
    setLoading(true);

    const statuses = { ...companionStatuses };
    const replies = [];

    await Promise.all(
      ALL_COMPANIONS.map(async (c) => {
        statuses[c.id] = "loading";
        setCompanionStatuses({ ...statuses });
        try {
          const res = await axios.post(`${API_BASE}/api/memes/chat`, {
            companionId: c.id,
            message: currentInput,
          });
          replies.push({
            id: `${Date.now()}-${c.id}`,
            text: res.data.reply,
            sender: c.id,
            companion: c.id,
            time: new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
          statuses[c.id] = "done";
        } catch {
          replies.push({
            id: `${Date.now()}-${c.id}`,
            text: `${c.name} n'a pas pu répondre pour l'instant.`,
            sender: c.id,
            companion: c.id,
            time: "maintenant",
          });
          statuses[c.id] = "error";
        }
        setCompanionStatuses({ ...statuses });
      }),
    );

    replies.sort(
      (a, b) =>
        ALL_COMPANIONS.findIndex((c) => c.id === a.companion) -
        ALL_COMPANIONS.findIndex((c) => c.id === b.companion),
    );
    setMessages((prev) => [...prev, ...replies]);
    setLoading(false);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.page}>
        <GlassCard style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.kicker, { color: theme.textMuted }]}>
                MULTI COMPANION BOARD
              </Text>
              <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
                Les{" "}
                <Text style={{ color: theme.primaryLight }}>7 compagnons</Text>{" "}
                à la fois
              </Text>
              <Text
                style={[styles.heroSubtitle, { color: theme.textSecondary }]}
              >
                Une seule question, plusieurs angles : produit, risque, style,
                humour, clarté et direction visuelle.
              </Text>
            </View>
            <View style={styles.heroLogo}>
              <Image
                source={require("../../assets/logo/logo_sans_fond.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
        </GlassCard>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MultiChatBubble msg={item} theme={theme} />
          )}
          ref={flatRef}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatRef.current?.scrollToEnd({ animated: true })
          }
          ListHeaderComponent={
            <>
              <View style={styles.statusGrid}>
                {ALL_COMPANIONS.map((c) => (
                  <CompanionStatus
                    key={c.id}
                    companion={c}
                    status={companionStatuses[c.id] || "idle"}
                    theme={theme}
                  />
                ))}
              </View>
              <Text style={[styles.boardHint, { color: theme.textMuted }]}>
                Conseil : pose une vraie question produit, créative ou technique
                pour obtenir des réponses vraiment différentes.
              </Text>
            </>
          }
          ListFooterComponent={
            loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={theme.primary} size="small" />
                <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                  Le board consolide les réponses…
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: theme.backgroundCard,
              borderTopColor: theme.divider,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                color: theme.textPrimary,
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
            value={input}
            onChangeText={setInput}
            placeholder="Pose une question à tout le board..."
            placeholderTextColor={theme.textMuted}
            onSubmitEditing={sendToAll}
            returnKeyType="send"
            editable={!loading}
          />
          <TouchableOpacity
            onPress={sendToAll}
            disabled={loading}
            style={[
              styles.sendBtn,
              {
                backgroundColor: loading ? theme.divider : theme.primary,
                ...createShadow(theme.primary, 10),
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendIcon}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  page: { flex: 1, paddingTop: 70, paddingHorizontal: spacing.md },
  heroCard: { marginBottom: spacing.md },
  heroTop: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  kicker: {
    fontSize: typography.fontSize.xs,
    fontWeight: "800",
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: typography.fontSize.sm,
    lineHeight: 21,
  },
  heroLogo: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 104, height: 104 },
  statusGrid: { gap: spacing.sm, marginBottom: spacing.md },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  statusAvatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 1 },
  statusName: { fontSize: typography.fontSize.sm, fontWeight: "900" },
  statusRole: { fontSize: typography.fontSize.xs, marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
  boardHint: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  chatContent: { paddingBottom: spacing.md },
  bubbleRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    alignItems: "flex-end",
  },
  bubbleLeft: { justifyContent: "flex-start" },
  bubbleRight: { justifyContent: "flex-end" },
  bubbleAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
  },
  bubble: { maxWidth: "82%", borderRadius: radius.md, padding: spacing.md },
  companionName: {
    fontSize: typography.fontSize.xs,
    fontWeight: "900",
    marginBottom: 6,
    letterSpacing: 0.6,
  },
  bubbleText: { fontSize: typography.fontSize.sm, lineHeight: 20 },
  bubbleTime: { marginTop: 8, fontSize: 11, fontWeight: "700" },
  loadingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  loadingText: { fontSize: typography.fontSize.xs },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: typography.fontSize.sm,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: { color: "#fff", fontSize: 18, fontWeight: "900" },
});

export default MultiChatScreen;

import React, { useState, useRef, useEffect } from "react";
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
import { COMPANIONS, COMPANION_NAMES } from "../components/CompanionAvatar";

const API_BASE = "https://viral-stick.vercel.app";

const COMPANION_COLORS = {
  arch: "#0081c0",
  para: "#4CAF50",
  secu: "#F44336",
  data: "#FF9800",
  bio: "#9C27B0",
  ubu: "#8BC34A",
  art: "#FF5722",
};

const ALL_COMPANIONS = [
  { id: "arch", name: "Archlord", color: COMPANION_COLORS.arch },
  { id: "data", name: "Data", color: COMPANION_COLORS.data },
  { id: "para", name: "Para", color: COMPANION_COLORS.para },
  { id: "secu", name: "Secu", color: COMPANION_COLORS.secu },
  { id: "bio", name: "Bio", color: COMPANION_COLORS.bio },
  { id: "ubu", name: "Ubu", color: COMPANION_COLORS.ubu },
  { id: "art", name: "Art", color: COMPANION_COLORS.art },
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
  }, []);

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
                outputRange: [0.8, 1],
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
              ? `${theme.primary}CC`
              : theme.backgroundCard,
            borderColor: isUser ? "transparent" : companionColor,
            alignSelf: isUser ? "flex-end" : "flex-start",
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
            { color: isUser ? "rgba(255,255,255,0.6)" : theme.textMuted },
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
  const statusColors = {
    loading: "#FCD34D",
    done: "#34D399",
    error: "#F87171",
    idle: theme.textMuted,
  };
  const statusText = {
    loading: "réfléchit...",
    done: "prêt",
    error: "erreur",
    idle: "en attente",
  };

  return (
    <View
      style={[
        styles.statusItem,
        { borderColor: `${color}40`, backgroundColor: `${color}15` },
      ]}
    >
      <Image
        source={COMPANIONS[companion.id]}
        style={[styles.statusAvatar, { borderColor: color }]}
        resizeMode="contain"
      />
      <View style={styles.statusInfo}>
        <Text style={[styles.statusName, { color }]}>{companion.name}</Text>
        <Text style={[styles.statusLabel, { color: statusColors[status] }]}>
          {status === "loading" && (
            <ActivityIndicator size="small" color={statusColors.loading} />
          )}{" "}
          {statusText[status]}
        </Text>
      </View>
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
    const newStatuses = { ...companionStatuses };

    await Promise.all(
      ALL_COMPANIONS.map(async (c) => {
        newStatuses[c.id] = "loading";
        setCompanionStatuses({ ...newStatuses });
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
          newStatuses[c.id] = "done";
        } catch {
          const fallbacks = {
            arch: "Bienvenue dans Viral Stick. Je suis Archlord.",
            data: "Salut ! Data ici, prêt à t'aider.",
            para: "Hey ! Para à ta disposition.",
            secu: "Sécurité activée. Tout est sous contrôle.",
            bio: "Yooo ! Bio en ligne !",
            ubu: "Ubu débarque !",
            art: "Art est là pour créer !",
          };
          greets.push({
            id: `g-${c.id}`,
            text: fallbacks[c.id] || "Bonjour !",
            sender: c.id,
            companion: c.id,
            time: "maintenant",
          });
          newStatuses[c.id] = "done";
        }
      }),
    );

    greets.sort(
      (a, b) =>
        ALL_COMPANIONS.findIndex((c) => c.id === a.companion) -
        ALL_COMPANIONS.findIndex((c) => c.id === b.companion),
    );
    setMessages(greets);
    setCompanionStatuses(newStatuses);
    setLoading(false);
  };

  const sendToAll = async () => {
    if (!input.trim() || loading) return;

    const now = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMsg = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      companion: "user",
      time: now,
    };
    const currentInput = input;
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const newStatuses = { ...companionStatuses };
    const replies = [];

    await Promise.all(
      ALL_COMPANIONS.map(async (c) => {
        newStatuses[c.id] = "loading";
        setCompanionStatuses({ ...newStatuses });
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
          newStatuses[c.id] = "done";
        } catch {
          replies.push({
            id: `${Date.now()}-${c.id}`,
            text: "...",
            sender: c.id,
            companion: c.id,
            time: "maintenant",
          });
          newStatuses[c.id] = "error";
        }
        setCompanionStatuses({ ...newStatuses });
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
      <View style={[styles.header, { borderBottomColor: theme.divider }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          💬 Multi-Chat
        </Text>
        <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
          Tous les 7 compagnons à la fois
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MultiChatBubble msg={item} theme={theme} />}
        contentContainerStyle={styles.chatContent}
        ref={flatRef}
        onContentSizeChange={() =>
          flatRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View
            style={[styles.statusBar, { borderBottomColor: theme.divider }]}
          >
            {ALL_COMPANIONS.map((c) => (
              <CompanionStatus
                key={c.id}
                companion={c}
                status={companionStatuses[c.id] || "idle"}
                theme={theme}
              />
            ))}
          </View>
        }
        ListFooterComponent={
          loading && (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                Les compagnons réfléchissent...
              </Text>
            </View>
          )
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <View
          style={[
            styles.inputRow,
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
            placeholder="Message à tous les compagnons..."
            placeholderTextColor={theme.textMuted}
            onSubmitEditing={sendToAll}
            returnKeyType="send"
            editable={!loading}
          />
          <TouchableOpacity
            onPress={sendToAll}
            style={[
              styles.sendBtn,
              {
                backgroundColor: loading ? theme.divider : theme.primary,
                ...createShadow(theme.primary, 8),
              },
            ]}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendIcon}>▶</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: 60,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: typography.fontSize.xl, fontWeight: "800" },
  headerSub: {
    fontSize: typography.fontSize.xs,
    fontWeight: "500",
    marginTop: 2,
  },
  chatContent: { padding: spacing.md, gap: spacing.sm },
  statusBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    paddingBottom: spacing.md,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  statusAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 1 },
  statusInfo: { gap: 1 },
  statusName: { fontSize: 10, fontWeight: "700" },
  statusLabel: { fontSize: 9, fontWeight: "500" },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginVertical: 3,
  },
  bubbleLeft: { justifyContent: "flex-start" },
  bubbleRight: { justifyContent: "flex-end" },
  bubbleAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5 },
  bubble: {
    maxWidth: "78%",
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  companionName: {
    fontSize: typography.fontSize.xs,
    fontWeight: "700",
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  bubbleText: { fontSize: typography.fontSize.sm, lineHeight: 20 },
  bubbleTime: { fontSize: 10, marginTop: 4, textAlign: "right" },
  loadingContainer: { padding: spacing.lg, alignItems: "center" },
  loadingText: { fontSize: typography.fontSize.sm, fontStyle: "italic" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.full,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.sm,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: { color: "#fff", fontSize: 14, fontWeight: "700" },
});

export default MultiChatScreen;

/**
 * CompanionChatScreen — Interactive chat with AI companions
 * Viral Stick | KERNEL FORGE — 2026
 *
 * Companion system: arch (admin), data (support), para (settings guide),
 *   secu (security), bio/ubu/art (creative trio)
 */

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

const COMPANION_LIST = [
  { id: "arch", role: "PDG & Admin système" },
  { id: "data", role: "Support & Données" },
  { id: "para", role: "Paramètres & Guide" },
  { id: "secu", role: "Sécurité" },
  { id: "bio", role: "Artiste Créatif" },
  { id: "ubu", role: "Artiste Comique" },
  { id: "art", role: "Artiste Visuel" },
];

// Pre-seeded conversation starters per companion
const GREETINGS = {
  arch: [
    "Bienvenue dans Viral Stick. Je suis Archlord, PDG de cette opération. 👑",
    "Que puis-je faire pour toi ?",
  ],
  data: [
    "Salut ! Je suis Data 📊, ton assistant support.",
    "Tu as une question sur l'app ? Je suis là !",
  ],
  para: [
    "Hey ! Para ici ⚙️",
    "Je m'occupe de tout ce qui est paramètres. Tu as besoin d'aide pour configurer quelque chose ?",
  ],
  secu: [
    "Système de sécurité activé 🔒",
    "Je surveille que tout va bien. Aucune anomalie détectée.",
  ],
  bio: ["Yooo ! Bio en ligne 🌿🎉", "Prêt à créer des trucs stylés ensemble ?"],
  ubu: [
    "Ubu arrive ! 🤖💥",
    "Tu as des blagues à transformer en mèmes ? Je suis ton gars !",
  ],
  art: [
    "Art ici 🎨✨",
    "Chaque contenu est une œuvre d'art. Dis-moi ton idée !",
  ],
};

const AUTO_REPLIES = {
  arch: [
    "Ordre exécuté. 👁️‍🗨️",
    "Comme je te le disais, cette app est un chef-d'œuvre. 🏆",
    "Parle à Data si tu as besoin de support technique.",
    "KERNEL FORGE ne dort jamais. 💪",
  ],
  data: [
    "Voici les infos que j'ai trouvées ! 📊",
    "Je note ça dans mes registres.",
    "Pour les problèmes techniques, je suis ton expert !",
    "Tu peux me confier tes données en toute sécurité.",
  ],
  para: [
    "Pour changer le thème, va dans Paramètres → Apparence.",
    "Tu veux configurer ton API key ? Je t'explique !",
    "Les réglages sont sauvegardés automatiquement.",
  ],
  secu: [
    "Connexion sécurisée confirmée. ✅",
    "Aucune menace détectée. 🛡️",
    "Ton API key est chiffrée et sécurisée.",
    "Sécurité maximale activée. 🔐",
  ],
  bio: [
    "TROP COOL ! 🌿🌟",
    "On fait ça ensemble bro !",
    "La créativité n'a pas de limites ici !",
  ],
  ubu: [
    "MDR 💀",
    "T'es trop drôle !",
    "On va faire un mème là-dessus !",
    "LMAO 🤣",
  ],
  art: [
    "Magnifique idée ! 🎨",
    "Je visualise déjà le résultat !",
    "Art approuve. ✨",
  ],
};

const COMPANION_COLORS = {
  arch: "#0081c0", // Bleu
  para: "#4CAF50", // Vert
  secu: "#F44336", // Rouge
  data: "#FF9800", // Jaune/Orange
  bio: "#9C27B0", // Violet/Rose
  ubu: "#8BC34A", // Jaune/Vert
  art: "#FF5722", // Orange/Rouge
};

const ChatBubble = ({ msg, theme }) => {
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

const CompanionChatScreen = ({ navigate }) => {
  const { theme } = useTheme();
  const [activeCompanion, setActiveCompanion] = useState("arch");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatRef = useRef(null);
  const tabAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchGreeting = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE}/api/memes/chat/greeting`, {
          companionId: activeCompanion,
        });
        const initMsg = {
          id: "g0",
          text: res.data.reply,
          sender: activeCompanion,
          companion: activeCompanion,
          time: "maintenant",
        };
        setMessages([initMsg]);
      } catch (err) {
        // Fallback to static if API fails
        const greets = GREETINGS[activeCompanion] || ["Bonjour !"];
        const initMsgs = greets.map((text, i) => ({
          id: `g${i}`,
          text,
          sender: activeCompanion,
          companion: activeCompanion,
          time: "maintenant",
        }));
        setMessages(initMsgs);
      } finally {
        setLoading(false);
      }
    };

    fetchGreeting();
  }, [activeCompanion]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const now = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMsg = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      companion: activeCompanion,
      time: now,
    };

    const currentInput = input;
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Prepare chat history for the AI
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const res = await axios.post(`${API_BASE}/api/memes/chat`, {
        companionId: activeCompanion,
        message: currentInput,
        history: history,
      });

      const reply = {
        id: (Date.now() + 1).toString(),
        text: res.data.reply,
        sender: activeCompanion,
        companion: activeCompanion,
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error("Chat error:", err);
      // Minimal fallback
      const replies = AUTO_REPLIES[activeCompanion];
      const fallbackMsg = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: activeCompanion,
        companion: activeCompanion,
        time: "maintenant",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const switchCompanion = (id) => {
    Animated.sequence([
      Animated.timing(tabAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(tabAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
    setActiveCompanion(id);
  };

  const accentColor = COMPANION_COLORS[activeCompanion] || theme.primary;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.divider }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            💬 Compagnons
          </Text>
          <Text style={[styles.headerSub, { color: accentColor }]}>
            {COMPANION_NAMES[activeCompanion]} —{" "}
            {COMPANION_LIST.find((c) => c.id === activeCompanion)?.role}
          </Text>
        </View>
        <Image
          source={COMPANIONS[activeCompanion]}
          style={[styles.headerAvatar, { borderColor: accentColor }]}
          resizeMode="contain"
        />
      </View>

      {/* Companion selector */}
      <View style={[styles.selector, { borderBottomColor: theme.divider }]}>
        <FlatList
          data={COMPANION_LIST}
          horizontal
          keyExtractor={(c) => c.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorContent}
          renderItem={({ item }) => {
            const active = item.id === activeCompanion;
            const itemColor = COMPANION_COLORS[item.id] || theme.primary;
            return (
              <TouchableOpacity
                onPress={() => switchCompanion(item.id)}
                style={[
                  styles.selectorItem,
                  {
                    borderColor: active ? itemColor : "transparent",
                    backgroundColor: active ? `${itemColor}22` : "transparent",
                  },
                ]}
              >
                <Image
                  source={COMPANIONS[item.id]}
                  style={styles.selectorAvatar}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.selectorName,
                    { color: active ? itemColor : theme.textMuted },
                  ]}
                >
                  {COMPANION_NAMES[item.id]}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Chat messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <ChatBubble msg={item} theme={theme} />}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() =>
          flatRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loading && (
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color={accentColor} />
              <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                {COMPANION_NAMES[activeCompanion]} réfléchit...
              </Text>
            </View>
          )
        }
      />

      {/* Input */}
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
            placeholder={`Message ${COMPANION_NAMES[activeCompanion]}...`}
            placeholderTextColor={theme.textMuted}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            editable={!loading}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[
              styles.sendBtn,
              {
                backgroundColor: loading ? theme.divider : accentColor,
                ...createShadow(accentColor, 8),
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: 60,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: typography.fontSize.xl, fontWeight: "800" },
  headerSub: {
    fontSize: typography.fontSize.xs,
    fontWeight: "600",
    marginTop: 2,
  },
  headerAvatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2 },
  selector: { borderBottomWidth: 1 },
  selectorContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  selectorItem: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    minWidth: 70,
  },
  selectorAvatar: { width: 72, height: 72, borderRadius: 36 },
  selectorName: {
    fontSize: typography.fontSize.xs,
    fontWeight: "600",
    marginTop: 4,
  },
  chatContent: { padding: spacing.md, gap: spacing.sm },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginVertical: 3,
  },
  bubbleLeft: { justifyContent: "flex-start" },
  bubbleRight: { justifyContent: "flex-end" },
  bubbleAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 1.5 },
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
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: spacing.md,
    marginLeft: 40,
  },
  loadingText: {
    fontSize: typography.fontSize.xs,
    fontStyle: "italic",
  },
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

export default CompanionChatScreen;

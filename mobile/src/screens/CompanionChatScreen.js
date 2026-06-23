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

const COMPANION_LIST = [
  { id: "arch", role: "Direction produit" },
  { id: "data", role: "Support & structure" },
  { id: "para", role: "Réglages & onboarding" },
  { id: "secu", role: "Sécurité & vigilance" },
  { id: "bio", role: "Énergie visuelle" },
  { id: "ubu", role: "Humour & imprévu" },
  { id: "art", role: "Direction artistique" },
];

const GREETINGS = {
  arch: [
    "Bienvenue dans le studio Viral Stick.",
    "On va structurer ton idée proprement.",
  ],
  data: ["Data en ligne.", "Je peux clarifier, trier et résoudre."],
  para: [
    "Para ici.",
    "On peut remettre de l'ordre dans les réglages ou le parcours.",
  ],
  secu: [
    "Secu active la veille.",
    "On vérifie que tout tient debout avant d'avancer.",
  ],
  bio: ["Bio en scène.", "On va rendre ton contenu plus vivant."],
  ubu: ["Ubu débarque.", "Si ta demande a du potentiel comique, je le trouve."],
  art: ["Art est prêt.", "Montre-moi l'idée, je juge le rendu."],
};

const AUTO_REPLIES = {
  arch: [
    "Décision nette : on peut améliorer ça sans le compliquer.",
    "Le produit gagne quand le message devient plus clair et plus fort.",
  ],
  data: [
    "Je reformule : il faut distinguer le problème, puis l'action.",
    "On peut rendre ça plus lisible immédiatement.",
  ],
  para: [
    "Je te propose l'option la plus simple d'abord.",
    "On peut fluidifier ce parcours sans perdre en contrôle.",
  ],
  secu: [
    "Je vois surtout un point de vigilance à traiter avant la suite.",
    "Mieux vaut verrouiller l'essentiel maintenant.",
  ],
  bio: [
    "Il manque un peu de relief, mais la base a du potentiel.",
    "On peut injecter plus de rythme visuel dans cette idée.",
  ],
  ubu: [
    "Il y a clairement une chute à sortir de ça.",
    "C'est presque drôle. Avec un angle plus nerveux, ça part.",
  ],
  art: [
    "La composition mentale est là, mais il faut un meilleur contraste.",
    "Je veux une image plus nette et une phrase plus iconique.",
  ],
};

const COMPANION_COLORS = {
  arch: "#3B82F6",
  para: "#22C55E",
  secu: "#EF4444",
  data: "#F59E0B",
  bio: "#A855F7",
  ubu: "#84CC16",
  art: "#FB923C",
};

const PROMPT_SUGGESTIONS = [
  "Aide-moi à améliorer un prompt mème.",
  "Quel compagnon est le meilleur pour un visuel ?",
  "Comment rendre un post plus viral sans le surcharger ?",
];

const ChatBubble = ({ msg, theme }) => {
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
            { color: isUser ? "rgba(255,255,255,0.68)" : theme.textMuted },
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

  useEffect(() => {
    const fetchGreeting = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE}/api/memes/chat/greeting`, {
          companionId: activeCompanion,
        });
        setMessages([
          {
            id: `g-${activeCompanion}`,
            text: res.data.reply,
            sender: activeCompanion,
            companion: activeCompanion,
            time: "maintenant",
          },
        ]);
      } catch {
        const fallback = (GREETINGS[activeCompanion] || ["Bonjour."]).map(
          (text, i) => ({
            id: `${activeCompanion}-${i}`,
            text,
            sender: activeCompanion,
            companion: activeCompanion,
            time: "maintenant",
          }),
        );
        setMessages(fallback);
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

    const currentInput = input.trim();
    const userMsg = {
      id: Date.now().toString(),
      text: currentInput,
      sender: "user",
      companion: activeCompanion,
      time: now,
    };

    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const res = await axios.post(`${API_BASE}/api/memes/chat`, {
        companionId: activeCompanion,
        message: currentInput,
        history,
      });

      const reply = {
        id: `${Date.now()}-reply`,
        text: res.data.reply,
        sender: activeCompanion,
        companion: activeCompanion,
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, reply]);
    } catch {
      const replies = AUTO_REPLIES[activeCompanion] || [
        "Réessaie dans un instant.",
      ];
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-fallback`,
          text: replies[Math.floor(Math.random() * replies.length)],
          sender: activeCompanion,
          companion: activeCompanion,
          time: "maintenant",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const accentColor = COMPANION_COLORS[activeCompanion] || theme.primary;
  const activeRole = COMPANION_LIST.find((c) => c.id === activeCompanion)?.role;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.page}>
        <GlassCard style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.kicker, { color: theme.textMuted }]}>
                COMPANION CONSOLE
              </Text>
              <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
                Chat <Text style={{ color: accentColor }}>compagnon</Text>
              </Text>
              <Text
                style={[styles.heroSubtitle, { color: theme.textSecondary }]}
              >
                Un interlocuteur dédié selon le besoin : produit, sécurité,
                humour, visuel ou structure.
              </Text>
            </View>
            <View style={[styles.heroLogo, { shadowColor: accentColor }]}>
              <Image
                source={require("../../assets/logo/logo_sans_fond.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.activeCompanionRow}>
            <Image
              source={COMPANIONS[activeCompanion]}
              style={[styles.activeAvatar, { borderColor: accentColor }]}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.activeName, { color: accentColor }]}>
                {COMPANION_NAMES[activeCompanion]}
              </Text>
              <Text style={[styles.activeRole, { color: theme.textSecondary }]}>
                {activeRole}
              </Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.selectorWrap}>
          <FlatList
            data={COMPANION_LIST}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectorContent}
            renderItem={({ item }) => {
              const active = item.id === activeCompanion;
              const color = COMPANION_COLORS[item.id] || theme.primary;
              return (
                <TouchableOpacity
                  onPress={() => setActiveCompanion(item.id)}
                  style={[
                    styles.selectorItem,
                    {
                      borderColor: active ? color : theme.border,
                      backgroundColor: active
                        ? `${color}18`
                        : theme.backgroundCard,
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
                      { color: active ? color : theme.textMuted },
                    ]}
                  >
                    {COMPANION_NAMES[item.id]}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.suggestionsRow}>
          {PROMPT_SUGGESTIONS.map((item) => (
            <Text
              key={item}
              style={[
                styles.suggestionChip,
                { color: theme.textSecondary, borderColor: theme.border },
              ]}
              onPress={() => setInput(item)}
            >
              {item}
            </Text>
          ))}
        </View>

        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble msg={item} theme={theme} />}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={
            loading ? (
              <View style={styles.loadingBubble}>
                <ActivityIndicator size="small" color={accentColor} />
                <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                  {COMPANION_NAMES[activeCompanion]} prépare sa réponse…
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
            placeholder={`Écrire à ${COMPANION_NAMES[activeCompanion]}...`}
            placeholderTextColor={theme.textMuted}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            editable={!loading}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={loading}
            style={[
              styles.sendBtn,
              {
                backgroundColor: loading ? theme.divider : accentColor,
                ...createShadow(accentColor, 10),
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
  activeCompanionRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  activeAvatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 1.5 },
  activeName: { fontSize: typography.fontSize.lg, fontWeight: "900" },
  activeRole: { marginTop: 4, fontSize: typography.fontSize.sm },
  selectorWrap: { marginBottom: spacing.sm },
  selectorContent: { gap: spacing.sm, paddingRight: spacing.md },
  selectorItem: {
    width: 92,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 6,
  },
  selectorAvatar: { width: 44, height: 44 },
  selectorName: { fontSize: typography.fontSize.xs, fontWeight: "800" },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  suggestionChip: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: typography.fontSize.xs,
    overflow: "hidden",
  },
  chatContent: { paddingBottom: spacing.md, gap: spacing.sm },
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
  loadingBubble: {
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

export default CompanionChatScreen;

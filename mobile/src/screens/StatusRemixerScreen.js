import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useTheme, spacing, radius, typography, createShadow } from "../theme";
import GlassCard from "../components/GlassCard";
import AnimatedButton from "../components/AnimatedButton";
import CompanionAvatar from "../components/CompanionAvatar";

const API_BASE = "https://viral-stick.vercel.app";

const FILTERS = [
  { id: "none", label: "Original", emoji: "📷" },
  { id: "dramatic", label: "Dramatic", emoji: "🌑" },
  { id: "neon", label: "Neon", emoji: "💫" },
  { id: "vintage", label: "Vintage", emoji: "🎞️" },
  { id: "fire", label: "Fire", emoji: "🔥" },
];

const TEXT_POSITIONS = ["top", "center", "bottom"];

const StatusRemixerScreen = ({ navigate }) => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [overlayText, setOverlayText] = useState("");
  const [textPosition, setTextPosition] = useState("bottom");
  const [imagePicked, setImagePicked] = useState(false);
  const [companionMsg, setCompanionMsg] = useState(
    "Envoie un visuel ou une intention. Je m'occupe de la caption et des finitions qui rendent le post crédible.",
  );
  const [loading, setLoading] = useState(false);
  const [remix, setRemix] = useState(null);
  const previewAnim = useRef(new Animated.Value(0)).current;

  const filterOverlay = useMemo(() => {
    switch (selectedFilter) {
      case "dramatic":
        return "rgba(0,0,0,0.56)";
      case "neon":
        return "rgba(34,211,238,0.22)";
      case "vintage":
        return "rgba(193,132,79,0.24)";
      case "fire":
        return "rgba(239,68,68,0.28)";
      default:
        return "transparent";
    }
  }, [selectedFilter]);

  const simulatePickImage = () => {
    setImagePicked(true);
    setCompanionMsg(
      "Base visuelle chargée. Maintenant on construit une vraie publication, pas juste un autocollant.",
    );
    Animated.spring(previewAnim, {
      toValue: 1,
      tension: 70,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const pickImage = () => {
    Alert.alert("Sélectionner une image", "Choisir depuis :", [
      { text: "📷 Caméra", onPress: simulatePickImage },
      { text: "🖼️ Galerie", onPress: simulatePickImage },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  const askRemix = async () => {
    if (!imagePicked && !overlayText.trim()) {
      Alert.alert(
        "Viral Stick",
        "Charge une image ou décris une idée de caption.",
      );
      return;
    }

    setLoading(true);
    setRemix(null);
    setCompanionMsg(
      "Je cherche une caption plus postable et des ajustements visuels utiles sur mobile.",
    );

    try {
      const res = await axios.post(`${API_BASE}/api/memes/status-remixer`, {
        text:
          overlayText ||
          "Image de réaction expressive à transformer en mème premium",
      });
      setRemix(res.data);
      if (res.data?.meme_text) {
        setOverlayText(res.data.meme_text);
      }
      setCompanionMsg(
        res.data?.companionComment ||
          "Remix prêt. Le texte et l'édition visuelle sont maintenant alignés.",
      );
    } catch (e) {
      setCompanionMsg(
        "Le remix IA n'a pas répondu. Le studio local reste utilisable pour maqueter.",
      );
      Alert.alert("Erreur", "Impossible d'obtenir un remix IA pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  const exportSticker = () => {
    setCompanionMsg(
      "Le concept visuel est prêt. Il reste à brancher l'export image final côté moteur.",
    );
    Alert.alert(
      "Viral Stick",
      "Maquette prête. L'export PNG automatique reste à finaliser côté pipeline image.",
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard animate style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.kicker, { color: theme.textMuted }]}>
                MODULE 03 · VISUAL REMIX
              </Text>
              <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
                Status <Text style={{ color: theme.warning }}>Remixer</Text>
              </Text>
              <Text
                style={[styles.heroSubtitle, { color: theme.textSecondary }]}
              >
                Passe d'un visuel brut à une publication mème mieux cadrée,
                mieux légendée et plus lisible.
              </Text>
            </View>
            <View style={styles.logoWrap}>
              <Image
                source={require("../../assets/logo/logo_sans_fond.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={styles.heroBottom}>
            <CompanionAvatar
              companion="bio"
              size={116}
              floating
              message={companionMsg}
            />
          </View>
        </GlassCard>

        {!imagePicked ? (
          <GlassCard animate delay={80} style={styles.pickCard}>
            <Text style={[styles.sectionTag, { color: theme.warning }]}>
              SOURCE VISUELLE
            </Text>
            <Text style={[styles.pickTitle, { color: theme.textPrimary }]}>
              Charge une image à remixer
            </Text>
            <Text style={[styles.pickText, { color: theme.textSecondary }]}>
              Caméra, galerie ou image de démo. L'objectif est de tester le
              captioning et la direction visuelle.
            </Text>
            <AnimatedButton
              title="Choisir une image"
              onPress={pickImage}
              size="lg"
              style={{ marginTop: spacing.md }}
            />
            <AnimatedButton
              title="Utiliser une image démo"
              onPress={simulatePickImage}
              variant="ghost"
              size="lg"
              style={{ marginTop: spacing.sm }}
            />
          </GlassCard>
        ) : (
          <>
            <Animated.View
              style={{
                opacity: previewAnim,
                transform: [
                  {
                    scale: previewAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.92, 1],
                    }),
                  },
                ],
              }}
            >
              <GlassCard style={styles.canvasCard}>
                <Text style={[styles.sectionTag, { color: theme.warning }]}>
                  CANVAS
                </Text>
                <View
                  style={[
                    styles.canvas,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        backgroundColor: filterOverlay,
                        borderRadius: radius.md,
                      },
                    ]}
                    pointerEvents="none"
                  />
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.canvasEmoji}>
                      {selectedFilter === "fire"
                        ? "🔥"
                        : selectedFilter === "neon"
                          ? "💫"
                          : selectedFilter === "dramatic"
                            ? "🌑"
                            : selectedFilter === "vintage"
                              ? "🎞️"
                              : "📸"}
                    </Text>
                    <Text
                      style={[styles.demoLabel, { color: theme.textMuted }]}
                    >
                      Visuel de démonstration chargé
                    </Text>
                  </View>

                  {!!overlayText && (
                    <Text
                      style={[
                        styles.overlayText,
                        textPosition === "top"
                          ? styles.textTop
                          : textPosition === "center"
                            ? styles.textCenter
                            : styles.textBottom,
                      ]}
                    >
                      {overlayText.toUpperCase()}
                    </Text>
                  )}
                </View>
              </GlassCard>
            </Animated.View>

            <GlassCard animate delay={100} style={styles.controlsCard}>
              <Text style={[styles.sectionTag, { color: theme.warning }]}>
                ÉDITION
              </Text>
              <Text style={[styles.subHeading, { color: theme.textPrimary }]}>
                Caption / overlay principal
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: theme.textPrimary,
                    borderColor:
                      overlayText.length > 0 ? theme.primary : theme.border,
                    backgroundColor: theme.backgroundSecondary,
                  },
                ]}
                value={overlayText}
                onChangeText={setOverlayText}
                placeholder="Entre une caption courte et percutante..."
                placeholderTextColor={theme.textMuted}
                multiline
              />

              <Text
                style={[
                  styles.subHeading,
                  { color: theme.textPrimary, marginTop: spacing.md },
                ]}
              >
                Filtre
              </Text>
              <View style={styles.filterRow}>
                {FILTERS.map((f) => {
                  const active = selectedFilter === f.id;
                  return (
                    <TouchableOpacity
                      key={f.id}
                      onPress={() => setSelectedFilter(f.id)}
                      style={[
                        styles.filterChip,
                        {
                          backgroundColor: active
                            ? `${theme.primary}22`
                            : theme.backgroundSecondary,
                          borderColor: active ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      <Text style={styles.filterEmoji}>{f.emoji}</Text>
                      <Text
                        style={[
                          styles.filterLabel,
                          {
                            color: active
                              ? theme.primaryLight
                              : theme.textSecondary,
                          },
                        ]}
                      >
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text
                style={[
                  styles.subHeading,
                  { color: theme.textPrimary, marginTop: spacing.md },
                ]}
              >
                Position du texte
              </Text>
              <View style={styles.positionRow}>
                {TEXT_POSITIONS.map((pos) => {
                  const active = textPosition === pos;
                  return (
                    <TouchableOpacity
                      key={pos}
                      onPress={() => setTextPosition(pos)}
                      style={[
                        styles.positionBtn,
                        {
                          backgroundColor: active
                            ? `${theme.warning}22`
                            : theme.backgroundSecondary,
                          borderColor: active ? theme.warning : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.positionText,
                          {
                            color: active ? theme.warning : theme.textSecondary,
                          },
                        ]}
                      >
                        {pos === "top"
                          ? "Haut"
                          : pos === "center"
                            ? "Centre"
                            : "Bas"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </GlassCard>

            <View style={styles.actionRow}>
              <AnimatedButton
                title={loading ? "Remix IA..." : "Remixer avec l'IA"}
                onPress={askRemix}
                loading={loading}
                disabled={loading}
                size="lg"
                style={{ flex: 1 }}
              />
              <AnimatedButton
                title="Exporter"
                onPress={exportSticker}
                variant="ghost"
                size="lg"
                style={{ flex: 1 }}
              />
            </View>

            {loading && (
              <GlassCard animate style={styles.loadingCard}>
                <ActivityIndicator color={theme.warning} size="large" />
                <Text
                  style={[styles.loadingTitle, { color: theme.textPrimary }]}
                >
                  Direction visuelle en cours
                </Text>
                <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                  Recherche d'une caption social-first et d'améliorations de
                  cadrage, lisibilité et contraste.
                </Text>
              </GlassCard>
            )}

            {remix && (
              <GlassCard style={styles.resultCard}>
                <Text style={[styles.sectionTag, { color: theme.warning }]}>
                  RECOMMANDATIONS IA
                </Text>
                <Text
                  style={[styles.resultTitle, { color: theme.textPrimary }]}
                >
                  {remix.meme_text || overlayText || "Caption prête"}
                </Text>
                <View style={styles.enhancementsList}>
                  {(remix.visual_enhancements || []).map((item, index) => (
                    <View
                      key={`${item}-${index}`}
                      style={[
                        styles.enhancementItem,
                        { backgroundColor: theme.backgroundSecondary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.enhancementIndex,
                          { color: theme.warning },
                        ]}
                      >
                        {index + 1}
                      </Text>
                      <Text
                        style={[
                          styles.enhancementText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            )}
          </>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: spacing.md, paddingTop: 80 },
  heroCard: { padding: spacing.lg, marginBottom: spacing.md },
  heroTop: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  heroBottom: { marginTop: spacing.md, alignItems: "center" },
  kicker: {
    fontSize: typography.fontSize.xs,
    fontWeight: "800",
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: typography.fontSize.sm,
    lineHeight: 22,
  },
  logoWrap: {
    width: 138,
    height: 138,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 132, height: 132 },
  sectionTag: {
    fontSize: typography.fontSize.xs,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  pickCard: { marginBottom: spacing.md },
  pickTitle: { fontSize: typography.fontSize.xl, fontWeight: "800" },
  pickText: { marginTop: 8, lineHeight: 21, fontSize: typography.fontSize.sm },
  canvasCard: { marginBottom: spacing.md },
  canvas: {
    borderWidth: 1,
    borderRadius: radius.md,
    minHeight: 340,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imagePlaceholder: { alignItems: "center", justifyContent: "center" },
  canvasEmoji: { fontSize: 78, marginBottom: 10 },
  demoLabel: { fontSize: typography.fontSize.sm },
  overlayText: {
    position: "absolute",
    left: 16,
    right: 16,
    color: "#FFFFFF",
    fontSize: typography.fontSize.xl,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  textTop: { top: 18 },
  textCenter: { top: "45%" },
  textBottom: { bottom: 18 },
  controlsCard: { marginBottom: spacing.md },
  subHeading: {
    fontSize: typography.fontSize.md,
    fontWeight: "800",
    marginBottom: 8,
  },
  textInput: {
    minHeight: 92,
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    textAlignVertical: "top",
  },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterEmoji: { fontSize: 18 },
  filterLabel: { fontSize: typography.fontSize.xs, fontWeight: "800" },
  positionRow: { flexDirection: "row", gap: spacing.sm },
  positionBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  positionText: { fontSize: typography.fontSize.sm, fontWeight: "800" },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  loadingCard: {
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  loadingTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "800",
    marginTop: spacing.sm,
  },
  loadingText: { textAlign: "center", lineHeight: 20 },
  resultCard: { marginBottom: spacing.md },
  resultTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: "800",
    marginBottom: spacing.md,
  },
  enhancementsList: { gap: spacing.sm },
  enhancementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  enhancementIndex: {
    fontSize: typography.fontSize.md,
    fontWeight: "900",
    minWidth: 18,
  },
  enhancementText: {
    flex: 1,
    lineHeight: 20,
    fontSize: typography.fontSize.sm,
  },
});

export default StatusRemixerScreen;

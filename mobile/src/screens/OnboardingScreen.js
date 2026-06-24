import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, Image, StatusBar, Platform } from "react-native";
import { colors, borderRadius } from "../theme/tokens";

const { width, height } = Dimensions.get("window");

const PAGES = [
  { key: "welcome", icon: "🎨", companion: "art",  title: "Bienvenue sur Viral Stick", subtitle: "Studio IA de mèmes", desc: "Transformez textes, voix et images en mèmes viraux avec vos 7 compagnons IA." },
  { key: "context", icon: "📝", companion: "art",  title: "Context Reader", subtitle: "Texte → Mème", desc: "Collez un extrait de discussion — l'IA génère le mème adapté à votre culture." },
  { key: "voice",   icon: "🎤", companion: "ubu",  title: "Voice to Meme", subtitle: "Voix → Mème", desc: "Parlez et l'IA transforme vos mots en mèmes hilarants en temps réel." },
  { key: "remix",   icon: "🖼️", companion: "bio",  title: "Status Remixer", subtitle: "Image → Mème", desc: "Importez une image et laissez Bio créer un remix visuel unique." },
  { key: "chat",    icon: "💬", companion: "data", title: "Companion Chat", subtitle: "Discutez avec l'IA", desc: "Échangez avec 7 compagnons spécialisés pour des conversations créatives." },
  { key: "ready",   icon: "🚀", companion: "arch", title: "Prêt à commencer ?", subtitle: "L'aventure commence", desc: "Explorez toutes les fonctionnalités et créez du contenu viral dès maintenant !" },
];

const IMGS = {
  arch: require("../../assets/companions/arch_sans_fond.png"),
  art:  require("../../assets/companions/art_sans_fond.png"),
  bio:  require("../../assets/companions/bio_sans_fond.png"),
  data: require("../../assets/companions/data_sans_fond.png"),
  para: require("../../assets/companions/para_sans_fond.png"),
  secu: require("../../assets/companions/secu_sans_fond.png"),
  ubu:  require("../../assets/companions/ubu_sans_fond.png"),
};

const OnboardingScreen = ({ onFinish }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const [idx, setIdx] = useState(0);

  const handleScroll = useRef(Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })).current;

  const goNext = () => {
    if (idx < PAGES.length - 1) {
      const next = idx + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setIdx(next);
    } else { onFinish(); }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <TouchableOpacity onPress={onFinish} style={styles.skip}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      <Animated.ScrollView
        ref={scrollRef} horizontal pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll} onMomentumScrollEnd={(e) => setIdx(Math.round(e.nativeEvent.contentOffset.x / width))}
        scrollEventThrottle={16} bounces={false}
      >
        {PAGES.map((page, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const scale   = scrollX.interpolate({ inputRange, outputRange: [0.7, 1, 0.7], extrapolate: "clamp" });
          const opacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: "clamp" });
          const col = colors[page.companion] || colors.duoGreen;
          return (
            <View key={page.key} style={styles.page}>
              <Animated.View style={[styles.illustration, { opacity, transform: [{ scale }] }]}>
                <View style={[styles.circle, { backgroundColor: `${col}18`, borderColor: `${col}33` }]}>
                  <Image source={IMGS[page.companion]} style={styles.companionImg} resizeMode="contain" />
                </View>
                <Text style={styles.pageIcon}>{page.icon}</Text>
              </Animated.View>
              <Animated.View style={{ opacity }}>
                <Text style={styles.pageTitle}>{page.title}</Text>
                <Text style={[styles.pageSub, { color: col }]}>{page.subtitle}</Text>
                <Text style={styles.pageDesc}>{page.desc}</Text>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {PAGES.map((_, i) => {
            const w = scrollX.interpolate({ inputRange: [(i-1)*width, i*width, (i+1)*width], outputRange: [8, 26, 8], extrapolate: "clamp" });
            const op = scrollX.interpolate({ inputRange: [(i-1)*width, i*width, (i+1)*width], outputRange: [0.35, 1, 0.35], extrapolate: "clamp" });
            return <Animated.View key={i} style={[styles.dot, { width: w, opacity: op, backgroundColor: i === idx ? colors.duoGreen : colors.cloudGray }]} />;
          })}
        </View>
        <TouchableOpacity onPress={goNext} style={styles.nextBtn} activeOpacity={0.85}>
          <Text style={styles.nextText}>{idx === PAGES.length - 1 ? "Commencer 🚀" : "Suivant"}</Text>
        </TouchableOpacity>
        {idx === PAGES.length - 1 && (
          <TouchableOpacity onPress={onFinish} style={styles.laterBtn}>
            <Text style={styles.laterText}>Se connecter plus tard</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: "#ffffff" },
  skip:        { position: "absolute", top: 60, right: 20, zIndex: 10, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: colors.cloudGray },
  skipText:    { fontSize: 13, fontWeight: "700", color: colors.silver },
  page:        { width, paddingHorizontal: 32, paddingTop: height * 0.1, alignItems: "center" },
  illustration:{ width: width * 0.68, height: width * 0.68, alignItems: "center", justifyContent: "center", marginBottom: 36 },
  circle:      { width: width * 0.72, height: width * 0.72, borderRadius: width * 0.36, borderWidth: 3, alignItems: "center", justifyContent: "center" },
  companionImg:{ width: width * 0.52, height: width * 0.52 },
  pageIcon:    { position: "absolute", bottom: 8, right: 8, fontSize: 36 },
  pageTitle:   { color: colors.almostBlack, fontSize: 26, fontWeight: "900", textAlign: "center", marginBottom: 6, letterSpacing: -0.5 },
  pageSub:     { fontSize: 14, fontWeight: "800", textAlign: "center", marginBottom: 14, letterSpacing: 0.3 },
  pageDesc:    { color: colors.graphite, fontSize: 15, lineHeight: 23, textAlign: "center", paddingHorizontal: 8, fontWeight: "600" },
  bottom:      { position: "absolute", bottom: 56, left: 0, right: 0, alignItems: "center", gap: 18 },
  dots:        { flexDirection: "row", gap: 7, alignItems: "center", height: 12 },
  dot:         { height: 8, borderRadius: 4 },
  nextBtn:     { backgroundColor: colors.duoGreen, paddingHorizontal: 46, paddingVertical: 15, borderRadius: 30, shadowColor: colors.duoGreenDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 0, elevation: 4 },
  nextText:    { color: "#ffffff", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 },
  laterBtn:    { marginTop: 2 },
  laterText:   { color: colors.silver, fontSize: 13, fontWeight: "600" },
});

export default OnboardingScreen;

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from "react-native";

const { width, height } = Dimensions.get("window");

const PAGES = [
  {
    key: "welcome",
    icon: "🎨",
    companion: "art",
    title: "Bienvenue sur Viral Stick",
    subtitle: "Générateur IA Multimodal",
    description:
      "Transformez vos textes, voix et images en mèmes et stickers virals avec nos 7 compagnons IA uniques.",
  },
  {
    key: "context",
    icon: "📝",
    companion: "art",
    title: "Context Reader",
    subtitle: "Texte → Mème",
    description:
      "Collez un extrait de discussion et laissez l'IA générer le mème parfait adapté à votre culture.",
  },
  {
    key: "voice",
    icon: "🎤",
    companion: "ubu",
    title: "Voice to Meme",
    subtitle: "Voix → Mème",
    description:
      "Parlez et notre IA transformera vos mots en mèmes hilarants en temps réel.",
  },
  {
    key: "remix",
    icon: "🖼️",
    companion: "bio",
    title: "Status Remixer",
    subtitle: "Image → Mème",
    description:
      "Importez une image et laissez Bio créer un remix visuel unique.",
  },
  {
    key: "chat",
    icon: "💬",
    companion: "data",
    title: "Companion Chat",
    subtitle: "Discutez avec l'IA",
    description:
      "Échangez avec nos 7 compagnons IA pour des conversations personnalisées et divertissantes.",
  },
  {
    key: "ready",
    icon: "🚀",
    companion: "arch",
    title: "Prêt à commencer ?",
    subtitle: "L'aventure commence",
    description:
      "Explorez toutes les fonctionnalités et créez du contenu viral dès maintenant !",
  },
];

const COMPANION_IMAGES = {
  arch: require("../../assets/companions/arch_sans_fond.png"),
  art: require("../../assets/companions/art_sans_fond.png"),
  bio: require("../../assets/companions/bio_sans_fond.png"),
  data: require("../../assets/companions/data_sans_fond.png"),
  para: require("../../assets/companions/para_sans_fond.png"),
  secu: require("../../assets/companions/secu_sans_fond.png"),
  ubu: require("../../assets/companions/ubu_sans_fond.png"),
};

const OnboardingScreen = ({ onFinish }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const handleMomentumEnd = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(idx);
  };

  const goNext = () => {
    if (currentIndex < PAGES.length - 1) {
      const next = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setCurrentIndex(next);
    } else {
      onFinish();
    }
  };

  const goSkip = () => {
    onFinish();
  };

  const isLast = currentIndex === PAGES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />

      {/* Skip button */}
      <TouchableOpacity
        onPress={goSkip}
        style={styles.skipBtn}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      {/* Pages */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        bounces={false}
      >
        {PAGES.map((page, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
          });

          return (
            <View key={page.key} style={styles.page}>
              <Animated.View
                style={[
                  styles.illustration,
                  { opacity, transform: [{ scale }] },
                ]}
              >
                <View style={styles.glowCircle}>
                  <Image
                    source={COMPANION_IMAGES[page.companion]}
                    style={styles.companionImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.pageIcon}>{page.icon}</Text>
              </Animated.View>

              <Animated.View style={{ opacity }}>
                <Text style={styles.pageTitle}>{page.title}</Text>
                <Text style={styles.pageSubtitle}>{page.subtitle}</Text>
                <Text style={styles.pageDescription}>{page.description}</Text>
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Page dots */}
        <View style={styles.dotsRow}>
          {PAGES.map((_, i) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [8, 28, 8],
              extrapolate: "clamp",
            });
            const dotOpacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor:
                      i === currentIndex ? "#7C3AED" : "rgba(255,255,255,0.2)",
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Next / Get Started */}
        <TouchableOpacity
          onPress={goNext}
          style={styles.nextBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.nextText}>
            {isLast ? "Commencer 🚀" : "Suivant"}
          </Text>
        </TouchableOpacity>

        {/* Login hint */}
        {isLast && (
          <TouchableOpacity
            onPress={goSkip}
            style={styles.loginHint}
            activeOpacity={0.7}
          >
            <Text style={styles.loginHintText}>Se connecter plus tard</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A1A",
  },
  skipBtn: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  skipText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  page: {
    width,
    paddingHorizontal: 32,
    paddingTop: height * 0.12,
    alignItems: "center",
  },
  illustration: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  glowCircle: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(124, 58, 237, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 58, 237, 0.2)",
  },
  companionImage: {
    width: width * 0.6,
    height: width * 0.6,
  },
  pageIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 40,
  },
  pageTitle: {
    color: "#F3F4F6",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    color: "#A78BFA",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  pageDescription: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  bottomSection: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 20,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    height: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#7C3AED",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  nextText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  loginHint: {
    marginTop: 4,
  },
  loginHintText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 13,
    fontWeight: "500",
  },
});

export default OnboardingScreen;

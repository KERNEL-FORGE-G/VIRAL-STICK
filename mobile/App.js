/**
 * Viral Stick — Application Entry Point
 * KERNEL FORGE — 2026
 */

import React, { useState, useEffect } from "react";
import { View, Text, LogBox } from "react-native";
import { ThemeProvider } from "./src/theme";
import RootNavigator from "./src/navigation/RootNavigator";
import SplashScreen from "./src/components/SplashScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import { initDatabase } from "./src/services/database";

// Ignorer les warnings NativeEventEmitter liés aux anciennes versions de Voice
LogBox.ignoreLogs(['new NativeEventEmitter()']);

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Erreur inconnue" };
  }

  componentDidCatch(error) {
    console.error("[Mobile App Crash]", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#0D0D0D",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: "800",
              marginBottom: 12,
            }}
          >
            Erreur au lancement
          </Text>
          <Text style={{ color: "#A0A0B0", textAlign: "center" }}>
            {this.state.message}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    // Initialiser le stockage persistant AsyncStorage au démarrage
    initDatabase()
      .then(() => {
        console.log('✅ Stockage local prêt');
        setDbReady(true);
      })
      .catch((error) => {
        console.error('❌ Erreur initialisation stockage:', error);
        setDbReady(true);
      });
  }, []);

  return (
    <AppErrorBoundary>
      <ThemeProvider>
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : showOnboarding ? (
          <OnboardingScreen onFinish={() => setShowOnboarding(false)} />
        ) : (
          <RootNavigator />
        )}
      </ThemeProvider>
    </AppErrorBoundary>
  );
};

export default App;

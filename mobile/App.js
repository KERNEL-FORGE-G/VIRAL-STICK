/**
 * Viral Stick — Application Entry Point
 * KERNEL FORGE — 2026
 */

import React, { useState } from "react";
import { ThemeProvider } from "./src/theme";
import RootNavigator from "./src/navigation/RootNavigator";
import SplashScreen from "./src/components/SplashScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
};

export default App;

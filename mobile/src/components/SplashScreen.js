import React, { useRef, useEffect, useState } from "react";
import { View, Animated, StatusBar, StyleSheet, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Wait, do we have this? Let's just use a solid gradient approach with views!

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Create a gradient-like progress bar with multiple colored views
const Flame = ({ style, delay }) => {
  const flameAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          delay: delay,
        }),
        Animated.timing(flameAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [delay]);

  const flameScale = flameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.3],
  });

  const flameOpacity = flameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <Animated.View 
      style={[
        styles.flame, 
        style,
        { 
          transform: [{ scaleY: flameScale }],
          opacity: flameOpacity
        }
      ]} 
    >
      {/* Simple solid flame color since CSS gradients aren't supported on RN views directly */}
      <View style={{flex:1, backgroundColor:'#ff6b35', borderTopLeftRadius: 50, borderTopRightRadius:50}}/>
    </Animated.View>
  );
};

const SplashScreen = ({ onFinish }) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    // Progress animation for exactly 5 seconds (0 to 1)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
      easing: (t) => t, // Linear
    }).start(() => {
      onFinish?.();
    });
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Animated flames */}
      <View style={styles.flameContainer}>
        {[...Array(20)].map((_, i) => (
          <Flame 
            key={i} 
            delay={i * 100}
            style={{
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${40 + Math.random() * 80}px`,
              bottom: `${Math.random() * 100}px`
            }} 
          />
        ))}
      </View>
      
      {/* Logo */}
      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <Image 
          source={require("../../assets/logo/logo_sans_fond.png")} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </Animated.View>
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Animated.View style={[
          styles.progressBar, 
          {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"]
            }),
            backgroundColor: "#ff6b35"
          }
        ]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  
  flameContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 300,
  },
  
  flame: {
    position: "absolute",
    borderRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    overflow: "hidden",
    transformOrigin: "bottom center",
  },
  
  logoWrap: {
    marginBottom: 60,
    zIndex: 10,
  },
  
  logo: {
    width: 200,
    height: 200,
  },
  
  progressContainer: {
    width: "60%",
    maxWidth: 400,
    height: 8,
    backgroundColor: "#333333",
    borderRadius: 4,
    overflow: "hidden",
    zIndex: 10,
  },
  
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});

export default SplashScreen;

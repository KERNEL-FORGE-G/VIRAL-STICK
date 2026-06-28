import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { useTheme } from '../theme';
import AnimatedButton from '../components/AnimatedButton';
import { apiUrl } from '../config/api';
import axios from 'axios';
import authService from '../services/authService';

const AuthScreen = ({ navigate }) => {
  const { theme, isDark } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit faire au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      // Simulation d'un appel API pour valider l'existence du serveur
      await axios.get(apiUrl('/health'), { timeout: 4000 });
      
      const userId = `user_${email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const success = await authService.saveSession(userId, email.trim());

      if (success) {
        Alert.alert('Bienvenue', isLogin ? 'Ravi de vous revoir !' : 'Compte créé avec succès !');
        navigate('Home');
      } else {
        throw new Error("Échec stockage session");
      }
    } catch (error) {
      console.error('[Auth] Error:', error);
      Alert.alert('Erreur Connexion', 'Impossible de joindre le serveur. Mode hors-ligne activé.');

      // Fallback offline pour permettre l'utilisation de l'app même sans backend configuré
      const userId = `offline_${Date.now()}`;
      await authService.saveSession(userId, email);
      navigate('Home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.snowWhite }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>{isLogin ? 'Bon retour !' : 'Créer un compte'}</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Connecte-toi pour tes mèmes.' : 'Rejoins la communauté Viral Stick !'}
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-MAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="ton@email.com"
            placeholderTextColor={colors.silver}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>MOT DE PASSE</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.silver}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={{ marginTop: 10 }}>
            <AnimatedButton
              title={isLogin ? 'SE CONNECTER' : 'CRÉER MON COMPTE'}
              onPress={handleAuth}
              loading={loading}
              disabled={loading}
            />
          </View>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switch}>
            <Text style={styles.switchText}>
              {isLogin ? "Pas encore de compte ? S'INSCRIRE" : "Déjà inscrit ? SE CONNECTER"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
  title: { fontSize: 30, fontWeight: '900', color: colors.almostBlack, textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', color: colors.graphite, marginTop: 10 },
  form: { width: '100%' },
  label: { fontWeight: '800', fontSize: 12, marginBottom: 8, color: colors.charcoal, letterSpacing: 1 },
  input: {
    height: 55,
    borderWidth: 2,
    borderColor: colors.cloudGray,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: colors.almostBlack,
    fontWeight: '600'
  },
  switch: { marginTop: 25, alignItems: 'center' },
  switchText: { fontWeight: '800', fontSize: 14, color: colors.brandSecondary }
});

export default AuthScreen;

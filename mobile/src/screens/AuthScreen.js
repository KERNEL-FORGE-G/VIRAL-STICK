import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { useTheme } from '../theme';
import CompanionAvatar from '../components/CompanionAvatar';
import { apiUrl } from '../config/api';
import axios from 'axios';

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

    setLoading(true);
    try {
      // Pour l'instant, simulation simple - vérifier si le backend a des endpoints d'auth
      const url = apiUrl('/health');
      const res = await axios.get(url, { timeout: 5000 });
      
      if (res.status === 200) {
        // Backend accessible - simuler une connexion réussie
        Alert.alert('Succès', isLogin ? 'Connexion réussie !' : 'Compte créé avec succès !');
        navigate('Home');
      }
    } catch (error) {
      console.error('Erreur auth:', error);
      Alert.alert('Erreur', 'Impossible de contacter le serveur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <CompanionAvatar companion="para" size={100} />
        <Text style={[styles.title, { color: theme.textPrimary }]}>{isLogin ? 'Bon retour !' : 'Créer un compte'}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {isLogin ? 'Connecte-toi pour tes mèmes.' : 'Rejoins la communauté.'}
        </Text>
      </View>

      <View style={[styles.form, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.textMuted }]}>E-MAIL</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
          placeholder="ton@email.com"
          placeholderTextColor={theme.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          spellCheck={false}
          textContentType="none"
        />

        <Text style={[styles.label, { color: theme.textMuted }]}>MOT DE PASSE</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
          placeholder="••••••••"
          placeholderTextColor={theme.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
          spellCheck={false}
          textContentType="none"
          autoComplete="off"
        />

        <TouchableOpacity 
          style={[styles.mainBtn, { backgroundColor: colors.sapphire, opacity: loading ? 0.7 : 1 }]} 
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.mainBtnText}>{isLogin ? 'SE CONNECTER' : 'CRÉER COMPTE'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switch}>
          <Text style={[styles.switchText, { color: colors.sapphire }]}>
            {isLogin ? "Pas encore de compte ? S'INSCRIRE" : "Déjà inscrit ? SE CONNECTER"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.xl, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  title: { fontSize: 28, fontWeight: '900', marginTop: 16 },
  subtitle: { fontSize: 16, textAlign: 'center' },
  form: { width: '100%', padding: 20, borderRadius: radius.xl, borderWidth: 1 },
  label: { fontWeight: '900', fontSize: 13, marginBottom: 8 },
  input: {
    height: 50, borderWidth: 1,
    borderRadius: radius.md, paddingHorizontal: 16, marginBottom: 20,
    fontSize: 16
  },
  mainBtn: {
    height: 54, borderRadius: radius.md,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.sapphireDark, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, elevation: 4
  },
  mainBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  switch: { marginTop: 24, alignItems: 'center' },
  switchText: { fontWeight: '800', fontSize: 13 }
});

export default AuthScreen;

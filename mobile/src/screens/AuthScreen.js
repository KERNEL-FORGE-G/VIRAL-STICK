import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
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

    setLoading(true);
    try {
      const url = apiUrl('/health');
      const res = await axios.get(url, { timeout: 5000 });
      
      if (res.status === 200) {
        const userId = `user_${email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        const saved = await authService.saveSession(userId, email);
        
        if (saved) {
          console.log('[AuthScreen] Session sauvegardée avec userId:', userId);
          Alert.alert('Succès', isLogin ? 'Connexion réussie !' : 'Compte créé avec succès !');
          navigate('Home');
        } else {
          Alert.alert('Erreur', 'Impossible de sauvegarder la session');
        }
      }
    } catch (error) {
      console.error('Erreur auth:', error);
      Alert.alert('Erreur', 'Impossible de contacter le serveur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.snowWhite }]} contentContainerStyle={styles.content}>
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
          autoCorrect={false}
          spellCheck={false}
          textContentType="none"
        />

        <Text style={styles.label}>MOT DE PASSE</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={colors.silver}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
          spellCheck={false}
          textContentType="none"
          autoComplete="off"
        />

        <AnimatedButton 
          title={isLogin ? 'SE CONNECTER' : 'CRÉER COMPTE'} 
          onPress={handleAuth}
          loading={loading}
          disabled={loading}
        />

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switch}>
          <Text style={styles.switchText}>
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
  header: { alignItems: 'center', marginBottom: 40, marginTop: 60 },
  title: { fontSize: 32, fontWeight: '900', color: colors.almostBlack, marginTop: 16, fontFamily: 'Nunito' },
  subtitle: { fontSize: 16, textAlign: 'center', color: colors.graphite, marginTop: 8, fontFamily: 'Nunito' },
  form: { width: '100%', padding: 24 },
  label: { fontWeight: '800', fontSize: 13, marginBottom: 8, color: colors.charcoal, fontFamily: 'Nunito', letterSpacing: 1 },
  input: {
    height: 56, 
    borderWidth: 2,
    borderColor: colors.cloudGray,
    borderRadius: radius.buttons, 
    paddingHorizontal: 20, 
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: colors.snowWhite,
    color: colors.almostBlack,
    fontFamily: 'Nunito',
    fontWeight: '600'
  },
  switch: { marginTop: 24, alignItems: 'center' },
  switchText: { fontWeight: '800', fontSize: 15, color: colors.skyBlue, fontFamily: 'Nunito' }
});

export default AuthScreen;

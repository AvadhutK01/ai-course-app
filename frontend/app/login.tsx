import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SocialButton } from '../components/ui/SocialButton';
import { Colors } from '../constants/Colors';
import authService from '../services/authService';

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data?.idToken) {
        throw new Error('No ID token returned');
      }

      const result = await authService.loginWithGoogle(userInfo.data.idToken);
      
      // Store token and user data securely
      await SecureStore.setItemAsync('userToken', result.token);
      await SecureStore.setItemAsync('userData', JSON.stringify(result.user));

      // Navigate to home screen
      router.replace('/home');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Failed', error.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={Colors.gradients.primary} style={styles.background}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🎓</Text>
            </View>
            <Text style={styles.title}>AI Course Finder</Text>
            <Text style={styles.subtitle}>
              Unlock your potential with AI-driven learning paths.
            </Text>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.welcomeText}>Get Started</Text>
            <Text style={styles.instructionText}>
              Sign in to save your progress and discover personalized courses.
            </Text>

            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.light.primary} />
            ) : (
              <SocialButton
                title="Sign in with Google"
                iconName="logo-google"
                onPress={signInWithGoogle}
                style={styles.googleButton}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoIcon: { fontSize: 50 },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  loginContainer: {
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#F5F5F5',
  },
});

/**
 * DemoLoginSignUp - Google Authentication with Firebase
 * @format
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthService } from './src/services/AuthService';
import { LoginScreen } from './src/components/LoginScreen';
import { ProfileScreen } from './src/components/ProfileScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const subscriber = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  // Animate screen changes
  useEffect(() => {
    if (!loading) {
      // Reset animation values
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [user, loading, fadeAnim, slideAnim]);

  const handleLoginSuccess = (user: FirebaseAuthTypes.User) => {
    setUser(user);
  };

  const handleLogoutSuccess = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#4285f4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Google Authentication</Text>
        <Text style={styles.subtitle}>Firebase Auth Demo</Text>
      </View>

      <Animated.View
        style={[
          styles.screenContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {user ? (
          <ProfileScreen user={user} onLogoutSuccess={handleLogoutSuccess} />
        ) : (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5f6368',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5f6368',
  },
  screenContainer: {
    flex: 1,
  },
});

export default App;

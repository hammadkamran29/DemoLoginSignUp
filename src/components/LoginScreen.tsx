/**
 * Login Screen Component
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Animated,
} from 'react-native';
import { AuthService } from '../services/AuthService';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  // Animation refs
  const welcomeAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Stagger the entrance animations
    Animated.sequence([
      Animated.timing(welcomeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoogleSignIn = async () => {
    // Add button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      setIsSigningIn(true);
      const user = await AuthService.signInWithGoogle();
      Alert.alert('Success', `Welcome ${user.displayName}!`);
      onLoginSuccess(user);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong during sign-in');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.welcomeSection,
          {
            opacity: welcomeAnim,
            transform: [
              {
                translateY: welcomeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.welcomeSubtext}>
          Sign in with your Google account to continue
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          {
            opacity: buttonAnim,
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              { scale: buttonScale },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.googleButton, isSigningIn && styles.buttonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={isSigningIn}
        >
          {isSigningIn ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <View style={styles.googleIcon}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={{
          opacity: buttonAnim,
        }}
      >
        <Text style={styles.disclaimer}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
    lineHeight: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285f4',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIconText: {
    color: '#4285f4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
    lineHeight: 18,
  },
});

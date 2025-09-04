/**
 * Profile Screen Component
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AuthService } from '../services/AuthService';

interface ProfileScreenProps {
  user: FirebaseAuthTypes.User;
  onLogoutSuccess: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogoutSuccess }) => {
  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      Alert.alert('Success', 'You have been signed out successfully');
      onLogoutSuccess();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        {user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {user.displayName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        )}
        <Text style={styles.userName}>{user.displayName || 'User'}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Account Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>UID:</Text>
          <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="middle">
            {user.uid}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email Verified:</Text>
          <Text style={styles.infoValue}>{user.emailVerified ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Creation Date:</Text>
          <Text style={styles.infoValue}>
            {user.metadata.creationTime 
              ? new Date(user.metadata.creationTime).toLocaleDateString() 
              : 'N/A'
            }
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Last Sign In:</Text>
          <Text style={styles.infoValue}>
            {user.metadata.lastSignInTime 
              ? new Date(user.metadata.lastSignInTime).toLocaleDateString() 
              : 'N/A'
            }
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    backgroundColor: '#4285f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#5f6368',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  infoLabel: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#202124',
    flex: 2,
    textAlign: 'right',
    marginLeft: 16,
  },
  signOutButton: {
    backgroundColor: '#ea4335',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

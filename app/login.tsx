import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../lib/contexts/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        Alert.alert(
          '성공',
          'Google 로그인이 완료되었습니다!',
          [{ text: '확인', onPress: () => router.replace('/') }]
        );
      } else {
        Alert.alert('오류', result.error || 'Google 로그인에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', 'Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>노스텀</Text>
          <Text style={styles.subtitle}>
            Google 계정으로 로그인하여 시작하세요
          </Text>
        </View>

        <View style={styles.form}>
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleGoogleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#4285F4" />
            ) : (
              <Ionicons name="logo-google" size={24} color="#4285F4" />
            )}
            <Text style={styles.googleButtonText}>
              {loading ? '로그인 중...' : 'Google로 계속하기'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.description}>
            Google 계정으로 간편하게 로그인하고{'\n'}
            향수 정보를 탐색해보세요
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: '#ffffff',
    marginBottom: 30,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    color: '#4285F4',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../lib/contexts/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SupabaseTest from '../components/SupabaseTest';

export default function HomeScreen() {
  const { user, userProfile, signOut, loading } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            const result = await signOut();
            if (result.success) {
              router.replace('/login');
            } else {
              Alert.alert('오류', '로그아웃에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈</Text>
      
      {user ? (
        <View style={styles.userSection}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              {userProfile?.avatar_url ? (
                <Text style={styles.avatarText}>👤</Text>
              ) : (
                <Ionicons name="person-circle" size={80} color="#d946ef" />
              )}
            </View>
            <Text style={styles.welcomeText}>
              안녕하세요,
            </Text>
            <Text style={styles.userName}>
              {userProfile?.nickname || user.email?.split('@')[0] || '사용자'}님
            </Text>
            <Text style={styles.userEmail}>
              {user.email}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color="#ffffff" />
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loginSection}>
          <Ionicons name="lock-closed-outline" size={60} color="#9ca3af" style={styles.lockIcon} />
          <Text style={styles.loginPrompt}>로그인이 필요합니다</Text>
          <Text style={styles.loginSubtext}>
            Google 계정으로 간편하게 로그인하세요
          </Text>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => router.push('/login')}
            activeOpacity={0.7}
          >
            <Ionicons name="log-in-outline" size={20} color="#ffffff" />
            <Text style={styles.loginButtonText}>로그인하기</Text>
          </TouchableOpacity>
        </View>
      )}

      <SupabaseTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  title: {
    color: '#1f2937',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    fontFamily: 'Pretendard-Bold',
  },
  userSection: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 80,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 5,
    fontFamily: 'Pretendard',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: 'Pretendard-Bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: 'Pretendard',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    gap: 8,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  loginSection: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lockIcon: {
    marginBottom: 20,
  },
  loginPrompt: {
    fontSize: 20,
    color: '#1f2937',
    marginBottom: 10,
    fontWeight: '600',
    fontFamily: 'Pretendard-SemiBold',
  },
  loginSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Pretendard',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d946ef',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    gap: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
}); 
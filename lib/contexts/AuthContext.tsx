import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { supabase } from '../supabase/client';
import { UserProfile } from '../types';
import { 
  signInWithGoogle, 
  signOut as authSignOut,
  getCurrentUser,
  getUserProfile,
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 사용자 프로필 새로고침
  const refreshUserProfile = async () => {
    if (user) {
      const result = await getUserProfile(user.id);
      if (result.success && result.profile) {
        setUserProfile(result.profile);
      }
    }
  };

  useEffect(() => {
    // 웹에서 OAuth 콜백 처리
    const handleOAuthCallback = async () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          try {
            // Supabase 세션 설정
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error && data.user) {
              console.log('OAuth 로그인 성공:', data.user.email);
              
              // 프로필 확인 및 생성
              const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

              if (!profileData) {
                // 새 프로필 생성
                await supabase
                  .from('profiles')
                  .insert({
                    id: data.user.id,
                    nickname: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || '사용자',
                    google_id: data.user.user_metadata?.sub,
                    avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
                  });
              }

              // URL 정리
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } catch (error) {
            console.error('OAuth 콜백 처리 오류:', error);
          }
        }
      }
    };

    handleOAuthCallback();

    // 초기 사용자 상태 확인
    const getInitialUser = async () => {
      try {
        console.log('🔍 AuthContext: 초기 사용자 확인 시작');
        
        // 타임아웃 추가 (5초)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('타임아웃')), 5000)
        );
        
        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('❌ AuthContext: 세션 조회 에러:', error);
          setLoading(false);
          return;
        }
        
        console.log('🔍 AuthContext: 세션 확인:', session?.user?.email || '로그인 안됨');
        
        if (session?.user) {
          setUser(session.user);
          // 프로필 정보는 비동기로 가져오기 (로딩 블로킹하지 않음)
          getUserProfile(session.user.id).then(profileResult => {
            if (profileResult.success && profileResult.profile) {
              setUserProfile(profileResult.profile);
            }
          }).catch(err => {
            console.error('❌ AuthContext: 프로필 로딩 에러:', err);
          });
        }
        console.log('✅ AuthContext: 초기 로딩 완료');
      } catch (error) {
        console.error('❌ AuthContext: 초기 사용자 확인 오류:', error);
        console.log('⚠️ AuthContext: 타임아웃 또는 에러로 인해 로딩 강제 완료');
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth 상태 변경:', event, session?.user?.email);
      
      if (session?.user) {
        setUser(session.user);
        // 프로필 정보 가져오기
        const profileResult = await getUserProfile(session.user.id);
        if (profileResult.success && profileResult.profile) {
          setUserProfile(profileResult.profile);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);


  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    // 웹에서는 리다이렉트되므로 여기서는 바로 반환
    return result;
  };

  const signOut = async () => {
    const result = await authSignOut();
    if (result.success) {
      setUser(null);
      setUserProfile(null);
    }
    return result;
  };

  const value = {
    user,
    userProfile,
    loading,
    signInWithGoogle: handleGoogleSignIn,
    signOut,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
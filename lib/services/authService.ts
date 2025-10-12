import { supabase } from '../supabase/client';
import { Platform } from 'react-native';
import { User, UserProfile } from '../types';

// Google Sign-In 설정 (웹에서는 비활성화)
let GoogleSignin: any = null;
if (Platform.OS !== 'web') {
  try {
    GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
    GoogleSignin.configure({
      webClientId: process.env.GOOGLE_WEB_CLIENT_ID || 'your_google_web_client_id_here',
      iosClientId: process.env.GOOGLE_IOS_CLIENT_ID || 'your_google_ios_client_id_here',
    });
  } catch (error) {
    console.log('Google Sign-In 라이브러리를 로드할 수 없습니다:', error);
  }
}

// 이메일/비밀번호 회원가입
export const signUpWithEmail = async (email: string, password: string, nickname: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      // 사용자 프로필 생성
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          nickname,
        });

      if (profileError) {
        console.error('프로필 생성 오류:', profileError);
        // 프로필 생성 실패해도 회원가입은 성공으로 처리
      }

      return { success: true, user: data.user };
    }

    return { success: false, error: '사용자 생성에 실패했습니다.' };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.' };
  }
};

// 이메일/비밀번호 로그인
export const signInWithEmail = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.' };
  }
};

// Google 로그인
export const signInWithGoogle = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    if (Platform.OS === 'web') {
      // 웹에서는 Supabase의 OAuth를 사용
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // 웹에서는 리다이렉트되므로 여기서는 성공으로 처리
      return { success: true };
    } else {
      // 모바일에서는 Google Sign-In 라이브러리 사용
      if (!GoogleSignin) {
        return { success: false, error: 'Google Sign-In 라이브러리가 로드되지 않았습니다.' };
      }
      
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      // Supabase에 Google 토큰으로 로그인
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Google 계정 정보로 프로필 생성/업데이트
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profileData) {
          // 새 프로필 생성
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              nickname: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || '사용자',
              google_id: data.user.user_metadata?.sub,
            });

          if (profileError) {
            console.error('프로필 생성 오류:', profileError);
          }
        } else {
          // 기존 프로필에 Google ID 업데이트
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              google_id: data.user.user_metadata?.sub,
            })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('프로필 업데이트 오류:', updateError);
          }
        }

        return { success: true, user: data.user };
      }

      return { success: false, error: 'Google 로그인에 실패했습니다.' };
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Google 로그인 중 오류가 발생했습니다.' };
  }
};

// 로그아웃
export const signOut = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Google Sign-In에서 로그아웃 (Google로 로그인한 경우)
    try {
      await GoogleSignin.signOut();
    } catch (err) {
      // Google 로그아웃 실패는 무시 (이메일 로그인인 경우)
    }

    // Supabase에서 로그아웃
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : '로그아웃 중 오류가 발생했습니다.' };
  }
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: user || undefined };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : '사용자 정보를 가져오는 중 오류가 발생했습니다.' };
  }
};

// 사용자 프로필 가져오기
export const getUserProfile = async (userId: string): Promise<{ success: boolean; profile?: UserProfile; error?: string }> => {
  try {
    console.log('🔍 getUserProfile 호출:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // .single() 대신 .maybeSingle() 사용

    if (error) {
      console.error('❌ getUserProfile 에러:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ getUserProfile 성공:', data);
    return { success: true, profile: data };
  } catch (err) {
    console.error('❌ getUserProfile 예외:', err);
    return { success: false, error: err instanceof Error ? err.message : '프로필을 가져오는 중 오류가 발생했습니다.' };
  }
};

// 비밀번호 재설정 이메일 발송
export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Platform.OS === 'web' 
        ? `${window.location.origin}/reset-password`
        : 'nostum://reset-password',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : '비밀번호 재설정 이메일 발송 중 오류가 발생했습니다.' };
  }
};
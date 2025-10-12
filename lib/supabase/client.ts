import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Database } from '../types/database';

// Supabase 설정
const supabaseUrl = process.env.SUPABASE_URL || 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

// 디버깅용 로그
console.log('🔧 Supabase 설정:');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 API Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '없음');

// 웹 환경에서는 localStorage, 모바일에서는 AsyncStorage 사용
const storage = Platform.OS === 'web' ? {
  getItem: (key: string) => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
} : AsyncStorage;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    fetch: (url, options = {}) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ Supabase 요청 타임아웃:', url);
        controller.abort();
      }, 20000);
      
      console.log('🔍 Supabase 요청:', url);
      console.log('🔑 요청 헤더:', options.headers);
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        }
      }).finally(() => {
        clearTimeout(timeoutId);
      });
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
};

// 연결 테스트 함수
export const testConnection = async () => {
  try {
    console.log('🔗 Supabase 연결 테스트 시작...');
    console.log('📍 URL:', supabaseUrl);
    console.log('🔑 API Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '없음');
    
    // 간단한 쿼리로 연결 테스트
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase 연결 실패:', error);
      return { success: false, error: error.message };
    } else {
      console.log('✅ Supabase 연결 성공!');
      console.log('📊 테스트 데이터:', data);
      return { success: true, data };
    }
  } catch (err) {
    console.error('❌ 연결 테스트 중 오류 발생:', err);
    return { success: false, error: err };
  }
};

// 커뮤니티 테스트 함수
export const testCommunityConnection = async () => {
  try {
    console.log('🔗 커뮤니티 연결 테스트 시작...');
    
    // 1. 카테고리 테스트
    const { data: categories, error: catError } = await supabase
      .from('board_categories')
      .select('*')
      .limit(3);
    
    if (catError) {
      console.error('❌ 카테고리 조회 실패:', catError);
      return { success: false, error: catError.message };
    }
    
    console.log('✅ 카테고리 조회 성공:', categories?.length || 0, '개');
    
    // 2. 게시글 테스트
    const { data: posts, error: postError } = await supabase
      .from('community_posts')
      .select('*')
      .limit(3);
    
    if (postError) {
      console.error('❌ 게시글 조회 실패:', postError);
      return { success: false, error: postError.message };
    }
    
    console.log('✅ 게시글 조회 성공:', posts?.length || 0, '개');
    
    return { 
      success: true, 
      data: { 
        categories: categories?.length || 0,
        posts: posts?.length || 0 
      } 
    };
  } catch (err) {
    console.error('❌ 커뮤니티 테스트 중 오류 발생:', err);
    return { success: false, error: err };
  }
};

// 데이터베이스 스키마 확인 함수
export const checkDatabaseSchema = async () => {
  try {
    console.log('🔍 데이터베이스 스키마 확인 중...');
    
    // 주요 테이블들이 존재하는지 확인
    const tables = ['brands', 'perfumes', 'profiles', 'reviews', 'community_posts'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          results[table] = { exists: false, error: error.message };
        } else {
          results[table] = { exists: true, count: data?.length || 0 };
        }
      } catch (err) {
        results[table] = { exists: false, error: err };
      }
    }
    
    console.log('📋 테이블 상태:', results);
    return { success: true, results };
  } catch (err) {
    console.error('❌ 스키마 확인 중 오류:', err);
    return { success: false, error: err };
  }
};

// 타입 테스트 함수
export const testTypes = async () => {
  try {
    console.log('🔍 TypeScript 타입 테스트 중...');
    
    // 브랜드 데이터 조회 (타입 체크)
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('*')
      .limit(1);
    
    if (brandsError) {
      console.error('❌ 브랜드 조회 실패:', brandsError);
      return { success: false, error: brandsError.message };
    }
    
    // 향수 데이터 조회 (타입 체크)
    const { data: perfumes, error: perfumesError } = await supabase
      .from('perfumes')
      .select(`
        *,
        brand:brands(*)
      `)
      .limit(1);
    
    if (perfumesError) {
      console.error('❌ 향수 조회 실패:', perfumesError);
      return { success: false, error: perfumesError.message };
    }
    
    console.log('✅ 타입 테스트 성공!');
    console.log('📊 브랜드 데이터:', brands);
    console.log('📊 향수 데이터:', perfumes);
    
    return { 
      success: true, 
      data: { 
        brands: brands as any[], 
        perfumes: perfumes as any[] 
      } 
    };
  } catch (err) {
    console.error('❌ 타입 테스트 중 오류:', err);
    return { success: false, error: err };
  }
};

// API 서비스 테스트 함수 (간단한 버전)
export const testApiServices = async () => {
  try {
    console.log('🔍 API 서비스 테스트 중...');
    
    // 1. 브랜드 테이블 직접 조회
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('*')
      .limit(3);
    
    if (brandsError) {
      throw new Error(`브랜드 조회 실패: ${brandsError.message}`);
    }
    
    // 2. 향수 테이블 직접 조회 (JOIN 없이)
    const { data: perfumes, error: perfumesError } = await supabase
      .from('perfumes')
      .select('*')
      .limit(3);
    
    if (perfumesError) {
      throw new Error(`향수 조회 실패: ${perfumesError.message}`);
    }
    
    console.log('✅ API 서비스 테스트 성공!');
    console.log('📊 브랜드 수:', brands?.length || 0);
    console.log('📊 향수 수:', perfumes?.length || 0);
    
    return { 
      success: true, 
      data: { 
        brands_count: brands?.length || 0,
        perfumes_count: perfumes?.length || 0,
        brands: brands,
        perfumes: perfumes
      } 
    };
  } catch (err) {
    console.error('❌ API 서비스 테스트 중 오류:', err);
    return { success: false, error: err };
  }
}; 
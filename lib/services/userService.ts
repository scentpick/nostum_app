import { supabase } from '../supabase/client';
import { 
  User, 
  UserProfile, 
  UserFavorite, 
  PerfumeWithBrand,
  ApiResponse,
  UserStats 
} from '../types';

// 사용자 프로필 조회
export const getUserProfile = async (userId: string): Promise<ApiResponse<UserProfile>> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as UserProfile, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 사용자 프로필 업데이트
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as UserProfile, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 사용자 찜한 향수 조회
export const getUserFavorites = async (userId: string, favoriteType?: 'owned' | 'tried' | 'want_to_buy'): Promise<ApiResponse<UserFavorite[]>> => {
  try {
    let query = supabase
      .from('user_favorites')
      .select(`
        *,
        perfume:perfumes(
          *,
          brand:brands(*)
        )
      `)
      .eq('user_id', userId);

    if (favoriteType) {
      query = query.eq('favorite_type', favoriteType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as UserFavorite[], error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 향수 찜하기 추가
export const addToFavorites = async (userId: string, perfumeId: string, favoriteType: 'owned' | 'tried' | 'want_to_buy'): Promise<ApiResponse<UserFavorite>> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        perfume_id: perfumeId,
        favorite_type: favoriteType
      })
      .select(`
        *,
        perfume:perfumes(
          *,
          brand:brands(*)
        )
      `)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as UserFavorite, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 향수 찜하기 제거
export const removeFromFavorites = async (userId: string, perfumeId: string, favoriteType: 'owned' | 'tried' | 'want_to_buy'): Promise<ApiResponse<boolean>> => {
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('perfume_id', perfumeId)
      .eq('favorite_type', favoriteType);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: true, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 찜하기 상태 확인
export const checkFavoriteStatus = async (userId: string, perfumeId: string): Promise<ApiResponse<{ [key: string]: boolean }>> => {
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('favorite_type')
      .eq('user_id', userId)
      .eq('perfume_id', perfumeId);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    const status = {
      owned: false,
      tried: false,
      want_to_buy: false
    };

    data.forEach(item => {
      status[item.favorite_type as keyof typeof status] = true;
    });

    return { success: true, data: status, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 사용자 통계 조회
export const getUserStats = async (userId: string): Promise<ApiResponse<UserStats>> => {
  try {
    // 리뷰 수 조회
    const { count: reviewCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // 찜한 향수 수 조회
    const { count: favoriteCount } = await supabase
      .from('user_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // 타입별 찜한 향수 수 조회
    const { data: favoriteData } = await supabase
      .from('user_favorites')
      .select('favorite_type')
      .eq('user_id', userId);

    const ownedCount = favoriteData?.filter(item => item.favorite_type === 'owned').length || 0;
    const triedCount = favoriteData?.filter(item => item.favorite_type === 'tried').length || 0;
    const wantToBuyCount = favoriteData?.filter(item => item.favorite_type === 'want_to_buy').length || 0;

    // 선호 브랜드 조회
    const { data: brandData } = await supabase
      .from('user_favorites')
      .select(`
        perfume:perfumes(
          brand:brands(*)
        )
      `)
      .eq('user_id', userId);

    const brandCounts: { [key: string]: { brand: any; count: number } } = {};
    brandData?.forEach(item => {
      const brandId = item.perfume?.brand?.id;
      if (brandId) {
        if (brandCounts[brandId]) {
          brandCounts[brandId].count++;
        } else {
          brandCounts[brandId] = {
            brand: item.perfume?.brand,
            count: 1
          };
        }
      }
    });

    const favoriteBrands = Object.values(brandCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const stats: UserStats = {
      total_reviews: reviewCount || 0,
      total_favorites: favoriteCount || 0,
      owned_perfumes: ownedCount,
      tried_perfumes: triedCount,
      want_to_buy_perfumes: wantToBuyCount,
      favorite_brands: favoriteBrands
    };

    return { success: true, data: stats, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
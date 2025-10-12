import { supabase } from '../supabase/client';
import { 
  Review, 
  ReviewWithDetails, 
  ReviewFormData,
  ApiResponse,
  PaginatedResponse 
} from '../types';

// 향수 리뷰 목록 조회
export const getPerfumeReviews = async (perfumeId: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<ReviewWithDetails>>> => {
  try {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(*),
        perfume:perfumes(*)
      `)
      .eq('perfume_id', perfumeId)
      .order('created_at', { ascending: false });

    // 페이지네이션 (안전한 방식)
    if (page > 0 && limit > 0) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      success: true,
      data: {
        data: data as ReviewWithDetails[],
        count: count || 0,
        page,
        limit,
        total_pages: totalPages
      },
      error: null
    };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 사용자 리뷰 목록 조회
export const getUserReviews = async (userId: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<ReviewWithDetails>>> => {
  try {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(*),
        perfume:perfumes(
          *,
          brand:brands(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // 페이지네이션 (안전한 방식)
    if (page > 0 && limit > 0) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      success: true,
      data: {
        data: data as ReviewWithDetails[],
        count: count || 0,
        page,
        limit,
        total_pages: totalPages
      },
      error: null
    };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 리뷰 작성
export const createReview = async (userId: string, perfumeId: string, reviewData: ReviewFormData): Promise<ApiResponse<ReviewWithDetails>> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        perfume_id: perfumeId,
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        longevity_rating: reviewData.longevity_rating,
        sillage_rating: reviewData.sillage_rating
      })
      .select(`
        *,
        user:profiles(*),
        perfume:perfumes(
          *,
          brand:brands(*)
        )
      `)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as ReviewWithDetails, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 리뷰 수정
export const updateReview = async (reviewId: string, userId: string, reviewData: Partial<ReviewFormData>): Promise<ApiResponse<ReviewWithDetails>> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        ...reviewData,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .eq('user_id', userId)
      .select(`
        *,
        user:profiles(*),
        perfume:perfumes(
          *,
          brand:brands(*)
        )
      `)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as ReviewWithDetails, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 리뷰 삭제
export const deleteReview = async (reviewId: string, userId: string): Promise<ApiResponse<boolean>> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', userId);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: true, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 리뷰 좋아요 토글
export const toggleReviewLike = async (reviewId: string, userId: string): Promise<ApiResponse<boolean>> => {
  try {
    // 기존 좋아요 확인
    const { data: existingLike } = await supabase
      .from('review_likes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // 좋아요 제거
      const { error } = await supabase
        .from('review_likes')
        .delete()
        .eq('review_id', reviewId)
        .eq('user_id', userId);

      if (error) {
        return { success: false, data: null, error: error.message };
      }

      return { success: true, data: false, error: null };
    } else {
      // 좋아요 추가
      const { error } = await supabase
        .from('review_likes')
        .insert({
          review_id: reviewId,
          user_id: userId
        });

      if (error) {
        return { success: false, data: null, error: error.message };
      }

      return { success: true, data: true, error: null };
    }
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 리뷰 좋아요 수 조회
export const getReviewLikesCount = async (reviewId: string): Promise<ApiResponse<number>> => {
  try {
    const { count, error } = await supabase
      .from('review_likes')
      .select('*', { count: 'exact', head: true })
      .eq('review_id', reviewId);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: count || 0, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 사용자가 리뷰를 좋아요했는지 확인
export const checkReviewLikeStatus = async (reviewId: string, userId: string): Promise<ApiResponse<boolean>> => {
  try {
    const { data, error } = await supabase
      .from('review_likes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116은 "not found" 에러
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: !!data, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
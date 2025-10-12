import { supabase } from '../supabase/client';
import { 
  CommunityPost, 
  CommunityPostWithDetails, 
  PostComment, 
  PostCommentWithDetails,
  BoardCategory,
  CommunityPostFormData,
  PostCommentFormData,
  CommunityPostSearchParams,
  ApiResponse,
  PaginatedResponse 
} from '../types';

// 게시판 카테고리 목록 조회
export const getBoardCategories = async (): Promise<ApiResponse<BoardCategory[]>> => {
  try {
    const { data, error } = await supabase
      .from('board_categories')
      .select('*')
      .order('order_index');

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as BoardCategory[], error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 커뮤니티 게시글 목록 조회
export const getCommunityPosts = async (params: CommunityPostSearchParams = {}): Promise<ApiResponse<PaginatedResponse<CommunityPostWithDetails>>> => {
  try {
    const {
      category_id,
      query = '',
      sort_by = 'created_at',
      sort_order = 'desc',
      page = 1,
      limit = 20
    } = params;

    let queryBuilder = supabase
      .from('community_posts')
      .select(`
        *,
        user:profiles(*),
        category:board_categories(*)
      `);

    // 카테고리 필터
    if (category_id) {
      queryBuilder = queryBuilder.eq('category_id', category_id);
    }

    // 검색어 필터
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
    }

    // 정렬
    const sortColumn = sort_by === 'view_count' ? 'view_count' :
                      sort_by === 'like_count' ? 'like_count' :
                      sort_by === 'comment_count' ? 'comment_count' : 'created_at';
    
    queryBuilder = queryBuilder.order(sortColumn, { ascending: sort_order === 'asc' });

    // 페이지네이션 (안전한 방식)
    if (page > 0 && limit > 0) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      queryBuilder = queryBuilder.range(from, to);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('❌ getCommunityPosts 에러:', error);
      return { success: false, data: null, error: error.message };
    }

    // 전체 개수를 위한 별도 요청 (향수 서비스와 완전히 동일한 방식)
    let totalCount = 0;
    try {
      console.log('🔍 totalCount 조회 시작:', { category_id, query });
      
      // 실제 데이터를 가져와서 개수를 셈 (향수 서비스와 동일)
      let countQueryBuilder = supabase
        .from('community_posts')
        .select('id'); // head: true 제거
      
      // 동일한 필터 적용
      if (category_id) {
        countQueryBuilder = countQueryBuilder.eq('category_id', category_id);
      }
      if (query) {
        countQueryBuilder = countQueryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
      }
      
      const { data: countData, error: countError } = await countQueryBuilder;
      
      if (countError) {
        console.error('⚠️ totalCount 조회 에러:', countError);
        totalCount = data?.length || 0;
      } else {
        totalCount = countData?.length || 0;
        console.log('✅ totalCount 조회 성공:', totalCount);
      }
    } catch (countError) {
      console.error('⚠️ totalCount 조회 실패:', countError);
      console.log('⚠️ 데이터 길이로 대체:', data?.length);
      totalCount = data?.length || 0;
    }

    const totalPages = Math.ceil(totalCount / limit);

    console.log('📊 getCommunityPosts 반환값:', {
      count: totalCount,
      totalPages,
      dataLength: data?.length || 0
    });

    return {
      success: true,
      data: {
        data: data as CommunityPostWithDetails[],
        count: totalCount,
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

// 게시글 상세 조회
export const getCommunityPostById = async (postId: string): Promise<ApiResponse<CommunityPostWithDetails>> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:profiles(*),
        category:board_categories(*)
      `)
      .eq('id', postId)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as CommunityPostWithDetails, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 게시글 작성
export const createCommunityPost = async (userId: string, postData: CommunityPostFormData): Promise<ApiResponse<CommunityPostWithDetails>> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: userId,
        category_id: postData.category_id,
        title: postData.title,
        content: postData.content,
        image_urls: postData.image_urls
      })
      .select(`
        *,
        user:profiles(*),
        category:board_categories(*)
      `)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as CommunityPostWithDetails, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 게시글 수정
export const updateCommunityPost = async (postId: string, userId: string, postData: Partial<CommunityPostFormData>): Promise<ApiResponse<CommunityPostWithDetails>> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .update({
        ...postData,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .eq('user_id', userId)
      .select(`
        *,
        user:profiles(*),
        category:board_categories(*)
      `)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as CommunityPostWithDetails, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 게시글 삭제
export const deleteCommunityPost = async (postId: string, userId: string): Promise<ApiResponse<boolean>> => {
  try {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: true, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 조회수 증가
export const incrementViewCount = async (postId: string): Promise<ApiResponse<boolean>> => {
  try {
    const { error } = await supabase.rpc('increment_view_count', { post_id: postId });

    if (error) {
      // RPC 함수가 없으면 직접 업데이트
      const { data: post } = await supabase
        .from('community_posts')
        .select('view_count')
        .eq('id', postId)
        .single();

      if (post) {
        await supabase
          .from('community_posts')
          .update({ view_count: (post.view_count || 0) + 1 })
          .eq('id', postId);
      }
    }

    return { success: true, data: true, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 게시글 댓글 목록 조회
export const getPostComments = async (postId: string): Promise<ApiResponse<PostCommentWithDetails[]>> => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        user:profiles(*)
      `)
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    // 대댓글 조회
    const commentsWithReplies = await Promise.all(
      data.map(async (comment) => {
        const { data: replies } = await supabase
          .from('post_comments')
          .select(`
            *,
            user:profiles(*)
          `)
          .eq('parent_id', comment.id)
          .order('created_at', { ascending: true });

        return {
          ...comment,
          replies: replies || []
        };
      })
    );

    return { success: true, data: commentsWithReplies as PostCommentWithDetails[], error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 댓글 작성
export const createPostComment = async (userId: string, postId: string, commentData: PostCommentFormData): Promise<ApiResponse<PostCommentWithDetails>> => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        parent_id: commentData.parent_id,
        content: commentData.content
      })
      .select(`
        *,
        user:profiles(*)
      `)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as PostCommentWithDetails, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 댓글 수정
export const updatePostComment = async (commentId: string, userId: string, content: string): Promise<ApiResponse<PostCommentWithDetails>> => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .eq('user_id', userId)
      .select(`
        *,
        user:profiles(*)
      `)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as PostCommentWithDetails, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 댓글 삭제
export const deletePostComment = async (commentId: string, userId: string): Promise<ApiResponse<boolean>> => {
  try {
    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: true, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
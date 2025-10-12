// 앱에서 사용할 비즈니스 로직 타입 정의

// 사용자 관련 타입
export interface User {
  id: string;
  nickname: string;
  avatar_url?: string;
  google_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  // 추가 프로필 정보가 필요하면 여기에 추가
}

// 향수 관련 타입
export interface Brand {
  id: string;
  name_kr: string;
  name_en: string;
  nickname?: string;
  description?: string;
  logo_url?: string;
  country?: string;
  official_url?: string; // 브랜드 공식 사이트 링크
  created_at: string;
}

export interface Perfume {
  id: string;
  brand_id: string;
  name: string; // 영문명
  name_kr?: string; // 한글명
  description?: string;
  image_url?: string;
  price?: number;
  volume_ml?: number;
  gender?: 'male' | 'female' | 'unisex';
  release_year?: number;
  fragrantica_url?: string; // Fragrantica 링크
  official_url?: string; // 브랜드 공식 제품 링크
  created_at: string;
  updated_at: string;
}

export interface PerfumeWithBrand extends Perfume {
  brand: Brand;
}

export interface PerfumeWithDetails extends PerfumeWithBrand {
  notes: PerfumeNote[];
  fragrant_wheels: PerfumeFragrantWheel[];
  tags: Tag[];
  accords: PerfumeAccord[]; // 어코드 추가
  reviews?: Review[];
  user_favorite?: UserFavorite;
}

// Fragrant Wheel 관련 타입
export interface FragrantWheel {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  color_code?: string;
  created_at: string;
}

export interface PerfumeFragrantWheel {
  id: string;
  perfume_id: string;
  fragrant_wheel_id: string;
  intensity: number; // 1-5
  created_at: string;
  fragrant_wheel?: FragrantWheel;
}

// 향수 노트 타입
export interface PerfumeNote {
  id: string;
  perfume_id: string;
  note_name: string;
  note_type: 'top' | 'middle' | 'base';
  created_at: string;
}

// 태그 타입
export interface Tag {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface PerfumeTag {
  id: string;
  perfume_id: string;
  tag_id: string;
  tag?: Tag;
}

// 어코드 관련 타입
export interface Accord {
  id: string;
  name: string; // 영문 어코드명 (예: "fruity", "woody")
  name_kr?: string; // 한글 어코드명
  description?: string;
  created_at: string;
}

export interface PerfumeAccord {
  id: string;
  perfume_id: string;
  accord_id: string;
  priority: number; // 1=가장 중요, 10=덜 중요
  accord?: Accord;
  created_at: string;
}

// 리뷰 관련 타입
export interface Review {
  id: string;
  user_id: string;
  perfume_id: string;
  rating: number; // 1-5
  title?: string;
  content?: string;
  longevity_rating?: number; // 1-5
  sillage_rating?: number; // 1-5
  created_at: string;
  updated_at: string;
  user?: User;
  perfume?: Perfume;
  likes_count?: number;
  is_liked?: boolean;
}

export interface ReviewWithDetails extends Review {
  user: User;
  perfume: Perfume;
  likes_count: number;
  is_liked: boolean;
}

// 사용자 찜하기 타입
export interface UserFavorite {
  id: string;
  user_id: string;
  perfume_id: string;
  favorite_type: 'owned' | 'tried' | 'want_to_buy';
  created_at: string;
  perfume?: Perfume;
}

// 커뮤니티 관련 타입
export interface BoardCategory {
  id: string;
  name: string;
  description?: string;
  order_index: number;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  category_id?: string;
  title: string;
  content: string;
  image_urls?: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityPostWithDetails extends CommunityPost {
  user: User;
  category?: BoardCategory;
  is_liked?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface PostCommentWithDetails extends PostComment {
  user: User;
  is_liked?: boolean;
  replies?: PostCommentWithDetails[];
}

// 챗봇 관련 타입
export interface ChatbotConversation {
  id: string;
  user_id: string;
  chatbot_type: 'tommy' | 'nora' | 'scentie';
  message: string;
  is_user_message: boolean;
  created_at: string;
}

export interface ChatbotMessage {
  id: string;
  chatbot_type: 'tommy' | 'nora' | 'scentie';
  message: string;
  is_user_message: boolean;
  created_at: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// 검색 및 필터 타입
export interface PerfumeSearchParams {
  query?: string;
  brand_id?: string;
  gender?: 'male' | 'female' | 'unisex';
  price_min?: number;
  price_max?: number;
  fragrant_wheel_ids?: string[];
  tag_ids?: string[];
  sort_by?: 'name' | 'price' | 'created_at' | 'rating';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CommunityPostSearchParams {
  category_id?: string;
  query?: string;
  sort_by?: 'created_at' | 'view_count' | 'like_count' | 'comment_count';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// 폼 데이터 타입
export interface ReviewFormData {
  rating: number;
  title?: string;
  content?: string;
  longevity_rating?: number;
  sillage_rating?: number;
}

export interface CommunityPostFormData {
  category_id: string;
  title: string;
  content: string;
  image_urls?: string[];
}

export interface PostCommentFormData {
  content: string;
  parent_id?: string;
}

// 통계 타입
export interface PerfumeStats {
  total_perfumes: number;
  total_brands: number;
  total_reviews: number;
  average_rating: number;
  most_popular_brands: Array<{
    brand: Brand;
    count: number;
  }>;
  most_reviewed_perfumes: Array<{
    perfume: Perfume;
    review_count: number;
    average_rating: number;
  }>;
}

export interface UserStats {
  total_reviews: number;
  total_favorites: number;
  owned_perfumes: number;
  tried_perfumes: number;
  want_to_buy_perfumes: number;
  favorite_brands: Array<{
    brand: Brand;
    count: number;
  }>;
}
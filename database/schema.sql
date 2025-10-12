-- 향수 앱 데이터베이스 스키마
-- Supabase에서 실행할 SQL 스크립트

-- 1. 사용자 프로필 테이블 (auth.users와 연결)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nickname TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  google_id TEXT UNIQUE, -- 구글 계정 연결용
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 향수 브랜드 테이블
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_kr TEXT NOT NULL, -- 한글명 (필수)
  name_en TEXT NOT NULL, -- 영문명 (필수)
  nickname TEXT, -- 닉네임 (선택사항)
  description TEXT,
  logo_url TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name_kr, name_en) -- 한글명과 영문명 조합은 유일해야 함
);

-- 3. 향수 테이블
CREATE TABLE perfumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10,2),
  volume_ml INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'unisex')),
  release_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Fragrant Wheel 테이블 (향수 특징 정보)
CREATE TABLE fragrant_wheels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES fragrant_wheels(id), -- 계층 구조용 (예: 플로럴 > 화이트 플로럴)
  color_code TEXT, -- UI에서 사용할 색상 코드
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 향수-Fragrant Wheel 연결 테이블
CREATE TABLE perfume_fragrant_wheels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  fragrant_wheel_id UUID REFERENCES fragrant_wheels(id) ON DELETE CASCADE,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5) DEFAULT 3, -- 강도 (1-5)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(perfume_id, fragrant_wheel_id)
);

-- 6. 향수 노트 테이블 (상단, 중단, 하단 노트)
CREATE TABLE perfume_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  note_name TEXT NOT NULL,
  note_type TEXT CHECK (note_type IN ('top', 'middle', 'base')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 향수 태그 테이블
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 향수-태그 연결 테이블
CREATE TABLE perfume_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(perfume_id, tag_id)
);

-- 7. 향수 리뷰 테이블
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  content TEXT,
  longevity_rating INTEGER CHECK (longevity_rating >= 1 AND longevity_rating <= 5),
  sillage_rating INTEGER CHECK (sillage_rating >= 1 AND sillage_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, perfume_id)
);

-- 8. 리뷰 좋아요 테이블
CREATE TABLE review_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, review_id)
);

-- 9. 사용자 찜한 향수 테이블
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  favorite_type TEXT CHECK (favorite_type IN ('owned', 'tried', 'want_to_buy')) NOT NULL, -- 내가산향수, 써본향수, 사고싶은향수
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, perfume_id, favorite_type) -- 같은 향수를 같은 타입으로 중복 찜 방지
);

-- 10. 커뮤니티 게시판 카테고리 테이블
CREATE TABLE board_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. 커뮤니티 게시글 테이블
CREATE TABLE community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES board_categories(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[], -- 이미지 URL 배열
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. 커뮤니티 댓글 테이블
CREATE TABLE post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES post_comments(id), -- 대댓글용
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. 게시글 좋아요 테이블
CREATE TABLE post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 14. 댓글 좋아요 테이블
CREATE TABLE comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- 15. 챗봇 대화 기록 테이블
CREATE TABLE chatbot_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  chatbot_type TEXT CHECK (chatbot_type IN ('tommy', 'nora', 'scentie')) NOT NULL,
  message TEXT NOT NULL,
  is_user_message BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_perfumes_brand_id ON perfumes(brand_id);
CREATE INDEX idx_perfumes_name ON perfumes(name);
CREATE INDEX idx_brands_name_kr ON brands(name_kr);
CREATE INDEX idx_brands_name_en ON brands(name_en);
CREATE INDEX idx_fragrant_wheels_parent_id ON fragrant_wheels(parent_id);
CREATE INDEX idx_perfume_fragrant_wheels_perfume_id ON perfume_fragrant_wheels(perfume_id);
CREATE INDEX idx_perfume_fragrant_wheels_fragrant_wheel_id ON perfume_fragrant_wheels(fragrant_wheel_id);
CREATE INDEX idx_reviews_perfume_id ON reviews(perfume_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_perfume_id ON user_favorites(perfume_id);
CREATE INDEX idx_user_favorites_type ON user_favorites(favorite_type);
CREATE INDEX idx_community_posts_category_id ON community_posts(category_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_chatbot_conversations_user_id ON chatbot_conversations(user_id);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- 기본 RLS 정책 (예시)
-- 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 모든 사용자가 향수 정보 조회 가능
CREATE POLICY "Anyone can view perfumes" ON perfumes
  FOR SELECT USING (true);

-- 사용자는 자신의 리뷰만 수정/삭제 가능
CREATE POLICY "Users can manage own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);

-- 모든 사용자가 리뷰 조회 가능
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);
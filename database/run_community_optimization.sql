-- ==========================================
-- 커뮤니티 인덱스 최적화 - 간편 실행 스크립트
-- Supabase SQL Editor에서 전체 선택 후 실행
-- ==========================================

-- Step 1: PostgreSQL 확장 활성화
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Step 2: 커뮤니티 인덱스 생성 (필수)
CREATE INDEX IF NOT EXISTS idx_community_posts_category_created ON community_posts(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_view_count_desc ON community_posts(view_count DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_community_posts_like_count_desc ON community_posts(like_count DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Step 3: 댓글 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_post_comments_post_created ON post_comments(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_created ON post_comments(user_id, created_at DESC);

-- Step 4: 검색 인덱스 생성 (선택적 - 검색 기능 사용 시)
CREATE INDEX IF NOT EXISTS idx_community_posts_title_trgm ON community_posts USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_community_posts_content_trgm ON community_posts USING gin(content gin_trgm_ops);

-- Step 5: 완료 확인
SELECT 
  '✅ 인덱스 생성 완료!' as status,
  COUNT(*) as "생성된 인덱스 수"
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('community_posts', 'post_comments', 'profiles')
  AND indexname LIKE 'idx_%';


-- ================================================
-- Nostum 앱 - 검색 인덱스 생성 (GIN + Trigram)
-- 작성일: 2025-10-12
-- 참조: docs/DATABASE_SCHEMA_FINAL.md Line 384-416
-- ================================================

-- ================================================
-- pg_trgm 확장 활성화
-- ================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ================================================
-- 1. 커뮤니티 게시글 검색 인덱스
-- ================================================

-- 제목 검색 (소프트 삭제 필터링 - DATABASE_SCHEMA_FINAL.md Line 395-401)
CREATE INDEX IF NOT EXISTS idx_community_posts_title_gin 
  ON community_posts USING gin(title gin_trgm_ops) 
  WHERE is_deleted = false;

-- 내용 검색
CREATE INDEX IF NOT EXISTS idx_community_posts_content_gin 
  ON community_posts USING gin(content gin_trgm_ops) 
  WHERE is_deleted = false;

COMMENT ON INDEX idx_community_posts_title_gin IS '게시글 제목 텍스트 검색 (GIN + Trigram)';
COMMENT ON INDEX idx_community_posts_content_gin IS '게시글 내용 텍스트 검색 (GIN + Trigram)';

-- ================================================
-- 2. 향수 검색 인덱스
-- ================================================

-- 한글명 검색
CREATE INDEX IF NOT EXISTS idx_perfumes_name_kr_gin 
  ON perfumes USING gin(name_kr gin_trgm_ops);

-- 영문명 검색
CREATE INDEX IF NOT EXISTS idx_perfumes_name_gin 
  ON perfumes USING gin(name gin_trgm_ops);

COMMENT ON INDEX idx_perfumes_name_kr_gin IS '향수 한글명 텍스트 검색 (GIN + Trigram)';
COMMENT ON INDEX idx_perfumes_name_gin IS '향수 영문명 텍스트 검색 (GIN + Trigram)';

-- ================================================
-- 3. 리뷰 검색 인덱스
-- ================================================

-- 리뷰 내용 검색 (소프트 삭제 필터링 - DATABASE_SCHEMA_FINAL.md Line 209-211)
CREATE INDEX IF NOT EXISTS idx_reviews_content_gin 
  ON reviews USING gin(content gin_trgm_ops) 
  WHERE is_deleted = false;

COMMENT ON INDEX idx_reviews_content_gin IS '리뷰 내용 텍스트 검색 (GIN + Trigram)';

-- ================================================
-- 완료 메시지
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE '검색 인덱스 생성 완료! (GIN + Trigram)';
  RAISE NOTICE '- community_posts: title, content';
  RAISE NOTICE '- perfumes: name_kr, name';
  RAISE NOTICE '- reviews: content';
  RAISE NOTICE '================================================';
END $$;


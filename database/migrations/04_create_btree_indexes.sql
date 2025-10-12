-- ================================================
-- Nostum 앱 - B-Tree 인덱스 생성 (정렬/필터)
-- 작성일: 2025-10-12
-- 참조: docs/DATABASE_SCHEMA_FINAL.md Line 418-467
-- ================================================

-- ================================================
-- 1. 커뮤니티 인덱스
-- ================================================

-- 타임스탬프 (정렬) - DATABASE_SCHEMA_FINAL.md Line 424-430
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at 
  ON community_posts(created_at DESC) 
  WHERE is_deleted = false;

-- 카테고리별 + 타임스탬프 (복합) - DATABASE_SCHEMA_FINAL.md Line 433-439
CREATE INDEX IF NOT EXISTS idx_community_posts_category 
  ON community_posts(category_id, created_at DESC) 
  WHERE is_deleted = false;

-- 사용자별 게시글
CREATE INDEX IF NOT EXISTS idx_community_posts_user 
  ON community_posts(user_id, created_at DESC) 
  WHERE is_deleted = false;

-- 고정 게시글
CREATE INDEX IF NOT EXISTS idx_community_posts_pinned 
  ON community_posts(is_pinned, created_at DESC) 
  WHERE is_pinned = true AND is_deleted = false;

-- 댓글
CREATE INDEX IF NOT EXISTS idx_post_comments_post 
  ON post_comments(post_id, created_at ASC) 
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_post_comments_user 
  ON post_comments(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_post_comments_parent 
  ON post_comments(parent_comment_id, created_at ASC) 
  WHERE parent_comment_id IS NOT NULL;

-- ================================================
-- 2. 리뷰 인덱스
-- ================================================

-- 향수별 리뷰 (DATABASE_SCHEMA_FINAL.md Line 204-207)
CREATE INDEX IF NOT EXISTS idx_reviews_perfume_id 
  ON reviews(perfume_id, created_at DESC) 
  WHERE is_deleted = false;

-- 사용자별 리뷰
CREATE INDEX IF NOT EXISTS idx_reviews_user_id 
  ON reviews(user_id, created_at DESC);

-- 평점 정렬
CREATE INDEX IF NOT EXISTS idx_reviews_rating 
  ON reviews(rating DESC) 
  WHERE is_deleted = false;

-- 향수별 리뷰 (추가)
CREATE INDEX IF NOT EXISTS idx_reviews_perfume 
  ON reviews(perfume_id, created_at DESC) 
  WHERE is_deleted = false;

-- 평점 정렬 (추가)
CREATE INDEX IF NOT EXISTS idx_reviews_rating_sort 
  ON reviews(perfume_id, rating DESC) 
  WHERE is_deleted = false;

-- ================================================
-- 3. 복합 인덱스 (자주 함께 조회)
-- ================================================

-- 사용자의 카테고리별 찜하기
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_category 
  ON user_favorites(user_id, category, created_at DESC);

-- 향수별 찜하기 (관심순 정렬용)
-- 모든 카테고리 포함 (필요 시 쿼리에서 필터링)
CREATE INDEX IF NOT EXISTS idx_user_favorites_perfume_count 
  ON user_favorites(perfume_id, category);

-- 알림 (읽지 않은 알림) - DATABASE_SCHEMA_FINAL.md Line 458-461
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
  ON notifications(user_id, created_at DESC) 
  WHERE is_read = false;

-- 신고 (처리 대기) - DATABASE_SCHEMA_FINAL.md Line 463-465
CREATE INDEX IF NOT EXISTS idx_reports_pending 
  ON reports(status, created_at DESC);

-- 신고 대상별
CREATE INDEX IF NOT EXISTS idx_reports_target_type 
  ON reports(target_type, target_id);

-- ================================================
-- 4. 캘린더 인덱스 (이미 01_add_new_tables.sql에 포함)
-- ================================================

-- perfume_calendar 인덱스는 테이블 생성 시 함께 생성됨

-- ================================================
-- 완료 메시지
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'B-Tree 인덱스 생성 완료!';
  RAISE NOTICE '- community_posts: 정렬/필터 인덱스';
  RAISE NOTICE '- post_comments: 게시글별, 대댓글';
  RAISE NOTICE '- reviews: 향수별, 평점';
  RAISE NOTICE '- user_favorites: 카테고리별';
  RAISE NOTICE '- notifications: 읽지 않은 알림';
  RAISE NOTICE '- reports: 처리 대기';
  RAISE NOTICE '================================================';
END $$;


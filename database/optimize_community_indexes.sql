-- 커뮤니티 데이터베이스 인덱스 최적화
-- Supabase SQL Editor에서 실행

-- ==========================================
-- 1. 검색 성능 최적화
-- ==========================================

-- 제목 검색 (ILIKE '%검색어%' 최적화)
CREATE INDEX IF NOT EXISTS idx_community_posts_title_gin 
ON community_posts USING gin(to_tsvector('korean', title));

-- 내용 검색 (ILIKE '%검색어%' 최적화)
CREATE INDEX IF NOT EXISTS idx_community_posts_content_gin 
ON community_posts USING gin(to_tsvector('korean', content));

-- 일반 텍스트 패턴 매칭용 (ILIKE 대체)
CREATE INDEX IF NOT EXISTS idx_community_posts_title_trgm 
ON community_posts USING gin(title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_community_posts_content_trgm 
ON community_posts USING gin(content gin_trgm_ops);

-- ==========================================
-- 2. 정렬 성능 최적화
-- ==========================================

-- 조회수 정렬 (인기글)
CREATE INDEX IF NOT EXISTS idx_community_posts_view_count_desc 
ON community_posts(view_count DESC NULLS LAST);

-- 좋아요수 정렬 (인기글)
CREATE INDEX IF NOT EXISTS idx_community_posts_like_count_desc 
ON community_posts(like_count DESC NULLS LAST);

-- 댓글수 정렬 (활발한 글)
CREATE INDEX IF NOT EXISTS idx_community_posts_comment_count_desc 
ON community_posts(comment_count DESC NULLS LAST);

-- ==========================================
-- 3. 복합 인덱스 (여러 조건 동시 사용)
-- ==========================================

-- 카테고리별 최신순 (가장 많이 사용)
-- 주의: is_deleted 컬럼이 있는 경우에만 WHERE 조건 활성화
CREATE INDEX IF NOT EXISTS idx_community_posts_category_created 
ON community_posts(category_id, created_at DESC);

-- 카테고리별 조회수순
CREATE INDEX IF NOT EXISTS idx_community_posts_category_views 
ON community_posts(category_id, view_count DESC);

-- 카테고리별 좋아요순
CREATE INDEX IF NOT EXISTS idx_community_posts_category_likes 
ON community_posts(category_id, like_count DESC);

-- ==========================================
-- 4. 사용자 활동 인덱스
-- ==========================================

-- 작성자별 게시글 조회
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id 
ON community_posts(user_id, created_at DESC);

-- 프로필 역할별 조회 (관리자 필터링)
CREATE INDEX IF NOT EXISTS idx_profiles_role 
ON profiles(role);

-- ==========================================
-- 5. 댓글 시스템 인덱스
-- ==========================================

-- 게시글별 댓글 조회 (이미 있음: idx_post_comments_post_id)
-- 추가: 생성일 포함 복합 인덱스
CREATE INDEX IF NOT EXISTS idx_post_comments_post_created 
ON post_comments(post_id, created_at DESC);

-- 사용자별 댓글 조회
CREATE INDEX IF NOT EXISTS idx_post_comments_user_created 
ON post_comments(user_id, created_at DESC);

-- 대댓글 조회 (parent_comment_id가 있다면)
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_id 
ON post_comments(parent_comment_id, created_at ASC);

-- ==========================================
-- 6. 좋아요 시스템 인덱스
-- ==========================================

-- post_likes 테이블 (향후 생성 예정)
CREATE INDEX IF NOT EXISTS idx_post_likes_post_user 
ON post_likes(post_id, user_id);

CREATE INDEX IF NOT EXISTS idx_post_likes_user 
ON post_likes(user_id, created_at DESC);

-- comment_likes 테이블 (향후 생성 예정)
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_user 
ON comment_likes(comment_id, user_id);

-- ==========================================
-- 7. 신고 시스템 인덱스
-- ==========================================

-- reports 테이블 (향후 생성 예정)
CREATE INDEX IF NOT EXISTS idx_reports_target_type 
ON reports(target_type, target_id);

CREATE INDEX IF NOT EXISTS idx_reports_reporter 
ON reports(reporter_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_status 
ON reports(status, created_at DESC);

-- ==========================================
-- 8. 소프트 삭제 필터링 최적화
-- ==========================================

-- 삭제되지 않은 게시글만 조회 (Partial Index)
-- 주의: is_deleted 컬럼 추가 후 활성화
-- CREATE INDEX IF NOT EXISTS idx_community_posts_active 
-- ON community_posts(created_at DESC) 
-- WHERE is_deleted = false;

-- ==========================================
-- 9. 카테고리 시스템 인덱스
-- ==========================================

-- 카테고리 정렬 (order_index)
CREATE INDEX IF NOT EXISTS idx_board_categories_order 
ON board_categories(order_index ASC);

-- ==========================================
-- 인덱스 생성 완료 확인
-- ==========================================

-- 현재 테이블의 인덱스 확인 쿼리
-- SELECT 
--   schemaname,
--   tablename,
--   indexname,
--   indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
--   AND tablename IN ('community_posts', 'post_comments', 'board_categories', 'profiles')
-- ORDER BY tablename, indexname;

-- 인덱스 사용 통계 확인 쿼리
-- SELECT 
--   schemaname,
--   tablename,
--   indexname,
--   idx_scan as index_scans,
--   idx_tup_read as tuples_read,
--   idx_tup_fetch as tuples_fetched
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
--   AND tablename IN ('community_posts', 'post_comments')
-- ORDER BY idx_scan DESC;


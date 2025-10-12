-- ================================================
-- 소프트 삭제 컬럼 확인
-- 작성일: 2025-10-12
-- ================================================

-- community_posts 컬럼 확인
SELECT 'community_posts' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'community_posts'
  AND column_name IN ('is_deleted', 'deleted_at', 'deleted_by')
ORDER BY column_name;

-- post_comments 컬럼 확인
SELECT 'post_comments' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'post_comments'
  AND column_name IN ('is_deleted', 'deleted_at', 'deleted_by')
ORDER BY column_name;

-- reviews 테이블 존재 확인
SELECT 'reviews' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'reviews'
  AND column_name IN ('is_deleted', 'deleted_at', 'deleted_by')
ORDER BY column_name;

-- ================================================
-- 결과 해석:
-- - 각 테이블마다 3개 행이 나와야 함 (is_deleted, deleted_at, deleted_by)
-- - 0개 행이 나오면 02번 파일이 제대로 실행 안 된 것
-- ================================================


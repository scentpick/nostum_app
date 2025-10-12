-- ================================================
-- 기존 테이블 구조 확인
-- 작성일: 2025-10-12
-- ================================================

-- user_favorites 테이블 구조 확인
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_favorites'
ORDER BY ordinal_position;

-- 결과를 확인하고 category 컬럼이 있는지 체크하세요!


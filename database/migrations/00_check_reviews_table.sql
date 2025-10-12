-- ================================================
-- reviews 테이블 상태 확인
-- 작성일: 2025-10-12
-- ================================================

-- reviews 테이블 존재 여부 확인
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews' AND table_schema = 'public')
    THEN 'reviews 테이블 존재함 ✅'
    ELSE 'reviews 테이블 없음 ❌'
  END as table_status;

-- reviews 테이블 컬럼 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'reviews'
ORDER BY ordinal_position;

-- is_deleted 컬럼 특별 확인
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'reviews' 
        AND column_name = 'is_deleted'
    )
    THEN 'is_deleted 컬럼 존재함 ✅'
    ELSE 'is_deleted 컬럼 없음 ❌'
  END as is_deleted_status;

-- ================================================
-- 결과 해석:
-- - table_status: reviews 테이블이 있는지 확인
-- - 컬럼 목록: reviews 테이블의 모든 컬럼 확인
-- - is_deleted_status: is_deleted 컬럼이 있는지 확인
-- ================================================

-- ================================================
-- user_favorites 테이블 수정
-- 작성일: 2025-10-12
-- 문제: 기존 테이블에 category 컬럼이 없음
-- ================================================

-- ================================================
-- 옵션 A: 기존 테이블 삭제 후 재생성 (데이터 손실)
-- 테스트 데이터만 있거나 데이터가 없으면 이 방법 사용
-- ================================================

-- 주석 해제하여 사용:
-- DROP TABLE IF EXISTS user_favorites CASCADE;

-- 위를 실행한 후, 01_add_new_tables.sql을 다시 실행하세요

-- ================================================
-- 옵션 B: 기존 테이블에 컬럼 추가 (데이터 보존)
-- 중요한 데이터가 있으면 이 방법 사용
-- ================================================

-- 1. category 컬럼 추가
ALTER TABLE user_favorites ADD COLUMN IF NOT EXISTS 
  category TEXT NOT NULL DEFAULT 'interested';

-- 2. memo 컬럼 추가
ALTER TABLE user_favorites ADD COLUMN IF NOT EXISTS 
  memo TEXT;

-- 3. updated_at 컬럼 추가
ALTER TABLE user_favorites ADD COLUMN IF NOT EXISTS 
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. UNIQUE 제약조건 추가 (기존에 없다면)
-- 주의: 기존 데이터에 중복이 있으면 에러 발생
-- ALTER TABLE user_favorites 
--   DROP CONSTRAINT IF EXISTS user_favorites_user_id_perfume_id_category_key;
  
-- ALTER TABLE user_favorites 
--   ADD CONSTRAINT user_favorites_user_id_perfume_id_category_key 
--   UNIQUE(user_id, perfume_id, category);

-- ================================================
-- 실행 후 다음 단계
-- ================================================

-- 옵션 A를 선택했다면:
--   → 01_add_new_tables.sql 다시 실행

-- 옵션 B를 선택했다면:
--   → 01_add_new_tables.sql 다시 실행 (인덱스만 생성됨)

-- ================================================

DO $$
BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'user_favorites 테이블 수정 완료!';
  RAISE NOTICE '이제 01_add_new_tables.sql을 다시 실행하세요.';
  RAISE NOTICE '================================================';
END $$;


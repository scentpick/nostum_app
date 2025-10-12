-- ================================================
-- 누락된 컴포넌트 수정 (소프트 삭제 컬럼 + fragrance_wheel 테이블)
-- 작성일: 2025-10-12
-- ================================================

-- 1. perfumes 테이블에 소프트 삭제 컬럼 추가
ALTER TABLE perfumes 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);

-- 2. profiles 테이블에 소프트 삭제 컬럼 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);

-- 3. reviews 테이블에 소프트 삭제 컬럼 추가 (이미 있을 수 있음)
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);

-- 4. fragrance_wheel 테이블 생성
CREATE TABLE IF NOT EXISTS fragrance_wheel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE NOT NULL,
  
  -- 향수 노트 분류 (0.0 ~ 1.0 비율)
  citrus DECIMAL(3,2) DEFAULT 0.0 CHECK (citrus >= 0.0 AND citrus <= 1.0),
  fruity DECIMAL(3,2) DEFAULT 0.0 CHECK (fruity >= 0.0 AND fruity <= 1.0),
  sweet DECIMAL(3,2) DEFAULT 0.0 CHECK (sweet >= 0.0 AND sweet <= 1.0),
  floral DECIMAL(3,2) DEFAULT 0.0 CHECK (floral >= 0.0 AND floral <= 1.0),
  fresh DECIMAL(3,2) DEFAULT 0.0 CHECK (fresh >= 0.0 AND fresh <= 1.0),
  green DECIMAL(3,2) DEFAULT 0.0 CHECK (green >= 0.0 AND green <= 1.0),
  woody DECIMAL(3,2) DEFAULT 0.0 CHECK (woody >= 0.0 AND woody <= 1.0),
  spicy DECIMAL(3,2) DEFAULT 0.0 CHECK (spicy >= 0.0 AND spicy <= 1.0),
  oriental DECIMAL(3,2) DEFAULT 0.0 CHECK (oriental >= 0.0 AND oriental <= 1.0),
  musky DECIMAL(3,2) DEFAULT 0.0 CHECK (musky >= 0.0 AND musky <= 1.0),
  
  -- 제약조건: 모든 값의 합이 1.0이어야 함
  CONSTRAINT fragrance_wheel_total_check CHECK (
    citrus + fruity + sweet + floral + fresh + green + 
    woody + spicy + oriental + musky = 1.0
  ),
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 향수당 하나의 fragrance_wheel만 존재
  UNIQUE(perfume_id)
);

COMMENT ON TABLE fragrance_wheel IS '향수 노트 분류 (Fragrance Wheel)';

-- 5. fragrance_wheel 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_fragrance_wheel_perfume ON fragrance_wheel(perfume_id);

-- 6. 완료 확인
WITH 
-- 소프트 삭제 컬럼 확인
soft_delete_check AS (
  SELECT 
    'perfumes' as table_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'perfumes' 
        AND column_name = 'is_deleted'
    ) THEN '✅' ELSE '❌' END as is_deleted,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'perfumes' 
        AND column_name = 'deleted_at'
    ) THEN '✅' ELSE '❌' END as deleted_at,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'perfumes' 
        AND column_name = 'deleted_by'
    ) THEN '✅' ELSE '❌' END as deleted_by
  UNION ALL
  SELECT 
    'profiles' as table_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'is_deleted'
    ) THEN '✅' ELSE '❌' END as is_deleted,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'deleted_at'
    ) THEN '✅' ELSE '❌' END as deleted_at,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'deleted_by'
    ) THEN '✅' ELSE '❌' END as deleted_by
  UNION ALL
  SELECT 
    'reviews' as table_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'reviews' 
        AND column_name = 'is_deleted'
    ) THEN '✅' ELSE '❌' END as is_deleted,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'reviews' 
        AND column_name = 'deleted_at'
    ) THEN '✅' ELSE '❌' END as deleted_at,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'reviews' 
        AND column_name = 'deleted_by'
    ) THEN '✅' ELSE '❌' END as deleted_by
),
-- fragrance_wheel 테이블 확인
fragrance_wheel_check AS (
  SELECT 
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name = 'fragrance_wheel'
    ) THEN '✅ fragrance_wheel 테이블 생성됨' 
    ELSE '❌ fragrance_wheel 테이블 없음' END as status
)

-- 최종 결과 출력
SELECT 
  '소프트 삭제' as category,
  table_name as item,
  'is_deleted' as name,
  is_deleted as result
FROM soft_delete_check

UNION ALL

SELECT 
  '소프트 삭제' as category,
  table_name as item,
  'deleted_at' as name,
  deleted_at as result
FROM soft_delete_check

UNION ALL

SELECT 
  '소프트 삭제' as category,
  table_name as item,
  'deleted_by' as name,
  deleted_by as result
FROM soft_delete_check

UNION ALL

SELECT 
  '테이블' as category,
  'fragrance_wheel' as item,
  '생성 상태' as name,
  status as result
FROM fragrance_wheel_check

ORDER BY category, item, name;

-- ================================================
-- 완료 메시지
-- ================================================
SELECT '누락된 컴포넌트 수정 완료!' as message;

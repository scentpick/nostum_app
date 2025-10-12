-- 향수 앱 DB 스키마 마이그레이션
-- 어코드 테이블 추가 및 필드 확장

-- 1. perfumes 테이블에 새 컬럼 추가
ALTER TABLE perfumes 
ADD COLUMN IF NOT EXISTS name_kr TEXT,              -- 향수 한글명
ADD COLUMN IF NOT EXISTS fragrantica_url TEXT,      -- Fragrantica 링크
ADD COLUMN IF NOT EXISTS official_url TEXT;         -- 브랜드 공식 제품 링크

-- 2. brands 테이블에 새 컬럼 추가
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS official_url TEXT;         -- 브랜드 공식 사이트 링크

-- 3. 어코드(Accord) 테이블 생성
CREATE TABLE IF NOT EXISTS accords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,                        -- 어코드 이름 (예: "fruity", "woody")
  name_kr TEXT,                                      -- 한글 어코드 이름 (선택사항)
  description TEXT,                                  -- 어코드 설명
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 향수-어코드 연결 테이블 (N:N 관계)
CREATE TABLE IF NOT EXISTS perfume_accords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  accord_id UUID REFERENCES accords(id) ON DELETE CASCADE,
  priority INTEGER NOT NULL DEFAULT 1,              -- 어코드 우선순위 (1=가장 중요, 10=덜 중요)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(perfume_id, accord_id)
);

-- 5. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_perfumes_name_kr ON perfumes(name_kr);
CREATE INDEX IF NOT EXISTS idx_perfumes_fragrantica_url ON perfumes(fragrantica_url);
CREATE INDEX IF NOT EXISTS idx_brands_official_url ON brands(official_url);
CREATE INDEX IF NOT EXISTS idx_accords_name ON accords(name);
CREATE INDEX IF NOT EXISTS idx_perfume_accords_perfume_id ON perfume_accords(perfume_id);
CREATE INDEX IF NOT EXISTS idx_perfume_accords_accord_id ON perfume_accords(accord_id);
CREATE INDEX IF NOT EXISTS idx_perfume_accords_priority ON perfume_accords(priority);

-- 6. RLS (Row Level Security) 활성화
ALTER TABLE accords ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfume_accords ENABLE ROW LEVEL SECURITY;

-- 7. RLS 정책 설정 (기존 정책이 있으면 스킵)
DO $$ 
BEGIN
  -- accords 조회 정책
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'accords' 
    AND policyname = 'Anyone can view accords'
  ) THEN
    CREATE POLICY "Anyone can view accords" ON accords
      FOR SELECT USING (true);
  END IF;

  -- perfume_accords 조회 정책
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'perfume_accords' 
    AND policyname = 'Anyone can view perfume accords'
  ) THEN
    CREATE POLICY "Anyone can view perfume accords" ON perfume_accords
      FOR SELECT USING (true);
  END IF;
END $$;

-- 8. 코멘트 추가 (문서화)
COMMENT ON TABLE accords IS '향수 어코드(향의 분위기/특징)를 저장하는 테이블';
COMMENT ON TABLE perfume_accords IS '향수와 어코드의 N:N 관계를 저장하는 테이블';
COMMENT ON COLUMN perfume_accords.priority IS '어코드 우선순위: 1=가장 강함, 10=가장 약함';
COMMENT ON COLUMN perfumes.name_kr IS '향수 한글명';
COMMENT ON COLUMN perfumes.fragrantica_url IS 'Fragrantica 상세 페이지 링크';
COMMENT ON COLUMN perfumes.official_url IS '브랜드 공식 제품 페이지 링크';


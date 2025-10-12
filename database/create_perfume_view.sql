-- 향수 테이블 최적화: 향수-브랜드 통합 뷰 생성
-- 성능 개선을 위한 비정규화된 뷰 테이블

-- 1단계: 향수-브랜드 통합 뷰 생성
CREATE TABLE IF NOT EXISTS perfume_brands_view AS
SELECT 
  p.id,
  p.name,
  p.name_kr,
  p.description,
  p.image_url,
  p.price,
  p.volume_ml,
  p.gender,
  p.release_year,
  p.fragrantica_url,
  p.official_url,
  p.created_at,
  p.updated_at,
  p.brand_id,
  -- 브랜드 정보 직접 포함
  b.name_kr as brand_name_kr,
  b.name_en as brand_name_en,
  b.nickname as brand_nickname,
  b.country as brand_country,
  b.logo_url as brand_logo_url,
  b.official_url as brand_official_url
FROM perfumes p
LEFT JOIN brands b ON p.brand_id = b.id;

-- 2단계: 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_perfume_brands_view_name ON perfume_brands_view(name);
CREATE INDEX IF NOT EXISTS idx_perfume_brands_view_name_kr ON perfume_brands_view(name_kr);
CREATE INDEX IF NOT EXISTS idx_perfume_brands_view_brand_name_kr ON perfume_brands_view(brand_name_kr);
CREATE INDEX IF NOT EXISTS idx_perfume_brands_view_gender ON perfume_brands_view(gender);
CREATE INDEX IF NOT EXISTS idx_perfume_brands_view_price ON perfume_brands_view(price);
CREATE INDEX IF NOT EXISTS idx_perfume_brands_view_created_at ON perfume_brands_view(created_at);

-- 3단계: RLS 활성화
ALTER TABLE perfume_brands_view ENABLE ROW LEVEL SECURITY;

-- 4단계: RLS 정책 설정 (모든 사용자가 조회 가능)
CREATE POLICY "Anyone can view perfume brands view" ON perfume_brands_view
  FOR SELECT USING (true);

-- 5단계: 코멘트 추가
COMMENT ON TABLE perfume_brands_view IS '향수와 브랜드 정보가 통합된 최적화된 뷰 테이블';
COMMENT ON COLUMN perfume_brands_view.brand_name_kr IS '브랜드 한글명';
COMMENT ON COLUMN perfume_brands_view.brand_name_en IS '브랜드 영문명';
COMMENT ON COLUMN perfume_brands_view.brand_country IS '브랜드 국가';

-- 6단계: 데이터 확인
SELECT 
  COUNT(*) as total_perfumes,
  COUNT(DISTINCT brand_name_kr) as unique_brands
FROM perfume_brands_view;

-- RLS 정책 수정: INSERT/UPDATE/DELETE 권한 추가

-- 1. accords 테이블 정책
DROP POLICY IF EXISTS "Anyone can view accords" ON accords;
DROP POLICY IF EXISTS "Anyone can manage accords" ON accords;

CREATE POLICY "Anyone can view accords" ON accords
  FOR SELECT USING (true);

CREATE POLICY "Anyone can manage accords" ON accords
  FOR ALL USING (true);

-- 2. perfume_accords 테이블 정책
DROP POLICY IF EXISTS "Anyone can view perfume accords" ON perfume_accords;
DROP POLICY IF EXISTS "Anyone can manage perfume accords" ON perfume_accords;

CREATE POLICY "Anyone can view perfume accords" ON perfume_accords
  FOR SELECT USING (true);

CREATE POLICY "Anyone can manage perfume accords" ON perfume_accords
  FOR ALL USING (true);

-- 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename IN ('accords', 'perfume_accords')
ORDER BY tablename, policyname;


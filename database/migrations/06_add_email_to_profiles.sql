-- profiles 테이블에 email 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 기존 사용자들의 이메일 업데이트
UPDATE profiles 
SET email = auth.users.email
FROM auth.users
WHERE profiles.id = auth.users.id
AND profiles.email IS NULL;

-- email에 UNIQUE 제약 조건 추가
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_unique'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
  END IF;
END $$;

-- nickname UNIQUE 제약 조건 확인 (이미 있어야 함)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_nickname_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_nickname_key UNIQUE (nickname);
  END IF;
END $$;

-- google_id 컬럼 삭제 (email로 대체)
ALTER TABLE profiles DROP COLUMN IF EXISTS google_id;

-- 새 사용자 가입 시 자동으로 email 복사하는 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, email, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성 (이미 있으면 재생성)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 인덱스 추가 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- RLS 정책 추가 (관리자가 모든 사용자 수정 가능)
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 관리자 체크 함수 (무한 재귀 방지)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1
  ) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 관리자 SELECT 정책 (모든 프로필 조회 가능)
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (is_admin() OR id = auth.uid());

-- 관리자 UPDATE 정책 (모든 프로필 수정 가능)
CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
TO authenticated
USING (is_admin() OR id = auth.uid())
WITH CHECK (is_admin() OR id = auth.uid());

-- 결과 확인
SELECT 
  'Email column added' as status,
  COUNT(*) as total_users,
  COUNT(email) as users_with_email
FROM profiles;


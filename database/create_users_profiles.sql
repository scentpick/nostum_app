-- 사용자 프로필 생성 스크립트
-- Supabase SQL Editor에서 실행

-- 1. role 컬럼 추가 (아직 안했다면)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 2. RLS 임시 비활성화 (프로필 생성을 위해)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. 일반 유저 프로필 생성
INSERT INTO profiles (id, nickname, role)
VALUES ('e24e7884-a630-46e3-ac46-f49357945a9d', '일반유저', 'user')
ON CONFLICT (id) DO UPDATE SET 
  role = 'user', 
  nickname = COALESCE(profiles.nickname, '일반유저');

-- 4. 관리자 프로필 생성
INSERT INTO profiles (id, nickname, role)
VALUES ('147b05a4-0b1e-4846-8c5e-3ae20dd32717', '관리자', 'admin')
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin', 
  nickname = COALESCE(profiles.nickname, '관리자');

-- 5. RLS 다시 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 6. 생성된 프로필 확인
SELECT 
  p.id, 
  p.nickname, 
  p.role, 
  u.email,
  p.created_at
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.role DESC, p.created_at DESC;

-- 완료 메시지
SELECT 'Profiles created successfully!' as message;


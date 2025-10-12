-- profiles 테이블에 role 컬럼 추가
-- Supabase SQL Editor에서 실행하세요

-- 1. role 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 2. role 컬럼에 대한 체크 제약 추가 (옵션)
ALTER TABLE profiles ADD CONSTRAINT check_role_values 
CHECK (role IN ('admin', 'moderator', 'user'));

-- 3. role 컬럼 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 완료 메시지
SELECT 'Role column added successfully!' as message;


-- ================================================
-- Nostum 앱 - 기존 테이블 수정 마이그레이션
-- 작성일: 2025-10-12
-- 참조: docs/DATABASE_SCHEMA_FINAL.md
-- ================================================

-- ================================================
-- 1. profiles - 사용자 프로필 컬럼 추가
-- 참조: DATABASE_SCHEMA_FINAL.md Line 112-126
-- ================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  -- 닉네임 변경 제한 (한달에 1번)
  nickname_updated_at TIMESTAMP WITH TIME ZONE;
  
COMMENT ON COLUMN profiles.nickname_updated_at IS '마지막 닉네임 변경일 (한달 1회 제한용)';

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  -- 알림 설정
  email_notifications BOOLEAN DEFAULT true;
  
COMMENT ON COLUMN profiles.email_notifications IS '이메일 알림 수신 여부';

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  notification_type TEXT DEFAULT 'realtime';
  
COMMENT ON COLUMN profiles.notification_type IS '알림 타입 (realtime | hourly | daily | off)';

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  notification_interval INTEGER;
  
COMMENT ON COLUMN profiles.notification_interval IS '알림 간격 (시간, 1-24)';

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  notification_time INTEGER;
  
COMMENT ON COLUMN profiles.notification_time IS '하루 알림 시각 (0-23)';

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  -- 통계
  last_login_at TIMESTAMP WITH TIME ZONE;
  
COMMENT ON COLUMN profiles.last_login_at IS '마지막 로그인 시간';

-- ================================================
-- 2. community_posts - 소프트 삭제 컬럼 추가
-- 참조: DATABASE_SCHEMA_FINAL.md Line 592-607
-- ================================================

ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS
  is_deleted BOOLEAN DEFAULT false;

ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS
  deleted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS
  deleted_by UUID REFERENCES profiles(id);

COMMENT ON COLUMN community_posts.is_deleted IS '소프트 삭제 여부';
COMMENT ON COLUMN community_posts.deleted_at IS '삭제 시간';
COMMENT ON COLUMN community_posts.deleted_by IS '삭제한 사용자 (관리자 또는 본인)';

-- ================================================
-- 3. post_comments - 소프트 삭제 컬럼 추가
-- 참조: DATABASE_SCHEMA_FINAL.md Line 592-607
-- ================================================

ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS
  is_deleted BOOLEAN DEFAULT false;

ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS
  deleted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS
  deleted_by UUID REFERENCES profiles(id);

COMMENT ON COLUMN post_comments.is_deleted IS '소프트 삭제 여부';
COMMENT ON COLUMN post_comments.deleted_at IS '삭제 시간';
COMMENT ON COLUMN post_comments.deleted_by IS '삭제한 사용자 (관리자 또는 본인)';

-- ================================================
-- 4. perfumes - Tommy AI 설명 컬럼 추가
-- 참조: PERFUME.md Line 315-319
-- ================================================

ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS
  tommy_description TEXT;

COMMENT ON COLUMN perfumes.tommy_description IS 'Tommy AI 분석 설명 (관리자 페이지에서 관리)';

-- ================================================
-- 완료 메시지
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE '기존 테이블 수정 완료!';
  RAISE NOTICE '- profiles: 알림 설정, 닉네임 변경 제한 컬럼 추가';
  RAISE NOTICE '- community_posts: 소프트 삭제 컬럼 추가';
  RAISE NOTICE '- post_comments: 소프트 삭제 컬럼 추가';
  RAISE NOTICE '- perfumes: tommy_description 컬럼 추가';
  RAISE NOTICE '================================================';
END $$;


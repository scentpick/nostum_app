-- ================================================
-- community_posts 테이블에 소프트 삭제 컬럼 추가
-- 작성일: 2025-10-12
-- ================================================

-- community_posts에 소프트 삭제 컬럼 추가
ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_community_posts_is_deleted ON community_posts(is_deleted) WHERE is_deleted = true;

-- ================================================
-- 완료 확인
-- ================================================
SELECT 'community_posts 소프트 삭제 컬럼 추가 완료' as status;

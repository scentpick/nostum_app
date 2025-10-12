-- ==========================================
-- 소프트 삭제 컬럼 추가
-- 커뮤니티 규칙: 삭제된 게시글은 DB에서 지우지 않고 표시만 변경
-- ==========================================

-- 1. community_posts 테이블에 소프트 삭제 컬럼 추가
ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);

-- 2. post_comments 테이블에 소프트 삭제 컬럼 추가
ALTER TABLE post_comments 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);

-- 3. 인덱스 추가 (삭제되지 않은 항목만 빠르게 조회)
CREATE INDEX IF NOT EXISTS idx_community_posts_not_deleted 
ON community_posts(is_deleted, created_at DESC) 
WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_post_comments_not_deleted 
ON post_comments(is_deleted, created_at DESC) 
WHERE is_deleted = false;

-- 4. 완료 확인
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('community_posts', 'post_comments')
  AND column_name IN ('is_deleted', 'deleted_at', 'deleted_by')
ORDER BY table_name, column_name;


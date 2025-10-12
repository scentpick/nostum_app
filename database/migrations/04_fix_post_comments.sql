-- ================================================
-- post_comments 테이블에 누락된 컬럼 추가
-- 작성일: 2025-10-12
-- ================================================

-- post_comments 테이블에 parent_comment_id 컬럼 추가 (대댓글용)
ALTER TABLE post_comments 
ADD COLUMN IF NOT EXISTS parent_comment_id UUID REFERENCES post_comments(id);

-- parent_comment_id 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_post_comments_parent 
  ON post_comments(parent_comment_id, created_at ASC) 
  WHERE parent_comment_id IS NOT NULL;

-- 완료 확인
SELECT 'post_comments 테이블 수정 완료!' as message;

-- 커뮤니티 기능을 위한 데이터베이스 스키마 확장
-- 사용자 요구사항에 따른 테이블 및 컬럼 추가

-- 1. profiles 테이블에 권한 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
-- role: 'admin', 'moderator', 'user' 등으로 확장 가능

-- 2. 신고(reports) 테이블 생성
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  reason VARCHAR(20) NOT NULL CHECK (reason IN ('spam', 'abuse', 'advertisement', 'other')),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. 드래프트(drafts) 테이블 생성 (계정당 1개만 가능)
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  category_id INTEGER REFERENCES board_categories(id),
  title VARCHAR(100),
  content TEXT CHECK (length(content) <= 2000),
  image_urls JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. 게시글 좋아요(post_likes) 테이블 생성
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 5. 댓글 좋아요(comment_likes) 테이블 생성
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- 6. 기존 테이블에 소프트 삭제 컬럼 추가
-- community_posts 테이블
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);

-- post_comments 테이블
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);

-- 7. 기존 테이블에 좋아요 수 컬럼 추가 (성능 최적화)
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- 8. 인덱스 생성 (성능 최적화)
-- 검색을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_search ON community_posts USING gin(to_tsvector('korean', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_posts_category_created ON community_posts(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON community_posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_notice ON community_posts(category_id, created_at DESC) WHERE is_deleted = FALSE;

-- 댓글 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_comments_post_created ON post_comments(post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_user_created ON post_comments(user_id, created_at DESC);

-- 좋아요 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user ON comment_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);

-- 신고 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_id);

-- 9. 좋아요 수 업데이트를 위한 함수 생성
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts 
    SET like_count = like_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts 
    SET like_count = like_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE post_comments 
    SET like_count = like_count + 1 
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE post_comments 
    SET like_count = like_count - 1 
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 10. 좋아요 수 업데이트 트리거 생성
DROP TRIGGER IF EXISTS trigger_update_post_like_count ON post_likes;
CREATE TRIGGER trigger_update_post_like_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

DROP TRIGGER IF EXISTS trigger_update_comment_like_count ON comment_likes;
CREATE TRIGGER trigger_update_comment_like_count
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_like_count();

-- 11. RLS (Row Level Security) 정책 설정
-- reports 테이블
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- drafts 테이블
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own drafts" ON drafts
  FOR ALL USING (auth.uid() = user_id);

-- post_likes 테이블
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage likes" ON post_likes
  FOR ALL USING (auth.uid() = user_id);

-- comment_likes 테이블
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage comment likes" ON comment_likes
  FOR ALL USING (auth.uid() = user_id);

-- 12. 기존 테이블의 RLS 정책 업데이트 (소프트 삭제 고려)
-- community_posts의 기본 조회 정책 수정
DROP POLICY IF EXISTS "Enable read access for all users" ON community_posts;
CREATE POLICY "Enable read access for all users" ON community_posts
  FOR SELECT USING (is_deleted = FALSE OR is_deleted IS NULL);

-- post_comments의 기본 조회 정책 수정
DROP POLICY IF EXISTS "Enable read access for all users" ON post_comments;
CREATE POLICY "Enable read access for all users" ON post_comments
  FOR SELECT USING (is_deleted = FALSE OR is_deleted IS NULL);

-- 13. 초기 데이터 설정 (관리자 계정 생성)
-- 테스트용 관리자 계정 (실제 운영 시에는 다른 방법으로 생성)
INSERT INTO profiles (id, nickname, role) 
VALUES ('00000000-0000-0000-0000-000000000000', '관리자', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 14. 완료 메시지
SELECT 'Community schema expansion completed successfully!' as message;

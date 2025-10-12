-- ================================================
-- Nostum 앱 - 새 테이블 생성 마이그레이션
-- 작성일: 2025-10-12
-- 참조: docs/DATABASE_SCHEMA_FINAL.md
-- ================================================

-- ================================================
-- 1. user_favorites - 찜한 향수 (카테고리별)
-- 참조: DATABASE_SCHEMA_FINAL.md Line 137-162
-- ================================================

CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE NOT NULL,
  
  -- 카테고리 (확장 가능)
  category TEXT NOT NULL DEFAULT 'interested',  
  -- 'sampled' (시향해본), 'used' (써본), 'today' (오늘 뿌린), 'owned' (보유중), 'interested' (관심)
  
  memo TEXT,  -- 개인 메모 (선택)
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, perfume_id, category)  -- 같은 카테고리 중복 방지
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id, category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_favorites_perfume ON user_favorites(perfume_id);

COMMENT ON TABLE user_favorites IS '사용자 찜하기 (카테고리별)';

-- ================================================
-- 2. perfume_calendar - 향수 캘린더 기록
-- 참조: DATABASE_SCHEMA_FINAL.md Line 260-289
-- ================================================

CREATE TABLE IF NOT EXISTS perfume_calendar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE NOT NULL,
  applied_date DATE NOT NULL,
  applied_time TIME, -- 선택적 (몇 시에 뿌렸는지)
  notes TEXT, -- 개인 메모 (선택)
  weather TEXT, -- 날씨 (선택)
  mood TEXT, -- 기분 (선택)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, perfume_id, applied_date) -- 같은 날 같은 향수 중복 방지
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_perfume_calendar_user_date ON perfume_calendar(user_id, applied_date DESC);
CREATE INDEX IF NOT EXISTS idx_perfume_calendar_perfume ON perfume_calendar(perfume_id, applied_date DESC);
-- 월별 조회용 (WHERE 절 제거하여 에러 방지)
CREATE INDEX IF NOT EXISTS idx_perfume_calendar_month ON perfume_calendar(user_id, applied_date);

COMMENT ON TABLE perfume_calendar IS '향수 캘린더 기록 (오늘 뿌린 향수 포함)';

-- ================================================
-- 3. perfume_feedback - 향수 피드백
-- 참조: PERFUME.md Line 289-302
-- ================================================

CREATE TABLE IF NOT EXISTS perfume_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('data_error', 'link_error', 'image_error', 'other')),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  admin_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_perfume_feedback_perfume ON perfume_feedback(perfume_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_perfume_feedback_user ON perfume_feedback(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_perfume_feedback_status ON perfume_feedback(status, created_at DESC);

COMMENT ON TABLE perfume_feedback IS '향수 데이터 피드백 (오류 신고)';

-- ================================================
-- 4. reviews - 리뷰
-- 참조: DATABASE_SCHEMA_FINAL.md Line 177-218
-- ================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  
  -- 내용
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
  title TEXT CHECK (char_length(title) <= 50),
  content TEXT NOT NULL CHECK (char_length(content) >= 10 AND char_length(content) <= 1000),
  image_urls TEXT[],
  
  -- 통계
  helpful_count INTEGER DEFAULT 0,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 소프트 삭제
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES profiles(id)
);

COMMENT ON TABLE reviews IS '향수 리뷰';

-- 인덱스는 04_create_btree_indexes.sql에서 생성
-- (테이블 생성 직후 인덱스 생성 시 순서 문제 발생 가능)

-- ================================================
-- 5. 좋아요 테이블 (post_likes, comment_likes, review_helpful)
-- 참조: DATABASE_SCHEMA_FINAL.md Line 221-256
-- ================================================

-- 게시글 좋아요
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 댓글 좋아요
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- 리뷰 도움됨
CREATE TABLE IF NOT EXISTS review_helpful (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON post_likes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user ON comment_likes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_helpful_review ON review_helpful(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_user ON review_helpful(user_id, created_at DESC);

COMMENT ON TABLE post_likes IS '게시글 좋아요';
COMMENT ON TABLE comment_likes IS '댓글 좋아요';
COMMENT ON TABLE review_helpful IS '리뷰 도움됨';

-- ================================================
-- 6. drafts - 게시글 드래프트
-- 참조: COMMUNITY.md Line 447-459
-- ================================================

CREATE TABLE IF NOT EXISTS drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT,
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- 계정당 1개
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_drafts_user ON drafts(user_id);

COMMENT ON TABLE drafts IS '게시글 드래프트 (계정당 1개)';

-- ================================================
-- 7. reports - 신고
-- 참조: DATABASE_SCHEMA_FINAL.md Line 292-321
-- ================================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) NOT NULL,
  
  -- 대상
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment', 'review')),
  target_id UUID NOT NULL,
  
  -- 신고 내용
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'abuse', 'ad', 'other')),
  description TEXT,
  
  -- 처리
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  processed_by UUID REFERENCES profiles(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  admin_note TEXT,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_id, created_at DESC);

COMMENT ON TABLE reports IS '신고 (게시글, 댓글, 리뷰)';

-- ================================================
-- 8. notifications - 알림
-- 참조: DATABASE_SCHEMA_FINAL.md Line 325-356
-- ================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- 알림 내용
  type TEXT NOT NULL CHECK (type IN ('comment', 'reply', 'mention', 'like', 'notice')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- 링크
  link_type TEXT CHECK (link_type IN ('post', 'comment', 'review')),
  link_id UUID,
  
  -- 상태
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year')
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE is_read = false;

-- 자동 삭제용 인덱스 (expires_at만 인덱싱, WHERE 절 제거)
CREATE INDEX IF NOT EXISTS idx_notifications_expired ON notifications(expires_at);

COMMENT ON TABLE notifications IS '사용자 알림 (1년 후 자동 만료)';

-- ================================================
-- 9. search_history - 검색 기록
-- 참조: DATABASE_SCHEMA_FINAL.md Line 643-678
-- ================================================

CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- 검색 정보
  query TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('perfume', 'community', 'review')),
  
  -- 검색 결과
  result_count INTEGER DEFAULT 0,
  
  -- 메타데이터 (향후 확장용)
  search_filters JSONB,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_category ON search_history(category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query, created_at DESC);

-- 정리 정책용 인덱스 (created_at만 인덱싱, WHERE 절 제거)
CREATE INDEX IF NOT EXISTS idx_search_history_cleanup ON search_history(created_at);

COMMENT ON TABLE search_history IS '검색 기록 (통계/트렌드 분석용, 6개월 후 자동 삭제)';

-- ================================================
-- 10. chatbot_messages - 챗봇 메시지
-- 참조: DATABASE_SCHEMA_FINAL.md Line 360-380
-- 참조: CHATBOT.md Line 179-192
-- ================================================

CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE NOT NULL,
  
  -- 메시지
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- 메타데이터
  metadata JSONB, -- 추천 향수 ID, 점수 등
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation ON chatbot_messages(conversation_id, created_at ASC);

COMMENT ON TABLE chatbot_messages IS 'Tommy 챗봇 메시지';

-- ================================================
-- 완료 메시지
-- ================================================

DO $$
BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE '새 테이블 생성 완료!';
  RAISE NOTICE '- user_favorites';
  RAISE NOTICE '- perfume_calendar';
  RAISE NOTICE '- perfume_feedback';
  RAISE NOTICE '- reviews';
  RAISE NOTICE '- post_likes, comment_likes, review_helpful';
  RAISE NOTICE '- drafts';
  RAISE NOTICE '- reports';
  RAISE NOTICE '- notifications';
  RAISE NOTICE '- search_history';
  RAISE NOTICE '- chatbot_messages';
  RAISE NOTICE '================================================';
END $$;


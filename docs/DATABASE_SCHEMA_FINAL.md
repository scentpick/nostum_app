# 최종 데이터베이스 스키마

> **작성일:** 2025-10-11  
> **버전:** 2.0 (문서 기반 재설계)  
> **목적:** 모든 기능 문서를 기반으로 한 최종 확정 스키마

---

## 📋 목차
1. [스키마 설계 원칙](#스키마-설계-원칙)
2. [전체 테이블 목록](#전체-테이블-목록)
3. [테이블 상세](#테이블-상세)
4. [인덱스 전략](#인덱스-전략)
5. [마이그레이션 계획](#마이그레이션-계획)

---

## 스키마 설계 원칙 ✅ 확정

### 1. 소프트 삭제 우선
**모든 사용자 생성 콘텐츠는 소프트 삭제**

```sql
-- 표준 소프트 삭제 컬럼
is_deleted BOOLEAN DEFAULT false,
deleted_at TIMESTAMP WITH TIME ZONE,
deleted_by UUID REFERENCES profiles(id)
```

**적용 대상:**
- ✅ community_posts (관리자가 하드 삭제 선택 가능)
- ✅ post_comments (관리자가 하드 삭제 선택 가능)
- ✅ reviews (관리자가 하드 삭제 선택 가능)
- ⚠️ profiles (소프트 삭제 후 관리자가 하드 삭제 선택 가능)
- ⚠️ perfumes (소프트 삭제 후 관리자가 하드 삭제 선택 가능)
- ❌ drafts (하드 삭제)
- ❌ notifications (자동 만료, 하드 삭제)

### 2. 타임스탬프 표준
```sql
-- 모든 테이블
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### 3. UUID 우선
- 모든 ID는 UUID 사용
- `gen_random_uuid()` 기본값

### 4. 정규화 vs 성능
- 기본: 3NF 정규화
- 필요 시: 뷰(View)로 비정규화

---

## 전체 테이블 목록

### 사용자 관련 (3개)
1. `profiles` - 사용자 프로필 ✅
2. `user_favorites` - 찜한 향수 (카테고리별)
3. `perfume_calendar` - 향수 캘린더 기록 (오늘 뿌린)

### 향수 관련 (6개)
4. `brands` - 브랜드 ✅
5. `perfumes` - 향수 ✅
6. `perfume_notes` - 노트 ✅
7. `accords` - 어코드 ✅
8. `perfume_accords` - 향수-어코드 연결 ✅
9. `reviews` - 리뷰
10. `perfume_feedback` - 향수 피드백

### 커뮤니티 관련 (6개)
11. `board_categories` - 게시판 카테고리 ✅
12. `community_posts` - 게시글 ✅
13. `post_comments` - 댓글 ✅
14. `post_likes` - 게시글 좋아요
15. `comment_likes` - 댓글 좋아요
16. `drafts` - 게시글 드래프트

### 신고 시스템 (1개)
17. `reports` - 신고

### 알림 시스템 (1개)
18. `notifications` - 알림

### 검색 히스토리 (1개)
19. `search_history` - 검색 기록

### 챗봇 (2개)
20. `chatbot_conversations` - 대화 ✅
21. `chatbot_messages` - 메시지

---

## 테이블 상세

### 1. profiles (수정 필요) ✅ 확정

#### 현재
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nickname TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,  -- auth.users의 email 자동 동기화 (트리거)
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 추가 필요 (확정)
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  -- 닉네임 변경 제한 (한달에 1번)
  nickname_updated_at TIMESTAMP WITH TIME ZONE,  -- 마지막 닉네임 변경일
  
  -- 알림 설정
  email_notifications BOOLEAN DEFAULT true,      -- 이메일 수신
  notification_type TEXT DEFAULT 'realtime',     -- 'realtime' | 'hourly' | 'daily' | 'off'
  notification_interval INTEGER,                 -- 알림 간격 (시간, 1-24)
  notification_time INTEGER,                     -- 하루 알림 시각 (0-23)
  
  -- 통계
  last_login_at TIMESTAMP WITH TIME ZONE;        -- 마지막 로그인
```

**설계 결정:**
- ❌ 자기소개 (bio) - 불필요
- ❌ 프로필 공개/비공개 - 프로필 조회 페이지 없음
- ❌ 활동 공개/비공개 - 활동은 본인/관리자만 조회
- ✅ 닉네임 변경 제한 - 한달 1회, `nickname_updated_at`으로 체크
- ✅ 썸네일/닉네임 변경 시 과거 게시글도 자동 반영 (profiles 테이블 참조)

---

### 2. user_favorites (신규 생성 필요) ✅ 확정

```sql
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE NOT NULL,
  
  -- 카테고리 (확장 가능) ✅ 확정
  category TEXT NOT NULL DEFAULT 'interested',  
  -- 'sampled' (시향해본), 'used' (써본), 'today' (오늘 뿌린), 'owned' (보유중), 'interested' (관심)
  -- CHECK 제약조건은 추후 추가 가능
  
  memo TEXT,  -- 개인 메모 (선택)
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, perfume_id, category)  -- 같은 카테고리 중복 방지
);

-- 인덱스
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id, category, created_at DESC);
CREATE INDEX idx_user_favorites_perfume ON user_favorites(perfume_id);
```

**설계 결정:**
- ✅ 카테고리별 찜하기 (여러 카테고리 추가 가능)
- ✅ 같은 향수를 다른 카테고리에 중복 추가 가능
- ✅ 개인 메모 기능
- ✅ 카테고리 값 (PERFUME.md와 일치):
  - `sampled`: 시향해본
  - `used`: 써본
  - `today`: 오늘 뿌린 (자동 변경됨)
  - `owned`: 보유중
  - `interested`: 관심

---

### 9. reviews (신규 생성 필요) ✅ 확정

```sql
CREATE TABLE reviews (
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

-- 인덱스
CREATE INDEX idx_reviews_perfume_id ON reviews(perfume_id, created_at DESC) WHERE is_deleted = false;
CREATE INDEX idx_reviews_user_id ON reviews(user_id, created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC) WHERE is_deleted = false;

-- 텍스트 검색 (GIN + Trigram)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_reviews_content_gin ON reviews USING gin(content gin_trgm_ops) WHERE is_deleted = false;
```

**설계 결정:**
- ❌ 익명 리뷰 불필요 (is_anonymous 컬럼 제거)
- ✅ 리뷰 수정 가능 (updated_at으로 "수정됨" 표시)
- ✅ 리뷰 내용 검색 가능 (GIN + Trigram 인덱스)

---

### 13-15. 좋아요 테이블 (신규 생성 필요)

```sql
-- 게시글 좋아요
CREATE TABLE post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 댓글 좋아요
CREATE TABLE comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- 리뷰 도움됨
CREATE TABLE review_helpful (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- 인덱스
CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id, created_at DESC);
CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX idx_review_helpful_review ON review_helpful(review_id);
```

---

### 3. perfume_calendar - 향수 캘린더 기록 ✅ 확정

```sql
CREATE TABLE perfume_calendar (
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
CREATE INDEX idx_perfume_calendar_user_date ON perfume_calendar(user_id, applied_date DESC);
CREATE INDEX idx_perfume_calendar_perfume ON perfume_calendar(perfume_id, applied_date DESC);
-- 월별 조회용 (주로 1년 이내 데이터 조회됨)
CREATE INDEX idx_perfume_calendar_month ON perfume_calendar(user_id, applied_date);
```

**설계 목적:**
- ✅ 날짜별 향수 사용 기록 저장
- ✅ 개인 캘린더 기능 (시간, 메모, 날씨, 기분)
- ✅ 통계 기능 (가장 많이 쓴 향수, 월별 통계)
- ✅ Phase 2에서 구현 예정

---

### 16. reports (신규 생성 필요)

```sql
CREATE TABLE reports (
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
CREATE INDEX idx_reports_status ON reports(status, created_at DESC);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_reporter ON reports(reporter_id, created_at DESC);
```

---

### 17. notifications (신규 생성 필요)

```sql
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  
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
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE is_read = false;

-- 만료된 알림 찾기용 (자동 삭제는 Edge Function에서 처리)
CREATE INDEX idx_notifications_expired ON notifications(expires_at);
```

---

### 19. chatbot_messages (신규 생성 필요)

```sql
CREATE TABLE chatbot_messages (
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
CREATE INDEX idx_chatbot_messages_conversation ON chatbot_messages(conversation_id, created_at ASC);
```

---

## 인덱스 전략 ✅ 확정

### 1. 텍스트 검색 인덱스 (GIN + Trigram)

**적용 대상:** 사용자가 검색하는 모든 텍스트 필드

```sql
-- pg_trgm 확장 활성화
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 커뮤니티 게시글 (제목 + 내용)
CREATE INDEX idx_community_posts_title_gin 
  ON community_posts USING gin(title gin_trgm_ops) 
  WHERE is_deleted = false;

CREATE INDEX idx_community_posts_content_gin 
  ON community_posts USING gin(content gin_trgm_ops) 
  WHERE is_deleted = false;

-- 향수 (한글명 + 영문명)
CREATE INDEX idx_perfumes_name_kr_gin 
  ON perfumes USING gin(name_kr gin_trgm_ops);

CREATE INDEX idx_perfumes_name_gin 
  ON perfumes USING gin(name gin_trgm_ops);

-- 리뷰 (내용)
CREATE INDEX idx_reviews_content_gin 
  ON reviews USING gin(content gin_trgm_ops) 
  WHERE is_deleted = false;
```

---

### 2. B-Tree 인덱스 (일반 검색/정렬)

**적용 대상:** FK, 정렬, 범위 검색

```sql
-- 타임스탬프 (정렬)
CREATE INDEX idx_community_posts_created_at 
  ON community_posts(created_at DESC) 
  WHERE is_deleted = false;

CREATE INDEX idx_reviews_created_at 
  ON reviews(created_at DESC) 
  WHERE is_deleted = false;

-- 외래키 + 복합 인덱스
CREATE INDEX idx_community_posts_category 
  ON community_posts(category_id, created_at DESC) 
  WHERE is_deleted = false;

CREATE INDEX idx_reviews_perfume 
  ON reviews(perfume_id, created_at DESC) 
  WHERE is_deleted = false;

CREATE INDEX idx_reviews_user 
  ON reviews(user_id, created_at DESC);

-- 좋아요 (UNIQUE 제약)
CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id, created_at DESC);
```

---

### 3. 복합 인덱스 (자주 함께 조회)

```sql
-- 사용자의 카테고리별 찜하기
CREATE INDEX idx_user_favorites_user_category 
  ON user_favorites(user_id, category, created_at DESC);

-- 알림 (읽지 않은 알림)
CREATE INDEX idx_notifications_unread 
  ON notifications(user_id, created_at DESC) 
  WHERE is_read = false;

-- 신고 (처리 대기)
CREATE INDEX idx_reports_pending 
  ON reports(status, created_at DESC);
```

---

### 4. 인덱스 유지보수

```sql
-- 인덱스 사용 통계 확인
SELECT 
  schemaname, tablename, indexname, 
  idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- 사용되지 않는 인덱스 확인
SELECT 
  schemaname, tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexname NOT LIKE '%pkey';
```

---

## 썸네일 이미지 처리 ✅ 확정

### 업로드 프로세스

```typescript
// 1. 클라이언트: 이미지 선택
const image = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],  // 1:1 비율 강제
  quality: 0.8,
});

// 2. 이미지 압축 (JPG로 변환)
const compressedImage = await manipulateAsync(
  image.uri,
  [{ resize: { width: 400, height: 400 } }],
  { compress: 0.8, format: SaveFormat.JPEG }
);

// 3. Supabase Storage 업로드
const fileName = `${userId}_${Date.now()}.jpg`;
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(fileName, compressedImage);

// 4. profiles 테이블 업데이트
await supabase
  .from('profiles')
  .update({ avatar_url: data.publicUrl })
  .eq('id', userId);
```

### 과거 게시글 자동 반영

**핵심:** `profiles` 테이블을 참조하므로 **자동 반영**

```typescript
// 게시글 조회 시 JOIN으로 최신 정보 가져오기
const { data } = await supabase
  .from('community_posts')
  .select(`
    *,
    author:profiles(nickname, avatar_url)
  `);

// 결과:
// {
//   id: '...',
//   title: '게시글 제목',
//   author: {
//     nickname: '새로운닉네임',  // 실시간 반영
//     avatar_url: '새로운이미지' // 실시간 반영
//   }
// }
```

---

## 닉네임 변경 제한 ✅ 확정

### 변경 제한 로직

```typescript
// 닉네임 변경 함수
async function updateNickname(userId: string, newNickname: string) {
  // 1. 현재 프로필 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname_updated_at')
    .eq('id', userId)
    .single();
  
  // 2. 마지막 변경일로부터 30일 체크
  const lastUpdated = profile.nickname_updated_at 
    ? new Date(profile.nickname_updated_at) 
    : null;
  
  if (lastUpdated) {
    const daysSince = Math.floor(
      (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSince < 30) {
      throw new Error(`닉네임은 ${30 - daysSince}일 후에 변경할 수 있습니다.`);
    }
  }
  
  // 3. 닉네임 업데이트
  const { error } = await supabase
    .from('profiles')
    .update({
      nickname: newNickname,
      nickname_updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
  
  if (error) throw error;
}
```

---

## 소프트 삭제 추가 스크립트

### 즉시 실행 필요

```sql
-- community_posts, post_comments에 소프트 삭제 추가
ALTER TABLE community_posts 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);

ALTER TABLE post_comments 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);
```

---

## 마이그레이션 계획

### Phase 1: 소프트 삭제 (즉시)
```sql
-- database/add_soft_delete_columns.sql
✅ 실행 완료 예정
```

### Phase 2: 좋아요 시스템 (1주 내)
```sql
-- database/create_likes_tables.sql
CREATE TABLE post_likes ...
CREATE TABLE comment_likes ...
CREATE TABLE review_helpful ...
```

### Phase 3: 신고 및 알림 (2주 내)
```sql
-- database/create_moderation_tables.sql
CREATE TABLE reports ...
CREATE TABLE notifications ...
```

### Phase 4: 리뷰 및 챗봇 (3-4주 내)
```sql
-- database/create_perfume_features.sql
CREATE TABLE reviews ...
CREATE TABLE chatbot_messages ...
```

---

### 18. search_history (신규 생성 필요) ✅ 확정

```sql
CREATE TABLE search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  
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
CREATE INDEX idx_search_history_user ON search_history(user_id, created_at DESC);
CREATE INDEX idx_search_history_category ON search_history(category, created_at DESC);
CREATE INDEX idx_search_history_query ON search_history(query, created_at DESC);

-- 오래된 검색 기록 정리용 (6개월 후 자동 삭제는 Edge Function에서 처리)
CREATE INDEX idx_search_history_cleanup ON search_history(created_at);
```

**설계 목적:**
- ✅ 통계/트렌드 페이지용 데이터 수집
- ✅ 개인 검색 히스토리 기능 (향후)
- ✅ 검색어 추천 기능 (향후)
- ✅ 6개월 후 자동 정리

---

## 예상 총 테이블 수

- **현재:** 9개
- **추가 필요:** 10개
- **최종:** 19개 (user_settings 제외)

---

## ✅ 최종 확정 요약

### 핵심 결정 사항

1. **프로필 관리**
   - ❌ 자기소개, 프로필 공개/비공개 불필요
   - ✅ 닉네임 변경 제한 (한달 1회)
   - ✅ 썸네일/닉네임 변경 시 과거 게시글 자동 반영 (JOIN)
   - ✅ 썸네일: JPG/PNG → 1:1 비율 → 400x400 JPG 압축

2. **찜하기 시스템**
   - ✅ 카테고리별 찜하기 (사고싶은, 써본, 오늘뿌린 등)
   - ✅ 카테고리 확장 가능
   - ✅ 개인 메모 기능

3. **리뷰 시스템**
   - ❌ 익명 리뷰 불필요
   - ✅ 리뷰 수정 가능 (수정됨 표시)
   - ✅ 리뷰 내용 검색 (GIN + Trigram)

4. **소프트 삭제**
   - ✅ 모든 사용자 콘텐츠: 소프트 삭제 우선
   - ✅ 관리자 페이지에서 하드 삭제 선택 가능
   - ❌ 드래프트, 알림: 하드 삭제

5. **인덱스 전략**
   - ✅ 텍스트 검색: GIN + Trigram
   - ✅ 일반 검색/정렬: B-Tree
   - ✅ 복합 인덱스 적극 활용

---

**이 스키마를 기반으로 안정적이고 확장 가능한 데이터베이스를 구축합니다.**


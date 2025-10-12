# 커뮤니티 기능 명세서 ✅ 확정

> **작성일:** 2025-10-11  
> **버전:** 3.0 (최종 확정)  
> **상태:** 개발 준비 완료 ✅

---

## 📋 목차
1. [개요](#1-개요)
2. [기능 상세](#2-기능-상세)
3. [데이터베이스](#3-데이터베이스)
4. [API](#4-api)
5. [UI 컴포넌트](#5-ui-컴포넌트)
6. [권한 및 보안](#6-권한-및-보안)
7. [성능 목표](#7-성능-목표)
8. [테스트 시나리오](#8-테스트-시나리오)
9. [의존성](#9-의존성)
10. [개발 우선순위](#10-개발-우선순위)

---

## 1. 개요

### 1.1 목적
향수 애호가들이 정보를 공유하고, 질문하고, 소통할 수 있는 안전하고 활발한 커뮤니티 공간

### 1.2 사용자 스토리
- "향수 구매 후기를 공유하고 싶어요"
- "향수 추천을 받고 싶어요"
- "다른 사람들의 향수 경험을 듣고 싶어요"
- "향수 관련 질문을 하고 싶어요"

### 1.3 핵심 목표
- ✅ 안전하고 건전한 커뮤니티 환경
- ✅ 빠르고 쾌적한 사용자 경험
- ✅ 효과적인 콘텐츠 관리 및 모더레이션

---

## 2. 기능 상세

### 2.1 게시글 목록

#### 현재 구현 상태
- ✅ 게시글 목록 조회
- ✅ 카테고리 필터링 (향수게시판, 공지사항)
- ✅ 검색 (제목 + 내용)
- ✅ 페이지네이션 (10개/페이지)
- ✅ 정렬 (최신순)
- ⚠️ 조회수순, 좋아요순 (UI만)

#### 게시판 카테고리
```
1. 향수게시판 (15개 게시글) ✅
2. 공지사항 (2개 게시글) ✅
3. 자유게시판 (준비 중)
4. 메거진 (준비 중)
5. 이벤트 (준비 중)
```

#### UI/UX
```
┌─────────────────────┐
│ 커뮤니티            │ ← 헤더 (70px)
├─────────────────────┤
│ [향수게시판][공지]  │ ← 탭
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ 제목            │ │ ← 게시글 카드
│ │ 내용 (2줄)      │ │
│ │ 작성자 • 1시간 전│ │
│ └─────────────────┘ │
│ ...                 │
├─────────────────────┤
│ < 1 2 3 >          │ ← 페이지네이션
├─────────────────────┤
│ 🔍 검색             │ ← 검색바
└─────────────────────┘
│ [글쓰기]            │ ← 플로팅 버튼
```

#### 운영 규칙

##### 콘텐츠 제한
| 항목 | 최대 | 최소 |
|------|------|------|
| 제목 | 100자 | 2자 |
| 내용 | 2,000자 | 10자 |

##### 이미지
- **개수**: 제한 없음 (권장 10개)
- **형식**: JPG, PNG, GIF
- **크기**: 5MB 이하/개
- **자동 처리**: 80% 압축, WebP 변환

##### 스팸 방지
- 24시간 내 **10개 이하** 글 작성

---

### 2.2 게시글 상세

#### 현재 구현 상태
- ✅ UI 구조 (제목, 본문, 작성자)
- ✅ 통계 정보 (조회수, 댓글수, 좋아요수)
- ✅ 댓글 섹션 UI (임시)
- ✅ 수정/삭제 버튼 UI
- ❌ 실제 데이터 연동 (대기)
- ❌ 조회수 자동 증가 (미구현)
- ❌ 좋아요 기능 (미구현)
- ❌ 공유 기능 (미구현)

#### UI 구조
```
┌─────────────────────┐
│ [←] 게시글      [⋮] │ ← 헤더
├─────────────────────┤
│ 📄 제목 (여러 줄)   │
├─────────────────────┤
│ 👤 작성자           │
│ 조회 1,400 • 1시간 전│
├─────────────────────┤
│ 💬 1,014 ❤️ 1,144  │
│ 📤 공유하기         │
├─────────────────────┤
│ 본문 내용           │
│ ...                 │
│ [이미지들]          │
├─────────────────────┤
│ 💬 댓글수 1,014     │
│ ❤️ 좋아요 1,444     │
│                     │
│ 📤 공유 ✏️ 수정 🗑️ 삭제│
├─────────────────────┤
│ 💬 댓글 목록        │
│ ┌─────────────────┐│
│ │ 👤 댓글 내용    ││
│ │ 답글쓰기        ││
│ └─────────────────┘│
│   ┌───────────────┐│ ← 대댓글 (들여쓰기)
│   │ 👤 대댓글     ││
│   │ 작성자 뱃지   ││
│   └───────────────┘│
├─────────────────────┤
│ 💬 댓글 입력창      │
│ [등록]              │
├─────────────────────┤
│ [이전글] [목록] [다음글]│
└─────────────────────┘
```

#### 추가 필요
- [ ] 조회수 자동 증가 (진입 시)
- [ ] 좋아요 버튼 기능
- [ ] 공유하기 (URL 복사)
- [ ] 이전글/다음글 로직
- [ ] 작성자 권한 체크 (수정/삭제 버튼 표시)

---

### 2.3 게시글 작성

#### 요구사항 (미구현)

```
폼 필드:
✅ 카테고리 선택
✅ 제목 입력 (100자)
✅ 내용 입력 (2000자)
✅ 이미지 업로드 (무제한, 5MB)
✅ 임시 저장 버튼

제약사항:
- 로그인 필수
- 제목: 2~100자
- 내용: 10~2000자
- 이미지: JPG/PNG/GIF, 5MB
- 24시간 내 10개 제한
```

#### 드래프트 저장 ✅ 확정
- ✅ 계정당 1개만
- ✅ 자동 저장 (1분마다)
- ✅ 복원 기능
- ✅ 여러 게시글 동시 작성 시 마지막 저장된 것만 유지

---

### 2.4 게시글 수정

#### 요구사항
```
권한: 작성자 or 관리자
수정 가능: 제목, 내용, 이미지
수정 불가: 카테고리, 작성자
표시: ✅ (수정됨) 표시 안 함 (게시글은 수정 표시 없음)
```

---

### 2.5 게시글 삭제

#### 소프트 삭제 방식
```sql
UPDATE community_posts SET
  is_deleted = true,
  deleted_at = NOW(),
  deleted_by = '...'
WHERE id = '...';
```

#### 권한
- 작성자: 본인 글만
- 관리자: 모든 글

#### 확인
- "정말 삭제하시겠습니까?" 다이얼로그
- 삭제 후 목록으로 이동

---

### 2.6 댓글 시스템

#### 댓글 구조
```
게시글
├── 댓글 1
│   ├── 대댓글 1-1
│   └── 대댓글 1-2
└── 댓글 2
    └── 대댓글 2-1
```

**최대 깊이:** ✅ 2단계 (대댓글까지만) 확정

#### 댓글 작성
```
제약사항:
- 로그인 필수
- 최대 300자
- 이미지 1개 (선택)
- 분당 10개 제한

기능:
✅ 댓글 작성
✅ 대댓글 작성 (@ 멘션 자동)
✅ 이미지 첨부 (1개)
```

#### 댓글 표시
```
현재 구현:
✅ 작성자 아바타 (26px)
✅ 닉네임
✅ 작성 시간
✅ 내용
✅ 좋아요 수 (UI만)
✅ 답글쓰기 버튼
✅ 작성자 뱃지 (파란색)
✅ 멘션 (@사용자명, 갈색)

추가 필요:
- [ ] 실제 댓글 데이터 연동
- [ ] 대댓글 로딩
- [ ] 페이지네이션 (100개/페이지)
- [ ] 좋아요 기능
- [ ] 수정/삭제 기능
```

#### 댓글 삭제
```
표시 방식:
- 대댓글 있음: "작성자가 삭제한 댓글입니다"
- 대댓글 없음: 완전 숨김
- ✅ 댓글 수정: "(수정됨)" 표시

소프트 삭제:
is_deleted = true
```

---

### 2.7 좋아요 시스템 ✅ 확정

#### 게시글 좋아요
```
기능:
- ✅ 하트 아이콘 클릭 (무채색 ↔ 유채색)
- ✅ 토글 방식 (추가/취소)
- ✅ 로그인 필수
- ✅ 실시간 카운트 업데이트 (낙관적 업데이트)
- ✅ 한 사람당 한 번만 (UNIQUE 제약)

Rate Limiting:
- 분당 30개
- 시간당 200개
```

#### 댓글 좋아요
- ✅ 동일한 방식 (게시글과 완전 동일)

---

### 2.8 신고 시스템 ✅ 확정

#### 신고 사유
1. 스팸
2. 욕설
3. 광고
4. 기타 (설명 필수)

#### 신고 처리 ✅ 확정
**게시글:**
- ✅ 관리자 페이지에서 검토
- ✅ 승인 시: 소프트 삭제 + 작성자 이력 저장
- ✅ 거부 시: 신고 내역만 저장
- ✅ 신고 횟수 임계값 없음
- ✅ 관리자 승인 전까지 화면 변화 없음

**댓글:**
- ✅ 승인 시: "관리자에 의해 삭제된 댓글입니다"
- ✅ 신고 방식은 게시글과 동일

---

### 2.9 공지사항 ✅ 확정

#### 특징
- ✅ 관리자만 작성 가능
- ✅ 게시판 상단 고정 (`is_pinned = true`)
- ✅ 일반 게시글과 구분되는 디자인

#### 관리 ✅ 확정
- ✅ 관리자 페이지에서 게시판별로 고정/해제
- ✅ 여러 개 동시 고정 가능
- ✅ 순서: 작성 시간 순으로 위에서부터 나열

---

### 2.10 검색 기능

#### 현재 구현
- ✅ 제목 + 내용 검색
- ✅ 최소 2자
- ✅ 실시간 검색
- ✅ 검색어 클리어 버튼

#### 정렬 옵션
1. **최신순** (기본값) ✅
2. 조회수순 (준비 중)
3. 관련도순 (향후)

---

## 3. 데이터베이스

### 3.1 현재 테이블

#### `board_categories`
```sql
CREATE TABLE board_categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP
);
```

**현재 데이터:** 5개 카테고리

#### `community_posts`
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES board_categories(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[],
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT 0, -- 공지사항 고정
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**현재 데이터:** 17개 게시글 (향수게시판 15개, 공지사항 2개)

#### `post_comments`
```sql
CREATE TABLE post_comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  parent_comment_id UUID REFERENCES post_comments(id), -- 대댓글
  content TEXT NOT NULL,
  image_url TEXT, -- 댓글 이미지 1개
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### 3.2 추가 필요한 컬럼

#### 소프트 삭제 (즉시 추가 필요)
```sql
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES profiles(id);

ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES profiles(id);
```

### 3.3 추가 필요한 테이블

#### `post_likes` (게시글 좋아요)
```sql
CREATE TABLE post_likes (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP,
  UNIQUE(post_id, user_id)
);
```

#### `comment_likes` (댓글 좋아요)
```sql
CREATE TABLE comment_likes (
  id UUID PRIMARY KEY,
  comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP,
  UNIQUE(comment_id, user_id)
);
```

#### `drafts` (드래프트)
```sql
CREATE TABLE drafts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  title TEXT,
  content TEXT,
  image_urls TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id) -- 계정당 1개
);
```

---

## 4. API

### 4.1 현재 API (`lib/services/communityService.ts`)

#### 게시글
```typescript
✅ getCommunityPosts(params): Promise<ApiResponse<PaginatedResponse>>
✅ getBoardCategories(): Promise<ApiResponse<BoardCategory[]>>
△ getCommunityPostById(postId): Promise<...> (있지만 사용 안 함)
```

### 4.2 추가 필요한 API

#### 게시글
```typescript
createCommunityPost(data: {
  category_id: string,
  title: string,
  content: string,
  image_urls?: string[]
}): Promise<ApiResponse<CommunityPost>>

updateCommunityPost(postId: string, data: {
  title?: string,
  content?: string,
  image_urls?: string[]
}): Promise<ApiResponse<CommunityPost>>

deleteCommunityPost(postId: string): Promise<ApiResponse<void>>

incrementViewCount(postId: string): Promise<ApiResponse<void>>
```

#### 댓글
```typescript
getPostComments(postId: string, params: { page, limit }): Promise<...>

createPostComment(data: {
  post_id: string,
  content: string,
  parent_comment_id?: string,
  image_url?: string
}): Promise<ApiResponse<Comment>>

updatePostComment(commentId: string, content: string): Promise<...>

deletePostComment(commentId: string): Promise<...>
```

#### 좋아요
```typescript
likePost(postId: string): Promise<ApiResponse<void>>
unlikePost(postId: string): Promise<ApiResponse<void>>

likeComment(commentId: string): Promise<ApiResponse<void>>
unlikeComment(commentId: string): Promise<ApiResponse<void>>
```

#### 드래프트
```typescript
saveDraft(data: { title, content, image_urls }): Promise<...>
getDraft(): Promise<ApiResponse<Draft>>
deleteDraft(): Promise<...>
```

---

## 5. UI 컴포넌트

### 5.1 현재 컴포넌트

#### 화면
- `app/community.tsx` (메인 화면)
  - 목록 화면
  - 상세 화면 (조건부 렌더링) ✅

#### 인라인 컴포넌트
- 모두 인라인 (컴포넌트 분리 안 됨)

### 5.2 필요한 컴포넌트

#### 공통 (Shared)
- `<Pagination />` ⭐
- `<SearchBar />` ⭐
- `<ImageUploader />` ⭐
- `<ImageGallery />` ⭐
- `<Avatar />` ⭐
- `<ConfirmDialog />` ⭐

#### 도메인 (Community)
- `<PostCard />` - 게시글 카드
- `<PostDetail />` - 게시글 상세
- `<PostForm />` - 게시글 작성/수정 폼
- `<CommentList />` - 댓글 목록
- `<CommentItem />` - 댓글 아이템
- `<CommentForm />` - 댓글 작성 폼
- `<LikeButton />` - 좋아요 버튼

---

## 6. 권한 및 보안

### 6.1 권한 레벨

| 기능 | 비로그인 | 로그인 | 작성자 | 관리자 |
|------|----------|--------|--------|--------|
| 목록 조회 | ✅ | ✅ | ✅ | ✅ |
| 상세 조회 | ✅ | ✅ | ✅ | ✅ |
| 검색 | ✅ | ✅ | ✅ | ✅ |
| 게시글 작성 | ❌ | ✅ | ✅ | ✅ |
| 게시글 수정 | ❌ | ❌ | ✅ | ✅ |
| 게시글 삭제 | ❌ | ❌ | ✅ | ✅ |
| 댓글 작성 | ❌ | ✅ | ✅ | ✅ |
| 댓글 수정 | ❌ | ❌ | ✅(본인) | ✅ |
| 댓글 삭제 | ❌ | ❌ | ✅(본인) | ✅ |
| 좋아요 | ❌ | ✅ | ✅ | ✅ |
| 신고 | ❌ | ✅ | ✅ | ✅ |
| 공지 고정 | ❌ | ❌ | ❌ | ✅ |

### 6.2 보안 조치

#### XSS 방지
- 제목/내용 HTML 태그 이스케이프
- 스크립트 실행 차단

#### Rate Limiting
| 작업 | 제한 |
|------|------|
| 게시글 작성 | 24시간 10개 |
| 댓글 작성 | 분당 10개 |
| 좋아요 | 분당 30개, 시간당 200개 |
| 검색 | 분당 30회 |

#### 이미지 보안
- 파일 타입 검증 (매직 넘버)
- 메타데이터 제거 (위치 정보 등)
- 바이러스 스캔 (선택)

---

## 7. 성능 목표

| 항목 | 목표 | 현재 |
|------|------|------|
| 목록 로딩 | < 500ms | ~300ms ✅ |
| 상세 로딩 | < 300ms | - |
| 댓글 로딩 | < 500ms | - |
| 검색 응답 | < 1s | ~600ms ✅ |
| 이미지 업로드 | < 5s (5MB) | - |
| 좋아요 응답 | < 200ms | - |

---

## 8. 테스트 시나리오

### 8.1 정상 케이스
1. 목록 조회 → 10개 표시
2. 검색 ("향수") → 검색 결과
3. 게시글 클릭 → 상세 진입
4. 댓글 작성 → 등록 완료
5. 좋아요 클릭 → 카운트 +1

### 8.2 예외 케이스
1. 로그인 안 하고 글쓰기 → "로그인이 필요합니다"
2. 제목 1자 입력 → "최소 2자 이상"
3. 24시간 내 11번째 글 → "하루 10개 제한"
4. 타인 글 삭제 → "권한이 없습니다"

---

## 9. 의존성

### 9.1 필수 의존
- ✅ 인증 (게시글/댓글 작성)
- ✅ 프로필 (작성자 정보)

### 9.2 선택적 의존
- △ 향수 (향수 관련 글 링크)

### 9.3 역의존
- ✅ 홈 (최신 글 표시)
- ✅ 프로필 (내가 쓴 글)

---

## 10. 개발 우선순위 ✅ 최종 확정

### ✅ 완료
- [x] 목록 화면 (검색, 페이지네이션, 카테고리)
- [x] 상세 화면 UI
- [x] 댓글 섹션 UI (임시)
- [x] DB 인덱스 최적화 (12개)
- [x] 운영 규칙 27개 문서화

### Week 3: 소프트 삭제 + 게시글 작성 ✅ MVP
- [ ] `add_soft_delete_columns.sql` 실행
- [ ] 삭제 API 구현
- [ ] 삭제 UI 연동
- [ ] 작성 화면 UI
- [ ] 이미지 업로드 (ImageUploader 사용)
- [ ] 드래프트 저장 (계정당 1개, 1분 자동저장)
- [ ] 작성 API 연동

### Week 4: 댓글 시스템 ✅ MVP
- [ ] 댓글 데이터 연동
- [ ] 댓글 작성 (2단계 깊이)
- [ ] 대댓글 작성
- [ ] 페이지네이션 (100개/페이지)
- [ ] 수정/삭제 (수정됨 표시)

### Week 5: 좋아요 + 신고 시스템 ✅ MVP
- [ ] post_likes, comment_likes 테이블
- [ ] 좋아요 API (토글 방식, 낙관적 업데이트)
- [ ] 좋아요 UI (무채색 ↔ 유채색)
- [ ] Rate Limiting (분당 30개, 시간당 200개)
- [ ] reports 테이블
- [ ] 신고 UI (게시글/댓글 동일 방식)
- [ ] 신고 API
- [ ] 공지사항 고정 시스템

---

## 11. 커뮤니티 운영 규칙 (요약)

### 콘텐츠 제한
- 제목: 100자, 내용: 2,000자, 댓글: 300자

### 이미지
- 게시글: 무제한(권장 10개), 5MB
- 댓글: 1개, 3MB
- 압축: 80%, WebP 변환

### 스팸 방지
- 게시글: 24시간 10개
- 댓글: 분당 10개

### 삭제 정책
- 소프트 삭제 (DB 유지)
- 탈퇴 후 게시글 유지
- 보관 기간: 무한

### 댓글 구조 ✅ 확정
- ✅ 최대 깊이: 2단계 (댓글 → 대댓글)
- ✅ 페이지네이션: 100개
- ✅ 수정 시: "(수정됨)" 표시

### 알림
- 실시간 (기본)
- 1시간 단위 (선택)
- 하루 한 번 (선택)
- 1년 보관

### Rate Limiting
- 게시글: 24시간 10개
- 댓글: 분당 10개
- 좋아요: 분당 30개, 시간당 200개
- 검색: 분당 30회

**상세 규칙:** `COMMUNITY_RULES.md` 참조

---

## 12. ✅ 모든 사항 확정 완료

### ✅ 결정 완료 (우선순위 높음)
1. ✅ **댓글 깊이**: 2단계 (댓글 → 대댓글)
2. ✅ **공지사항**: 관리자만 작성, 게시판별 고정, 여러 개 동시 고정 가능
3. ✅ **게시글 수정**: 수정됨 표시 없음
4. ✅ **댓글 수정**: 수정됨 표시 있음
5. ✅ **좋아요 시스템**: 게시글/댓글 동일 방식, 토글, 낙관적 업데이트
6. ✅ **신고 시스템**: 게시글/댓글 동일 방식, 임계값 없음, 승인 전까지 변화 없음
7. ✅ **드래프트**: 계정당 1개, 1분 자동저장, 마지막 저장만 유지

### ✅ 개발 일정 확정
- ✅ **모든 기능이 MVP에 포함** (Week 3-5)

---

## 13. ✅ 개발 준비 완료

### ✅ 문서화 완료
- ✅ 모든 미결정 사항 결정
- ✅ DB 스키마 확정 (소프트 삭제, 좋아요, 신고 테이블)
- ✅ API 명세 확정 (CRUD, 좋아요, 신고)
- ✅ UI/UX 명세 확정 (댓글 깊이, 좋아요 토글, 공지사항 고정)

### 🚀 개발 단계 준비 완료
- ✅ 공통 컴포넌트 명세 (Pagination, SearchBar, ImageUploader, LikeButton)
- ✅ 패턴 적용 준비 (CRUD, AUTH, IMAGE_UPLOAD)
- ✅ 기능 구현 로드맵 확정 (Week 3-5 MVP)

---

## 🎯 **COMMUNITY.md 최종 확정 완료!**

**모든 결정 사항이 확정되어 개발을 시작할 준비가 완료되었습니다!** 🚀


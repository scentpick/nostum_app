# 프로필 기능 명세서 ✅ 확정

> **작성일:** 2025-10-11  
> **버전:** 2.0 (최종 확정)  
> **상태:** 개발 준비 완료 ✅

---

## 1. 개요

### 1.1 목적
사용자가 자신의 프로필을 관리하고, 활동 내역을 확인하며, 앱 설정을 조절할 수 있는 개인화된 공간

### 1.2 사용자 스토리
- "내 프로필을 수정하고 싶어요"
- "내가 쓴 글과 댓글을 보고 싶어요"
- "찜한 향수 목록을 관리하고 싶어요"
- "알림 설정을 변경하고 싶어요"
- "내 활동 통계를 보고 싶어요"

---

## 2. 기능 상세

### 2.1 프로필 정보

#### 현재 구현 상태
- ✅ 프로필 조회 (닉네임, 아바타)
- ✅ Google OAuth 로그인
- ❌ 프로필 수정 (미구현)
- ❌ 아바타 업로드 (미구현)

#### 표시 정보 ✅ 확정
```
┌─────────────────────┐
│     🖼️ 아바타        │ ← 40x40 → 100x100
│   닉네임             │
│   이메일 (비공개)    │
│   가입일             │
├─────────────────────┤
│ 📝 내 활동           │
│ • 내가 쓴 글         │
│ • 내가 쓴 댓글       │
│ • 내가 쓴 리뷰       │
│ • 찜한 향수          │
└─────────────────────┘
```

#### 수정 가능 항목 ✅ 확정
- ✅ 닉네임 (2~20자, 중복 체크)
- ✅ 아바타 (이미지 업로드)
- ❌ 자기소개 (필드 제거)
- ❌ 이메일 (변경 불가, Google 연동)

#### 확정 사항 ✅
- ✅ **자기소개 필드**: 불필요 (제거)
- ✅ **공개 프로필**: 본인만 볼 수 있음
- ✅ **활동 통계**: 관리자 페이지에서만 확인 가능

---

### 2.2 내 활동 ✅ MVP 확정

#### 2.2.1 내가 쓴 글 ✅ MVP
```
목록:
✅ 커뮤니티 게시글
✅ 페이지네이션 (10개/페이지)
✅ 최신순 정렬
✅ 클릭 → 상세 화면으로 이동

표시 정보:
- 제목
- 내용 (2줄 요약)
- 카테고리
- 작성일
- 조회수, 댓글수, 좋아요수
```

#### 2.2.2 내가 쓴 댓글 ✅ MVP
```
목록:
✅ 커뮤니티 댓글
✅ 페이지네이션 (20개/페이지)
✅ 최신순 정렬
✅ 클릭 → 원글(게시글)로 이동

표시 정보:
- 댓글 내용
- 작성일
- 원글 제목 (링크)
- 좋아요수
```

#### 2.2.3 내가 쓴 리뷰 (Phase 2)
```
목록:
✅ 향수 리뷰 (Phase 2)
✅ 페이지네이션 (10개/페이지)
✅ 최신순 / 별점순

표시 정보:
- 향수 정보 (이미지, 브랜드, 이름)
- 별점
- 리뷰 내용 (요약)
- 작성일
- 좋아요수
```

---

### 2.3 내 향수 ✅ MVP 확정

#### 2.3.1 찜한 향수 ✅ MVP
```
카테고리별 분류:
✅ 전체
✅ 시향해본
✅ 써본
✅ 오늘 뿌린
✅ 보유중
✅ 관심

표시 방식:
- 2열 그리드 (향수 목록과 동일)
- 카테고리별 필터링
- 페이지네이션 (20개/페이지)
- 클릭 → 향수 상세 페이지로 이동
```

#### 2.3.2 향수 노트 (Phase 2)
```
개인 메모:
- 향수별 개인 메모 (300자)
- 사용 경험, 느낌 등
- 본인만 볼 수 있음
```

---

### 2.4 설정

#### 2.4.1 알림 설정
```
옵션:
✅ 실시간 (기본값)
✅ 1시간 단위 (1~24시간 선택)
✅ 하루에 한번 (시간 설정)
✅ 알림 끄기

알림 유형별 설정:
- 댓글 알림 (On/Off)
- 대댓글 알림 (On/Off)
- 멘션 알림 (On/Off)
- 좋아요 알림 (On/Off)
- 공지사항 알림 (On/Off)
```

#### 2.4.2 개인정보 설정
```
- 프로필 공개 범위 (전체/친구/비공개)
- 활동 내역 공개 (On/Off)
- 이메일 수신 동의 (On/Off)
```

#### 2.4.3 계정 관리
```
- 로그아웃
- 회원 탈퇴
  - 주의: 탈퇴 시 게시글은 남음
  - 작성자명: "탈퇴한 사용자"
```

---

### 2.5 통계 ✅ 관리자 페이지로 이동

#### 내 활동 통계 (관리자 페이지에서만 확인)
```
✅ 가입일
✅ 작성한 글 수
✅ 작성한 댓글 수
✅ 작성한 리뷰 수
✅ 찜한 향수 수
✅ 받은 좋아요 수 (총합)
✅ 마지막 로그인 시간
✅ 활동 패턴 분석
```

#### 향수 취향 분석 (관리자 페이지에서만 확인)
```
△ 가장 많이 찜한 브랜드
△ 선호하는 노트
△ 선호하는 어코드
△ 가격대 분포
△ 캘린더 사용 패턴 (Phase 2)
```

---

## 3. 데이터베이스

### 3.1 현재 테이블

#### `profiles`
```sql
- id (UUID, FK → auth.users)
- nickname (TEXT, UNIQUE)
- avatar_url (TEXT)
- google_id (TEXT, UNIQUE)
- role (VARCHAR: 'user' | 'admin')
- created_at, updated_at
```

### 3.2 추가 필요한 컬럼

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  -- bio TEXT,                           -- 자기소개 제거
  -- is_profile_public BOOLEAN DEFAULT true, -- 프로필 공개 (본인만 볼 수 있음)
  -- is_activity_public BOOLEAN DEFAULT true, -- 활동 공개 (본인만 볼 수 있음)
  email_notifications BOOLEAN DEFAULT true, -- 이메일 수신
  notification_type TEXT DEFAULT 'realtime', -- 알림 설정
  notification_interval INTEGER,      -- 알림 간격 (시간)
  last_login_at TIMESTAMP;            -- 마지막 로그인
  nickname_updated_at TIMESTAMP;      -- 닉네임 변경 시간 (한달 제한용)
```

### 3.3 관련 테이블 (이미 존재 또는 예정)
- `community_posts` (내가 쓴 글)
- `post_comments` (내가 쓴 댓글)
- `reviews` (내가 쓴 리뷰)
- `user_favorites` (찜한 향수)

---

## 4. API

### 4.1 현재 API

```typescript
// lib/services/userService.ts

getUserProfile(userId: string): Promise<ApiResponse<UserProfile>>
```

### 4.2 추가 필요한 API

#### 프로필 관리 ✅ MVP 확정
```typescript
updateUserProfile(userId: string, data: {
  nickname?: string,
  avatar_url?: string
}): Promise<ApiResponse<UserProfile>>

uploadAvatar(userId: string, file: File): Promise<ApiResponse<string>> // URL 반환

checkNicknameDuplicate(nickname: string): Promise<ApiResponse<boolean>>
```

#### 활동 내역 ✅ MVP 확정
```typescript
getUserPosts(userId: string, params: { page, limit }): Promise<ApiResponse<PaginatedResponse<Post>>>

getUserComments(userId: string, params: { page, limit }): Promise<ApiResponse<PaginatedResponse<Comment>>>

getUserReviews(userId: string, params: { page, limit, sort_by }): Promise<ApiResponse<PaginatedResponse<Review>>>

getUserFavorites(userId: string, params: { category?, page, limit }): Promise<ApiResponse<PaginatedResponse<Favorite>>>
```

#### 통계 (관리자 페이지로 이동)
```typescript
// 관리자 페이지에서만 사용
getUserStats(userId: string): Promise<ApiResponse<{
  posts_count: number,
  comments_count: number,
  reviews_count: number,
  favorites_count: number,
  total_likes_received: number,
  member_since: string,
  last_login_at: string
}>>
```

#### 설정
```typescript
updateNotificationSettings(userId: string, settings: {
  notification_type: 'realtime' | 'hourly' | 'daily' | 'off',
  notification_interval?: number,
  email_notifications?: boolean
}): Promise<ApiResponse<void>>

deleteAccount(userId: string): Promise<ApiResponse<void>>
```

---

## 5. UI 컴포넌트

### 5.1 필요한 컴포넌트

#### 화면
```
app/profile.tsx
├── 프로필 정보 섹션
├── 탭 (내 글, 내 댓글, 내 리뷰, 찜한 향수)
└── 설정 버튼
```

#### 컴포넌트
```
components/profile/
├── ProfileHeader.tsx      # 프로필 정보 + 수정 버튼
├── ActivityTabs.tsx       # 활동 탭
├── PostList.tsx           # 내가 쓴 글 (재사용 가능)
├── CommentList.tsx        # 내가 쓴 댓글
├── ReviewList.tsx         # 내가 쓴 리뷰
├── FavoriteList.tsx       # 찜한 향수
├── StatsCard.tsx          # 통계 카드
└── SettingsModal.tsx      # 설정 모달
```

---

## 6. 권한 및 보안

### 6.1 권한 ✅ 확정
| 기능 | 본인 | 타인 | 관리자 |
|------|------|------|--------|
| 프로필 조회 | ✅ | ❌ (본인만) | ✅ |
| 프로필 수정 | ✅ | ❌ | ✅ |
| 활동 조회 | ✅ | ❌ (본인만) | ✅ |
| 통계 조회 | ❌ | ❌ | ✅ (관리자만) |
| 설정 변경 | ✅ | ❌ | ✅ |
| 계정 삭제 | ✅ | ❌ | ✅ |

### 6.2 보안 ✅ 확정
- ✅ 닉네임 중복 체크 (서버 사이드)
- ✅ 아바타 파일 검증 (이미지만)
- ✅ 닉네임 변경 제한 (한달에 1회)
- ✅ Rate Limiting (프로필 수정: 하루 5회)

---

## 7. 성능 목표

| 항목 | 목표 |
|------|------|
| 프로필 로딩 | < 200ms |
| 활동 내역 로딩 | < 500ms |
| 아바타 업로드 | < 3s (3MB) |
| 설정 변경 | < 300ms |

---

## 8. 의존성

### 필수 의존
- ✅ 인증 (로그인 필요)

### 선택적 의존
- △ 커뮤니티 (내가 쓴 글)
- △ 향수 (찜한 향수)

---

## 9. 개발 우선순위 ✅ 최종 확정

### Week 3: 프로필 기본 ✅ MVP
- [ ] 프로필 조회 (본인만)
- [ ] 프로필 수정 (닉네임, 아바타)
- [ ] 닉네임 중복 체크
- [ ] 닉네임 변경 제한 (한달 1회)

### Week 4: 활동 내역 ✅ MVP
- [ ] 내가 쓴 글 (클릭 시 상세 페이지 이동)
- [ ] 내가 쓴 댓글 (클릭 시 원글로 이동)
- [ ] 찜한 향수 (카테고리별, 클릭 시 향수 상세 이동)

### Week 5: 설정 + Phase 2 준비
- [ ] 알림 설정
- [ ] 개인정보 설정
- [ ] 계정 관리
- [ ] 내가 쓴 리뷰 (Phase 2 준비)

### Phase 2: 고급 기능
- [ ] 내가 쓴 리뷰
- [ ] 향수 노트
- [ ] 통계 기능 (관리자 페이지로 이동)

---

---

## ✅ **모든 사항 확정 완료**

### ✅ 결정 완료 (우선순위 높음)
1. ✅ **프로필 공개**: 본인만 볼 수 있음
2. ✅ **자기소개**: 불필요 (필드 제거)
3. ✅ **활동 통계**: 관리자 페이지에서만 확인 가능
4. ✅ **내 활동**: MVP에서 내가 쓴 글/댓글/찜한 향수 목록 + 클릭 시 이동

### ✅ 개발 일정 확정
- ✅ **MVP**: Week 3-5 (프로필 기본 + 활동 내역 + 설정)
- ✅ **Phase 2**: 리뷰 + 향수 노트 + 통계

---

## 🎯 **PROFILE.md 최종 확정 완료!**

**모든 결정 사항이 확정되어 개발을 시작할 준비가 완료되었습니다!** 🚀


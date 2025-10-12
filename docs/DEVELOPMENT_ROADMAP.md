# Nostum 앱 개발 로드맵 🚀

> **작성일:** 2025-10-12  
> **버전:** 1.0 (최종 확정)  
> **목적:** 문서 기반 체계적 개발 계획

---

## 📋 목차
1. [현재 상태](#현재-상태)
2. [8주 개발 계획](#8주-개발-계획)
3. [주간 상세 계획](#주간-상세-계획)
4. [성공 기준](#성공-기준)

---

## 현재 상태

### ✅ 완료된 작업

#### 문서화 (100% 완료)
- ✅ 14개 문서 작성 완료
- ✅ 충돌 검토 및 수정 완료
- ✅ 모든 미결정 사항 확정
- ✅ DB 스키마 최종 확정

#### 앱 개발 (약 30% 완료)
| 영역 | 완료율 | 완료된 기능 | 미구현 기능 |
|------|--------|------------|------------|
| 향수 | 60% | 목록, 상세, 필터 | 찜하기, 리뷰, 비교 |
| 커뮤니티 | 40% | 목록, 상세 UI | 작성, 댓글, 좋아요 |
| 프로필 | 20% | 조회 | 수정, 활동 내역 |
| 챗봇 | 5% | UI만 | GPT 연동 |
| 관리자 | 0% | - | 전체 |

---

## 8주 개발 계획

### 전체 타임라인

```
Week 1 ✅ 문서화 (완료)
  └─ 14개 문서 작성 및 확정

Week 2 🔥 인프라 + 관리자 페이지 MVP
  └─ DB 스키마 적용 + Next.js 관리자 페이지

Week 3 🧩 공통 컴포넌트
  └─ 11개 컴포넌트 개발 (재사용 극대화)

Week 4 📐 커뮤니티 완성 (패턴 확립)
  └─ 게시글 작성/수정/삭제 + 댓글 시스템

Week 5 🌸 향수 + 프로필 (패턴 적용)
  └─ 찜하기, 비교, Fragrance Wheel + 프로필 수정

Week 6 🤖 챗봇 개발
  └─ OpenAI GPT 연동 + 스트리밍 응답

Week 7 🏠 홈 화면 + 통합
  └─ 캐릭터 말풍선 + 오늘의 향수 + 전체 통합

Week 8 🚨 알림 + 신고 + 최종 점검
  └─ 알림 시스템 + 신고 처리 + MVP 100% 완성
```

---

## 주간 상세 계획

### 📅 Week 1: 문서화 ✅ 완료

#### 완료 산출물
- ✅ 6개 기능 문서 (PERFUME, COMMUNITY, PROFILE, HOME, CHATBOT, ADMIN)
- ✅ 5개 패턴 문서 (CRUD, AUTH, PAGINATION, SEARCH, IMAGE_UPLOAD)
- ✅ 3개 통합 문서 (DATABASE_SCHEMA_FINAL, COMPONENT_INVENTORY, DEVELOPMENT_ROADMAP)

---

### 📅 Week 2: 인프라 + 관리자 페이지 MVP 🔥

#### 목표
**테스트 환경 구축 → 이후 개발 속도 2배 향상**

#### Day 1 (월): DB 스키마 최종 적용
```
⏰ 예상 시간: 2-3시간

📋 작업:
1. 마이그레이션 파일 작성
   - database/migrations/add_new_tables.sql
   - database/migrations/update_existing_tables.sql
   
2. 새 테이블 생성 (8개)
   ✅ user_favorites
   ✅ perfume_calendar
   ✅ perfume_feedback
   ✅ reviews
   ✅ post_likes, comment_likes
   ✅ drafts
   ✅ reports
   ✅ search_history

3. 기존 테이블 수정
   ✅ profiles: nickname_updated_at 추가
   ✅ community_posts: 소프트 삭제 컬럼
   ✅ post_comments: 소프트 삭제 컬럼

4. 인덱스 생성
   ✅ GIN + Trigram (검색)
   ✅ B-Tree (정렬/필터)

5. Supabase 적용 및 검증
```

#### Day 2 (화): Next.js 관리자 프로젝트 생성
```
⏰ 예상 시간: 4-5시간

📋 작업:
1. 프로젝트 생성
   cd /Users/macel/Documents/nostum/
   npx create-next-app@latest nostum-admin --typescript --tailwind --app
   
2. 의존성 설치
   cd nostum-admin
   npm install @supabase/supabase-js
   npx shadcn@latest init
   npm install @tanstack/react-table recharts
   npm install react-hook-form zod @hookform/resolvers

3. 기본 구조 생성
   - app/(auth)/login/page.tsx
   - app/(admin)/layout.tsx
   - app/(admin)/dashboard/page.tsx
   - lib/supabase/client.ts
   - lib/types/database.ts (nostum_app에서 복사)

4. 환경 변수 설정
   .env.local (Supabase URL, ANON_KEY)
```

#### Day 3 (수): 관리자 인증 + 대시보드
```
⏰ 예상 시간: 6-7시간

📋 작업:
1. 관리자 로그인 페이지
   app/(auth)/login/page.tsx
   - 이메일/비밀번호 로그인
   - role = 'admin' 체크
   
2. 인증 미들웨어
   middleware.ts
   - 보호된 라우트 (/admin/*)
   - role 체크
   
3. 레이아웃
   app/(admin)/layout.tsx
   - 사이드바 네비게이션
   - 헤더 (관리자 정보)
   
4. 대시보드 기본
   app/(admin)/dashboard/page.tsx
   - 주요 지표 카드
   - 최근 가입 사용자 (5명)
   - 최근 게시글 (5개)
```

#### Day 4 (목): 사용자 관리 + 게시글 빠른 생성 ⭐
```
⏰ 예상 시간: 7-8시간

📋 작업:
1. 사용자 관리
   app/(admin)/users/page.tsx
   - TanStack Table
   - 검색 (닉네임, 이메일)
   - 권한 변경 (user ↔ admin)
   
2. 게시글 관리
   app/(admin)/posts/page.tsx
   - 게시글 목록
   - 삭제 (소프트 삭제)
   - 공지사항 고정
   
3. ⭐ 빠른 게시글 생성 도구
   app/(admin)/posts/quick-create/page.tsx
   - 개수 선택 (1-100개)
   - 카테고리 선택
   - 작성자 선택 (랜덤/특정)
   - 랜덤 제목/내용 생성
   - [생성] 버튼 → 1초에 10개씩 생성
```

#### Day 5 (금): 댓글 빠른 생성 + 향수 관리
```
⏰ 예상 시간: 6-7시간

📋 작업:
1. ⭐ 빠른 댓글 생성 도구
   app/(admin)/comments/quick-create/page.tsx
   - 게시글 선택
   - 개수 선택 (1-50개)
   - 작성자 선택
   - 대댓글 포함 여부
   
2. 향수 관리
   app/(admin)/perfumes/page.tsx
   - 향수 목록
   - 향수 추가/수정 폼
   
3. 테스트 데이터 정리
   app/(admin)/tools/cleanup/page.tsx
   - 테스트 게시글 전체 삭제
   - 테스트 댓글 전체 삭제
```

#### Week 2 완료 기준 ✅
- [x] DB 스키마 최종 적용 완료
- [x] 관리자 페이지 MVP 완성
- [x] 테스트 데이터 쉽게 생성 가능
- [x] 게시글/댓글 관리 가능

---

### 📅 Week 3: 공통 컴포넌트 집중 개발 🧩

#### Day 1 (월): Pagination + SearchBar 추출
```
⏰ 예상 시간: 6-7시간

📋 작업:
1. Pagination 컴포넌트
   components/shared/Pagination.tsx
   - PAGINATION_PATTERN.md 기반
   - 고정 5페이지 표시
   - 블록 네비게이션 (<< >>)
   
2. 기존 코드에서 추출
   - app/perfume.tsx → Pagination 컴포넌트 사용
   - app/community.tsx → Pagination 컴포넌트 사용
   
3. SearchBar 컴포넌트
   components/shared/SearchBar.tsx
   - SEARCH_PATTERN.md 기반
   - 최소 2글자
   - 버튼 트리거
   
4. 기존 코드에 적용
```

#### Day 2 (화): Avatar + LikeButton
```
⏰ 예상 시간: 5-6시간

📋 작업:
1. Avatar 컴포넌트
   components/ui/Avatar.tsx
   - 크기: sm (24px), md (40px), lg (100px)
   - 플레이스홀더
   - 클릭 가능 (선택)
   
2. LikeButton 컴포넌트
   components/ui/LikeButton.tsx
   - targetType: 'post' | 'comment'
   - 낙관적 업데이트
   - 애니메이션
   - Rate Limiting 적용
```

#### Day 3 (수): ImageUploader
```
⏰ 예상 시간: 6-7시간

📋 작업:
1. ImageUploader 컴포넌트
   components/shared/ImageUploader.tsx
   - IMAGE_UPLOAD_PATTERN.md 기반
   - expo-image-picker 사용
   - 압축 (80% 품질)
   - Supabase Storage 업로드
   
2. 폴더별 설정
   - avatars/: 1:1, 400x400, JPG
   - posts/: max 1200px, 원본
   - reviews/: max 1200px, 원본
   - chat/: max 800px, 원본
```

#### Day 4 (목): ImageGallery + ConfirmDialog
```
⏰ 예상 시간: 5-6시간

📋 작업:
1. ImageGallery
   components/shared/ImageGallery.tsx
   - 여러 이미지 표시
   - 스와이프
   - 확대/축소 (react-native-image-zoom-viewer)
   
2. ConfirmDialog
   components/ui/ConfirmDialog.tsx
   - 제목, 메시지, 확인/취소 버튼
   - 위험한 액션 강조
```

#### Day 5 (금): Badge + EmptyState + LoadingSpinner
```
⏰ 예상 시간: 3-4시간

📋 작업:
1. Badge
   components/ui/Badge.tsx
   - 색상별 (primary, secondary, success, warning, danger)
   
2. EmptyState
   components/ui/EmptyState.tsx
   - 아이콘, 제목, 설명, 액션 버튼
   
3. LoadingSpinner
   components/ui/LoadingSpinner.tsx
   - 크기별 (sm, md, lg)
```

#### Week 3 완료 기준 ✅
- [x] 11개 공통 컴포넌트 완성
- [x] 기존 코드에 적용 완료
- [x] 스타일 통일

---

### 📅 Week 4: 커뮤니티 완성 (패턴 확립) 📐

#### Day 1-2 (월-화): 게시글 작성 (CREATE 패턴)
```
⏰ 예상 시간: 12-14시간

📋 작업:
1. 게시글 작성 화면
   screens/community/CreatePost.tsx
   - 제목/내용 입력
   - 카테고리 선택
   - ImageUploader 사용 (최대 5장)
   - Rate Limiting
   
2. API 연동
   lib/services/communityService.ts
   - createPost()
   - 입력 검증 (UI + Service)
   
3. 드래프트 자동 저장
   - 1분마다 자동 저장
   - 계정당 1개만
   - drafts 테이블 사용
```

#### Day 3 (수): 게시글 수정/삭제 (UPDATE/DELETE 패턴)
```
⏰ 예상 시간: 6-7시간

📋 작업:
1. 게시글 수정
   screens/community/EditPost.tsx
   - 권한 체크 (checkOwner)
   - 드래프트 불러오기
   
2. 게시글 삭제
   - ConfirmDialog 사용
   - 소프트 삭제
   - 권한 체크
```

#### Day 4-5 (목-금): 댓글 시스템
```
⏰ 예상 시간: 12-14시간

📋 작업:
1. 댓글 컴포넌트
   components/community/CommentList.tsx
   components/community/CommentItem.tsx
   - 2단계 깊이
   - Avatar 컴포넌트 사용
   - LikeButton 컴포넌트 사용
   - 수정됨 표시
   
2. 댓글 작성/수정/삭제
   - CREATE/UPDATE/DELETE 패턴 재사용
   
3. 좋아요 시스템
   - post_likes, comment_likes 테이블
   - 낙관적 업데이트
   - Rate Limiting
```

#### Week 4 완료 기준 ✅
- [x] 커뮤니티 100% 완성
- [x] CRUD 패턴 확립 및 검증
- [x] 다른 기능에 적용 준비 완료

---

### 📅 Week 5: 향수 + 프로필 (패턴 적용) 🌸

#### Day 1-2 (월-화): 찜하기 시스템
```
⏰ 예상 시간: 12-14시간

📋 작업:
1. FavoriteButton 컴포넌트
   components/perfume/FavoriteButton.tsx
   - 5개 카테고리
   - 토글 애니메이션
   - 오늘 뿌린 5개 제한
   
2. API 연동
   lib/services/perfumeService.ts
   - addToFavorites(perfumeId, category)
   - removeFromFavorites(perfumeId, category)
   
3. 찜 목록 화면
   screens/profile/Favorites.tsx
   - 카테고리별 탭
   - Pagination 재사용
```

#### Day 3 (수): 향수 비교 + Fragrance Wheel
```
⏰ 예상 시간: 6-7시간

📋 작업:
1. 향수 비교
   screens/perfume/Compare.tsx
   - 최대 5개 선택
   - 비교 테이블
   
2. Fragrance Wheel (SVG)
   components/perfume/FragranceWheel.tsx
   - 데이터 기반 렌더링
   - 합산 표시 (단순 더하기)
```

#### Day 4 (목): 피드백 + 자동 변경 로직
```
⏰ 예상 시간: 5-6시간

📋 작업:
1. 피드백 모달
   components/perfume/FeedbackModal.tsx
   - 카테고리 선택
   - 자유 입력
   
2. Edge Function
   supabase/functions/move-today-to-used/index.ts
   - 매일 자정 실행 (Cron)
   - "오늘 뿌린" → "써본" 자동 변경
```

#### Day 5 (금): 프로필 완성
```
⏰ 예상 시간: 6-7시간

📋 작업:
1. 프로필 수정
   screens/profile/Edit.tsx
   - 닉네임 (중복 체크, 한달 1회)
   - 아바타 (ImageUploader 재사용)
   
2. 활동 내역
   screens/profile/MyPosts.tsx
   screens/profile/MyComments.tsx
   - Pagination 재사용
```

#### Week 5 완료 기준 ✅
- [x] 향수 90% 완성 (리뷰 제외)
- [x] 프로필 기본 완성
- [x] 패턴 재사용 검증

---

### 📅 Week 6: 챗봇 개발 (Tommy) 🤖

#### Day 1-2 (월-화): OpenAI GPT 연동 + 스트리밍
```
⏰ 예상 시간: 12-14시간

📋 작업:
1. Edge Function
   supabase/functions/tommy-chat/index.ts
   - OpenAI API 연동
   - 스트리밍 응답 (SSE)
   - 시스템 프롬프트
   
2. 채팅 UI
   components/chatbot/ChatMessage.tsx
   components/chatbot/ChatInput.tsx
   - 텍스트 + 이미지 메시지
   - 실시간 타이핑 효과
   
3. 스트리밍 수신
   lib/services/tommyChat.ts
   - Server-Sent Events 처리
   - 실시간 UI 업데이트
```

#### Day 3 (수): 이미지 업로드 + 대화 이력
```
⏰ 예상 시간: 6-7시간

📋 작업:
1. 이미지 업로드
   components/chatbot/ImagePicker.tsx
   - ImageUploader 재사용
   
2. 대화 이력
   screens/profile/Conversations.tsx
   - 대화 목록
   - 대화 삭제
```

#### Day 4-5 (목-금): 사용 방법 + 최적화
```
⏰ 예상 시간: 10-12시간

📋 작업:
1. UsageGuideModal
   - Tommy 소개
   - 사용 방법
   
2. ChatHeader
   - [❓] 버튼
   
3. 최적화
   - 에러 처리
   - 로딩 상태
   - 비용 모니터링
```

#### Week 6 완료 기준 ✅
- [x] Tommy 챗봇 MVP 완성
- [x] OpenAI GPT 연동 완료
- [x] 스트리밍 응답 구현

---

### 📅 Week 7: 홈 화면 + 통합 🏠

#### Day 1-2 (월-화): 홈 화면 완성
```
⏰ 예상 시간: 12-14시간

📋 작업:
1. 캐릭터 섹션
   components/home/CharacterSection.tsx
   components/home/SpeechBubble.tsx
   - 캐릭터 이미지
   - 말풍선 (클릭 시 변경)
   - 관리자 페이지에서 메시지 관리
   
2. 오늘의 향수
   components/home/TodayPerfumeSection.tsx
   - perfume_calendar 활용
   - 최대 3개
   
3. 최신 게시글
   components/home/RecentPostsSection.tsx
   - 실제 데이터 연동
```

#### Day 3-5 (수-금): 전체 통합 + 버그 수정
```
⏰ 예상 시간: 18-21시간

📋 작업:
1. 전체 플로우 테스트
   - 회원가입 → 로그인 → 향수 검색 → 찜하기
   - 게시글 작성 → 댓글 → 좋아요
   - Tommy 챗봇 대화
   
2. 버그 수정
   - 에러 처리 보강
   - 로딩 상태 추가
   - UI/UX 개선
   
3. 성능 최적화
   - 이미지 레이지 로딩
   - API 캐싱
```

#### Week 7 완료 기준 ✅
- [x] 모든 MVP 기능 통합
- [x] 주요 버그 수정
- [x] 전체 플로우 테스트 완료

---

### 📅 Week 8: 알림 + 신고 + 최종 점검 🚨

#### Day 1-2 (월-화): 알림 시스템
```
⏰ 예상 시간: 12-14시간

📋 작업:
1. 알림 생성
   - 댓글 알림
   - 좋아요 알림
   - 시스템 알림
   
2. 알림 화면
   screens/profile/Notifications.tsx
   - 읽음/안읽음
   - 클릭 → 해당 페이지
```

#### Day 3 (수): 신고 시스템
```
⏰ 예상 시간: 6-7시간

📋 작업:
1. 신고 모달
   components/shared/ReportModal.tsx
   
2. 관리자 페이지
   app/(admin)/reports/page.tsx
   - 신고 목록
   - 승인/거부
```

#### Day 4-5 (목-금): 최종 점검 + 배포 준비
```
⏰ 예상 시간: 12-14시간

📋 작업:
1. 전체 기능 테스트
2. 성능 최적화
3. 보안 점검
4. 배포 준비
```

#### Week 8 완료 기준 ✅
- [x] MVP 100% 완성
- [x] 배포 준비 완료

---

## 성공 기준

### 주간 체크포인트

```
✅ Week 1: 문서 14개 확정 완료
⏳ Week 2: 관리자 페이지로 테스트 데이터 생성 가능
⏳ Week 3: 11개 공통 컴포넌트 재사용 중
⏳ Week 4: 커뮤니티 100% 완성
⏳ Week 5: 향수 90% + 프로필 100% 완성
⏳ Week 6: Tommy 챗봇 대화 가능
⏳ Week 7: 홈 화면에서 모든 기능 접근 가능
⏳ Week 8: MVP 100% 완성
```

### 최종 MVP 기능 목록

#### 필수 기능 (100%)
- ✅ 향수 목록/상세/검색/필터/정렬
- ✅ 찜하기 (5개 카테고리)
- ✅ 향수 비교 (최대 5개)
- ✅ Fragrance Wheel
- ✅ 피드백 시스템
- ✅ 커뮤니티 (작성/수정/삭제)
- ✅ 댓글 (2단계 깊이)
- ✅ 좋아요/신고
- ✅ 공지사항
- ✅ 드래프트 자동 저장
- ✅ Tommy 챗봇 (GPT 연동, 스트리밍)
- ✅ 프로필 (조회/수정)
- ✅ 활동 내역 (내 글/댓글/찜)
- ✅ 홈 화면 (캐릭터 말풍선 + 오늘의 향수 + 최신 글)
- ✅ 알림
- ✅ 관리자 페이지 (테스트 데이터 생성)

#### Phase 2 (추후)
- △ 리뷰 시스템
- △ 향수 캘린더 (상세 기능)
- △ 대화 이력 기반 개인화
- △ 활동 통계

---

## 🎯 핵심 전략

### 1. 관리자 페이지 먼저! (Week 2)
```
관리자 페이지 → 테스트 데이터 쉽게 생성
  → 이후 개발 시 데이터 걱정 없음
  → 개발 속도 2배 향상 🚀
```

### 2. 공통 컴포넌트 집중! (Week 3)
```
한 번 개발 → 여러 곳 재사용
  → 코드 중복 방지
  → 일관된 UX
  → 유지보수 쉬움 🔧
```

### 3. 패턴 확립 후 적용! (Week 4-5)
```
커뮤니티로 패턴 확립
  → 향수/프로필에 빠르게 적용
  → 개발 시간 50% 단축 ⚡
```

### 4. 홈 화면은 마지막! (Week 7)
```
다른 기능 완성 후 통합
  → 모든 기능 접근점 역할
  → 게이트웨이로서 완벽한 UX 🎨
```

---

## 📊 예상 투입 시간

| Week | 핵심 작업 | 예상 시간 | 우선순위 |
|------|----------|-----------|---------|
| 1 ✅ | 문서화 | 완료 | ⭐⭐⭐⭐⭐ |
| 2 🔥 | 인프라 + 관리자 | 30-35시간 | ⭐⭐⭐⭐⭐ |
| 3 🧩 | 공통 컴포넌트 | 30-35시간 | ⭐⭐⭐⭐⭐ |
| 4 📐 | 커뮤니티 | 30-35시간 | ⭐⭐⭐⭐ |
| 5 🌸 | 향수 + 프로필 | 30-35시간 | ⭐⭐⭐⭐ |
| 6 🤖 | 챗봇 | 30-35시간 | ⭐⭐⭐⭐ |
| 7 🏠 | 홈 + 통합 | 30-35시간 | ⭐⭐⭐ |
| 8 🚨 | 알림 + 최종 | 30-35시간 | ⭐⭐⭐ |

**총 예상 시간: 210-245시간 (약 6-7주 실 작업)**

---

## 🎓 일일 개발 루틴

### 개발 시작 전 (10분)
```
1. 오늘의 목표 확인
2. 관련 문서 읽기
   - 기능 문서 (PERFUME.md, COMMUNITY.md 등)
   - 패턴 문서 (CRUD_PATTERN.md 등)
3. 필요한 컴포넌트 확인
```

### 개발 중 (6-7시간)
```
1. 공통 컴포넌트 먼저 확인
   - "이미 만들어진 게 있나?"
   
2. 패턴 문서 준수
   - CRUD: 입력 검증, 권한 체크, 에러 처리
   - AUTH: checkLogin, checkOwner
   
3. 에러 처리 추가
   - try-catch
   - ErrorMessages 상수 사용
   
4. Rate Limiting 적용
   - isRateLimited() 사용
```

### 개발 완료 후 (10분)
```
1. 관리자 페이지로 테스트
   - 테스트 데이터 생성
   - 기능 동작 확인
   
2. 다음 날 계획
3. 필요 시 문서 업데이트
   - features/ 또는 patterns/ 문서만
```

---

## 🚨 주의사항

### DO ✅
- ✅ 공통 컴포넌트 재사용
- ✅ 패턴 문서 준수
- ✅ 관리자 페이지로 테스트
- ✅ 에러 처리 철저히
- ✅ Rate Limiting 적용

### DON'T ❌
- ❌ 같은 컴포넌트 중복 개발
- ❌ 패턴 무시하고 즉흥 개발
- ❌ SQL Editor에서 수동 데이터 입력
- ❌ 임시 문서 생성 (보고서, 진행상황 등)
- ❌ 스타일/버그만 수정 시 문서 업데이트

---

## 🎯 다음 액션 (Week 2 Day 1)

### 즉시 시작할 작업

```bash
1. DATABASE_SCHEMA_FINAL.md 열기
2. 마이그레이션 파일 작성
3. Supabase SQL Editor에서 실행
4. 검증 쿼리 실행
```

**지금 바로 시작하세요!** 🚀


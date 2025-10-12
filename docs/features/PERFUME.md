# 향수 기능 명세서 ✅ 확정

> **작성일:** 2025-10-11  
> **버전:** 2.0  
> **상태:** 최종 확정 (개발 준비 완료)

---

## 1. 개요

### 1.1 목적
사용자가 다양한 향수를 검색하고, 상세 정보를 확인하며, 리뷰를 공유하고, 관심 향수를 관리할 수 있는 기능

### 1.2 사용자 스토리
- "향수를 브랜드별로 찾고 싶어요"
- "가격대별로 향수를 비교하고 싶어요"
- "이 향수의 노트 정보를 알고 싶어요"
- "내가 좋아한 향수 목록을 보고 싶어요"
- "다른 사람들의 리뷰를 보고 싶어요"

---

## 2. 기능 상세

### 2.1 향수 목록

#### 현재 구현 상태
- ✅ 목록 조회 (페이지네이션 10개)
- ✅ 검색 (한글명, 영문명)
- ✅ 카드 UI (이미지, 브랜드, 향수명)
- ⚠️ 필터 (브랜드, 성별, 가격 - UI만)
- ⚠️ 정렬 (최신순, 가격순 - UI만)

#### 추가 필요
- [ ] 필터 기능 데이터 연동
- [ ] 정렬 기능 데이터 연동
- [ ] 무한 스크롤 (선택)
- [ ] 찜하기 수 표시

#### UI/UX
```
┌─────────────────────┐
│ 향수                 │ ← 헤더 (70px)
├─────────────────────┤
│ [향수][분석][통계]   │ ← 탭
├─────────────────────┤
│ 🔍 검색             │ ← 검색바
│ [필터] [정렬]       │ ← 필터/정렬 버튼
├──────────┬──────────┤
│ 🖼️ 향수1  │ 🖼️ 향수2 │ ← 2열 그리드
│ 브랜드명   │ 브랜드명  │
│ 향수명     │ 향수명   │
├──────────┼──────────┤
│ ...                 │
└─────────────────────┘
│ < 1 2 3 4 5 >      │ ← 페이지네이션
└─────────────────────┘
```

#### 제약사항
- 한 페이지: 10개
- 검색어: 최소 2자
- 이미지 없을 시: 회색 플레이스홀더

---

### 2.2 향수 상세

#### 현재 구현 상태
- ✅ 브랜드 정보 (이름, 링크)
- ✅ 향수 이미지
- ✅ 노트 정보 (Top, Middle, Base)
- ✅ 피드백 버튼
- ❌ Fragrance Wheel (주석 처리됨)

#### 추가 필요
- [ ] Fragrance Wheel 차트 구현
- [ ] 찜하기 버튼
- [ ] 리뷰 목록 표시
- [ ] 관련 향수 추천
- [ ] 가격 정보 표시
- [ ] 구매 링크

#### 확정 사항 ✅
- ✅ **Fragrance Wheel**: SVG 인터랙티브 차트 (데이터 기반 변화)
- ✅ **피드백 시스템**: 카테고리 선택 + 자유 입력
  - 향수 데이터 오류
  - 링크 및 출처 오류  
  - 이미지 오류
  - 기타
- ✅ **Tommy 설명**: `perfumes.tommy_description` 컬럼에 저장

---

### 2.3 향수 리뷰 (Phase 2)

#### 요구사항 ✅ 확정

##### 리뷰 작성
- **별점**: 1~5점 (0.5 단위)
- **제목**: 선택 (50자 이하)
- **내용**: 필수 (10~1000자)
- **이미지**: 최대 3장, 5MB 이하
- ❌ **익명 리뷰**: 불필요

##### 리뷰 목록
- 최신순 / 별점 높은순 / 별점 낮은순
- 페이지네이션 (20개/페이지)
- 평균 별점 표시
- ✅ **좋아요/신고**: 게시글과 동일한 시스템

##### 리뷰 수정/삭제
- 작성자만 수정/삭제 가능
- ✅ **수정 가능**: "(수정됨)" 표시
- 삭제 시 소프트 삭제

#### 확정 사항 ✅
- ✅ **리뷰 수정**: 가능
- ❌ **익명 리뷰**: 불필요
- ✅ **좋아요/신고**: 게시글과 동일 시스템
- ✅ **개발 시기**: Phase 2 (MVP 제외)

---

### 2.4 향수 찜하기 ✅ 확정

#### 요구사항

##### 찜하기 기능
- 로그인 사용자만 가능
- ✅ **카테고리별 버튼**: 5개 카테고리 버튼
- 토글 방식 (클릭으로 추가/제거)
- ❌ **찜하기 수 표시**: 상세 페이지에서 불필요

##### 찜하기 카테고리 ✅ 확정
1. **시향해본** (`sampled`)
2. **써본** (`used`)
3. **오늘 뿌린** (`today`) - 하루 5개 제한
4. **보유중** (`owned`)
5. **관심** (`interested`)

##### 자동 변경 로직 ✅ 확정
- **오늘 뿌린** → **써본**: 매일 자정 자동 변경
- Supabase Edge Function으로 구현

##### 찜 목록
- 마이페이지에서 확인
- 카테고리별 분류
- 페이지네이션 (20개/페이지)

##### 찜 통계
- 총 찜한 향수 수
- 카테고리별 개수
- 최근 찜한 향수 (5개)
- ✅ **정렬 기준**: 관심순 = 전체 사용자 찜하기 수

---

### 2.5 향수 비교 ✅ MVP 포함

#### 요구사항

##### 비교 기능
- ✅ **최대 5개** 향수 동시 비교
- 비교 테이블 형태로 표시
- ✅ **Fragrance Wheel 시각화**: SVG 구현
- ✅ **AI 분석**: 공통점/차이점 요약

##### 비교 항목
- 기본 정보 (브랜드, 용량, 가격)
- 향 계열
- 주요 노트
- 지속력
- 발산력
- 계절성

##### Fragrance Wheel 합산 ✅ 확정
- **MVP**: 단순 더하기 (normalize 없음)
- **향후**: normalize 적용
- SVG로 시각화

#### 확정 사항 ✅
- ✅ **비교 개수**: 최대 5개
- ✅ **AI 분석**: 포함 (챗봇 연동)
- ✅ **개발 시기**: MVP 포함

---

### 2.6 Tommy AI 분석 ✅ 확정

#### 요구사항
- ✅ **개별 향수 분석**: AI 완료된 내용
- ✅ **Tommy 설명**: `perfumes.tommy_description` 저장
- ✅ **관리자 관리**: 관리자 페이지에서 편집
- ✅ **개발 시기**: 앱 개발 막바지 + 데이터 정리 과정

---

## 3. 데이터베이스

### 3.1 현재 테이블

#### `perfumes`
```sql
- id (UUID)
- brand_id (UUID, FK → brands)
- name (TEXT) -- 영문명
- name_kr (TEXT) -- 한글명
- description (TEXT)
- image_url (TEXT)
- price (DECIMAL)
- volume_ml (INTEGER)
- gender (TEXT: 'male' | 'female' | 'unisex')
- release_year (INTEGER)
- created_at, updated_at
```

#### `brands`
```sql
- id (UUID)
- name_kr (TEXT) -- 한글명
- name_en (TEXT) -- 영문명
- nickname (TEXT) -- 별칭
- description (TEXT)
- logo_url (TEXT)
- country (TEXT)
- created_at
```

#### `perfume_notes`
```sql
- id (UUID)
- perfume_id (UUID, FK)
- note_type (TEXT: 'top' | 'middle' | 'base')
- note_name (TEXT)
- intensity (INTEGER: 1-5) -- 강도
```

#### `perfume_accords`
```sql
- id (UUID)
- perfume_id (UUID, FK)
- accord_id (UUID, FK → accords)
- percentage (INTEGER: 0-100)
```

### 3.2 추가 필요한 테이블

#### `reviews` (리뷰) ✅ 확정
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  perfume_id UUID REFERENCES perfumes(id),
  user_id UUID REFERENCES profiles(id),
  rating DECIMAL(2,1), -- 0.5~5.0
  title TEXT, -- 선택 (50자)
  content TEXT NOT NULL, -- 10~1000자
  image_urls TEXT[],
  -- is_anonymous: 익명 불필요 (제거)
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  -- 소프트 삭제
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES profiles(id)
);
```

**설계 결정:**
- ❌ **익명 리뷰**: 불필요 (제거 확정)
- ✅ **수정 가능**: 수정 시 "(수정됨)" 표시
- ✅ **좋아요/신고**: 게시글과 동일한 방식

#### `user_favorites` (찜하기) ✅ 확정
```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  perfume_id UUID REFERENCES perfumes(id),
  category TEXT NOT NULL CHECK (category IN ('sampled', 'used', 'today', 'owned', 'interested')),
  memo TEXT, -- 선택적 메모
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, perfume_id, category)
);
```

#### `perfume_feedback` (피드백) ✅ 확정
```sql
CREATE TABLE perfume_feedback (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  perfume_id UUID REFERENCES perfumes(id),
  category TEXT NOT NULL CHECK (category IN ('data_error', 'link_error', 'image_error', 'other')),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  admin_comment TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### `review_likes` (리뷰 좋아요) ✅ 확정
```sql
CREATE TABLE review_likes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  review_id UUID REFERENCES reviews(id),
  created_at TIMESTAMP,
  UNIQUE(user_id, review_id)
);
```

#### `perfumes` 테이블 수정 ✅ 확정
```sql
-- 기존 perfumes 테이블에 추가
ALTER TABLE perfumes ADD COLUMN tommy_description TEXT;
```

#### `perfume_calendar` (오늘 뿌린 캘린더) ✅ 확정
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
CREATE INDEX idx_perfume_calendar_month ON perfume_calendar(user_id, applied_date) 
WHERE applied_date >= CURRENT_DATE - INTERVAL '1 year';
```

---

## 4. API

### 4.1 현재 API

#### 향수 목록 ✅ 확정
```typescript
getPerfumesOptimized(params: {
  query?: string,
  brand_id?: string,
  gender?: 'male' | 'female' | 'unisex',
  price_min?: number,
  price_max?: number,
  sort_by?: 'created_at' | 'price' | 'name' | 'name_desc' | 'brand' | 'brand_desc' | 'interested' | 'used',
  sort_order?: 'asc' | 'desc',
  page?: number,
  limit?: number
}): Promise<ApiResponse<PaginatedResponse<PerfumeWithBrand>>>
```

#### 향수 상세
```typescript
getPerfumeDetail(perfumeId: string): Promise<ApiResponse<PerfumeWithBrand>>
getPerfumeNotes(perfumeId: string): Promise<ApiResponse<{ top: string[], middle: string[], base: string[] }>>
```

### 4.2 추가 필요한 API

#### 리뷰
```typescript
getReviews(perfumeId: string, params: { page, limit, sort_by }): Promise<...>
createReview(data: CreateReviewData): Promise<...>
updateReview(reviewId: string, data: UpdateReviewData): Promise<...>
deleteReview(reviewId: string): Promise<...>
markReviewHelpful(reviewId: string): Promise<...>
```

#### 찜하기 ✅ 확정
```typescript
getFavorites(userId: string, params: { category?, page, limit }): Promise<...>
toggleFavorite(perfumeId: string, category: 'sampled' | 'used' | 'today' | 'owned' | 'interested'): Promise<...>
getFavoriteStatus(perfumeId: string): Promise<{ [category: string]: boolean }>
```

#### 피드백 ✅ 확정
```typescript
submitFeedback(data: {
  perfumeId: string,
  category: 'data_error' | 'link_error' | 'image_error' | 'other',
  content: string
}): Promise<...>
```

#### 향수 비교 ✅ 확정
```typescript
comparePerfumes(perfumeIds: string[]): Promise<{
  perfumes: PerfumeWithBrand[],
  comparison: ComparisonData,
  aiAnalysis: string
}>
```

#### 자동 변경 (Edge Function) ✅ 확정
```typescript
// 매일 자정 실행
moveTodayToUsed(): Promise<{ movedCount: number }>
```

#### 캘린더 기능 ✅ 확정
```typescript
// 캘린더 기록 추가
addToCalendar(data: {
  perfumeId: string,
  appliedDate: string,
  appliedTime?: string,
  notes?: string,
  weather?: string,
  mood?: string
}): Promise<ApiResponse<PerfumeCalendarEntry>>

// 캘린더 기록 조회 (월별)
getCalendarEntries(userId: string, year: number, month: number): Promise<ApiResponse<PerfumeCalendarEntry[]>>

// 캘린더 기록 수정
updateCalendarEntry(entryId: string, data: {
  appliedTime?: string,
  notes?: string,
  weather?: string,
  mood?: string
}): Promise<ApiResponse<PerfumeCalendarEntry>>

// 캘린더 기록 삭제
deleteCalendarEntry(entryId: string): Promise<ApiResponse<void>>

// 통계 조회
getCalendarStats(userId: string, year?: number): Promise<{
  totalDays: number,
  mostUsedPerfume: PerfumeWithCount,
  monthlyStats: MonthlyStats[]
}>
```

---

## 5. UI 컴포넌트

### 5.1 현재 컴포넌트

#### 화면
- `app/perfume.tsx` (메인 화면)
  - 목록 탭
  - 분석 탭 (미구현)
  - 통계 탭 (미구현)
  - 상세 화면 (조건부 렌더링)

#### 컴포넌트
- 없음 (모두 인라인)

### 5.2 필요한 컴포넌트

#### 공통 (Shared)
- `<Pagination />` - 페이지네이션
- `<SearchBar />` - 검색바
- `<FilterModal />` - 필터 모달
- `<SortModal />` - 정렬 모달

#### 도메인 (Perfume) ✅ 확정
- `<PerfumeCard />` - 향수 카드
- `<PerfumeDetail />` - 향수 상세
- `<NoteBar />` - 노트 바
- ✅ `<FragranceWheel />` - Fragrance Wheel 차트 (MVP)
- ✅ `<FavoriteButtons />` - 5개 카테고리 찜하기 버튼 (MVP)
- ✅ `<FeedbackModal />` - 피드백 모달 (MVP)
- ✅ `<ComparisonTable />` - 향수 비교 테이블 (MVP)
- ✅ `<PerfumeCalendar />` - 캘린더 컴포넌트 (Phase 2)
- ✅ `<CalendarEntryForm />` - 캘린더 기록 작성 폼 (Phase 2)
- ✅ `<CalendarStats />` - 캘린더 통계 컴포넌트 (Phase 2)
- `<ReviewCard />` - 리뷰 카드 (Phase 2)
- `<ReviewForm />` - 리뷰 작성 폼 (Phase 2)

---

## 6. 권한 및 보안

### 6.1 권한 레벨

| 기능 | 비로그인 | 로그인 | 관리자 |
|------|----------|--------|--------|
| 목록 조회 | ✅ | ✅ | ✅ |
| 상세 조회 | ✅ | ✅ | ✅ |
| 찜하기 | ❌ | ✅ | ✅ |
| 피드백 제출 | ❌ | ✅ | ✅ |
| 향수 비교 | ✅ | ✅ | ✅ |
| 캘린더 조회 | ❌ | ✅(본인) | ✅ |
| 캘린더 기록 | ❌ | ✅(본인) | ✅ |
| 리뷰 조회 | ✅ | ✅ | ✅ |
| 리뷰 작성 | ❌ | ✅ | ✅ |
| 리뷰 수정 | ❌ | ✅(본인) | ✅(모두) |
| 리뷰 삭제 | ❌ | ✅(본인) | ✅(모두) |
| 향수 추가 | ❌ | ❌ | ✅ |
| 향수 수정 | ❌ | ❌ | ✅ |
| 피드백 관리 | ❌ | ❌ | ✅ |

### 6.2 보안 고려사항 ✅ 확정
- ✅ **XSS 방지**: React Native 앱에서는 불필요 (향후 웹 버전 대비)
- ✅ **이미지 검증**: 리뷰 이미지 (Phase 2)
- ✅ **Rate Limiting**: 찜하기 (10회/10초), 피드백 (5회/분)
- ✅ **자동 변경**: Edge Function으로 안전한 배치 처리

---

## 7. 성능 목표

| 항목 | 목표 | 현재 |
|------|------|------|
| 목록 로딩 | < 500ms | ~400ms ✅ |
| 상세 로딩 | < 300ms | ~250ms ✅ |
| 검색 응답 | < 1s | ~600ms ✅ |
| ✅ 향수 비교 | < 3s | - |
| ✅ Fragrance Wheel | < 1s | - |
| ✅ 찜하기 토글 | < 500ms | - |
| ✅ 피드백 제출 | < 1s | - |
| 리뷰 로딩 | < 500ms | - (Phase 2) |
| 이미지 업로드 | < 5s | - (Phase 2) |

---

## 8. 테스트 시나리오

### 8.1 정상 케이스 ✅ 확정
1. 목록 조회 → 10개 표시
2. 검색 ("디올") → 검색 결과 표시
3. 필터 (브랜드: 샤넬) → 샤넬 향수만
4. 정렬 (이름순/브랜드순/관심순/써본순) → 정렬 결과
5. 상세 클릭 → 상세 화면 진입
6. ✅ 찜하기 토글 → 카테고리별 찜하기/해제
7. ✅ 피드백 제출 → 카테고리 선택 + 내용 입력
8. ✅ 향수 비교 → 최대 5개 선택 + Fragrance Wheel 표시
9. 뒤로가기 → 목록 복귀 (상태 유지)

### 8.2 예외 케이스 ✅ 확정
1. 검색 결과 없음 → "검색 결과가 없습니다"
2. 네트워크 오류 → 재시도 버튼
3. 이미지 로딩 실패 → 플레이스홀더
4. ✅ 로그인 없이 찜하기 → 로그인 유도
5. ✅ 오늘 뿌린 5개 초과 → "하루 5개까지만 가능"
6. ✅ 비교 5개 초과 → "최대 5개까지만 비교 가능"

---

## 9. 의존성

### 9.1 필수 의존 ✅ 확정
- ✅ **인증 시스템**: 찜하기, 피드백 제출
- ✅ **권한 체크**: AUTH_PATTERN
- ✅ **CRUD 시스템**: CRUD_PATTERN
- ✅ **Rate Limiting**: CRUD_PATTERN

### 9.2 선택적 의존 ✅ 확정
- ✅ **프로필**: 찜하기 사용자 정보
- ✅ **공통 컴포넌트**: Pagination, SearchBar
- ✅ **이미지 업로드**: IMAGE_UPLOAD_PATTERN (Phase 2)

### 9.3 역의존 (이 기능에 의존하는 것) ✅ 확정
- ✅ **커뮤니티**: 향수 관련 글
- ✅ **챗봇**: 향수 추천 + 비교 분석
- ✅ **홈**: 오늘의 향수
- ✅ **관리자 페이지**: 향수 데이터 관리

---

## 10. 개발 우선순위

### Week 3: 필터/정렬 완성 + 공통 컴포넌트
- [ ] 브랜드 필터 데이터 연동
- [ ] 성별 필터 데이터 연동
- [ ] 가격 필터 데이터 연동
- [ ] ✅ 정렬 기능: 이름순/역순, 브랜드순/역순, 관심순, 써본순
- [ ] 공통 컴포넌트: Pagination, SearchBar

### Week 4: 찜하기 + 피드백 시스템
- [ ] ✅ 찜하기 버튼: 5개 카테고리 (시향해본, 써본, 오늘 뿌린, 보유중, 관심)
- [ ] ✅ 찜하기 토글 기능
- [ ] ✅ 오늘 뿌린 5개 제한
- [ ] ✅ 찜 목록 화면 (마이페이지)
- [ ] ✅ 피드백 모달: 카테고리 선택 + 자유 입력
- [ ] ✅ 피드백 제출 API
- [ ] ✅ 자동 변경 로직: 매일 자정 "오늘 뿌린" → "써본" (Edge Function)

### Week 5: 향수 비교 + Fragrance Wheel
- [ ] ✅ 향수 비교: 최대 5개 선택
- [ ] ✅ Fragrance Wheel: SVG 구현
- [ ] ✅ 비교 테이블
- [ ] ✅ Fragrance Wheel 합산 (단순 더하기)
- [ ] ✅ 챗봇 연동: AI 분석 결과

### Phase 2: 리뷰 시스템 + 캘린더 기능
- [ ] 리뷰 목록 표시
- [ ] 리뷰 작성 화면
- [ ] 리뷰 수정/삭제
- [ ] ✅ 좋아요/신고 시스템 (게시글과 동일)
- [ ] ✅ 캘린더 기능: perfume_calendar 테이블
- [ ] ✅ 캘린더 UI: 월별 달력 표시
- [ ] ✅ 캘린더 기록: 시간, 메모, 날씨, 기분
- [ ] ✅ 캘린더 통계: 가장 많이 쓴 향수, 월별 통계

### Phase 3: 고급 기능
- [ ] ✅ Tommy 설명: AI 분석 완료 내용
- [ ] ✅ Fragrance Wheel normalize
- [ ] 개인화 통계

---

## 11. ✅ 모든 사항 확정 완료

### ✅ 결정 완료 (우선순위 높음)
1. ✅ **리뷰 수정**: 가능 (수정됨 표시)
2. ✅ **리뷰 익명**: 불필요
3. ✅ **찜하기 카테고리**: 시향해본, 써본, 오늘 뿌린(5개 제한), 보유중, 관심
4. ✅ **Fragrance Wheel**: SVG 인터랙티브 차트 (데이터 기반 변화)

### ✅ 결정 완료 (우선순위 낮음)
5. ✅ **리뷰 좋아요**: 게시글과 동일한 좋아요/신고 시스템
6. ✅ **향수 비교**: 최대 5개, Fragrance Wheel 합산, AI 분석
7. ✅ **Tommy AI 분석**: 개별 향수 분석 완료 내용 (앱 개발 막바지)
8. ✅ **캘린더 기능**: Phase 2에서 구현, 날짜별 향수 기록, 통계 기능

---

## 12. 다음 단계

### ✅ 문서화 완료
- ✅ 모든 미결정 사항 결정
- ✅ DB 스키마 확정 (user_favorites, perfume_feedback, review_likes, perfume_calendar)
- ✅ API 명세 확정 (찜하기, 피드백, 비교, 자동변경, 캘린더)

### 🚀 개발 단계 준비 완료
- ✅ 공통 컴포넌트 명세 (Pagination, SearchBar, FragranceWheel, PerfumeCalendar)
- ✅ 패턴 적용 준비 (CRUD, AUTH, IMAGE_UPLOAD)
- ✅ 기능 구현 로드맵 확정 (Week 3-5 MVP, Phase 2 캘린더)

---

## 🎯 **PERFUME.md 최종 확정 완료!**

**모든 결정 사항이 확정되어 개발을 시작할 준비가 완료되었습니다!** 🚀


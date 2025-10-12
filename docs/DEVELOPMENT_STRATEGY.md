# Nostum 앱 개발 전략

> **작성일:** 2025-10-11  
> **버전:** 2.0 (전략 재수립)  
> **목적:** 체계적이고 유기적인 개발을 위한 레이어 기반 접근

---

## 📌 목차
1. [현재 상황 분석](#현재-상황-분석)
2. [문제점 및 원인](#문제점-및-원인)
3. [새로운 개발 전략](#새로운-개발-전략)
4. [문서화 우선 접근](#문서화-우선-접근)
5. [레이어별 개발 순서](#레이어별-개발-순서)
6. [관리자 페이지 옵션](#관리자-페이지-옵션)
7. [실행 계획](#실행-계획)

---

## 현재 상황 분석

### ✅ 완료된 작업

#### 향수 기능
- ✅ 목록 (페이지네이션, 검색, 필터)
- ✅ 상세 (브랜드 정보, 노트 정보)
- ✅ 카드 UI (이미지, 브랜드, 이름)
- ❌ 리뷰 시스템 (미구현)
- ❌ 찜하기 (미구현)

#### 커뮤니티 기능
- ✅ 목록 (페이지네이션, 검색, 카테고리 필터)
- ✅ 상세 UI (게시글 본문, 댓글 UI)
- ✅ 운영 규칙 27개 문서화
- ✅ DB 인덱스 최적화 (12개 인덱스)
- ❌ 상세 데이터 연동 (임시 데이터)
- ❌ 작성 화면 (미구현)
- ❌ 댓글 기능 (미구현)

#### 인증 및 프로필
- ✅ Google OAuth 로그인
- ✅ 로그인/로그아웃
- ✅ 프로필 조회
- ❌ 마이페이지 (거의 미구현)
- ❌ 프로필 수정 (미구현)

#### 기타
- ✅ 홈 화면 (오늘의 향수, 최신 글)
- ❌ 챗봇 (UI만, 기능 없음)
- ❌ 관리자 페이지 (없음)

### 📊 구현률
- **향수**: 60%
- **커뮤니티**: 40%
- **프로필**: 20%
- **챗봇**: 5%
- **관리자**: 0%

---

## 문제점 및 원인

### 🚨 **현재 문제점**

#### 1. 기능별 분산 개발 (Feature-Based)
```
향수 개발 → 커뮤니티 개발 → 다시 향수 → 다시 커뮤니티
└── 컨텍스트 스위칭 비용 증가
└── 일관성 부족
```

**증상:**
- 페이지네이션이 향수와 커뮤니티에서 다른 방식
- 검색 로직 중복
- 스타일 불일치

#### 2. 테스트 환경 부족
**현재:**
```
테스트 필요 → Supabase SQL Editor → 수동 INSERT
└── 매우 번거로움
└── 오타 발생
└── 시간 소모
```

**필요:**
```
테스트 필요 → 관리자 페이지 → 클릭 몇 번으로 데이터 생성
└── 빠름
└── 정확함
└── 편리함
```

#### 3. DB 스키마 변경 빈번
**문제:**
- 기능 개발 중 "아, 이 컬럼 필요해!" 반복
- ALTER TABLE 스크립트 누적
- 마이그레이션 복잡도 증가

**원인:**
- 전체 기능 요구사항 파악 안 됨
- 미리 설계하지 않고 즉흥적 개발

#### 4. 순환 의존성
**예시:**
```
커뮤니티 개발 중
  → 권한 체크 필요
    → 마이페이지 필요
      → 내가 쓴 글 필요
        → 커뮤니티 API 필요
          → 다시 커뮤니티로...
```

#### 5. 코드 중복 및 불일치
**현재:**
- 향수 페이지네이션 ≠ 커뮤니티 페이지네이션
- 향수 검색 ≠ 커뮤니티 검색
- 시간 포맷팅 함수 중복

**문제:**
- 유지보수 시 여러 곳 수정 필요
- 버그 발생 확률 증가
- 일관성 없는 UX

---

## 새로운 개발 전략

### **기존: Feature-Based Development** ❌

```
Layer 1: UI
├── 향수 UI → 커뮤니티 UI → 프로필 UI
│   └── 각각 완성하려다 막힘

Layer 2: API
├── 향수 API → 커뮤니티 API → 프로필 API
│   └── 중복 로직 발생

Layer 3: DB
└── 필요할 때마다 테이블/컬럼 추가
    └── 마이그레이션 지옥
```

### **새로운: Layer-Based Development** ✅

```
Phase 1: 인프라 레이어 (Foundation)
├── DB 스키마 최종 확정 (모든 테이블/컬럼)
├── 관리자 페이지 (테스트 환경)
└── 인증 & 기본 프로필

Phase 2: 공통 레이어 (Shared)
├── 디자인 시스템
├── 공통 컴포넌트 (Pagination, SearchBar, ImageUploader)
├── 공통 훅 (useAuth, usePagination, useSearch)
└── 유틸리티 (formatters, validators)

Phase 3: 패턴 레이어 (Patterns)
├── CRUD 표준 패턴 확립
├── 권한 체크 패턴
└── 이미지 처리 패턴

Phase 4: 기능 레이어 (Features)
└── 패턴 적용하여 빠르게 개발
```

### **핵심 원칙**

#### 1. **문서 → 설계 → 개발**
```
요구사항 문서화
  ↓
DB 스키마 확정
  ↓
공통 요소 파악
  ↓
공통 컴포넌트 개발
  ↓
패턴 확립
  ↓
기능 개발 (빠름!)
```

#### 2. **한 번 만들어 여러 곳 사용**
```
<Pagination /> 한 번 개발
  → 향수, 커뮤니티, 프로필, 관리자 모두 사용
  
usePagination() 한 번 개발
  → 모든 목록 페이지에서 재사용
```

#### 3. **테스트 환경 우선**
```
관리자 페이지 먼저 개발
  → 다른 기능 개발 시 데이터 쉽게 생성/삭제
  → 개발 속도 2배 향상
```

---

## 문서화 우선 접근

### **왜 문서화부터?**

#### 1. **요구사항 명확화**
- ✅ 무엇을 만들지 정확히 알고 시작
- ✅ 기능 누락 방지
- ✅ 범위 크립(Scope Creep) 방지

#### 2. **DB 스키마 최적화**
- ✅ 모든 기능 파악 → 필요한 컬럼 미리 추가
- ✅ ALTER TABLE 최소화
- ✅ 마이그레이션 부담 감소

#### 3. **공통 요소 파악**
- ✅ 여러 기능에서 사용하는 것 먼저 개발
- ✅ 중복 코드 방지
- ✅ 일관성 확보

#### 4. **의존성 관리**
- ✅ 어떤 기능이 어떤 기능에 의존하는지 파악
- ✅ 최적의 개발 순서 도출
- ✅ 막히는 상황 방지

#### 5. **커뮤니케이션**
- ✅ AI와의 협업 시 문서 참조
- ✅ 일관된 개발 방향
- ✅ 향후 개발자 온보딩 용이

---

## 레이어별 개발 순서

### **📚 Phase 0: 문서화 (1주일)**

#### **Day 1-2: 기능 명세서 작성**
```
✅ PERFUME.md         - 향수 기능 (목록, 상세, 리뷰, 찜)
✅ PROFILE.md         - 프로필 기능 (정보, 활동, 설정)
✅ ADMIN.md           - 관리자 기능 (관리, 통계)
✅ CHATBOT.md         - 챗봇 기능 (대화, 추천)
✅ COMMUNITY.md       - 커뮤니티 기능 (이미 완료 ✅)
```

#### **Day 3-4: 패턴 문서화**
```
✅ CRUD_PATTERN.md           - CRUD 표준
✅ PAGINATION_PATTERN.md     - 페이지네이션 표준
✅ SEARCH_PATTERN.md         - 검색 표준
✅ IMAGE_UPLOAD_PATTERN.md   - 이미지 처리 표준
✅ AUTH_PATTERN.md           - 권한 체크 표준
```

#### **Day 5: 통합 문서**
```
✅ DATABASE_SCHEMA_FINAL.md  - 최종 DB 스키마
✅ COMPONENT_INVENTORY.md    - 공통 컴포넌트 목록
✅ DEVELOPMENT_ROADMAP.md    - 문서 기반 개발 계획
```

#### **완료 시 산출물:**
- 📄 5개 기능 명세서
- 📄 5개 패턴 문서
- 📄 3개 통합 문서
- 📊 최종 DB 스키마
- 📋 최적화된 개발 로드맵

---

### **🏗️ Phase 1: 인프라 레이어 (3-5일)**

#### **Step 1: DB 스키마 최종 적용**
```sql
-- 문서 기반으로 모든 테이블 생성/수정
1. add_soft_delete_columns.sql
2. expand_community_schema.sql
3. perfume_additional_columns.sql (필요 시)
4. 모든 인덱스 생성
```

**목표:** 향후 6개월간 스키마 변경 없도록

#### **Step 2: 관리자 페이지 기본 (2-3일)**
```
선택: 옵션 A (RN Web) 또는 옵션 B (Next.js)

최소 기능:
✅ 로그인 (관리자 권한 체크)
✅ 사용자 목록 및 권한 변경
✅ 게시글 생성/삭제
✅ 댓글 생성/삭제
✅ 테스트 데이터 일괄 생성
```

**목표:** 개발 중 테스트 편의성 극대화

#### **Step 3: 마이페이지 기본 (1-2일)**
```
✅ 프로필 조회
✅ 프로필 수정 (닉네임, 아바타)
✅ 내가 쓴 글 목록
✅ 내가 쓴 댓글 목록
```

**목표:** 권한 체크 테스트 가능

---

### **🧩 Phase 2: 공통 레이어 (1주일)**

#### **공통 컴포넌트 개발**

##### 1. Pagination 통합
```typescript
// components/shared/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'compact';
}

// 사용처: 향수, 커뮤니티, 프로필, 관리자
```

##### 2. SearchBar 통합
```typescript
// components/shared/SearchBar.tsx
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

// 사용처: 향수, 커뮤니티, 관리자
```

##### 3. ImageUploader
```typescript
// components/shared/ImageUploader.tsx
interface ImageUploaderProps {
  maxImages?: number;
  maxSize?: number; // MB
  onUpload: (urls: string[]) => void;
  initialImages?: string[];
}

// 사용처: 커뮤니티, 프로필, 리뷰
```

##### 4. Avatar
```typescript
// components/ui/Avatar.tsx
interface AvatarProps {
  imageUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

// 사용처: 커뮤니티, 프로필, 댓글, 리뷰
```

#### **공통 훅 개발**

```typescript
// lib/hooks/
useAuth()           // 인증 상태 (전역)
usePagination()     // 페이지네이션 로직
useSearch()         // 검색 로직
useImageUpload()    // 이미지 업로드 로직
usePermission()     // 권한 체크
```

#### **유틸리티 함수**

```typescript
// lib/utils/formatters.ts
formatTimeAgo(date: string): string
formatNumber(num: number): string
formatDate(date: string): string

// lib/utils/validators.ts
validateTitle(title: string): boolean
validateContent(content: string): boolean
validateImage(file: File): boolean

// lib/utils/sanitizers.ts
sanitizeHTML(html: string): string
escapeXSS(text: string): string
```

---

### **📐 Phase 3: 패턴 레이어 (3-5일)**

#### **CRUD 표준 패턴 확립**

**한 가지를 완벽하게 → 모든 곳에 적용**

##### 예시: 게시글 CRUD
```typescript
// 1. 목록 조회 (표준)
const { data, totalCount } = await getCommunityPosts({
  page,
  limit,
  query,
  category_id,
  sort_by,
  sort_order
});

// 2. 상세 조회 (표준)
const { data } = await getCommunityPostById(id);
// + 조회수 자동 증가

// 3. 생성 (표준)
const { data } = await createCommunityPost({
  title,
  content,
  image_urls,
  category_id
});
// + 이미지 압축
// + XSS 필터링

// 4. 수정 (표준)
const { data } = await updateCommunityPost(id, {
  title,
  content
});
// + 권한 체크 (작성자 or 관리자)

// 5. 삭제 (표준 - 소프트 삭제)
const { data } = await deleteCommunityPost(id);
// + 소프트 삭제 (is_deleted=true)
// + 권한 체크
// + 확인 다이얼로그
```

**이 패턴을 적용:**
- 댓글 CRUD
- 리뷰 CRUD
- 향수 관리 CRUD

---

### **✨ Phase 4: 기능 레이어 (2-3주)**

#### **수평적 완성 (Horizontal)**
동일한 기능을 모든 페이지에 동시 적용

##### 예시: 좋아요 시스템
```
한 번에 개발:
✅ 게시글 좋아요
✅ 댓글 좋아요
✅ 리뷰 좋아요
✅ 향수 찜하기

공통 컴포넌트:
<LikeButton type="post" | "comment" | "review" | "perfume" />
```

#### **수직적 완성 (Vertical)**
한 페이지씩 완전히 마무리

```
우선순위:
1. 마이페이지 (다른 기능 테스트 위해 필요)
2. 커뮤니티 (진행 중)
3. 향수 (리뷰, 찜하기 추가)
4. 챗봇
```

---

## 관리자 페이지 옵션

### **옵션 A: React Native Web 전용 페이지**

#### **구조**
```typescript
// app/nadmin/_layout.tsx
<Stack>
  <Stack.Screen name="index" />      // 대시보드
  <Stack.Screen name="users" />      // 사용자 관리
  <Stack.Screen name="posts" />      // 게시글 관리
  <Stack.Screen name="perfumes" />   // 향수 DB
</Stack>

// 접근: http://localhost:8081/nadmin
```

#### **장점** ✅
1. **개발 속도 ⭐⭐⭐⭐⭐**
   - 기존 프로젝트에 폴더만 추가
   - 2-3일이면 기본 기능 완성
   - Supabase 클라이언트 재사용
   - 타입 정의 재사용

2. **코드 공유**
   - `communityService.ts` 그대로 사용
   - `AuthContext` 공유
   - 같은 디자인 시스템

3. **통합 관리**
   - 하나의 프로젝트
   - 하나의 배포
   - 의존성 관리 단순

#### **단점** ❌
1. **성능 제약 ⭐⭐⭐**
   - React Native Web은 무거움
   - 복잡한 테이블/차트 느림
   - 대용량 데이터 처리 어려움

2. **보안 우려 ⭐⭐⭐**
   - 앱 번들에 관리자 코드 포함
   - 디컴파일 시 노출 가능성
   - URL 노출 위험

3. **기능 제약 ⭐⭐⭐**
   - 웹 전용 라이브러리 사용 제한
   - 데스크톱 최적화 어려움
   - 파일 다운로드 등 제약

#### **적합한 경우**
- ✅ 빠른 프로토타입 필요
- ✅ 간단한 CRUD만 필요
- ✅ 초기 개발 단계
- ✅ 예산/시간 제약

---

### **옵션 B: 별도 Next.js 프로젝트**

#### **구조**
```
admin-dashboard/
├── app/
│   ├── page.tsx                    # 대시보드
│   ├── login/page.tsx              # 관리자 로그인
│   ├── users/
│   │   ├── page.tsx                # 사용자 목록
│   │   └── [id]/page.tsx           # 사용자 상세
│   ├── posts/
│   │   ├── page.tsx                # 게시글 목록
│   │   └── [id]/page.tsx           # 게시글 상세/수정
│   └── perfumes/
│       ├── page.tsx                # 향수 목록
│       └── [id]/page.tsx           # 향수 수정
├── components/
│   ├── ui/                         # Shadcn/ui
│   ├── tables/                     # 데이터 테이블
│   └── charts/                     # 통계 차트
├── lib/
│   ├── supabase.ts                 # Supabase 클라이언트
│   └── types.ts                    # 타입 (앱과 공유 가능)
└── package.json

// 접근: http://admin.localhost:3000
// 배포: https://admin.nostum.app
```

#### **장점** ✅
1. **최고 성능 ⭐⭐⭐⭐⭐**
   - Next.js는 웹에 최적화
   - Server Components (빠름)
   - 대용량 데이터 처리 우수

2. **풍부한 라이브러리 ⭐⭐⭐⭐⭐**
   - **Shadcn/ui**: 아름다운 컴포넌트
   - **AG Grid**: 엑셀급 테이블
   - **Recharts/Chart.js**: 통계 차트
   - **React Hook Form**: 복잡한 폼
   - **TanStack Table**: 고급 테이블

3. **강력한 기능 ⭐⭐⭐⭐⭐**
   - 실시간 통계 대시보드
   - CSV/Excel 다운로드
   - 이미지 일괄 처리
   - 고급 검색/필터링
   - 드래그 앤 드롭

4. **보안 강화 ⭐⭐⭐⭐⭐**
   - 앱과 완전 분리
   - 별도 도메인
   - 별도 인증 시스템
   - 앱에 코드 노출 안 됨
   - IP 제한 가능

5. **프로페셔널 ⭐⭐⭐⭐⭐**
   - 관리자가 사용하기 편함
   - 데스크톱 최적화
   - 단축키 지원
   - 다크 모드

6. **독립적 배포 ⭐⭐⭐⭐**
   - 앱 배포와 무관
   - 관리 기능만 빠르게 업데이트
   - Vercel 무료 호스팅

#### **단점** ❌
1. **초기 시간 ⭐⭐**
   - 프로젝트 생성: 1일
   - 기본 구조: 2-3일

2. **학습 필요 ⭐⭐**
   - Next.js 14 App Router
   - Server Components
   - (하지만 매우 쉬움)

3. **배포 복잡도 ⭐⭐**
   - 앱 + 관리자 2개 배포
   - (하지만 Vercel은 자동)

4. **타입 중복 ⭐⭐**
   - 타입 정의 공유 필요
   - (npm 패키지로 해결 가능)

#### **적합한 경우**
- ✅ 장기 프로젝트
- ✅ 복잡한 관리 기능 필요
- ✅ 여러 관리자 사용
- ✅ 통계/분석 중요
- ✅ 프로페셔널한 운영 도구 필요

---

## ✅ **최종 결정: 옵션 B (Next.js 별도 프로젝트)**

### **선택 이유**
1. ✅ 장기 프로젝트 (6개월 이상 운영 예정)
2. ✅ 복잡한 관리 기능 필요 (통계, 대시보드)
3. ✅ 보안 중요 (앱과 분리)
4. ✅ 여러 관리자 사용 가능성
5. ✅ 프로페셔널한 운영 도구 필요

### **기술 스택 (확정)**
```
- Next.js 14 (App Router)
- TypeScript
- Supabase Client
- Shadcn/ui (컴포넌트)
- TailwindCSS (스타일)
- TanStack Table (데이터 테이블)
- Recharts (통계 차트)
- React Hook Form + Zod (폼 검증)
```

### **프로젝트 위치**
```
/Users/macel/Documents/nostum/
├── cursor app/
│   └── nostum_app/        # 메인 앱 (React Native)
└── nostum-admin/          # 관리자 (Next.js)
```

---

## 📋 **문서화 TODO 리스트**

### **현재 TODO (문서화 단계)**

#### ✅ 완료
- [x] COMMUNITY_DEVELOPMENT.md
- [x] COMMUNITY_RULES.md
- [x] DEVELOPMENT_STRATEGY.md (이 문서)

#### 🔄 진행 중
- [ ] 개발 전략 문서 (이 문서)

#### ⏳ 대기
1. [ ] PERFUME.md (향수 기능 명세)
2. [ ] PROFILE.md (프로필 기능 명세)
3. [ ] ADMIN.md (관리자 기능 명세)
4. [ ] CHATBOT.md (챗봇 기능 명세)
5. [ ] CRUD_PATTERN.md
6. [ ] PAGINATION_PATTERN.md
7. [ ] SEARCH_PATTERN.md
8. [ ] IMAGE_UPLOAD_PATTERN.md
9. [ ] AUTH_PATTERN.md
10. [ ] DATABASE_SCHEMA_FINAL.md
11. [ ] COMPONENT_INVENTORY.md
12. [ ] DEVELOPMENT_ROADMAP.md (최종)

---

## 🎯 **예상 타임라인**

### **문서화 중심 접근**

```
Week 1: 📚 문서화
  Day 1-2: 기능 명세 (PERFUME, PROFILE, ADMIN)
  Day 3-4: 패턴 문서 (CRUD, Pagination 등)
  Day 5: 통합 문서 (Schema, Component 목록)
  Day 6-7: 검토 및 수정

Week 2: 🏗️ 인프라 & 관리자 페이지 (7일)
  Day 1: DB 스키마 최종 적용 (1-2시간)
  Day 2-5: 관리자 페이지 MVP (Next.js)
    - 프로젝트 셋업
    - 관리자 인증
    - 사용자 관리 (권한 변경)
    - 게시글 관리 (생성/삭제)
    - 댓글 관리 (생성/삭제)
    - 향수 DB 관리 (추가/수정)
    - 테스트 데이터 생성 도구 ⭐
  Day 6-7: 마이페이지 기본
    - 프로필 조회/수정
    - 내가 쓴 글/댓글 목록

Week 3: 🧩 공통 컴포넌트 추출 (5일)
  Day 1-2: 기존 코드 추출
    - Pagination (향수/커뮤니티에서)
    - SearchBar (향수/커뮤니티에서)
  Day 3: Avatar
  Day 4-5: ImageUploader + ImageGallery

Week 4: 📐 패턴 확립 (실전 구현) (5-7일)
  Day 1-2: 게시글 작성 (CREATE 패턴)
  Day 3-4: 게시글 수정/삭제 (UPDATE/DELETE 패턴)
  Day 5-7: 댓글 시스템 (패턴 적용 검증)
  → CRUD_PATTERN.md 실제 코드로 업데이트

Week 5: 패턴 적용 (빠른 개발) (3-5일)
  Day 1-2: 향수 리뷰 (패턴 재사용)
  Day 3: 향수 찜하기
  Day 4-5: 좋아요 시스템 통합
  Day 1-2: Pagination, SearchBar
  Day 3-4: ImageUploader, Avatar
  Day 5-7: 공통 훅, 유틸리티

Week 4: 📐 패턴 확립
  Day 1-3: CRUD 패턴 (게시글로 확립)
  Day 4-5: 권한 체크 패턴
  Day 6-7: 이미지 처리 패턴

Week 5-6: ✨ 기능 완성
  패턴 적용하여 빠르게 개발
  - 커뮤니티 (작성, 댓글, 좋아요)
  - 향수 (리뷰, 찜하기)
  
Week 7-8: 🚀 고급 기능
  - 알림 시스템
  - 성능 최적화
  - 보안 강화
```

---

## 🎓 **문서화의 가치**

### **단기적 이득 (1-2주)**
- 명확한 방향성
- 개발 중 혼란 감소
- 기능 누락 방지

### **중기적 이득 (1-2개월)**
- 개발 속도 2배 향상
- 버그 50% 감소
- 리팩토링 시간 70% 감소

### **장기적 이득 (6개월+)**
- 새 개발자 온보딩 쉬움
- 기능 추가 시 문서 참조
- 유지보수 비용 대폭 감소

---

## 🚀 **다음 액션**

### **즉시 실행 (지금 바로)**

Agent 모드에서 다음 문서들을 생성:

1. ✅ `DEVELOPMENT_STRATEGY.md` (이 문서)
2. ⏳ 기능 명세 템플릿 5개
3. ⏳ 패턴 문서 템플릿 5개
4. ⏳ 통합 문서 템플릿 3개

### **의사 결정 필요**

1. **관리자 페이지: A vs B?**
   - 빠른 시작 → A
   - 장기 관점 → B (추천)

2. **문서화 범위?**
   - 최소 (향수, 커뮤니티, 프로필, 관리자)
   - 권장 (+ 챗봇, 패턴 문서)

---

**문서 템플릿 생성을 시작하겠습니다!** 🎉

# Nostum 앱 문서 센터

> **마지막 업데이트:** 2025-10-11  
> **버전:** 2.0 (문서화 우선 전략)

---

## 📚 문서 구조

```
docs/
├── README.md (이 파일)                    # 문서 안내
├── DEVELOPMENT_STRATEGY.md ⭐           # 개발 전략 (필독!)
├── DATABASE_SCHEMA_FINAL.md            # 최종 DB 스키마
├── COMPONENT_INVENTORY.md              # 공통 컴포넌트 목록
├── DESIGN_SYSTEM.md                    # 디자인 시스템
│
├── features/                           # 기능별 명세서 (6개)
│   ├── HOME.md                         # 홈 화면 (게이트웨이) ✅
│   ├── PERFUME.md                      # 향수 기능
│   ├── COMMUNITY.md                    # 커뮤니티 기능 ✅
│   ├── PROFILE.md                      # 프로필 기능
│   ├── ADMIN.md                        # 관리자 기능
│   └── CHATBOT.md                      # 챗봇 기능
│
└── patterns/                           # 개발 패턴
    ├── CRUD_PATTERN.md                 # CRUD 표준
    ├── PAGINATION_PATTERN.md           # 페이지네이션 표준
    ├── SEARCH_PATTERN.md               # 검색 표준
    ├── IMAGE_UPLOAD_PATTERN.md         # 이미지 업로드
    └── AUTH_PATTERN.md                 # 권한 체크
```

---

## 🎯 문서 읽기 가이드

### 처음 시작하는 경우
```
1. DEVELOPMENT_STRATEGY.md (전체 전략 이해)
   ↓
2. 개발할 기능의 명세서 (features/)
   ↓
3. 필요한 패턴 문서 (patterns/)
   ↓
4. 개발 시작!
```

### 특정 기능 개발 시
```
예: 커뮤니티 게시글 작성 기능
1. features/COMMUNITY.md (기능 요구사항)
2. patterns/CRUD_PATTERN.md (생성 패턴)
3. patterns/IMAGE_UPLOAD_PATTERN.md (이미지 업로드)
4. patterns/AUTH_PATTERN.md (권한 체크)
```

### 공통 컴포넌트 개발 시
```
1. COMPONENT_INVENTORY.md (필요한 컴포넌트 목록)
2. patterns/[관련 패턴].md
3. DESIGN_SYSTEM.md (디자인 가이드)
```

---

## 📖 주요 문서 설명

### ⭐ DEVELOPMENT_STRATEGY.md (필독!)
**내용:**
- 현재 문제점 분석
- 새로운 개발 전략 (레이어 기반)
- 관리자 페이지 옵션 비교
- 문서화 우선 접근법
- 실행 계획

**읽어야 할 사람:**
- 모든 개발자
- 프로젝트 리더
- AI 어시스턴트

---

### 📋 기능 명세서 (features/)

#### PERFUME.md
- 향수 목록, 상세, 검색, 필터
- 리뷰 시스템
- 찜하기 기능
- 미결정 사항 4가지

#### COMMUNITY.md
- 게시글 목록, 상세, 작성
- 댓글 시스템 (2단계)
- 좋아요, 신고 시스템
- 27개 운영 규칙
- 완전히 문서화됨 ✅

#### PROFILE.md
- 프로필 관리
- 내 활동 (글, 댓글, 리뷰)
- 찜한 향수
- 알림 설정

#### ADMIN.md
- 관리자 페이지 옵션 (A vs B)
- 사용자 관리
- 콘텐츠 관리
- 테스트 데이터 생성

#### CHATBOT.md
- 대화형 향수 추천
- AI 연동 방식
- 간단한 매칭 알고리즘

---

### 🔧 패턴 문서 (patterns/)

#### CRUD_PATTERN.md
**핵심:** 모든 CRUD는 동일한 구조
- Create 템플릿
- Read (목록, 상세) 템플릿
- Update 템플릿
- Delete 템플릿 (소프트 삭제)
- 코드 예시

#### PAGINATION_PATTERN.md
**핵심:** 향수 페이지 방식으로 통일
- totalCount 조회 방식
- UI 구조
- 스타일 표준
- 공통 컴포넌트 제안

#### SEARCH_PATTERN.md
**핵심:** 검색 UI/로직 통일
- 최소 2자 검색
- 클리어 버튼
- or 조건 쿼리

#### IMAGE_UPLOAD_PATTERN.md
**핵심:** 이미지 처리 표준
- 압축 (80%, WebP)
- Supabase Storage 업로드
- 진행률 표시

#### AUTH_PATTERN.md
**핵심:** 권한 체크 표준
- 로그인 체크
- 작성자 체크
- 관리자 체크
- 표준 함수 제공

---

### 💾 DATABASE_SCHEMA_FINAL.md

**내용:**
- 현재 테이블 9개
- 추가 필요 테이블 10개
- 소프트 삭제 적용 계획
- 마이그레이션 4단계

**주요 추가 테이블:**
- `reviews` (리뷰)
- `post_likes`, `comment_likes` (좋아요)
- `reports` (신고)
- `notifications` (알림)
- `chatbot_messages` (챗봇)

---

### 🧩 COMPONENT_INVENTORY.md

**Priority 1 (즉시):**
1. Pagination - 현재 중복
2. SearchBar - 현재 중복
3. Avatar - 여러 곳에서 필요

**Priority 2 (곧):**
4. ImageUploader
5. ImageGallery
6. ConfirmDialog

**Priority 3 (나중):**
7. Badge
8. Card
9. EmptyState
10. LoadingSpinner

---

## 🗺️ 개발 로드맵

### Week 1: 문서화 ✅
- [x] 개발 전략
- [x] 기능 명세서 6개 (HOME, PERFUME, COMMUNITY, PROFILE, ADMIN, CHATBOT)
- [x] 패턴 문서 5개
- [x] 통합 문서 3개

### Week 2: 인프라
- [ ] DB 스키마 최종 확정
- [ ] 소프트 삭제 적용
- [ ] 관리자 페이지 옵션 결정
- [ ] 관리자 페이지 MVP

### Week 3: 공통 레이어
- [ ] Pagination 컴포넌트
- [ ] SearchBar 컴포넌트
- [ ] Avatar 컴포넌트
- [ ] 공통 훅 (usePagination 등)

### Week 4-5: 기능 완성
- [ ] 마이페이지
- [ ] 커뮤니티 (작성, 댓글)
- [ ] 향수 (리뷰, 찜하기)

### Week 6-8: 고급 기능
- [ ] 알림 시스템
- [ ] 챗봇
- [ ] 성능 최적화

---

## 📝 문서화 기본 룰

### ⭐ 문서 업데이트 원칙

#### **반드시 문서화해야 하는 것**
1. ✅ **기능 변경** (`features/` 문서)
   - 새 기능 추가 시
   - 기능 요구사항 변경 시
   - 미결정 사항 결정 시

2. ✅ **패턴 변경** (`patterns/` 문서)
   - CRUD 방식 변경 시
   - 페이지네이션 방식 변경 시
   - 검색 로직 변경 시
   - 이미지 업로드 방식 변경 시
   - 권한 체크 방식 변경 시

#### **문서화하지 않아도 되는 것**
- ❌ 스타일 변경 (색상, 폰트 등)
- ❌ 버그 수정
- ❌ 성능 최적화 (패턴 변경 아니면)
- ❌ 임시 테스트 코드
- ❌ 완료 보고서, 진행 상황 등

### **문서 업데이트 시점**
```
기능 개발 완료 → 해당 features/ 문서 업데이트
패턴 변경 → 해당 patterns/ 문서 업데이트
```

---

## 💡 문서 활용 팁

### 새 기능 개발 시
1. 해당 기능 명세서 읽기
2. 필요한 패턴 문서 확인
3. 공통 컴포넌트 재사용
4. 개발 시작
5. **개발 완료 후 문서 업데이트**

### 버그 수정 시
1. 관련 패턴 문서 확인
2. 표준 방식과 비교
3. 일관성 유지하며 수정
4. (문서 업데이트 불필요)

### 코드 리뷰 시
1. 패턴 문서와 비교
2. 표준을 따르는지 확인
3. 일관성 체크

---

## 📞 문서 관련 질문

### 문서가 불명확하거나 누락된 경우
- AI 어시스턴트에게 문의
- 문서 업데이트 요청

### 문서와 구현이 다른 경우
- 최신 구현을 우선
- 문서 업데이트 필요

---

## 🎉 문서화 완료!

### 완료된 문서
✅ 13개 문서 생성 완료
- 1개 전략 문서
- 5개 기능 명세서
- 5개 패턴 문서
- 2개 통합 문서

### 다음 단계
1. 문서 검토 및 미결정 사항 결정
2. DB 스키마 최종 확정
3. 관리자 페이지 옵션 선택
4. 체계적 개발 시작!

---

**이제 문서 기반으로 체계적인 개발이 가능합니다!** 🚀


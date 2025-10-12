# 마이그레이션 실행 가이드

> **작성일:** 2025-10-12  
> **목적:** Week 2 Day 1 - DB 스키마 최종 적용

---

## 📋 실행 순서

### **1단계: 기존 테이블 수정**
```sql
-- Supabase SQL Editor에서 실행
-- 파일: 02_update_existing_tables.sql
```

**내용:**
- profiles 테이블에 새 컬럼 추가
- community_posts, post_comments에 소프트 삭제 컬럼 추가
- perfumes에 tommy_description 컬럼 추가

**예상 시간:** 1-2분

---

### **2단계: 새 테이블 생성**
```sql
-- Supabase SQL Editor에서 실행
-- 파일: 01_add_new_tables.sql
```

**내용:**
- user_favorites (찜하기)
- perfume_calendar (캘린더)
- perfume_feedback (피드백)
- reviews (리뷰)
- post_likes, comment_likes, review_helpful (좋아요)
- drafts (드래프트)
- reports (신고)
- notifications (알림)
- search_history (검색 이력)
- chatbot_messages (챗봇 메시지)

**예상 시간:** 2-3분

---

### **3단계: 검색 인덱스 생성 (GIN + Trigram)**
```sql
-- Supabase SQL Editor에서 실행
-- 파일: 03_create_search_indexes.sql
```

**내용:**
- pg_trgm 확장 활성화
- community_posts (title, content)
- perfumes (name_kr, name)
- reviews (content)

**예상 시간:** 1-2분

---

### **4단계: 정렬/필터 인덱스 생성 (B-Tree)**
```sql
-- Supabase SQL Editor에서 실행
-- 파일: 04_create_btree_indexes.sql
```

**내용:**
- 타임스탬프 인덱스
- FK 인덱스
- 복합 인덱스

**예상 시간:** 1-2분

---

### **5단계: 검증**
```sql
-- Supabase SQL Editor에서 실행
-- 파일: 05_verify_schema.sql
```

**내용:**
- 모든 테이블 존재 확인 (22개)
- profiles 컬럼 확인
- 소프트 삭제 컬럼 확인
- 인덱스 확인
- 통계 요약

**예상 시간:** 1분

---

## ✅ 체크리스트

실행 전:
- [ ] Supabase 프로젝트 접속
- [ ] SQL Editor 열기
- [ ] 백업 확인 (필요 시)

실행:
- [ ] 02_update_existing_tables.sql 실행
- [ ] 01_add_new_tables.sql 실행
- [ ] 03_create_search_indexes.sql 실행
- [ ] 04_create_btree_indexes.sql 실행
- [ ] 05_verify_schema.sql 실행

완료 확인:
- [ ] 모든 NOTICE 메시지 확인
- [ ] 에러 없음 확인
- [ ] 22개 테이블 확인 완료

---

## 🚨 주의사항

### DO ✅
- ✅ 순서대로 실행 (02 → 01 → 03 → 04 → 05)
- ✅ 각 파일 실행 후 에러 확인
- ✅ 05_verify_schema.sql의 모든 체크 통과 확인

### DON'T ❌
- ❌ 순서 바꾸지 않기 (의존성 있음)
- ❌ 에러 무시하지 않기
- ❌ 일부만 실행하지 않기

---

## 🔍 에러 발생 시

### "table already exists"
→ 이미 생성된 테이블. 해당 CREATE TABLE 부분만 주석 처리 후 재실행

### "column already exists"
→ 이미 추가된 컬럼. 정상 (IF NOT EXISTS 사용)

### "foreign key constraint fails"
→ 참조 테이블이 없음. 01번 파일 먼저 실행했는지 확인

---

## 📊 완료 후 확인

### Supabase Dashboard에서 확인:
1. **Table Editor** → 22개 테이블 확인
2. **Indexes** → 30개 이상 인덱스 확인
3. **Database** → RLS 정책 확인

### 예상 결과:
```
✅ 테이블: 22개
✅ 인덱스: 30-40개
✅ 에러: 0개
```

---

## 🚀 다음 단계 (Week 2 Day 2)

마이그레이션 완료 후:
1. Next.js 관리자 프로젝트 생성
2. Supabase 연동
3. 기본 레이아웃 구축

---

**예상 총 소요 시간: 10-15분** ⏱️


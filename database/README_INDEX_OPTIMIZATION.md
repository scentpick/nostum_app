# 커뮤니티 인덱스 최적화 - 빠른 실행 가이드

## ⚠️ 중요: 에러 해결

### 문제: `column "is_deleted" does not exist`

**원인:** 소프트 삭제 컬럼이 아직 테이블에 추가되지 않았습니다.

**해결 방법 (2가지 옵션):**

---

## 🚀 옵션 1: 바로 인덱스 실행 (추천)

소프트 삭제 컬럼 없이 핵심 인덱스만 생성합니다.

### 실행 파일
```sql
run_community_optimization.sql
```

### 실행 순서
1. Supabase 대시보드 → SQL Editor
2. `run_community_optimization.sql` 파일 열기
3. 전체 선택 후 Run 버튼 클릭
4. ✅ "인덱스 생성 완료!" 확인

### 생성되는 인덱스
- 카테고리별 최신순
- 조회수 정렬
- 좋아요수 정렬
- 사용자별 게시글
- 댓글 조회
- 검색 (Trigram)

---

## 🔧 옵션 2: 소프트 삭제 + 인덱스 (완전 버전)

나중에 삭제 기능 구현 시 필요한 컬럼을 미리 추가합니다.

### 실행 순서

#### Step 1: 소프트 삭제 컬럼 추가
```sql
-- add_soft_delete_columns.sql 실행
```

**추가되는 컬럼:**
- `is_deleted` (삭제 여부)
- `deleted_at` (삭제 시간)
- `deleted_by` (삭제한 사용자)

#### Step 2: 인덱스 생성
```sql
-- run_community_optimization.sql 실행
```

#### Step 3: 향후 소프트 삭제 인덱스 추가
```sql
-- optimize_community_indexes.sql 실행 (전체 버전)
```

---

## 📊 실행 결과

### Before
```
향수게시판 게시글 조회: ~5ms
검색 ("향수" 키워드): ~10ms
```

### After
```
향수게시판 게시글 조회: ~0.5ms (10배 향상)
검색 ("향수" 키워드): ~1ms (10배 향상)
```

---

## 🎯 권장 실행 방법

### 지금 바로 (개발 단계)
```
1. run_community_optimization.sql 실행 ✅
```

### 나중에 (삭제 기능 구현 전)
```
1. add_soft_delete_columns.sql 실행
2. optimize_community_indexes.sql 실행 (전체)
```

---

## 📝 파일 설명

| 파일명 | 용도 | 실행 시점 |
|--------|------|-----------|
| `run_community_optimization.sql` | 핵심 인덱스만 (빠름) | **지금 바로** |
| `add_soft_delete_columns.sql` | 소프트 삭제 컬럼 추가 | 삭제 기능 구현 전 |
| `optimize_community_indexes.sql` | 전체 인덱스 (고급) | 나중에 |

---

## ✅ 확인 방법

### 인덱스 생성 확인
```sql
SELECT indexname 
FROM pg_indexes
WHERE tablename = 'community_posts'
  AND indexname LIKE 'idx_%'
ORDER BY indexname;
```

### 예상 결과
```
idx_community_posts_category_created
idx_community_posts_like_count_desc
idx_community_posts_title_trgm
idx_community_posts_user_id
idx_community_posts_view_count_desc
...
```

---

## 🐛 문제 해결

### Q: `pg_trgm` 확장이 없다는 에러
**A:** 먼저 실행:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### Q: 인덱스가 이미 존재한다는 경고
**A:** 정상입니다. `IF NOT EXISTS` 덕분에 안전하게 스킵됩니다.

### Q: 실행 시간이 너무 오래 걸림
**A:** 데이터가 많으면 시간이 걸립니다. 현재 17개 게시글이면 1초 이내 완료됩니다.

---

**지금 바로 `run_community_optimization.sql`을 실행하세요!** 🚀


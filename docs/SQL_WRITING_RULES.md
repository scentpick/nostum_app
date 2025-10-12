# SQL 스크립트 작성 규칙

## 📋 **기본 원칙**

### 1. **단일 결과 테이블 원칙**
- **❌ 금지**: 여러 개의 SELECT 문을 연속으로 작성
- **✅ 권장**: 하나의 통합된 결과 테이블로 모든 정보 표시
- **이유**: Supabase SQL Editor에서는 마지막 SELECT 결과만 표시됨

### 2. **CTE (Common Table Expression) 활용**
```sql
-- ✅ 좋은 예시
WITH 
section1 AS (
  SELECT ... FROM ...
),
section2 AS (
  SELECT ... FROM ...
)
SELECT 
  '섹션1' as category,
  item as name,
  result as status
FROM section1
UNION ALL
SELECT 
  '섹션2' as category,
  item as name,
  result as status
FROM section2
ORDER BY category, name;
```

### 3. **결과 테이블 구조 표준화**
```sql
SELECT 
  '카테고리' as category,    -- 정보 유형 (테이블, 컬럼, 인덱스 등)
  '항목' as item,           -- 구체적인 항목명
  '세부사항' as name,       -- 세부 항목명
  '상태' as result          -- ✅/❌ 또는 구체적인 상태값
FROM ...
ORDER BY category, item, name;
```

## 📊 **스크립트 유형별 규칙**

### **1. 진단/확인 스크립트 (00_*)**
```sql
-- 목적: 현재 상태 확인
-- 구조: CTE + UNION ALL로 통합 결과
-- 예시: 00_complete_schema_check.sql
```

### **2. 마이그레이션 스크립트 (01-99_*)**
```sql
-- 목적: 스키마 변경 실행
-- 구조: DDL 문 + 완료 확인 SELECT
-- 예시: 01_add_new_tables.sql
```

### **3. 검증 스크립트 (99_*)**
```sql
-- 목적: 마이그레이션 결과 검증
-- 구조: CTE + 통합 결과 테이블
-- 예시: 05_verify_schema.sql
```

## 🎯 **상태 표시 규칙**

### **이모지 사용 표준**
- ✅ **성공/존재함**: 테이블 존재, 컬럼 존재, 인덱스 생성됨
- ❌ **실패/누락됨**: 테이블 없음, 컬럼 없음, 인덱스 없음
- ⚠️ **주의/추가**: 예상 외 테이블, 추가 컬럼
- 🔧 **수정 필요**: 에러 발생, 수정 필요

### **텍스트 표준**
- **한국어**: 모든 사용자 메시지는 한국어 사용
- **영어**: 테이블명, 컬럼명은 영어 그대로
- **일관성**: 같은 의미는 같은 표현 사용

## 📝 **문서화 규칙**

### **헤더 표준**
```sql
-- ================================================
-- 스크립트 제목
-- 작성일: YYYY-MM-DD
-- ================================================
```

### **주석 표준**
```sql
-- 1. 섹션 제목
-- 2. 구체적인 설명
-- 3. 결과 해석 가이드 (필요시)
```

### **완료 메시지**
```sql
-- ================================================
-- 결과 해석 가이드:
-- 1. ✅ 항목: 정상 완료
-- 2. ❌ 항목: 수정 필요
-- 3. 다음 단계: ...
-- ================================================
```

## 🚫 **금지 사항**

### **1. 여러 SELECT 문 연속 작성**
```sql
-- ❌ 금지
SELECT '테이블 목록' as title;
SELECT table_name FROM information_schema.tables;
SELECT '컬럼 목록' as title;
SELECT column_name FROM information_schema.columns;
```

### **2. 결과 확인 불가능한 스크립트**
```sql
-- ❌ 금지: 마지막 결과만 보임
CREATE TABLE test (id SERIAL);
INSERT INTO test VALUES (1);
SELECT COUNT(*) FROM test;
```

### **3. 에러 발생 가능한 구조**
```sql
-- ❌ 금지: 컬럼 존재 여부 확인 없이 사용
SELECT column_name FROM table_name WHERE non_existent_column = 'value';
```

## ✅ **권장 사항**

### **1. 안전한 실행**
```sql
-- ✅ 권장: IF NOT EXISTS, IF EXISTS 사용
CREATE TABLE IF NOT EXISTS table_name (...);
CREATE INDEX IF NOT EXISTS index_name ON table_name (...);
DROP INDEX IF EXISTS index_name;
```

### **2. 명확한 결과 표시**
```sql
-- ✅ 권장: 모든 정보를 하나의 테이블로
WITH results AS (...)
SELECT 
  '테이블' as type,
  name,
  CASE WHEN exists THEN '✅' ELSE '❌' END as status
FROM results
ORDER BY type, name;
```

### **3. 단계별 진행**
```sql
-- ✅ 권장: 각 단계마다 완료 확인
-- Step 1: 테이블 생성
CREATE TABLE IF NOT EXISTS ...

-- Step 2: 완료 확인
SELECT '테이블 생성 완료' as step, 'table_name' as result;
```

## 📋 **체크리스트**

스크립트 작성 전 확인:
- [ ] 하나의 결과 테이블로 모든 정보 표시 가능한가?
- [ ] CTE를 활용하여 구조화했는가?
- [ ] ✅/❌ 이모지로 상태를 명확히 표시했는가?
- [ ] IF NOT EXISTS/IF EXISTS로 안전하게 작성했는가?
- [ ] 한국어 주석과 해석 가이드를 포함했는가?
- [ ] 실행 순서가 명확한가?

## 🎯 **목표**

**모든 SQL 스크립트는 실행 후 전체 결과를 한 눈에 볼 수 있어야 합니다.**

이를 통해:
- 디버깅 시간 단축
- 문제점 빠른 파악
- 진행 상황 명확한 확인
- 문서화 자동화

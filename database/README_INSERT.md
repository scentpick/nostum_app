# 🚀 향수 데이터 INSERT 가이드

## 📋 작업 순서

---

## Step 1️⃣: Supabase에서 마이그레이션 실행

### 1. Supabase 대시보드 접속
```
https://supabase.com/dashboard/project/wrdsumdjamvsdxjwnpdx
```

### 2. SQL Editor로 이동
좌측 메뉴에서 **SQL Editor** 클릭

### 3. 마이그레이션 SQL 복사 및 실행

파일을 열어서 전체 내용 복사:
```bash
cat migration_add_accord_and_fields.sql
```

**또는** 아래 내용을 SQL Editor에 붙여넣기:

```sql
-- 1. perfumes 테이블에 새 컬럼 추가
ALTER TABLE perfumes 
ADD COLUMN IF NOT EXISTS name_kr TEXT,
ADD COLUMN IF NOT EXISTS fragrantica_url TEXT,
ADD COLUMN IF NOT EXISTS official_url TEXT;

-- 2. brands 테이블에 새 컬럼 추가
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS official_url TEXT;

-- 3. 어코드 테이블 생성
CREATE TABLE IF NOT EXISTS accords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_kr TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 향수-어코드 연결 테이블
CREATE TABLE IF NOT EXISTS perfume_accords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  accord_id UUID REFERENCES accords(id) ON DELETE CASCADE,
  priority INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(perfume_id, accord_id)
);

-- 5. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_perfumes_name_kr ON perfumes(name_kr);
CREATE INDEX IF NOT EXISTS idx_perfumes_fragrantica_url ON perfumes(fragrantica_url);
CREATE INDEX IF NOT EXISTS idx_brands_official_url ON brands(official_url);
CREATE INDEX IF NOT EXISTS idx_accords_name ON accords(name);
CREATE INDEX IF NOT EXISTS idx_perfume_accords_perfume_id ON perfume_accords(perfume_id);
CREATE INDEX IF NOT EXISTS idx_perfume_accords_accord_id ON perfume_accords(accord_id);
CREATE INDEX IF NOT EXISTS idx_perfume_accords_priority ON perfume_accords(priority);

-- 6. RLS 정책
CREATE POLICY IF NOT EXISTS "Anyone can view accords" ON accords
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can view perfume accords" ON perfume_accords
  FOR SELECT USING (true);
```

### 4. Run 버튼 클릭
오른쪽 하단의 **Run** 버튼을 클릭하여 SQL 실행

### 5. 성공 확인
- 에러 없이 완료되면 ✅
- 에러가 있으면 메시지 확인 후 수정

---

## Step 2️⃣: 데이터 INSERT 실행

마이그레이션이 완료되면 Node.js 스크립트로 데이터를 INSERT합니다.

### 실행 명령어:
```bash
cd /Users/macel/Documents/nostum/cursor\ app/nostum_app/database
node insert_data.js
```

### 예상 소요 시간:
- 브랜드 37개: ~2분
- 향수 199개: ~10분
- 노트 1,461개: ~15분
- 어코드 63개 + 연결 1,326개: ~20분
- **총 예상 시간: 약 45-50분**

### 진행 상황 확인:
스크립트가 실행되면 다음과 같이 진행 상황이 표시됩니다:
```
🏢 브랜드 데이터 INSERT 중...
  ✅ 성공: 에르메스
  ✅ 성공: 딥티크
  ...

💐 향수 데이터 INSERT 중...
  ✅ 성공: 떼르 드 에르메스
  ✅ 성공: 에이치24
  ...

🎵 노트 데이터 INSERT 중...
  ✅ 성공: 떼르 드 에르메스 (3개 노트)
  ...

🎨 어코드 데이터 INSERT 중...
  고유 어코드 INSERT...
  향수-어코드 연결 중...
  ...
```

---

## Step 3️⃣: 데이터 확인

### Supabase에서 확인

#### 1. Table Editor로 이동
좌측 메뉴에서 **Table Editor** 클릭

#### 2. 각 테이블 확인

**brands 테이블:**
```sql
SELECT COUNT(*) FROM brands;
-- 예상: 37개

SELECT name_kr, name_en, official_url FROM brands LIMIT 10;
```

**perfumes 테이블:**
```sql
SELECT COUNT(*) FROM perfumes;
-- 예상: 199개

SELECT name_kr, name, fragrantica_url FROM perfumes LIMIT 10;
```

**perfume_notes 테이블:**
```sql
SELECT COUNT(*) FROM perfume_notes;
-- 예상: 1,461개

-- 특정 향수의 노트 확인
SELECT 
  p.name_kr,
  pn.note_name,
  pn.note_type
FROM perfumes p
JOIN perfume_notes pn ON p.id = pn.perfume_id
WHERE p.name_kr = '떼르 드 에르메스';
```

**accords 테이블:**
```sql
SELECT COUNT(*) FROM accords;
-- 예상: 63개

SELECT name FROM accords ORDER BY name LIMIT 20;
```

**perfume_accords 테이블:**
```sql
SELECT COUNT(*) FROM perfume_accords;
-- 예상: 1,326개

-- 특정 향수의 어코드 확인 (우선순위별 정렬)
SELECT 
  p.name_kr,
  a.name as accord,
  pa.priority
FROM perfumes p
JOIN perfume_accords pa ON p.id = pa.perfume_id
JOIN accords a ON pa.accord_id = a.id
WHERE p.name_kr = '떼르 드 에르메스'
ORDER BY pa.priority;
```

---

## Step 4️⃣: 앱에서 테스트

### 1. 서버 재시작
```bash
cd /Users/macel/Documents/nostum/cursor\ app/nostum_app
npx expo start
```

### 2. 웹에서 확인
브라우저에서 `http://localhost:8081` 접속

### 3. 향수 화면 테스트
1. "향수" 탭 클릭
2. 향수 목록에 **한글명**이 표시되는지 확인
3. 향수 개수가 **199개**로 표시되는지 확인
4. 검색 기능 테스트 (예: "에르메스" 검색)

### 4. SupabaseTest 컴포넌트로 확인
홈 화면 하단의 "API 서비스 테스트" 버튼 클릭하여 데이터 조회 확인

---

## 🐛 문제 해결

### 마이그레이션 실패 시:
```sql
-- 컬럼이 이미 있는지 확인
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'perfumes';

-- 테이블이 이미 있는지 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('accords', 'perfume_accords');
```

### 데이터 INSERT 실패 시:
- 브랜드가 없어서 향수 INSERT 실패 → 브랜드 먼저 확인
- 향수가 없어서 노트 INSERT 실패 → 향수 먼저 확인
- 중복 에러 → 이미 데이터가 있음 (정상)

### 데이터 삭제 (재시작 필요 시):
```sql
-- 주의: 모든 데이터 삭제됨!
TRUNCATE TABLE perfume_accords CASCADE;
TRUNCATE TABLE accords CASCADE;
TRUNCATE TABLE perfume_notes CASCADE;
TRUNCATE TABLE perfumes CASCADE;
TRUNCATE TABLE brands CASCADE;
```

---

## ✅ 완료 체크리스트

- [ ] Step 1: Supabase SQL Editor에서 마이그레이션 실행
- [ ] Step 2: `node insert_data.js` 실행
- [ ] Step 3: Supabase Table Editor에서 데이터 확인
- [ ] Step 4: 앱에서 향수 목록 테스트
- [ ] 최종 확인: 199개 향수가 한글명으로 표시됨

---

## 📞 문의 및 참고

- Python 스크립트: `import_perfume_data.py`
- Node.js INSERT 스크립트: `insert_data.js`
- 추출된 데이터: `perfume_import_data.json`
- 마이그레이션 SQL: `migration_add_accord_and_fields.sql`


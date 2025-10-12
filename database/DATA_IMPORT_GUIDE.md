# 📊 향수 데이터 임포트 가이드

## 🎯 개요
엑셀 파일(`assets/preDB.xlsx`)의 향수 데이터를 Supabase DB로 임포트하는 가이드입니다.

---

## 📋 데이터 통계

### 추출된 데이터:
- **브랜드**: 37개
- **향수**: 199개
- **향수 노트** (탑/미들/베이스): 1,461개
- **어코드** (고유 종류): 63개
- **어코드** (향수별 연결): 1,326개

### 샘플 브랜드:
에르메스, 딥티크, 루이비통, 구찌, 디올, 셀린, 메종 프랜시스 커정, 바이 킬리안, 이솝, 샤넬, 불가리, 까르티에, 입생로랑, 조말론, 크리드, 메종 마르지엘라 등 37개

### 샘플 어코드:
fruity, woody, floral, fresh, aromatic, sweet, citrus, spicy, green, powdery, aquatic, amber, vanilla, musky, herbal, leather, gourmand 등 63개

---

## 🔧 Step 1: DB 스키마 마이그레이션

### 1. Supabase 대시보드 접속
```
https://supabase.com/dashboard/project/wrdsumdjamvsdxjwnpdx
```

### 2. SQL Editor로 이동
- 좌측 메뉴에서 **SQL Editor** 클릭

### 3. 마이그레이션 SQL 실행
`database/migration_add_accord_and_fields.sql` 파일 내용 전체 복사 후 실행

**추가되는 내용:**
- `perfumes` 테이블: `name_kr`, `fragrantica_url`, `official_url` 컬럼 추가
- `brands` 테이블: `official_url` 컬럼 추가
- `accords` 테이블: 새로 생성 (어코드 정보)
- `perfume_accords` 테이블: 새로 생성 (향수-어코드 연결)
- 인덱스 및 RLS 정책 설정

---

## 📝 Step 2: 데이터 검토

### 추출된 JSON 파일 확인
```bash
cat database/perfume_import_data.json
```

**파일 구조:**
```json
{
  "brands": [
    {
      "name_kr": "에르메스",
      "name_en": "Hermès",
      "official_url": "https://..."
    }
  ],
  "perfumes": [
    {
      "name": "Terre d'Hermes Parfum Hermès for men",
      "name_kr": "떼르 드 에르메스",
      "brand_kr": "에르메스",
      "brand_en": "Hermès",
      "fragrantica_url": "https://...",
      "official_url": "https://..."
    }
  ],
  "notes": {
    "떼르 드 에르메스": [
      {"note_name": "Orange", "note_type": "top"},
      {"note_name": "Grapefruit", "note_type": "top"},
      {"note_name": "Flint", "note_type": "middle"}
    ]
  },
  "accords": {
    "떼르 드 에르메스": [
      {"accord_name": "fruity", "priority": 1},
      {"accord_name": "green", "priority": 2}
    ]
  },
  "unique_accords": ["fruity", "woody", "floral", ...]
}
```

---

## 🚀 Step 3: 데이터 INSERT (수동 또는 스크립트)

### Option A: Supabase SQL Editor 사용 (추천)

#### 1. 브랜드 INSERT
```sql
-- 샘플: 에르메스
INSERT INTO brands (name_kr, name_en, official_url)
VALUES ('에르메스', 'Hermès', 'https://www.hermes.com/us/en/product/terre-d-hermes-parfum-V107757V0/');
```

#### 2. 향수 INSERT
```sql
-- 먼저 brand_id 조회
SELECT id FROM brands WHERE name_kr = '에르메스';

-- 향수 INSERT
INSERT INTO perfumes (brand_id, name, name_kr, fragrantica_url, official_url)
VALUES (
  '<brand_id>', 
  'Terre d''Hermes Parfum Hermès for men',
  '떼르 드 에르메스',
  'https://www.fragrantica.com/perfume/Hermes/Terre-d-Hermes-Parfum-8282.html',
  'https://www.hermes.com/us/en/product/terre-d-hermes-parfum-V107757V0/'
);
```

#### 3. 노트 INSERT
```sql
-- 먼저 perfume_id 조회
SELECT id FROM perfumes WHERE name_kr = '떼르 드 에르메스';

-- 노트 INSERT
INSERT INTO perfume_notes (perfume_id, note_name, note_type)
VALUES 
  ('<perfume_id>', 'Orange', 'top'),
  ('<perfume_id>', 'Grapefruit', 'top'),
  ('<perfume_id>', 'Flint', 'middle');
```

#### 4. 어코드 INSERT
```sql
-- 1. 고유 어코드 먼저 INSERT
INSERT INTO accords (name) VALUES ('fruity'), ('green'), ('aromatic') 
ON CONFLICT (name) DO NOTHING;

-- 2. perfume_id와 accord_id 조회 후 연결
SELECT id FROM perfumes WHERE name_kr = '떼르 드 에르메스';
SELECT id FROM accords WHERE name = 'fruity';

INSERT INTO perfume_accords (perfume_id, accord_id, priority)
VALUES 
  ('<perfume_id>', '<accord_id_fruity>', 1),
  ('<perfume_id>', '<accord_id_green>', 2);
```

---

### Option B: Node.js/TypeScript 스크립트 (대량 INSERT)

*향후 구현 예정*

---

## ✅ Step 4: 데이터 검증

### 1. 브랜드 확인
```sql
SELECT COUNT(*) as total FROM brands;
-- 예상: 37개

SELECT name_kr, name_en FROM brands LIMIT 10;
```

### 2. 향수 확인
```sql
SELECT COUNT(*) as total FROM perfumes;
-- 예상: 199개

SELECT name_kr, name, brand_id FROM perfumes LIMIT 10;
```

### 3. 노트 확인
```sql
SELECT COUNT(*) as total FROM perfume_notes;
-- 예상: 1,461개

SELECT p.name_kr, pn.note_name, pn.note_type
FROM perfumes p
JOIN perfume_notes pn ON p.id = pn.perfume_id
LIMIT 20;
```

### 4. 어코드 확인
```sql
SELECT COUNT(*) as total FROM accords;
-- 예상: 63개

SELECT COUNT(*) as total FROM perfume_accords;
-- 예상: 1,326개

SELECT p.name_kr, a.name, pa.priority
FROM perfumes p
JOIN perfume_accords pa ON p.id = pa.perfume_id
JOIN accords a ON pa.accord_id = a.id
ORDER BY p.name_kr, pa.priority
LIMIT 30;
```

---

## 🎯 Step 5: 앱에서 테스트

### 1. TypeScript 타입 확인
파일: `lib/types/app.ts`
- ✅ `Perfume` 인터페이스에 `name_kr`, `fragrantica_url`, `official_url` 추가됨
- ✅ `Brand` 인터페이스에 `official_url` 추가됨
- ✅ `Accord`, `PerfumeAccord` 인터페이스 추가됨

### 2. 앱 실행
```bash
cd /Users/macel/Documents/nostum/cursor\ app/nostum_app
npx expo start
```

### 3. 향수 화면에서 확인
- 향수 목록에 한글명이 표시되는지 확인
- 향수 상세 페이지에서 노트, 어코드가 표시되는지 확인

---

## 📌 주의사항

### 데이터 정리가 필요한 항목:
1. **브랜드명 통일**: 일부 브랜드명에 띄어쓰기나 표기 차이 있음
2. **어코드 "-"**: 어코드 컬럼에 "-"가 있음 (제거 필요)
3. **중복 향수**: 같은 이름의 향수가 있을 수 있음 (확인 필요)
4. **NULL 값**: 일부 필드가 비어있음 (나중에 수동 입력 필요)

### 다음 작업:
1. ✅ DB 마이그레이션 실행
2. 🔄 브랜드 37개 INSERT (수동 또는 스크립트)
3. 🔄 향수 199개 INSERT
4. 🔄 노트 1,461개 INSERT
5. 🔄 어코드 63개 + 연결 1,326개 INSERT
6. ✅ 앱에서 데이터 확인 및 테스트

---

## 📞 문의 사항
- JSON 파일 위치: `database/perfume_import_data.json`
- 마이그레이션 SQL: `database/migration_add_accord_and_fields.sql`
- Python 스크립트: `database/import_perfume_data.py`


# 페이지네이션 표준 패턴 ✅ 확정

> **목적:** 향수, 커뮤니티 등 모든 목록 페이지의 페이지네이션을 통일  
> **적용:** 모든 목록 페이지 (향수, 커뮤니티, 리뷰, 관리자 등)

---

## 📋 목차
1. [현재 상황](#현재-상황)
2. [표준 UI 구조](#표준-ui-구조)
3. [블록 이동 로직](#블록-이동-로직)
4. [데이터 로딩](#데이터-로딩)
5. [공통 컴포넌트](#공통-컴포넌트)

---

## 현재 상황 ✅

### 구현 완료
- ✅ 향수 페이지: 10개/페이지, 5개 페이지 번호 표시
- ✅ 커뮤니티 페이지: 동일한 UI (통일 완료)
- ✅ totalCount 정상 작동

### 표준 사양 확정
- **페이지당 아이템:** 10개
- **표시 페이지 번호:** 5개 고정
- **블록 크기:** 5페이지씩
- **현재 페이지:** 파란색 배경 (`#5A7BC9`)

---

## 표준 UI 구조 ✅ 확정

### 기본 레이아웃
```
<<  <  1  2  3  4  5  >  >>
```

### 아이콘 의미
- `<<`: 이전 5개 블록으로 이동
- `<`: 한 페이지 이전
- `1 2 3 4 5`: 페이지 번호 (현재 페이지는 파란색)
- `>`: 한 페이지 다음  
- `>>`: 다음 5개 블록으로 이동

### 구현 코드

```typescript
// lib/components/Pagination.tsx

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = (): number[] => {
    const blockSize = 5;
    const currentBlock = Math.ceil(currentPage / blockSize);
    const startPage = (currentBlock - 1) * blockSize + 1;
    const endPage = Math.min(startPage + blockSize - 1, totalPages);
    
    return Array.from(
      { length: endPage - startPage + 1 }, 
      (_, i) => startPage + i
    );
  };

  const handleDoublePrev = () => {
    const blockSize = 5;
    const currentBlock = Math.ceil(currentPage / blockSize);
    
    if (currentBlock === 1) {
      // 첫 블록이면 1페이지로
      onPageChange(1);
    } else {
      // 이전 블록의 마지막 페이지로
      const prevBlockEnd = (currentBlock - 1) * blockSize;
      onPageChange(prevBlockEnd);
    }
  };

  const handleDoubleNext = () => {
    const blockSize = 5;
    const currentBlock = Math.ceil(currentPage / blockSize);
    const totalBlocks = Math.ceil(totalPages / blockSize);
    
    if (currentBlock === totalBlocks) {
      // 마지막 블록이면 마지막 페이지로
      onPageChange(totalPages);
    } else {
      // 다음 블록의 첫 페이지로
      const nextBlockStart = currentBlock * blockSize + 1;
      onPageChange(nextBlockStart);
    }
  };

  const visiblePages = getVisiblePages();

  return (
    <View style={styles.pagination}>
      {/* 왼쪽: 이전 블록/이전 페이지 */}
      <View style={styles.paginationLeft}>
        <TouchableOpacity 
          onPress={handleDoublePrev}
          disabled={currentPage === 1}
        >
          <Ionicons 
            name="chevron-back" 
            size={16} 
            color={currentPage === 1 ? "#ccc" : "#444"} 
          />
          <Ionicons 
            name="chevron-back" 
            size={16} 
            color={currentPage === 1 ? "#ccc" : "#444"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Ionicons 
            name="chevron-back" 
            size={16} 
            color={currentPage === 1 ? "#ccc" : "#444"} 
          />
        </TouchableOpacity>
      </View>

      {/* 중앙: 페이지 번호 */}
      <View style={styles.pageNumbers}>
        {visiblePages.map(pageNum => (
          <TouchableOpacity 
            key={pageNum}
            style={[
              styles.pageNumber,
              currentPage === pageNum ? styles.activePageNumber : styles.inactivePageNumber
            ]}
            onPress={() => onPageChange(pageNum)}
          >
            <Text style={[
              styles.pageNumberText,
              currentPage === pageNum ? styles.activePageNumberText : styles.inactivePageNumberText
            ]}>
              {pageNum}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 오른쪽: 다음 페이지/다음 블록 */}
      <View style={styles.paginationRight}>
        <TouchableOpacity 
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={currentPage === totalPages ? "#ccc" : "#444"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleDoubleNext}
          disabled={currentPage === totalPages}
        >
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={currentPage === totalPages ? "#ccc" : "#444"} 
          />
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={currentPage === totalPages ? "#ccc" : "#444"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

---

## 블록 이동 로직 ✅ 확정

### 이동 규칙

| 현재 위치 | `<<` 클릭 | `>>` 클릭 |
|----------|----------|----------|
| 1-5 블록 | 1페이지 | 6페이지 |
| 6-10 블록 | 5페이지 | 11페이지 |
| 11-14 블록 (마지막) | 10페이지 | 14페이지 |

### 예시 시나리오

**총 14페이지인 경우:**

1. **현재 3페이지** → `<<` 클릭 → **1페이지**
2. **현재 3페이지** → `>>` 클릭 → **6페이지**  
3. **현재 8페이지** → `<<` 클릭 → **5페이지**
4. **현재 8페이지** → `>>` 클릭 → **11페이지**
5. **현재 13페이지** → `<<` 클릭 → **10페이지**
6. **현재 13페이지** → `>>` 클릭 → **14페이지**

---

## 데이터 로딩 ✅ 확정

```typescript
// 표준 데이터 로딩 방식
const loadData = async (page: number = 1, limit: number = 10) => {
  try {
    // 1. 총 개수 조회
    const { data: countData } = await supabase
      .from('table_name')
      .select('id');

    const totalCount = countData?.length || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // 2. 페이지 데이터 조회
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data,
      totalCount,
      totalPages,
      currentPage: page
    };
  } catch (err) {
    console.error('데이터 로딩 실패:', err);
    throw err;
  }
};
```

**이유:** Supabase의 `{ count: 'exact' }`가 NaN 반환하는 문제 회피

---

## 공통 컴포넌트 ✅ 확정

### 생성 시점
- **Week 3**: 기존 향수/커뮤니티 페이지 리팩토링 시
- **개발 룰**: 페이지 작업 시 리마인드하여 공통화 진행

### 사용 예시

```typescript
// app/perfume/index.tsx
// app/community/index.tsx

import { Pagination } from '@/lib/components/Pagination';

export default function ListScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async (page: number) => {
    const result = await loadData(page, 10);
    setTotalPages(result.totalPages);
  };

  return (
    <View>
      {/* 목록 데이터 */}
      
      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          loadData(page);
        }}
      />
    </View>
  );
}
```

---

## ✅ 최종 확정 요약

### 핵심 결정 사항

1. **UI 구조**
   - ✅ 5개 페이지 번호 고정 표시
   - ✅ `<< < 1 2 3 4 5 > >>` 레이아웃
   - ✅ 현재 페이지: 파란색 배경 (`#5A7BC9`)

2. **블록 이동 로직**
   - ✅ `<<`: 이전 블록의 마지막 페이지 (첫 블록은 1페이지)
   - ✅ `>>`: 다음 블록의 첫 페이지 (마지막 블록은 마지막 페이지)
   - ✅ 블록 크기: 5페이지씩

3. **데이터 로딩**
   - ✅ 10개/페이지
   - ✅ `select('id')` 방식으로 totalCount 계산
   - ✅ `range(from, to)` 방식으로 페이지 데이터 조회

4. **공통 컴포넌트**
   - ✅ Week 3에 `components/shared/Pagination.tsx` 생성
   - ✅ 기존 향수/커뮤니티 코드 리팩토링

---

**모든 목록 페이지는 이 패턴을 사용합니다.**


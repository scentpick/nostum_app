# 검색 표준 패턴 ✅ 확정

> **목적:** 향수, 커뮤니티 등 모든 검색 기능의 통일된 구현  
> **적용:** 모든 검색 기능 (향수, 커뮤니티, 리뷰, 관리자 등)

---

## 📋 목차
1. [표준 검색 UI](#표준-검색-ui)
2. [검색 로직](#검색-로직)
3. [카테고리별 검색 필드](#카테고리별-검색-필드)
4. [검색 히스토리](#검색-히스토리)
5. [공통 컴포넌트](#공통-컴포넌트)

---

## 표준 검색 UI ✅ 확정

### 기본 구조
```
[검색어 입력] [X] [검색 버튼]
```

### 구현 코드

```typescript
// lib/components/SearchBar.tsx

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  placeholder = "검색어를 입력하세요",
  disabled = false
}) => {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInput}>
        <TextInput
          style={styles.searchText}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity 
        style={[styles.searchButton, disabled && styles.disabledButton]} 
        onPress={onSearch}
        disabled={disabled}
      >
        <Ionicons name="search" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );
};
```

---

## 검색 로직 ✅ 확정

### 표준 검색 함수

```typescript
// lib/utils/search.ts

import { ErrorMessages } from '@/lib/constants/errorMessages';
import { isRateLimited } from '@/lib/utils/rateLimiter';

export const handleSearch = async (
  query: string,
  category: 'perfume' | 'community' | 'review',
  userId?: string
): Promise<boolean> => {
  // 1. 검색어 유효성 검사
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) {
    Alert.alert('알림', '검색어는 최소 2자 이상 입력해주세요');
    return false;
  }

  // 2. Rate Limiting (클라이언트)
  if (userId && isRateLimited(`search_${category}_${userId}`, 3, 5000)) { // 5초에 3번
    Alert.alert('알림', ErrorMessages.RATE_LIMIT_EXCEEDED);
    return false;
  }

  // 3. 검색 실행
  try {
    await performSearch(trimmedQuery, category);
    
    // 4. 검색 히스토리 저장
    if (userId) {
      await saveSearchHistory(userId, trimmedQuery, category);
    }
    
    return true;
  } catch (error) {
    console.error('검색 실패:', error);
    Alert.alert('오류', '검색 중 오류가 발생했습니다');
    return false;
  }
};
```

### 페이지 초기화

```typescript
// 검색 시 항상 첫 페이지로
const handleSearch = async () => {
  const success = await handleSearch(searchQuery, category, user?.id);
  if (success) {
    setCurrentPage(1); // 페이지 초기화
    await loadData(); // 데이터 다시 로드
  }
};
```

---

## 카테고리별 검색 필드 ✅ 확정

### 1. 커뮤니티 검색
**검색 대상:** 제목 + 내용

```typescript
// lib/services/communityService.ts
export const searchCommunityPosts = async (query: string) => {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });
    
  return { data, error };
};
```

### 2. 리뷰 검색
**검색 대상:** 제목 + 내용

```typescript
// lib/services/reviewService.ts
export const searchReviews = async (query: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      perfume:perfumes(*),
      user:profiles(*)
    `)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });
    
  return { data, error };
};
```

### 3. 향수 검색 (확장)
**검색 대상:** 한글명 + 영문명 + 어코드 + fragrance wheel + 브랜드명 + 영문 브랜드명

```typescript
// lib/services/perfumeService.ts
export const searchPerfumes = async (query: string) => {
  const { data, error } = await supabase
    .from('perfumes')
    .select(`
      *,
      brand:brands(*),
      accords:perfume_accords(
        accord:accords(*)
      )
    `)
    .or(`
      name_kr.ilike.%${query}%,
      name.ilike.%${query}%,
      brand_name_kr.ilike.%${query}%,
      brand_name.ilike.%${query}%
    `)
    .order('name_kr', { ascending: true });
    
  return { data, error };
};
```

---

## 검색 히스토리 ✅ 확정

### DB 스키마

```sql
-- 검색 히스토리 테이블
CREATE TABLE search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  
  -- 검색 정보
  query TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('perfume', 'community', 'review')),
  
  -- 검색 결과
  result_count INTEGER DEFAULT 0,
  
  -- 메타데이터 (향후 확장용)
  search_filters JSONB,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_search_history_user ON search_history(user_id, created_at DESC);
CREATE INDEX idx_search_history_category ON search_history(category, created_at DESC);
CREATE INDEX idx_search_history_query ON search_history(query, created_at DESC);

-- 정리 정책 (6개월 후 자동 삭제)
CREATE INDEX idx_search_history_cleanup ON search_history(created_at) 
WHERE created_at < NOW() - INTERVAL '6 months';
```

### 히스토리 저장 함수

```typescript
// lib/utils/searchHistory.ts

export const saveSearchHistory = async (
  userId: string,
  query: string,
  category: string,
  resultCount: number = 0
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        query: query.trim(),
        category,
        result_count: resultCount
      });

    if (error) {
      console.error('검색 히스토리 저장 실패:', error);
    }
  } catch (err) {
    console.error('검색 히스토리 저장 예외:', err);
  }
};
```

### 향후 활용 계획

1. **통계/트렌드 페이지**
   - 인기 검색어 순위
   - 검색어 트렌드 그래프
   - 카테고리별 검색 통계

2. **개인 검색 히스토리**
   - 최근 검색어 목록
   - 자주 검색하는 키워드
   - 검색 결과 재조회

3. **추천 기능**
   - 관련 검색어 추천
   - 다른 사용자들의 인기 검색어

---

## 공통 컴포넌트 ✅ 확정

### 생성 시점
- **Week 3**: 기존 향수/커뮤니티 페이지 리팩토링 시
- **개발 룰**: 페이지 작업 시 리마인드하여 공통화 진행

### 사용 예시

```typescript
// app/perfume/index.tsx
// app/community/index.tsx

import { SearchBar } from '@/lib/components/SearchBar';
import { handleSearch } from '@/lib/utils/search';

export default function ListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const onSearch = async () => {
    setLoading(true);
    const success = await handleSearch(searchQuery, 'perfume', user?.id);
    if (success) {
      setCurrentPage(1);
      await loadData();
    }
    setLoading(false);
  };

  return (
    <View>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={onSearch}
        placeholder="향수명을 검색하세요"
        disabled={loading}
      />
      
      {/* 목록 데이터 */}
    </View>
  );
}
```

---

## ✅ 최종 확정 요약

### 핵심 결정 사항

1. **검색 방식**
   - ✅ 최소 2자 검색
   - ✅ 버튼 검색만 (안정성)
   - ❌ 실시간 검색 없음

2. **검색 필드**
   - ✅ 커뮤니티: 제목 + 내용
   - ✅ 리뷰: 제목 + 내용
   - ✅ 향수: 한글명 + 영문명 + 어코드 + fragrance wheel + 브랜드명 + 영문 브랜드명

3. **검색 히스토리**
   - ✅ DB에 저장 (통계/트렌드용)
   - ✅ 6개월 후 자동 삭제
   - ✅ 향후 활용: 인기 검색어, 개인 히스토리

4. **Rate Limiting**
   - ✅ 5초에 3번 검색 제한

5. **공통 컴포넌트**
   - ✅ Week 3에 `components/shared/SearchBar.tsx` 생성
   - ✅ 기존 코드 리팩토링

---

**모든 검색 기능은 이 패턴을 사용합니다.**


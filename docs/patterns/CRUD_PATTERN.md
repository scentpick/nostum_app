# CRUD 표준 패턴 ✅ 확정

> **목적:** 생성, 조회, 수정, 삭제의 일관된 구현 방식 정립  
> **적용 대상:** 게시글, 댓글, 리뷰, 향수 등 모든 CRUD 작업

---

## 📋 목차
1. [개요](#개요)
2. [Create (생성)](#create-생성)
3. [Read (조회)](#read-조회)
4. [Update (수정)](#update-수정)
5. [Delete (삭제)](#delete-삭제)
6. [고급 기능](#고급-기능)
7. [코드 템플릿](#코드-템플릿)

---

## 개요

### 표준 패턴의 필요성
- ✅ 코드 일관성
- ✅ 유지보수 용이
- ✅ 버그 감소
- ✅ 신규 개발자 온보딩 쉬움
- ✅ 다국어 지원 대비

### 적용 원칙 ✅ 확정
1. **모든 CRUD는 동일한 구조**
2. **서비스 레이어 분리**
3. **에러 처리 표준화 (다국어 대비)**
4. **권한 체크 필수**
5. **소프트 삭제 우선**
6. **입력 검증 이중 체크 (UI + 서비스)**
7. **낙관적 업데이트 (간단한 작업만)**
8. **Rate Limiting (클라이언트)**

---

## Create (생성)

### 표준 프로세스 ✅ 확정

```
1. 입력 검증 (UI - 즉각 피드백)
   ↓
2. Rate Limiting 체크 (클라이언트)
   ↓
3. 권한 체크 (로그인 필요?)
   ↓
4. 이미지 처리 (있다면)
   - 압축
   - 업로드
   - URL 획득
   ↓
5. 입력 검증 (서비스 - 보안)
   ↓
6. DB 삽입
   ↓
7. 성공 응답 + 목록 리프레시
```

**설계 결정:**
- ❌ XSS 필터링 불필요 (React Native 앱)
- ✅ 입력 검증 이중 체크 (UI + 서비스)
- ✅ Rate Limiting (클라이언트)

### API 서비스 템플릿 ✅ 확정

```typescript
// lib/services/[feature]Service.ts

import { ErrorMessages } from '@/lib/constants/errorMessages';

export const create[Feature] = async (
  data: Create[Feature]Data
): Promise<ApiResponse<[Feature]>> => {
  try {
    // 1. 입력 검증 (서비스 레벨 - 보안)
    if (!data.title || data.title.trim().length < 2) {
      return { 
        success: false, 
        data: null, 
        error: ErrorMessages.INVALID_TITLE_LENGTH  // 다국어 대비
      };
    }

    if (!data.content || data.content.trim().length < 10) {
      return { 
        success: false, 
        data: null, 
        error: ErrorMessages.INVALID_CONTENT_LENGTH 
      };
    }

    // 2. DB 삽입
    const { data: result, error } = await supabase
      .from('[table_name]')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('❌ create[Feature] 에러:', error);
      return { 
        success: false, 
        data: null, 
        error: ErrorMessages.CREATE_FAILED 
      };
    }

    console.log('✅ create[Feature] 성공:', result.id);
    return { success: true, data: result, error: null };
  } catch (err) {
    console.error('❌ create[Feature] 예외:', err);
    return { 
      success: false, 
      data: null, 
      error: ErrorMessages.UNKNOWN_ERROR
    };
  }
};
```

**에러 메시지 상수 (다국어 대비):**
```typescript
// lib/constants/errorMessages.ts

export const ErrorMessages = {
  // 입력 검증
  INVALID_TITLE_LENGTH: '제목은 최소 2자 이상이어야 합니다.',
  INVALID_CONTENT_LENGTH: '내용은 최소 10자 이상이어야 합니다.',
  
  // CRUD
  CREATE_FAILED: '작성 중 오류가 발생했습니다.',
  UPDATE_FAILED: '수정 중 오류가 발생했습니다.',
  DELETE_FAILED: '삭제 중 오류가 발생했습니다.',
  NOT_FOUND: '항목을 찾을 수 없습니다.',
  
  // 권한
  PERMISSION_DENIED: '권한이 없습니다.',
  LOGIN_REQUIRED: '로그인이 필요합니다.',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: '잠시 후 다시 시도해주세요.',
  
  // 기타
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
};

// 향후 다국어 지원 시:
// export const ErrorMessages = {
//   ko: { ... },
//   en: { ... }
// };
```

### UI 화면 템플릿 ✅ 확정

```typescript
// app/[feature]/create.tsx

import { isRateLimited } from '@/lib/utils/rateLimiter';
import { ErrorMessages } from '@/lib/constants/errorMessages';

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCreate = async () => {
    // 1. 입력 검증 (UI - 즉각 피드백)
    if (!title.trim()) {
      Alert.alert('오류', ErrorMessages.INVALID_TITLE_LENGTH);
      return;
    }

    if (!content.trim() || content.trim().length < 10) {
      Alert.alert('오류', ErrorMessages.INVALID_CONTENT_LENGTH);
      return;
    }

    // 2. Rate Limiting (클라이언트)
    if (isRateLimited(`create_[feature]_${user?.id}`, 3, 60000)) { // 1분에 3번
      Alert.alert('오류', ErrorMessages.RATE_LIMIT_EXCEEDED);
      return;
    }

    // 3. 생성
    setLoading(true);
    const result = await create[Feature]({
      title,
      content,
      image_urls: images,
      user_id: user?.id
    });

    setLoading(false);

    // 4. 결과 처리
    if (result.success) {
      Alert.alert('성공', '작성이 완료되었습니다');
      router.back(); // 목록으로
    } else {
      Alert.alert('오류', result.error || ErrorMessages.CREATE_FAILED);
    }
  };

  return (
    <View>
      <TextInput 
        value={title} 
        onChangeText={setTitle}
        placeholder="제목 (최소 2자)"
        maxLength={100}
      />
      <TextInput 
        value={content} 
        onChangeText={setContent} 
        placeholder="내용 (최소 10자)"
        maxLength={2000}
        multiline 
      />
      <ImageUploader onUpload={setImages} />
      <Button 
        onPress={handleCreate} 
        disabled={loading || !title.trim() || !content.trim()} 
      >
        {loading ? '작성 중...' : '작성하기'}
      </Button>
    </View>
  );
}
```

---

## Read (조회)

### 목록 조회 표준

```typescript
export const get[Feature]s = async (
  params: [Feature]SearchParams = {}
): Promise<ApiResponse<PaginatedResponse<[Feature]>>> => {
  try {
    const {
      query = '',
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'desc',
      ...filters
    } = params;

    // 1. 쿼리 빌더
    let queryBuilder = supabase
      .from('[table_name]')
      .select('*');

    // 2. 필터 적용
    if (filters.category_id) {
      queryBuilder = queryBuilder.eq('category_id', filters.category_id);
    }

    // 3. 검색
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
    }

    // 4. 정렬
    queryBuilder = queryBuilder.order(sort_by, { ascending: sort_order === 'asc' });

    // 5. 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    queryBuilder = queryBuilder.range(from, to);

    // 6. 실행
    const { data, error } = await queryBuilder;

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    // 7. 총 개수 조회 (별도)
    let countQuery = supabase.from('[table_name]').select('id');
    if (filters.category_id) countQuery = countQuery.eq('category_id', filters.category_id);
    if (query) countQuery = countQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
    
    const { data: countData } = await countQuery;
    const totalCount = countData?.length || 0;

    return {
      success: true,
      data: {
        data,
        count: totalCount,
        page,
        limit,
        total_pages: Math.ceil(totalCount / limit)
      },
      error: null
    };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
```

### 상세 조회 표준

```typescript
export const get[Feature]ById = async (
  id: string
): Promise<ApiResponse<[Feature]>> => {
  try {
    const { data, error } = await supabase
      .from('[table_name]')
      .select(`
        *,
        user:profiles(*),
        category:categories(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return { success: false, data: null, error: ErrorMessages.NOT_FOUND };
    }

    // 조회수 증가 (세션당 1회)
    await incrementViewCount(id);

    return { success: true, data, error: null };
  } catch (err) {
    return { success: false, data: null, error: ErrorMessages.UNKNOWN_ERROR };
  }
};
```

### 조회수 증가 (세션당 1회) ✅ 확정

```typescript
// lib/services/[feature]Service.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export const incrementViewCount = async (itemId: string): Promise<void> => {
  try {
    // 1. 세션 내 조회 여부 확인
    const viewedKey = `viewed_[feature]_${itemId}`;
    const hasViewed = await AsyncStorage.getItem(viewedKey);
    
    if (hasViewed) {
      console.log('🔍 이미 조회한 항목:', itemId);
      return; // 이미 조회함
    }
    
    // 2. 조회수 증가 (Supabase Function 사용)
    const { error } = await supabase.rpc('increment_view_count', { 
      table_name: '[table_name]',
      item_id: itemId 
    });
    
    if (error) {
      console.error('❌ 조회수 증가 실패:', error);
      return;
    }
    
    // 3. 조회 기록 저장 (24시간 동안 유지)
    await AsyncStorage.setItem(viewedKey, Date.now().toString());
    console.log('✅ 조회수 증가:', itemId);
  } catch (err) {
    console.error('❌ incrementViewCount 예외:', err);
  }
};
```

**Supabase Function (SQL):**
```sql
-- database/functions/increment_view_count.sql

CREATE OR REPLACE FUNCTION increment_view_count(
  table_name TEXT,
  item_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- 동적 테이블 업데이트
  EXECUTE format('
    UPDATE %I 
    SET view_count = view_count + 1 
    WHERE id = $1
  ', table_name)
  USING item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 또는 테이블별로 함수 분리 (추천)
CREATE OR REPLACE FUNCTION increment_post_view_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE community_posts 
  SET view_count = view_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Update (수정)

### 표준 프로세스

```
1. 권한 체크 (작성자 or 관리자)
   ↓
2. 기존 데이터 조회
   ↓
3. 입력 검증
   ↓
4. XSS 필터링
   ↓
5. DB 업데이트
   ↓
6. updated_at 자동 갱신
   ↓
7. 성공 응답
```

### API 서비스 템플릿

```typescript
export const update[Feature] = async (
  id: string,
  data: Update[Feature]Data,
  userId: string
): Promise<ApiResponse<[Feature]>> => {
  try {
    // 1. 권한 체크
    const { data: existing, error: fetchError } = await supabase
      .from('[table_name]')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return { success: false, data: null, error: '항목을 찾을 수 없습니다' };
    }

    // 2. 작성자 확인 (관리자는 체크 생략)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    const isAdmin = profile?.role === 'admin';
    const isOwner = existing.user_id === userId;

    if (!isOwner && !isAdmin) {
      return { success: false, data: null, error: '수정 권한이 없습니다' };
    }

    // 3. 업데이트
    const { data: result, error } = await supabase
      .from('[table_name]')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: result, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
```

---

## Delete (삭제)

### ⭐ **중요: 소프트 삭제 우선**

모든 삭제는 **소프트 삭제**를 기본으로 합니다.

```sql
-- 하드 삭제 (절대 사용 금지)
DELETE FROM table WHERE id = '...';

-- 소프트 삭제 (표준)
UPDATE table SET 
  is_deleted = true,
  deleted_at = NOW(),
  deleted_by = '...'
WHERE id = '...';
```

### API 서비스 템플릿

```typescript
export const delete[Feature] = async (
  id: string,
  userId: string
): Promise<ApiResponse<void>> => {
  try {
    // 1. 권한 체크 (수정과 동일)
    const { data: existing, error: fetchError } = await supabase
      .from('[table_name]')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return { success: false, data: null, error: '항목을 찾을 수 없습니다' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    const isAdmin = profile?.role === 'admin';
    const isOwner = existing.user_id === userId;

    if (!isOwner && !isAdmin) {
      return { success: false, data: null, error: '삭제 권한이 없습니다' };
    }

    // 2. 소프트 삭제
    const { error } = await supabase
      .from('[table_name]')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: userId
      })
      .eq('id', id);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    console.log('✅ delete[Feature] 성공 (소프트 삭제):', id);
    return { success: true, data: null, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
```

### UI 템플릿

```typescript
const handleDelete = async () => {
  // 1. 확인 다이얼로그
  Alert.alert(
    '삭제 확인',
    '정말 삭제하시겠습니까?',
    [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          // 2. 삭제 실행
          const result = await delete[Feature](id, userId);
          
          // 3. 결과 처리
          if (result.success) {
            Alert.alert('완료', '삭제되었습니다');
            router.back();
          } else {
            Alert.alert('오류', result.error);
          }
        }
      }
    ]
  );
};
```

---

## 고급 기능 ✅ 확정

### 1. Rate Limiting (클라이언트)

```typescript
// lib/utils/rateLimiter.ts

const requestHistory = new Map<string, number[]>();

/**
 * Rate Limiting 체크
 * @param key - 고유 키 (예: 'create_post_user123')
 * @param maxRequests - 최대 요청 수
 * @param windowMs - 시간 윈도우 (밀리초)
 * @returns true면 제한 초과
 */
export const isRateLimited = (
  key: string, 
  maxRequests: number, 
  windowMs: number
): boolean => {
  const now = Date.now();
  const history = requestHistory.get(key) || [];
  
  // 시간 윈도우 내 요청만 필터링
  const recentRequests = history.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    console.log(`⚠️ Rate Limit 초과: ${key}`);
    return true;
  }
  
  // 새 요청 기록
  recentRequests.push(now);
  requestHistory.set(key, recentRequests);
  
  return false;
};

/**
 * Rate Limit 초기화 (로그아웃 시)
 */
export const clearRateLimitHistory = (userId: string): void => {
  const keys = Array.from(requestHistory.keys());
  keys.forEach(key => {
    if (key.includes(userId)) {
      requestHistory.delete(key);
    }
  });
};
```

**일반적인 Rate Limit 설정 (권장):**
```typescript
// lib/constants/rateLimits.ts

export const RateLimits = {
  // 게시글 작성: 1분에 3번
  CREATE_POST: { maxRequests: 3, windowMs: 60 * 1000 },
  
  // 댓글 작성: 30초에 5번
  CREATE_COMMENT: { maxRequests: 5, windowMs: 30 * 1000 },
  
  // 좋아요: 10초에 10번
  LIKE_ACTION: { maxRequests: 10, windowMs: 10 * 1000 },
  
  // 검색: 5초에 3번
  SEARCH: { maxRequests: 3, windowMs: 5 * 1000 },
  
  // 이미지 업로드: 1분에 5개
  IMAGE_UPLOAD: { maxRequests: 5, windowMs: 60 * 1000 },
};
```

---

### 2. 낙관적 업데이트 (Optimistic Update)

**적용 대상:** 좋아요, 찜하기 등 간단한 토글 작업

```typescript
// components/LikeButton.tsx

export const LikeButton = ({ postId, initialLiked, initialCount }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const { user } = useAuth();

  const handleLike = async () => {
    // 1. UI 즉시 업데이트 (낙관적)
    const previousLiked = isLiked;
    const previousCount = likeCount;
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    // 2. API 호출
    const result = isLiked 
      ? await unlikePost(postId, user.id)
      : await likePost(postId, user.id);
    
    // 3. 실패 시 롤백
    if (!result.success) {
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      Alert.alert('오류', result.error);
    }
  };

  return (
    <TouchableOpacity onPress={handleLike}>
      <Icon name={isLiked ? 'heart' : 'heart-outline'} />
      <Text>{likeCount}</Text>
    </TouchableOpacity>
  );
};
```

**적용하지 않는 대상:** 게시글 작성, 수정, 삭제 등 중요한 작업
```typescript
// ❌ 게시글 작성에는 낙관적 업데이트 사용 안 함
const handleCreate = async () => {
  setLoading(true);
  const result = await createPost(data);
  setLoading(false);
  
  if (result.success) {
    router.back(); // 서버 응답 확인 후 이동
  }
};
```

---

### 3. 다국어 지원 대비

**현재 구조 (한국어만):**
```typescript
// lib/constants/errorMessages.ts
export const ErrorMessages = {
  INVALID_TITLE: '제목을 입력해주세요',
  // ...
};
```

**향후 확장 구조:**
```typescript
// lib/constants/messages.ts
export const Messages = {
  ko: {
    errors: {
      INVALID_TITLE: '제목을 입력해주세요',
      PERMISSION_DENIED: '권한이 없습니다',
    },
    success: {
      CREATE_SUCCESS: '작성이 완료되었습니다',
      UPDATE_SUCCESS: '수정이 완료되었습니다',
    },
    ui: {
      BUTTON_CREATE: '작성하기',
      BUTTON_UPDATE: '수정하기',
      BUTTON_DELETE: '삭제하기',
    }
  },
  en: {
    errors: {
      INVALID_TITLE: 'Please enter a title',
      PERMISSION_DENIED: 'Permission denied',
    },
    success: {
      CREATE_SUCCESS: 'Successfully created',
      UPDATE_SUCCESS: 'Successfully updated',
    },
    ui: {
      BUTTON_CREATE: 'Create',
      BUTTON_UPDATE: 'Update',
      BUTTON_DELETE: 'Delete',
    }
  }
};

// lib/hooks/useTranslation.ts
export const useTranslation = () => {
  const locale = 'ko'; // 나중에 설정에서 가져옴
  return {
    t: (key: string) => {
      const keys = key.split('.');
      let value = Messages[locale];
      for (const k of keys) {
        value = value[k];
      }
      return value;
    }
  };
};

// 사용 예시
const { t } = useTranslation();
Alert.alert('오류', t('errors.INVALID_TITLE'));
```

---

## 코드 템플릿

### 서비스 파일 전체 템플릿

```typescript
// lib/services/[feature]Service.ts

import { supabase } from '../supabase/client';
import { 
  [Feature], 
  Create[Feature]Data, 
  Update[Feature]Data,
  [Feature]SearchParams,
  ApiResponse,
  PaginatedResponse 
} from '../types';

// ==========================================
// CREATE
// ==========================================
export const create[Feature] = async (
  data: Create[Feature]Data
): Promise<ApiResponse<[Feature]>> => {
  // ... (위 템플릿 참조)
};

// ==========================================
// READ - 목록
// ==========================================
export const get[Feature]s = async (
  params: [Feature]SearchParams = {}
): Promise<ApiResponse<PaginatedResponse<[Feature]>>> => {
  // ... (위 템플릿 참조)
};

// ==========================================
// READ - 상세
// ==========================================
export const get[Feature]ById = async (
  id: string
): Promise<ApiResponse<[Feature]>> => {
  // ... (위 템플릿 참조)
};

// ==========================================
// UPDATE
// ==========================================
export const update[Feature] = async (
  id: string,
  data: Update[Feature]Data,
  userId: string
): Promise<ApiResponse<[Feature]>> => {
  // ... (위 템플릿 참조)
};

// ==========================================
// DELETE (소프트 삭제)
// ==========================================
export const delete[Feature] = async (
  id: string,
  userId: string
): Promise<ApiResponse<void>> => {
  // ... (위 템플릿 참조)
};

// ==========================================
// 복구 (관리자 전용)
// ==========================================
export const restore[Feature] = async (
  id: string,
  userId: string
): Promise<ApiResponse<void>> => {
  try {
    // 관리자 권한 체크
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role !== 'admin') {
      return { success: false, data: null, error: '관리자 권한이 필요합니다' };
    }

    // 복구
    const { error } = await supabase
      .from('[table_name]')
      .update({
        is_deleted: false,
        deleted_at: null,
        deleted_by: null
      })
      .eq('id', id);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: null, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
```

---

## 적용 예시

### 적용 대상
1. ✅ 커뮤니티 게시글 (`communityService.ts`)
2. ⏳ 댓글 (`commentService.ts`)
3. ⏳ 리뷰 (`reviewService.ts`)
4. ⏳ 향수 (`perfumeService.ts` - 관리자 전용)

### 체크리스트

각 서비스 구현 시 확인:
- [ ] ✅ ApiResponse 타입 사용
- [ ] ✅ 에러 처리 (try-catch)
- [ ] ✅ 로깅 (성공/실패)
- [ ] ✅ 권한 체크 (수정/삭제)
- [ ] ✅ 소프트 삭제 (하드 삭제 금지)
- [ ] ✅ XSS 필터링 (선택)
- [ ] ✅ 입력 검증

---

## ✅ 최종 확정 요약

### 핵심 결정 사항

1. **XSS 필터링**
   - ❌ 적용 안 함 (React Native 앱)
   - 향후 웹 버전 시 고려

2. **입력 검증**
   - ✅ 이중 체크 (UI + 서비스)
   - UI: 즉각 피드백
   - 서비스: 보안 (우회 방지)

3. **에러 메시지**
   - ✅ 현재: 한국어
   - ✅ 다국어 대비: 상수 분리 구조
   - 향후: `useTranslation` 훅 사용

4. **Rate Limiting**
   - ✅ 클라이언트 측만
   - 게시글: 1분 3번
   - 댓글: 30초 5번
   - 좋아요: 10초 10번
   - 검색: 5초 3번
   - 이미지: 1분 5개

5. **낙관적 업데이트**
   - ✅ 좋아요, 찜하기만
   - ❌ 게시글 CRUD는 제외

6. **조회수 증가**
   - ✅ 세션당 1회
   - AsyncStorage 활용
   - Supabase Function 사용

7. **소프트 삭제**
   - ✅ 모든 사용자 콘텐츠
   - 관리자가 하드 삭제 선택 가능

8. **다국어 지원**
   - ✅ 현재: 한국어만
   - ✅ 구조: 확장 가능하게 설계
   - 향수/브랜드: 이미 다국어 준비됨

---

**모든 CRUD 작업은 이 패턴을 따라 구현합니다.**


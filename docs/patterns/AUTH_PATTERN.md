# 권한 체크 표준 패턴 ✅ 확정

> **목적:** 로그인, 권한 검증의 일관된 구현  
> **적용:** 모든 권한이 필요한 기능

---

## 📋 목차
1. [권한 레벨](#권한-레벨)
2. [권한 체크 함수](#권한-체크-함수)
3. [UI 보호](#ui-보호)
4. [라우트 보호](#라우트-보호)
5. [사용 예시](#사용-예시)

---

## 권한 레벨 ✅ 확정

### 현재 권한 레벨
```typescript
// lib/types/permissions.ts

export type UserRole = 'user' | 'admin';  // 향후 확장 가능

export enum PermissionLevel {
  PUBLIC = 'public',      // 비로그인 가능
  USER = 'user',          // 일반 사용자 (로그인 필요)
  OWNER = 'owner',        // 작성자만
  ADMIN = 'admin'         // 관리자만
}
```

### 향후 확장 가능한 구조
```typescript
// 미래에 추가 가능한 역할 예시
export type UserRole = 
  | 'user'           // 일반 사용자
  | 'verified'       // 인증된 사용자 (이메일 인증 등)
  | 'vip'            // VIP 사용자
  | 'moderator'      // 운영자 (관리자보다 낮은 권한)
  | 'admin'          // 관리자
  | 'super_admin';   // 최고 관리자

// 역할별 권한 매핑
export const RolePermissions: Record<UserRole, string[]> = {
  user: ['read', 'create_post', 'create_comment'],
  admin: ['read', 'create_post', 'create_comment', 'delete_any', 'manage_users'],
  // 향후 추가...
};
```

**설계 결정:**
- ✅ 현재: `user`, `admin` 두 가지만
- ✅ 확장 가능: 타입과 enum 구조로 설계
- ✅ 다국어 대비: 에러 메시지 상수 사용

---

## 권한 체크 함수 ✅ 확정

### 1. 기본 체크 함수

```typescript
// lib/utils/permissions.ts

import { ErrorMessages } from '@/lib/constants/errorMessages';
import { supabase } from '@/lib/supabase/client';
import { UserRole } from '@/lib/types/permissions';

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

/**
 * 로그인 체크
 */
export const checkLogin = (userId: string | null): PermissionResult => {
  if (!userId) {
    return { 
      allowed: false, 
      reason: ErrorMessages.LOGIN_REQUIRED 
    };
  }
  return { allowed: true };
};

/**
 * 관리자 권한 체크
 */
export const checkAdmin = async (userId: string): Promise<PermissionResult> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return { 
        allowed: false, 
        reason: ErrorMessages.PERMISSION_DENIED 
      };
    }

    if (data.role !== 'admin') {
      return { 
        allowed: false, 
        reason: ErrorMessages.ADMIN_ONLY 
      };
    }

    return { allowed: true };
  } catch (err) {
    return { 
      allowed: false, 
      reason: ErrorMessages.UNKNOWN_ERROR 
    };
  }
};

/**
 * 작성자 체크 (본인 또는 관리자)
 */
export const checkOwner = async (
  userId: string,
  targetUserId: string
): Promise<PermissionResult> => {
  // 1. 본인 확인
  if (userId === targetUserId) {
    return { allowed: true };
  }

  // 2. 관리자는 모든 항목 접근 가능
  const adminCheck = await checkAdmin(userId);
  if (adminCheck.allowed) {
    return { allowed: true };
  }

  return { 
    allowed: false, 
    reason: ErrorMessages.OWNER_ONLY 
  };
};

/**
 * 통합 권한 체크
 */
export const checkPermission = async (
  userId: string | null,
  options?: {
    targetUserId?: string;
    requireAdmin?: boolean;
  }
): Promise<PermissionResult> => {
  // 1. 로그인 체크
  const loginCheck = checkLogin(userId);
  if (!loginCheck.allowed) {
    return loginCheck;
  }

  // 2. 관리자 체크 (필요 시)
  if (options?.requireAdmin) {
    return checkAdmin(userId!);
  }

  // 3. 작성자 체크 (필요 시)
  if (options?.targetUserId) {
    return checkOwner(userId!, options.targetUserId);
  }

  return { allowed: true };
};
```

### 2. 역할 기반 체크 (향후 확장용)

```typescript
// lib/utils/permissions.ts

/**
 * 특정 역할 체크 (확장 가능)
 */
export const checkRole = async (
  userId: string,
  requiredRole: UserRole
): Promise<PermissionResult> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return { 
        allowed: false, 
        reason: ErrorMessages.PERMISSION_DENIED 
      };
    }

    // 향후 역할 계층 구조 구현 가능
    // 예: super_admin > admin > moderator > vip > verified > user
    if (data.role !== requiredRole) {
      return { 
        allowed: false, 
        reason: ErrorMessages.PERMISSION_DENIED 
      };
    }

    return { allowed: true };
  } catch (err) {
    return { 
      allowed: false, 
      reason: ErrorMessages.UNKNOWN_ERROR 
    };
  }
};
```

### 3. 에러 메시지 추가

```typescript
// lib/constants/errorMessages.ts (기존에 추가)

export const ErrorMessages = {
  // ... 기존 메시지들
  
  // 권한 관련
  LOGIN_REQUIRED: '로그인이 필요합니다.',
  PERMISSION_DENIED: '권한이 없습니다.',
  ADMIN_ONLY: '관리자만 접근할 수 있습니다.',
  OWNER_ONLY: '작성자만 수정/삭제할 수 있습니다.',
};
```

---

## UI 보호 ✅ 확정

### 조건부 렌더링

```typescript
// components/PostActions.tsx

import { useAuth } from '@/lib/contexts/AuthContext';

export const PostActions = ({ post }) => {
  const { user } = useAuth();
  
  // 작성자 또는 관리자만 수정/삭제 버튼 표시
  const canEdit = user?.id === post.user_id || user?.role === 'admin';

  return (
    <View>
      {/* 좋아요는 로그인 사용자만 */}
      {user && <LikeButton postId={post.id} />}
      
      {/* 수정/삭제는 작성자 또는 관리자만 */}
      {canEdit && (
        <>
          <Button onPress={handleEdit}>수정</Button>
          <Button onPress={handleDelete}>삭제</Button>
        </>
      )}
      
      {/* 신고는 로그인한 다른 사용자만 */}
      {user && user.id !== post.user_id && (
        <Button onPress={handleReport}>신고</Button>
      )}
    </View>
  );
};
```

---

## 라우트 보호 ✅ 확정

### 보호된 화면 (HOC 패턴)

```typescript
// lib/components/ProtectedRoute.tsx

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 로그인 체크
      if (!user) {
        Alert.alert('알림', ErrorMessages.LOGIN_REQUIRED);
        router.replace('/login');
        return;
      }

      // 관리자 체크
      if (requireAdmin && user.role !== 'admin') {
        Alert.alert('알림', ErrorMessages.ADMIN_ONLY);
        router.back();
        return;
      }
    }
  }, [user, loading, requireAdmin]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};
```

### 사용 예시

```typescript
// app/community/create.tsx

export default function CreatePostScreen() {
  return (
    <ProtectedRoute>
      <View>
        <Text>게시글 작성</Text>
        {/* ... */}
      </View>
    </ProtectedRoute>
  );
}

// app/admin/index.tsx

export default function AdminScreen() {
  return (
    <ProtectedRoute requireAdmin>
      <View>
        <Text>관리자 페이지</Text>
        {/* ... */}
      </View>
    </ProtectedRoute>
  );
}
```

---

## 사용 예시 ✅ 확정

### 1. 게시글 삭제 (서비스 레이어)

```typescript
// lib/services/communityService.ts

import { checkPermission } from '@/lib/utils/permissions';
import { ErrorMessages } from '@/lib/constants/errorMessages';

export const deleteCommunityPost = async (
  postId: string,
  userId: string
): Promise<ApiResponse<void>> => {
  try {
    // 1. 게시글 조회
    const { data: post, error: fetchError } = await supabase
      .from('community_posts')
      .select('user_id')
      .eq('id', postId)
      .single();

    if (fetchError || !post) {
      return { 
        success: false, 
        data: null, 
        error: ErrorMessages.NOT_FOUND 
      };
    }

    // 2. 권한 체크 (작성자 또는 관리자)
    const permission = await checkPermission(userId, {
      targetUserId: post.user_id
    });

    if (!permission.allowed) {
      return { 
        success: false, 
        data: null, 
        error: permission.reason 
      };
    }

    // 3. 소프트 삭제
    const { error } = await supabase
      .from('community_posts')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: userId
      })
      .eq('id', postId);

    if (error) {
      return { 
        success: false, 
        data: null, 
        error: ErrorMessages.DELETE_FAILED 
      };
    }

    return { success: true, data: null, error: null };
  } catch (err) {
    return { 
      success: false, 
      data: null, 
      error: ErrorMessages.UNKNOWN_ERROR 
    };
  }
};
```

### 2. 관리자 전용 기능 (UI)

```typescript
// app/community/[id].tsx

import { checkLogin, checkAdmin } from '@/lib/utils/permissions';

export default function PostDetailScreen() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const result = await checkAdmin(user.id);
        setIsAdmin(result.allowed);
      }
    };
    checkAdminStatus();
  }, [user]);

  const handleAdminAction = async () => {
    // 관리자 확인
    if (!user) {
      Alert.alert('알림', ErrorMessages.LOGIN_REQUIRED);
      return;
    }

    const permission = await checkAdmin(user.id);
    if (!permission.allowed) {
      Alert.alert('알림', permission.reason);
      return;
    }

    // 관리자 작업 진행...
  };

  return (
    <View>
      {/* 일반 내용 */}
      
      {/* 관리자 전용 버튼 */}
      {isAdmin && (
        <View>
          <Button onPress={handleAdminAction}>관리자 기능</Button>
        </View>
      )}
    </View>
  );
}
```

### 3. 로그인 필요 기능 (간단한 체크)

```typescript
// components/LikeButton.tsx

import { checkLogin } from '@/lib/utils/permissions';

export const LikeButton = ({ postId }) => {
  const { user } = useAuth();

  const handleLike = async () => {
    // 로그인 체크
    const loginCheck = checkLogin(user?.id);
    if (!loginCheck.allowed) {
      Alert.alert('알림', loginCheck.reason, [
        { text: '취소', style: 'cancel' },
        { text: '로그인', onPress: () => router.push('/login') }
      ]);
      return;
    }

    // 좋아요 진행...
    const result = await likePost(postId, user!.id);
  };

  return (
    <TouchableOpacity onPress={handleLike}>
      <Icon name="heart" />
    </TouchableOpacity>
  );
};
```

---

## ✅ 최종 확정 요약

### 핵심 결정 사항

1. **권한 레벨**
   - ✅ 현재: `user`, `admin`
   - ✅ 확장 가능: 타입 기반 설계
   - 향후: `verified`, `vip`, `moderator` 등 추가 가능

2. **권한 체크 함수**
   - ✅ `checkLogin()` - 로그인 체크
   - ✅ `checkAdmin()` - 관리자 체크
   - ✅ `checkOwner()` - 작성자 체크 (관리자는 예외)
   - ✅ `checkPermission()` - 통합 체크
   - ✅ `checkRole()` - 역할 기반 체크 (확장용)

3. **UI 보호**
   - ✅ 조건부 렌더링
   - ✅ 역할에 따른 버튼 표시/숨김

4. **라우트 보호**
   - ✅ `ProtectedRoute` HOC
   - ✅ 로그인 필요 화면
   - ✅ 관리자 전용 화면

5. **에러 메시지**
   - ✅ 다국어 대비 상수 사용
   - `LOGIN_REQUIRED`, `ADMIN_ONLY`, `OWNER_ONLY`

---

**모든 권한 체크는 이 패턴을 사용합니다.**


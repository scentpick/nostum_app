# 수동 프로필 생성 가이드

## 🎯 문제
Google 로그인은 성공했지만 `profiles` 테이블에 자동으로 생성되지 않았습니다.

## ✅ 해결 방법

### 방법 1: 브라우저 콘솔에서 생성 (추천)

1. **앱이 실행 중인 브라우저에서 개발자 도구 열기**
   - Chrome/Edge: F12 또는 Ctrl+Shift+I (Mac: Cmd+Option+I)
   - Console 탭으로 이동

2. **다음 코드를 붙여넣고 Enter:**

```javascript
(async () => {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  
  const supabase = createClient(
    'https://wrdsumdjamvsdxjwnpdx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I'
  );
  
  // 현재 사용자 확인
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.log('❌ 로그인된 사용자가 없습니다.');
    return;
  }
  
  console.log('✅ 로그인 확인:', user.email);
  
  // 프로필 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  
  if (profile) {
    console.log('✅ 프로필이 이미 존재합니다:', profile.nickname);
    return;
  }
  
  // 프로필 생성
  const { data: newProfile, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      nickname: user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자',
      google_id: user.user_metadata?.sub,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    })
    .select()
    .single();
  
  if (insertError) {
    console.error('❌ 프로필 생성 실패:', insertError);
  } else {
    console.log('✅ 프로필 생성 완료:', newProfile.nickname);
    console.log('이제 페이지를 새로고침하세요!');
  }
})();
```

3. **결과 확인**
   - `✅ 프로필 생성 완료` 메시지가 나타나면 성공
   - 페이지 새로고침 (F5)

### 방법 2: Supabase 대시보드에서 직접 생성

1. **Supabase 대시보드 → Table Editor → profiles**

2. **Insert row 클릭**

3. **다음 정보 입력:**
   - `id`: 로그인한 사용자의 UUID (auth.users에서 확인)
   - `nickname`: 원하는 닉네임
   - `role`: `user` (또는 `admin`)
   - 나머지 필드는 선택사항

4. **Save**

### 방법 3: SQL Editor에서 생성

Supabase 대시보드 → SQL Editor에서 실행:

```sql
-- 먼저 auth.users에서 사용자 ID 확인
SELECT id, email, raw_user_meta_data 
FROM auth.users;

-- 위에서 확인한 ID를 사용하여 프로필 생성
INSERT INTO profiles (id, nickname, role)
VALUES ('여기에-사용자-UUID', '테스트유저', 'user')
ON CONFLICT (id) DO NOTHING;
```

## 🔧 근본적인 해결 방법

`AuthContext.tsx`의 프로필 자동 생성 로직을 수정해야 합니다:

```typescript
// lib/contexts/AuthContext.tsx의 68~71줄
const { data: profileData } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', data.user.id)
  .maybeSingle(); // .single() 대신 .maybeSingle() 사용 (이미 수정됨)
```

이 부분이 `.single()`이면 에러가 발생할 수 있습니다.

## ✅ 확인

프로필 생성 후, 터미널에서 확인:

```bash
node database/create_test_posts_simple.js
```

"기존 사용자 1명 발견" 메시지가 나타나면 성공!


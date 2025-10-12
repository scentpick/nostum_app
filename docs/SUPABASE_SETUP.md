# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

### 1.1 프로젝트 생성
1. [Supabase 대시보드](https://supabase.com/dashboard)에 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Organization**: 기존 조직 선택 또는 새로 생성
   - **Project Name**: `nostum-app`
   - **Database Password**: 강력한 비밀번호 설정 (기억해두세요!)
   - **Region**: `Northeast Asia (Seoul)` 선택

### 1.2 프로젝트 정보 확인
프로젝트 생성 완료 후:
1. **Settings > API** 메뉴로 이동
2. **Project URL** 복사 (예: `https://your-project-id.supabase.co`)
3. **anon public** 키 복사

## 2. 환경변수 설정

### 2.1 .env 파일 생성
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_public_key_here

# Google Sign-In (Optional)
GOOGLE_WEB_CLIENT_ID=your_google_web_client_id_here
GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id_here
GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id_here
```

### 2.2 .env 파일을 .gitignore에 추가
```gitignore
# Environment variables
.env
```

## 3. 데이터베이스 설정

### 3.1 스키마 생성
1. Supabase 대시보드에서 **SQL Editor** 메뉴로 이동
2. `database/schema.sql` 파일의 내용을 복사하여 실행
3. 모든 테이블과 인덱스가 생성되었는지 확인

### 3.2 초기 데이터 삽입
1. **SQL Editor**에서 `database/seed_data.sql` 파일의 내용을 복사하여 실행
2. 샘플 데이터가 정상적으로 삽입되었는지 확인

### 3.3 RLS (Row Level Security) 설정 확인
1. **Authentication > Policies** 메뉴에서 RLS 정책이 적용되었는지 확인
2. 필요에 따라 추가 정책 설정

## 4. Storage 설정 (이미지 업로드용)

### 4.1 Storage 버킷 생성
1. **Storage** 메뉴로 이동
2. "New bucket" 클릭
3. 버킷 이름: `perfume-images`
4. Public bucket으로 설정

### 4.2 Storage 정책 설정
```sql
-- 모든 사용자가 이미지 조회 가능
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'perfume-images');

-- 인증된 사용자만 이미지 업로드 가능
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'perfume-images' AND 
  auth.role() = 'authenticated'
);

-- 사용자는 자신이 업로드한 이미지만 삭제 가능
CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'perfume-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 5. 연결 테스트

### 5.1 Supabase 클라이언트 연결 확인
```typescript
import { supabase } from './lib/supabase/client';

// 연결 테스트
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase 연결 오류:', error);
    } else {
      console.log('Supabase 연결 성공:', data);
    }
  } catch (err) {
    console.error('연결 테스트 실패:', err);
  }
};
```

## 6. 다음 단계

1. **TypeScript 타입 정의** - 데이터베이스 스키마에 맞는 타입 생성
2. **API 서비스 레이어** - CRUD 작업을 담당하는 서비스 함수 구현
3. **인증 시스템** - 사용자 로그인/회원가입 구현
4. **실제 데이터 연동** - UI 컴포넌트와 데이터베이스 연결

## 문제 해결

### 일반적인 문제들
1. **연결 오류**: 환경변수가 올바르게 설정되었는지 확인
2. **RLS 오류**: 적절한 정책이 설정되었는지 확인
3. **타입 오류**: TypeScript 타입 정의가 올바른지 확인

### 도움말
- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript 클라이언트](https://supabase.com/docs/reference/javascript)
- [RLS 정책 가이드](https://supabase.com/docs/guides/auth/row-level-security)
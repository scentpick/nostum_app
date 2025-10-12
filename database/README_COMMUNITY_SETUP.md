# 커뮤니티 기능 설정 가이드

## 🎯 목표
커뮤니티 기능 개발을 위한 데이터베이스 설정 및 테스트 데이터 생성

## 📋 순서

### 1️⃣ 데이터베이스 스키마 확장

#### Step 1: role 컬럼 추가
Supabase 대시보드 → SQL Editor에서 실행:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
```

#### Step 2: 전체 스키마 확장 (나중에 실행)
`expand_community_schema.sql` 파일을 Supabase SQL Editor에서 실행

이 파일에는 다음이 포함됩니다:
- reports 테이블 (신고 시스템)
- drafts 테이블 (게시글 임시저장)
- post_likes, comment_likes 테이블 (좋아요 시스템)
- 소프트 삭제를 위한 컬럼들
- 인덱스 최적화
- RLS 정책

### 2️⃣ 테스트 데이터 생성

#### 사전 요구사항
✅ 앱에서 Google 로그인 완료 (profiles 테이블에 사용자 생성)

#### 실행 방법
```bash
cd database
node create_test_posts_simple.js
```

이 스크립트는:
1. 기존 사용자 확인
2. 카테고리 확인
3. 테스트 게시글 3~5개 생성
4. 결과 출력

### 3️⃣ 확인

#### 데이터베이스에서 확인
Supabase 대시보드 → Table Editor → community_posts

#### 앱에서 확인
커뮤니티 탭에서 게시글 목록 확인

## 📁 파일 설명

| 파일명 | 설명 |
|--------|------|
| `add_role_column.sql` | profiles 테이블에 role 컬럼 추가 (우선 실행) |
| `expand_community_schema.sql` | 전체 커뮤니티 스키마 확장 (나중에 실행) |
| `create_test_posts_simple.js` | 간단한 테스트 게시글 생성 스크립트 |
| `create_community_test_data.js` | 전체 테스트 데이터 생성 (사용자 포함) |

## ⚠️ 주의사항

1. **profiles 테이블은 auth.users를 참조**합니다
   - 직접 임의의 UUID로 사용자를 생성할 수 없습니다
   - 반드시 Google 로그인 등을 통해 실제 사용자를 먼저 생성해야 합니다

2. **RLS (Row Level Security) 정책**
   - Supabase는 기본적으로 RLS가 활성화되어 있습니다
   - 테스트 데이터 생성 시 anon 키를 사용하므로 제한이 있을 수 있습니다
   - 필요시 service_role 키를 사용하거나 RLS 정책을 조정해야 합니다

3. **데이터베이스 변경 순서**
   - 먼저 `add_role_column.sql` 실행
   - 앱에서 로그인
   - 테스트 데이터 생성
   - 나중에 `expand_community_schema.sql` 실행 (추가 기능 구현 시)

## 🚀 빠른 시작

```bash
# 1. Supabase에서 role 컬럼 추가
# (SQL Editor에서 add_role_column.sql 실행)

# 2. 앱 실행 및 로그인
cd /Users/macel/Documents/nostum/cursor\ app/nostum_app
npx expo start --web

# 3. 로그인 후, 새 터미널에서 테스트 데이터 생성
cd /Users/macel/Documents/nostum/cursor\ app/nostum_app/database
node create_test_posts_simple.js

# 4. 앱의 커뮤니티 탭에서 확인
```

## 📞 문제 해결

### Q: "사용자가 없습니다" 에러가 나요
**A:** 앱에서 Google 로그인을 먼저 진행해주세요.

### Q: "Could not find the 'role' column" 에러가 나요
**A:** `add_role_column.sql`을 Supabase SQL Editor에서 실행해주세요.

### Q: "violates row-level security policy" 에러가 나요
**A:** 이것은 정상입니다. 로그인한 사용자만 자신의 게시글을 생성할 수 있습니다.

## ✅ TODO

현재 진행 상황:
- [x] SQL 스크립트 작성
- [x] 테스트 데이터 생성 스크립트 작성
- [ ] role 컬럼 추가 (Supabase에서 실행 필요)
- [ ] 앱에서 로그인
- [ ] 테스트 데이터 생성
- [ ] 커뮤니티 화면에서 확인


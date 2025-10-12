-- ================================================
-- 전체 스키마 상태 확인 및 누락 요소 진단 (통합 결과)
-- 작성일: 2025-10-12
-- ================================================

WITH 
-- 1. 현재 존재하는 테이블 목록
existing_tables AS (
  SELECT table_name,
         CASE WHEN table_name IN (
           'profiles', 'perfumes', 'brands', 'accords', 'fragrance_wheel',
           'user_favorites', 'perfume_calendar', 'perfume_feedback', 'reviews',
           'community_posts', 'post_comments', 'post_likes', 'comment_likes',
           'drafts', 'reports', 'notifications', 'search_history',
           'chatbot_conversations', 'chatbot_messages'
         ) THEN '✅ 계획된 테이블' ELSE '⚠️ 추가 테이블' END as status
  FROM information_schema.tables 
  WHERE table_schema = 'public'
),

-- 2. 누락된 테이블 목록
expected_tables AS (
  SELECT unnest(ARRAY[
    'profiles', 'perfumes', 'brands', 'accords', 'fragrance_wheel',
    'user_favorites', 'perfume_calendar', 'perfume_feedback', 'reviews',
    'community_posts', 'post_comments', 'post_likes', 'comment_likes',
    'drafts', 'reports', 'notifications', 'search_history',
    'chatbot_conversations', 'chatbot_messages'
  ]) as table_name
),
missing_tables AS (
  SELECT et.table_name, '❌ 누락됨' as status
  FROM expected_tables et
  LEFT JOIN existing_tables ext ON et.table_name = ext.table_name
  WHERE ext.table_name IS NULL
),

-- 3. 소프트 삭제 컬럼 상태
soft_delete_status AS (
  SELECT 
    sdt.table_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = sdt.table_name 
        AND column_name = 'is_deleted'
    ) THEN '✅' ELSE '❌' END as is_deleted,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = sdt.table_name 
        AND column_name = 'deleted_at'
    ) THEN '✅' ELSE '❌' END as deleted_at,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = sdt.table_name 
        AND column_name = 'deleted_by'
    ) THEN '✅' ELSE '❌' END as deleted_by
  FROM (
    SELECT unnest(ARRAY[
      'community_posts', 'post_comments', 'reviews', 'profiles', 'perfumes'
    ]) as table_name
  ) sdt
),

-- 4. profiles 추가 컬럼 상태
profile_columns_status AS (
  SELECT 
    epc.column_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = epc.column_name
    ) THEN '✅' ELSE '❌' END as status
  FROM (
    SELECT unnest(ARRAY[
      'nickname_updated_at', 'email_notifications', 'notification_type',
      'notification_interval', 'notification_time', 'last_login_at'
    ]) as column_name
  ) epc
),

-- 5. pg_trgm 확장 상태
extension_status AS (
  SELECT 
    CASE WHEN EXISTS (
      SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm'
    ) THEN '✅ pg_trgm 설치됨' ELSE '❌ pg_trgm 미설치' END as pg_trgm_status
)

-- 최종 통합 결과 출력
SELECT 
  '테이블 상태' as category,
  '현재 존재하는 테이블' as item,
  table_name as name,
  status as result
FROM existing_tables

UNION ALL

SELECT 
  '테이블 상태' as category,
  '누락된 테이블' as item,
  table_name as name,
  status as result
FROM missing_tables

UNION ALL

SELECT 
  '소프트 삭제' as category,
  table_name as item,
  'is_deleted' as name,
  is_deleted as result
FROM soft_delete_status

UNION ALL

SELECT 
  '소프트 삭제' as category,
  table_name as item,
  'deleted_at' as name,
  deleted_at as result
FROM soft_delete_status

UNION ALL

SELECT 
  '소프트 삭제' as category,
  table_name as item,
  'deleted_by' as name,
  deleted_by as result
FROM soft_delete_status

UNION ALL

SELECT 
  'profiles 컬럼' as category,
  '추가 컬럼' as item,
  column_name as name,
  status as result
FROM profile_columns_status

UNION ALL

SELECT 
  '확장' as category,
  'pg_trgm' as item,
  '설치 상태' as name,
  pg_trgm_status as result
FROM extension_status

ORDER BY category, item, name;

-- ================================================
-- 결과 해석 가이드:
-- 1. 누락된 테이블이 있으면 01_add_new_tables.sql 재실행 필요
-- 2. 소프트 삭제 컬럼이 누락된 테이블이 있으면 수정 필요
-- 3. profiles 추가 컬럼이 누락되면 02_update_existing_tables.sql 재실행 필요
-- 4. GIN 인덱스가 없으면 03_create_search_indexes.sql 실행 필요
-- 5. pg_trgm이 없으면 확장 설치 필요
-- ================================================

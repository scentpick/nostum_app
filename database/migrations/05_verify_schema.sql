-- ================================================
-- 스키마 검증 (통합 결과 테이블)
-- 작성일: 2025-10-12
-- ================================================

WITH 
-- 1. 테이블 존재 확인
expected_tables AS (
  SELECT unnest(ARRAY[
    'profiles', 'perfumes', 'brands', 'accords', 'fragrance_wheel',
    'user_favorites', 'perfume_calendar', 'perfume_feedback', 'reviews',
    'community_posts', 'post_comments', 'post_likes', 'comment_likes',
    'drafts', 'reports', 'notifications', 'search_history',
    'chatbot_conversations', 'chatbot_messages'
  ]) as table_name
),
table_status AS (
  SELECT 
    et.table_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = et.table_name
    ) THEN '✅ 존재함' ELSE '❌ 누락됨' END as status
  FROM expected_tables et
),

-- 2. profiles 테이블 컬럼 확인
expected_profile_columns AS (
  SELECT unnest(ARRAY[
    'id', 'nickname', 'avatar_url', 'google_id', 'role',
    'nickname_updated_at', 'email_notifications', 'notification_type',
    'notification_interval', 'notification_time', 'last_login_at',
    'is_deleted', 'deleted_at', 'deleted_by',
    'created_at', 'updated_at'
  ]) as column_name
),
profile_columns_status AS (
  SELECT 
    epc.column_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = epc.column_name
    ) THEN '✅ 존재함' ELSE '❌ 누락됨' END as status
  FROM expected_profile_columns epc
),

-- 3. 소프트 삭제 컬럼 확인
soft_delete_tables AS (
  SELECT unnest(ARRAY[
    'community_posts', 'post_comments', 'reviews', 'profiles', 'perfumes'
  ]) as table_name
),
soft_delete_columns AS (
  SELECT unnest(ARRAY['is_deleted', 'deleted_at', 'deleted_by']) as column_name
),
soft_delete_status AS (
  SELECT 
    sdt.table_name,
    sdc.column_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = sdt.table_name 
        AND column_name = sdc.column_name
    ) THEN '✅ 존재함' ELSE '❌ 누락됨' END as status
  FROM soft_delete_tables sdt
  CROSS JOIN soft_delete_columns sdc
),

-- 4. 인덱스 확인
expected_indexes AS (
  SELECT unnest(ARRAY[
    'idx_user_favorites_user_category',
    'idx_user_favorites_perfume',
    'idx_perfume_calendar_user_date',
    'idx_perfume_calendar_perfume',
    'idx_reviews_perfume_id',
    'idx_reviews_user_id',
    'idx_post_likes_post_user',
    'idx_comment_likes_comment_user',
    'idx_community_posts_category',
    'idx_community_posts_user',
    'idx_post_comments_post',
    'idx_post_comments_user',
    'idx_post_comments_parent',
    'idx_fragrance_wheel_perfume'
  ]) as index_name
),
index_status AS (
  SELECT 
    ei.index_name,
    CASE WHEN EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE schemaname = 'public' AND indexname = ei.index_name
    ) THEN '✅ 존재함' ELSE '❌ 누락됨' END as status
  FROM expected_indexes ei
),

-- 5. pg_trgm 확장 확인
extension_status AS (
  SELECT 
    CASE WHEN EXISTS (
      SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm'
    ) THEN '✅ pg_trgm 설치됨' ELSE '❌ pg_trgm 미설치' END as status
)

-- 최종 통합 결과 출력
SELECT 
  '테이블' as category,
  table_name as item,
  '존재 여부' as name,
  status as result
FROM table_status

UNION ALL

SELECT 
  'profiles 컬럼' as category,
  column_name as item,
  '존재 여부' as name,
  status as result
FROM profile_columns_status

UNION ALL

SELECT 
  '소프트 삭제' as category,
  table_name as item,
  column_name as name,
  status as result
FROM soft_delete_status

UNION ALL

SELECT 
  '인덱스' as category,
  index_name as item,
  '존재 여부' as name,
  status as result
FROM index_status

UNION ALL

SELECT 
  '확장' as category,
  'pg_trgm' as item,
  '설치 상태' as name,
  status as result
FROM extension_status

ORDER BY category, item, name;

-- ================================================
-- 검증 결과 요약
-- ================================================
WITH 
summary_stats AS (
  SELECT 
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN (
      'profiles', 'perfumes', 'brands', 'accords', 'fragrance_wheel',
      'user_favorites', 'perfume_calendar', 'perfume_feedback', 'reviews',
      'community_posts', 'post_comments', 'post_likes', 'comment_likes',
      'drafts', 'reports', 'notifications', 'search_history',
      'chatbot_conversations', 'chatbot_messages'
    )) as tables_created,
    19 as total_tables,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles') as profile_columns,
    16 as expected_profile_columns,
    (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%') as indexes_created,
    14 as expected_indexes
)
SELECT 
  '=== 검증 요약 ===' as category,
  '테이블 생성' as item,
  CONCAT(tables_created, '/', total_tables) as name,
  CASE WHEN tables_created = total_tables THEN '✅ 완료' ELSE '⚠️ 일부 누락' END as result
FROM summary_stats

UNION ALL

SELECT 
  '=== 검증 요약 ===' as category,
  'profiles 컬럼' as item,
  CONCAT(profile_columns, '/', expected_profile_columns) as name,
  CASE WHEN profile_columns >= expected_profile_columns THEN '✅ 완료' ELSE '⚠️ 일부 누락' END as result
FROM summary_stats

UNION ALL

SELECT 
  '=== 검증 요약 ===' as category,
  '인덱스 생성' as item,
  CONCAT(indexes_created, '/', expected_indexes) as name,
  CASE WHEN indexes_created >= expected_indexes THEN '✅ 완료' ELSE '⚠️ 일부 누락' END as result
FROM summary_stats

ORDER BY category, item, name;

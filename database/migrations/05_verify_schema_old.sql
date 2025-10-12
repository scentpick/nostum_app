-- ================================================
-- Nostum 앱 - 스키마 검증 쿼리
-- 작성일: 2025-10-12
-- 참조: docs/DATABASE_SCHEMA_FINAL.md
-- ================================================

-- ================================================
-- 1. 모든 테이블 존재 확인
-- ================================================

DO $$
DECLARE
  expected_tables TEXT[] := ARRAY[
    'profiles',
    'user_favorites',
    'perfume_calendar',
    'brands',
    'perfumes',
    'perfume_notes',
    'accords',
    'perfume_accords',
    'reviews',
    'perfume_feedback',
    'board_categories',
    'community_posts',
    'post_comments',
    'post_likes',
    'comment_likes',
    'review_helpful',
    'drafts',
    'reports',
    'notifications',
    'search_history',
    'chatbot_conversations',
    'chatbot_messages'
  ];
  current_table TEXT;
  missing_tables TEXT[] := ARRAY[]::TEXT[];
BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE '테이블 존재 확인 시작...';
  RAISE NOTICE '================================================';
  
  FOREACH current_table IN ARRAY expected_tables
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = current_table
    ) THEN
      missing_tables := array_append(missing_tables, current_table);
      RAISE WARNING '❌ 테이블 없음: %', current_table;
    ELSE
      RAISE NOTICE '✅ %', current_table;
    END IF;
  END LOOP;
  
  IF array_length(missing_tables, 1) > 0 THEN
    RAISE EXCEPTION '누락된 테이블: %', array_to_string(missing_tables, ', ');
  ELSE
    RAISE NOTICE '================================================';
    RAISE NOTICE '모든 테이블 존재 확인 완료! (22개)';
    RAISE NOTICE '================================================';
  END IF;
END $$;

-- ================================================
-- 2. profiles 테이블 컬럼 확인
-- ================================================

DO $$
DECLARE
  expected_columns TEXT[] := ARRAY[
    'id',
    'nickname',
    'avatar_url',
    'google_id',
    'role',
    'nickname_updated_at',
    'email_notifications',
    'notification_type',
    'notification_interval',
    'notification_time',
    'last_login_at',
    'created_at',
    'updated_at'
  ];
  current_column TEXT;
  missing_columns TEXT[] := ARRAY[]::TEXT[];
BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE 'profiles 테이블 컬럼 확인...';
  RAISE NOTICE '================================================';
  
  FOREACH current_column IN ARRAY expected_columns
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = current_column
    ) THEN
      missing_columns := array_append(missing_columns, current_column);
      RAISE WARNING '❌ 컬럼 없음: profiles.%', current_column;
    ELSE
      RAISE NOTICE '✅ profiles.%', current_column;
    END IF;
  END LOOP;
  
  IF array_length(missing_columns, 1) > 0 THEN
    RAISE EXCEPTION 'profiles 누락된 컬럼: %', array_to_string(missing_columns, ', ');
  ELSE
    RAISE NOTICE '================================================';
    RAISE NOTICE 'profiles 컬럼 확인 완료!';
    RAISE NOTICE '================================================';
  END IF;
END $$;

-- ================================================
-- 3. 소프트 삭제 컬럼 확인
-- ================================================

DO $$
DECLARE
  tables_with_soft_delete TEXT[] := ARRAY['community_posts', 'post_comments', 'reviews'];
  current_table TEXT;
  soft_delete_columns TEXT[] := ARRAY['is_deleted', 'deleted_at', 'deleted_by'];
  current_column TEXT;
BEGIN
  RAISE NOTICE '================================================';
  RAISE NOTICE '소프트 삭제 컬럼 확인...';
  RAISE NOTICE '================================================';
  
  FOREACH current_table IN ARRAY tables_with_soft_delete
  LOOP
    RAISE NOTICE '테이블: %', current_table;
    FOREACH current_column IN ARRAY soft_delete_columns
    LOOP
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = current_table 
          AND column_name = current_column
      ) THEN
        RAISE WARNING '❌ 컬럼 없음: %.%', current_table, current_column;
      ELSE
        RAISE NOTICE '  ✅ %', current_column;
      END IF;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE '================================================';
  RAISE NOTICE '소프트 삭제 컬럼 확인 완료!';
  RAISE NOTICE '================================================';
END $$;

-- ================================================
-- 4. 인덱스 존재 확인
-- ================================================

SELECT 
  tablename AS "테이블",
  indexname AS "인덱스명",
  indexdef AS "정의"
FROM pg_indexes
WHERE schemaname = 'public'
  AND (
    indexname LIKE '%_gin' OR 
    indexname LIKE 'idx_%'
  )
ORDER BY tablename, indexname;

-- ================================================
-- 5. 통계 요약
-- ================================================

DO $$
DECLARE
  table_count INTEGER;
  index_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE schemaname = 'public';
  
  RAISE NOTICE '================================================';
  RAISE NOTICE '스키마 검증 완료!';
  RAISE NOTICE '- 총 테이블 수: %', table_count;
  RAISE NOTICE '- 총 인덱스 수: %', index_count;
  RAISE NOTICE '================================================';
  RAISE NOTICE '모든 마이그레이션이 성공적으로 적용되었습니다! ✅';
  RAISE NOTICE '================================================';
END $$;


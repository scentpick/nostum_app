const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestPosts() {
  try {
    console.log('🔍 테스트 게시글 생성 시작...');

    // 테스트용 게시글 데이터
    const testPosts = [
      {
        user_id: '00000000-0000-0000-0000-000000000001', // 테스트 사용자 ID
        category_id: 1, // 향수게시판
        title: '제목 1',
        content: '내용 1 - 향수에 대한 첫 번째 게시글입니다. 좋은 향수를 추천해주세요!',
        view_count: 15,
        like_count: 3,
        comment_count: 2,
        image_urls: null
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001', // 테스트 사용자 ID
        category_id: 2, // 자유게시판
        title: '제목 2',
        content: '내용 2 - 자유게시판에 올리는 두 번째 게시글입니다. 오늘 날씨가 좋네요.',
        view_count: 8,
        like_count: 1,
        comment_count: 0,
        image_urls: null
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001', // 테스트 사용자 ID
        category_id: 1, // 향수게시판
        title: '제목 3',
        content: '내용 3 - 세 번째 게시글입니다. 새로운 향수를 발견했어요! 여러분도 한번 써보세요.',
        view_count: 23,
        like_count: 7,
        comment_count: 5,
        image_urls: null
      }
    ];

    console.log('📝 게시글 데이터:', testPosts);

    // 게시글 삽입
    const { data, error } = await supabase
      .from('community_posts')
      .insert(testPosts)
      .select('*');

    if (error) {
      console.error('❌ 게시글 생성 실패:', error);
      return;
    }

    console.log('✅ 테스트 게시글 생성 성공!');
    console.log('📊 생성된 게시글:', data);

    // 생성된 게시글 목록 조회
    const { data: posts, error: fetchError } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:profiles(*),
        category:board_categories(*)
      `)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ 게시글 조회 실패:', fetchError);
      return;
    }

    console.log('📋 전체 게시글 목록:', posts?.length, '개');
    posts?.forEach((post, index) => {
      console.log(`${index + 1}. [${post.category?.name || '일반'}] ${post.title} - ${post.user?.nickname || '익명'}`);
    });

  } catch (err) {
    console.error('❌ 예외 발생:', err);
  }
}

// 스크립트 실행
createTestPosts();

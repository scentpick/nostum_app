const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTestData() {
  try {
    console.log('🚀 테스트 데이터 설정 시작...\n');

    // 1. 카테고리 생성
    console.log('📂 1단계: 카테고리 생성');
    const testCategories = [
      { id: 1, name: '향수게시판', description: '향수에 대한 이야기를 나누는 공간입니다', order_index: 1 },
      { id: 2, name: '자유게시판', description: '자유롭게 이야기를 나누는 공간입니다', order_index: 2 },
      { id: 3, name: '메거진', description: '향수 관련 매거진과 리뷰를 공유하는 공간입니다', order_index: 3 },
      { id: 4, name: '이벤트', description: '향수 관련 이벤트 정보를 공유하는 공간입니다', order_index: 4 },
      { id: 5, name: '공지사항', description: '중요한 공지사항을 확인하는 공간입니다', order_index: 5 }
    ];

    const { error: categoryError } = await supabase
      .from('board_categories')
      .upsert(testCategories, { onConflict: 'id', ignoreDuplicates: false });

    if (categoryError) {
      console.error('❌ 카테고리 생성 실패:', categoryError);
      return;
    }
    console.log('✅ 카테고리 생성 완료\n');

    // 2. 테스트 프로필 생성
    console.log('👤 2단계: 테스트 프로필 생성');
    const testProfile = {
      id: '00000000-0000-0000-0000-000000000001',
      nickname: '테스트유저',
      bio: '향수 테스트를 위한 계정입니다',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(testProfile, { onConflict: 'id', ignoreDuplicates: false });

    if (profileError) {
      console.error('❌ 프로필 생성 실패:', profileError);
      return;
    }
    console.log('✅ 테스트 프로필 생성 완료\n');

    // 3. 테스트 게시글 생성
    console.log('📝 3단계: 테스트 게시글 생성');
    const testPosts = [
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        category_id: 1,
        title: '제목 1',
        content: '내용 1 - 향수에 대한 첫 번째 게시글입니다. 좋은 향수를 추천해주세요!',
        view_count: 15,
        like_count: 3,
        comment_count: 2,
        image_urls: null
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        category_id: 2,
        title: '제목 2',
        content: '내용 2 - 자유게시판에 올리는 두 번째 게시글입니다. 오늘 날씨가 좋네요.',
        view_count: 8,
        like_count: 1,
        comment_count: 0,
        image_urls: null
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        category_id: 1,
        title: '제목 3',
        content: '내용 3 - 세 번째 게시글입니다. 새로운 향수를 발견했어요! 여러분도 한번 써보세요.',
        view_count: 23,
        like_count: 7,
        comment_count: 5,
        image_urls: null
      }
    ];

    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .insert(testPosts)
      .select('*');

    if (postsError) {
      console.error('❌ 게시글 생성 실패:', postsError);
      return;
    }
    console.log('✅ 테스트 게시글 생성 완료\n');

    // 4. 결과 확인
    console.log('📋 4단계: 결과 확인');
    const { data: allPosts, error: fetchError } = await supabase
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

    console.log('📊 생성된 게시글 목록:');
    allPosts?.forEach((post, index) => {
      console.log(`${index + 1}. [${post.category?.name || '일반'}] ${post.title} - ${post.user?.nickname || '익명'}`);
      console.log(`   조회: ${post.view_count}, 좋아요: ${post.like_count}, 댓글: ${post.comment_count}`);
    });

    console.log('\n🎉 테스트 데이터 설정 완료!');
    console.log(`📈 총 ${allPosts?.length || 0}개의 게시글이 생성되었습니다.`);

  } catch (err) {
    console.error('❌ 예외 발생:', err);
  }
}

// 스크립트 실행
setupTestData();

const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestPosts() {
  try {
    console.log('🚀 테스트 게시글 생성 시작...\n');

    // 1. 기존 사용자 확인
    console.log('👤 1단계: 기존 사용자 확인');
    const { data: existingUsers, error: userError } = await supabase
      .from('profiles')
      .select('*');

    if (userError) {
      console.error('❌ 사용자 조회 실패:', userError);
      return;
    }

    if (!existingUsers || existingUsers.length === 0) {
      console.log('❌ 사용자가 없습니다.');
      console.log('💡 앱에서 Google 로그인을 먼저 진행해주세요.');
      console.log('💡 로그인 후 profiles 테이블에 사용자가 생성됩니다.');
      return;
    }

    console.log(`✅ 기존 사용자 ${existingUsers.length}명 발견`);
    existingUsers.forEach(user => {
      console.log(`  - ${user.nickname || '닉네임없음'} (ID: ${user.id})`);
    });

    // 첫 번째 사용자 사용
    const userId = existingUsers[0].id;
    console.log(`\n📝 사용자 "${existingUsers[0].nickname}"로 게시글 생성...\n`);

    // 2. 카테고리 확인
    console.log('📂 2단계: 카테고리 확인');
    const { data: categories, error: catError } = await supabase
      .from('board_categories')
      .select('*')
      .order('order_index');

    if (catError) {
      console.error('❌ 카테고리 조회 실패:', catError);
      return;
    }

    console.log(`✅ 카테고리 ${categories?.length || 0}개 발견`);
    categories?.forEach(cat => {
      console.log(`  - ${cat.name} (ID: ${cat.id})`);
    });

    const perfumeCategoryId = categories?.find(c => c.name === '향수게시판')?.id;
    const noticeCategoryId = categories?.find(c => c.name === '공지사항')?.id;

    if (!perfumeCategoryId || !noticeCategoryId) {
      console.log('❌ 필요한 카테고리가 없습니다.');
      return;
    }

    // 3. 테스트 게시글 생성
    console.log('\n📝 3단계: 테스트 게시글 생성');
    const testPosts = [
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '제목 1',
        content: '내용 1 - 향수에 대한 첫 번째 게시글입니다. 좋은 향수를 추천해주세요!',
        view_count: 15,
        like_count: 3,
        comment_count: 2,
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '제목 2',
        content: '내용 2 - 두 번째 향수 게시글입니다. 새로운 향수를 발견했어요! 여러분도 한번 써보세요.',
        view_count: 8,
        like_count: 1,
        comment_count: 0,
        image_urls: null
      },
      {
        user_id: userId,
        category_id: noticeCategoryId,
        title: '제목 3',
        content: '내용 3 - 공지사항입니다. 새로운 기능이 추가되었습니다.',
        view_count: 23,
        like_count: 7,
        comment_count: 5,
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '제목 4',
        content: '내용 4 - 네 번째 게시글입니다. 향수 추천을 받고 싶어요!',
        view_count: 5,
        like_count: 0,
        comment_count: 1,
        image_urls: null
      },
      {
        user_id: userId,
        category_id: noticeCategoryId,
        title: '제목 5',
        content: '내용 5 - 두 번째 공지사항입니다. 서비스 이용 안내입니다.',
        view_count: 12,
        like_count: 2,
        comment_count: 0,
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
    console.log(`✅ 테스트 게시글 ${posts?.length || 0}개 생성 완료\n`);

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

    console.log('\n🎉 테스트 데이터 생성 완료!');
    console.log(`📈 총 ${allPosts?.length || 0}개의 게시글이 생성되었습니다.`);

  } catch (err) {
    console.error('❌ 예외 발생:', err);
  }
}

// 스크립트 실행
createTestPosts();


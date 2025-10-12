const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCommunityTestData() {
  try {
    console.log('🚀 커뮤니티 테스트 데이터 생성 시작...\n');

    // 1. 카테고리 생성 (향수게시판, 공지사항만)
    console.log('📂 1단계: 카테고리 생성');
    const testCategories = [
      { id: '00000000-0000-0000-0000-000000000001', name: '향수게시판', description: '향수에 대한 이야기를 나누는 공간입니다', order_index: 1 },
      { id: '00000000-0000-0000-0000-000000000002', name: '공지사항', description: '중요한 공지사항을 확인하는 공간입니다', order_index: 2 }
    ];

    const { error: categoryError } = await supabase
      .from('board_categories')
      .upsert(testCategories, { onConflict: 'id', ignoreDuplicates: false });

    if (categoryError) {
      console.error('❌ 카테고리 생성 실패:', categoryError);
      return;
    }
    console.log('✅ 카테고리 생성 완료\n');

    // 2. 테스트 사용자 생성 (일반 사용자 + 관리자)
    console.log('👤 2단계: 테스트 사용자 생성');
    const testUsers = [
      {
        id: '00000000-0000-0000-0000-000000000001',
        nickname: '테스트유저',
        role: 'user',
        bio: '향수 테스트를 위한 일반 사용자 계정입니다'
      },
      {
        id: '00000000-0000-0000-0000-000000000000',
        nickname: '관리자',
        role: 'admin',
        bio: '시스템 관리자 계정입니다'
      }
    ];

    const { error: userError } = await supabase
      .from('profiles')
      .upsert(testUsers, { onConflict: 'id', ignoreDuplicates: false });

    if (userError) {
      console.error('❌ 사용자 생성 실패:', userError);
      return;
    }
    console.log('✅ 테스트 사용자 생성 완료\n');

    // 3. 테스트 게시글 생성
    console.log('📝 3단계: 테스트 게시글 생성');
    const testPosts = [
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        category_id: '00000000-0000-0000-0000-000000000001',
        title: '제목 1',
        content: '내용 1 - 향수에 대한 첫 번째 게시글입니다. 좋은 향수를 추천해주세요!',
        view_count: 15,
        like_count: 3,
        comment_count: 2,
        image_urls: null,
        is_deleted: false
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        category_id: '00000000-0000-0000-0000-000000000001',
        title: '제목 2',
        content: '내용 2 - 두 번째 향수 게시글입니다. 새로운 향수를 발견했어요! 여러분도 한번 써보세요.',
        view_count: 8,
        like_count: 1,
        comment_count: 0,
        image_urls: null,
        is_deleted: false
      },
      {
        user_id: '00000000-0000-0000-0000-000000000000',
        category_id: '00000000-0000-0000-0000-000000000002',
        title: '제목 3',
        content: '내용 3 - 공지사항입니다. 새로운 기능이 추가되었습니다.',
        view_count: 23,
        like_count: 7,
        comment_count: 5,
        image_urls: null,
        is_deleted: false
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        category_id: '00000000-0000-0000-0000-000000000001',
        title: '제목 4',
        content: '내용 4 - 네 번째 게시글입니다. 향수 추천을 받고 싶어요!',
        view_count: 5,
        like_count: 0,
        comment_count: 1,
        image_urls: null,
        is_deleted: false
      },
      {
        user_id: '00000000-0000-0000-0000-000000000000',
        category_id: '00000000-0000-0000-0000-000000000002',
        title: '제목 5',
        content: '내용 5 - 두 번째 공지사항입니다. 서비스 이용 안내입니다.',
        view_count: 12,
        like_count: 2,
        comment_count: 0,
        image_urls: null,
        is_deleted: false
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

    // 4. 테스트 댓글 생성
    console.log('💬 4단계: 테스트 댓글 생성');
    const testComments = [
      {
        post_id: posts[0].id,
        user_id: '00000000-0000-0000-0000-000000000000',
        parent_id: null,
        content: '좋은 향수 추천해드릴게요!',
        like_count: 1,
        is_deleted: false
      },
      {
        post_id: posts[0].id,
        user_id: '00000000-0000-0000-0000-000000000001',
        parent_id: null,
        content: '감사합니다!',
        like_count: 0,
        is_deleted: false
      },
      {
        post_id: posts[2].id,
        user_id: '00000000-0000-0000-0000-000000000001',
        parent_id: null,
        content: '새로운 기능 정말 기대됩니다!',
        like_count: 2,
        is_deleted: false
      }
    ];

    const { data: comments, error: commentsError } = await supabase
      .from('post_comments')
      .insert(testComments)
      .select('*');

    if (commentsError) {
      console.error('❌ 댓글 생성 실패:', commentsError);
      return;
    }
    console.log('✅ 테스트 댓글 생성 완료\n');

    // 5. 테스트 좋아요 생성
    console.log('❤️ 5단계: 테스트 좋아요 생성');
    const testLikes = [
      // 게시글 좋아요
      { user_id: '00000000-0000-0000-0000-000000000000', post_id: posts[0].id },
      { user_id: '00000000-0000-0000-0000-000000000001', post_id: posts[1].id },
      { user_id: '00000000-0000-0000-0000-000000000001', post_id: posts[2].id },
      // 댓글 좋아요
      { user_id: '00000000-0000-0000-0000-000000000001', comment_id: comments[0].id }
    ];

    const { error: likesError } = await supabase
      .from('post_likes')
      .insert(testLikes.filter(like => like.post_id));

    if (likesError) {
      console.error('❌ 게시글 좋아요 생성 실패:', likesError);
    } else {
      console.log('✅ 게시글 좋아요 생성 완료');
    }

    const { error: commentLikesError } = await supabase
      .from('comment_likes')
      .insert(testLikes.filter(like => like.comment_id));

    if (commentLikesError) {
      console.error('❌ 댓글 좋아요 생성 실패:', commentLikesError);
    } else {
      console.log('✅ 댓글 좋아요 생성 완료\n');
    }

    // 6. 결과 확인
    console.log('📋 6단계: 결과 확인');
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
      console.log(`   조회: ${post.view_count}, 좋아요: ${post.like_count}, 댓글: ${post.comment_count}, 권한: ${post.user?.role || 'user'}`);
    });

    console.log('\n🎉 커뮤니티 테스트 데이터 생성 완료!');
    console.log(`📈 총 ${allPosts?.length || 0}개의 게시글이 생성되었습니다.`);

  } catch (err) {
    console.error('❌ 예외 발생:', err);
  }
}

// 스크립트 실행
createCommunityTestData();

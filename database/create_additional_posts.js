const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdditionalPosts() {
  try {
    console.log('🚀 향수게시판 추가 테스트 데이터 생성 시작...\n');

    // 기존 사용자와 카테고리 확인
    const { data: users } = await supabase.from('profiles').select('*');
    const { data: categories } = await supabase.from('board_categories').select('*');
    
    if (!users || users.length === 0) {
      console.log('❌ 사용자가 없습니다.');
      return;
    }
    
    const userId = users[0].id;
    const perfumeCategoryId = categories?.find(c => c.name === '향수게시판')?.id;
    
    if (!perfumeCategoryId) {
      console.log('❌ 향수게시판 카테고리를 찾을 수 없습니다.');
      return;
    }
    
    console.log(`✅ 사용자: ${users[0].nickname}`);
    console.log(`✅ 향수게시판 카테고리 ID: ${perfumeCategoryId}\n`);

    // 추가 게시글 데이터 (12개 더 생성하여 총 15개)
    const additionalPosts = [
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '새로운 향수 발견!',
        content: '최근에 새로운 향수를 발견했는데 정말 좋네요. 여러분도 한번 써보세요!',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '향수 추천 부탁드려요',
        content: '여름에 어울리는 향수를 찾고 있어요. 시원하고 상쾌한 향이면 좋겠어요.',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '향수 지속력이 짧아요',
        content: '새로 산 향수가 지속력이 너무 짧아서 아쉬워요. 지속력 좋은 향수 추천해주세요.',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '프리미엄 향수 vs 일반 향수',
        content: '프리미엄 향수와 일반 향수의 차이점이 궁금해요. 가격 차이가 정말 나는지 궁금합니다.',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '향수 보관 방법',
        content: '향수를 어떻게 보관해야 지속력이 오래갈까요? 냉장고에 보관해도 될까요?',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '남성향수 추천',
        content: '남성분들께 추천하고 싶은 향수가 있어요. 우디하고 깔끔한 향이 좋을 것 같아요.',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '향수 알레르기',
        content: '향수에 알레르기가 있어서 걱정돼요. 알레르기 없는 천연 향수 추천해주세요.',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '시즌별 향수',
        content: '계절에 따라 다른 향수를 쓰는 게 맞나요? 봄, 여름, 가을, 겨울 각각 어떤 향이 좋을까요?',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '향수 셀프 체험',
        content: '온라인으로 향수를 사기 전에 어떻게 체험해볼 수 있을까요? 샘플을 받는 방법이 있나요?',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '향수 브랜드 이야기',
        content: '좋아하는 향수 브랜드가 있어요. 그 브랜드의 스토리와 특징을 공유하고 싶어요.',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '향수 조합 팁',
        content: '여러 향수를 조합해서 사용하는 방법이 있을까요? 어떤 향들이 잘 어울리는지 궁금해요.',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      },
      {
        user_id: userId,
        category_id: perfumeCategoryId,
        title: '향수 구매 후기',
        content: '최근에 구매한 향수에 대한 솔직한 후기를 남겨요. 장단점을 정리해봤습니다.',
        view_count: Math.floor(Math.random() * 50) + 10,
        like_count: Math.floor(Math.random() * 10),
        comment_count: Math.floor(Math.random() * 5),
        image_urls: null
      }
    ];

    console.log(`📝 추가 게시글 ${additionalPosts.length}개 생성 중...`);
    
    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .insert(additionalPosts)
      .select('*');

    if (postsError) {
      console.error('❌ 게시글 생성 실패:', postsError);
      return;
    }
    
    console.log(`✅ 추가 게시글 ${posts?.length || 0}개 생성 완료!\n`);

    // 최종 확인
    const { data: allPosts } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:profiles(*),
        category:board_categories(*)
      `)
      .eq('category_id', perfumeCategoryId)
      .order('created_at', { ascending: false });

    console.log('📊 향수게시판 최종 게시글 목록:');
    allPosts?.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} - ${post.user?.nickname || '익명'}`);
      console.log(`   조회: ${post.view_count}, 좋아요: ${post.like_count}, 댓글: ${post.comment_count}`);
    });

    console.log(`\n🎉 향수게시판 총 ${allPosts?.length || 0}개 게시글 완성!`);

  } catch (err) {
    console.error('❌ 예외 발생:', err);
  }
}

createAdditionalPosts();

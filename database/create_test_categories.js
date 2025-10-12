const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestCategories() {
  try {
    console.log('🔍 테스트 카테고리 생성 시작...');

    // 테스트용 카테고리 데이터
    const testCategories = [
      {
        id: 1,
        name: '향수게시판',
        description: '향수에 대한 이야기를 나누는 공간입니다',
        order_index: 1,
        is_active: true
      },
      {
        id: 2,
        name: '자유게시판',
        description: '자유롭게 이야기를 나누는 공간입니다',
        order_index: 2,
        is_active: true
      },
      {
        id: 3,
        name: '메거진',
        description: '향수 관련 매거진과 리뷰를 공유하는 공간입니다',
        order_index: 3,
        is_active: true
      },
      {
        id: 4,
        name: '이벤트',
        description: '향수 관련 이벤트 정보를 공유하는 공간입니다',
        order_index: 4,
        is_active: true
      },
      {
        id: 5,
        name: '공지사항',
        description: '중요한 공지사항을 확인하는 공간입니다',
        order_index: 5,
        is_active: true
      }
    ];

    console.log('📂 카테고리 데이터:', testCategories);

    // 카테고리 삽입 (upsert 사용하여 중복 방지)
    const { data, error } = await supabase
      .from('board_categories')
      .upsert(testCategories, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select('*');

    if (error) {
      console.error('❌ 카테고리 생성 실패:', error);
      return;
    }

    console.log('✅ 테스트 카테고리 생성 성공!');
    console.log('📊 생성된 카테고리:', data);

    // 생성된 카테고리 목록 조회
    const { data: categories, error: fetchError } = await supabase
      .from('board_categories')
      .select('*')
      .order('order_index');

    if (fetchError) {
      console.error('❌ 카테고리 조회 실패:', fetchError);
      return;
    }

    console.log('📋 전체 카테고리 목록:', categories?.length, '개');
    categories?.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (ID: ${category.id})`);
    });

  } catch (err) {
    console.error('❌ 예외 발생:', err);
  }
}

// 스크립트 실행
createTestCategories();

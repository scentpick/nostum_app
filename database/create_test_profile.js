const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestProfile() {
  try {
    console.log('🔍 테스트 프로필 생성 시작...');

    // 테스트용 프로필 데이터
    const testProfile = {
      id: '00000000-0000-0000-0000-000000000001',
      nickname: '테스트유저',
      bio: '향수 테스트를 위한 계정입니다',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('👤 프로필 데이터:', testProfile);

    // 프로필 삽입
    const { data, error } = await supabase
      .from('profiles')
      .upsert(testProfile, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select('*');

    if (error) {
      console.error('❌ 프로필 생성 실패:', error);
      return;
    }

    console.log('✅ 테스트 프로필 생성 성공!');
    console.log('📊 생성된 프로필:', data);

    // 생성된 프로필 확인
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();

    if (fetchError) {
      console.error('❌ 프로필 조회 실패:', fetchError);
      return;
    }

    console.log('📋 프로필 확인:', profile);

  } catch (err) {
    console.error('❌ 예외 발생:', err);
  }
}

// 스크립트 실행
createTestProfile();

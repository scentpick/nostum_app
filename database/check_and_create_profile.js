const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODUxNDY2NSwiZXhwIjoyMDc0MDkwNjY1fQ.O1S2hJiEzH61wXWn9nLOqcCeHRLIDKPrAWApgxXLCps';

// service_role 키 사용 (RLS 우회)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAndCreateProfiles() {
  try {
    console.log('🚀 auth.users 및 profiles 확인 시작...\n');

    // 1. auth.users의 모든 사용자 조회 (service_role 필요)
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ 사용자 목록 조회 실패:', listError);
      return;
    }

    console.log(`👤 auth.users에 ${users?.length || 0}명의 사용자가 있습니다:\n`);
    
    if (!users || users.length === 0) {
      console.log('❌ 로그인된 사용자가 없습니다.');
      console.log('💡 브라우저에서 Google 로그인을 먼저 진행해주세요.');
      return;
    }

    // 각 사용자에 대해 프로필 확인 및 생성
    for (const user of users) {
      console.log(`\n📋 사용자: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   이름: ${user.user_metadata?.full_name || '없음'}`);
      
      // 프로필 확인
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('   ❌ 프로필 조회 오류:', profileError.message);
        continue;
      }
      
      if (profile) {
        console.log(`   ✅ 프로필 존재: ${profile.nickname} (Role: ${profile.role || '미설정'})`);
      } else {
        console.log('   📝 프로필이 없습니다. 생성 중...');
        
        // 프로필 생성
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            nickname: user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자',
            google_id: user.user_metadata?.sub,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            role: 'user', // 기본 역할
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('   ❌ 프로필 생성 실패:', insertError.message);
        } else {
          console.log(`   ✅ 프로필 생성 완료: ${newProfile.nickname}`);
        }
      }
    }

    console.log('\n\n📊 최종 profiles 테이블 상태:');
    const { data: allProfiles, error: finalError } = await supabase
      .from('profiles')
      .select('*');
    
    if (finalError) {
      console.error('❌ 프로필 목록 조회 실패:', finalError);
      return;
    }

    console.log(`총 ${allProfiles?.length || 0}개의 프로필:`);
    allProfiles?.forEach((p, idx) => {
      console.log(`${idx + 1}. ${p.nickname} (Role: ${p.role || '미설정'})`);
    });

    console.log('\n✅ 완료!');

  } catch (err) {
    console.error('❌ 예외 발생:', err);
  }
}

listAndCreateProfiles();


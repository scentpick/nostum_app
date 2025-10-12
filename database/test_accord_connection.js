/**
 * 어코드 연결 테스트 스크립트
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('🧪 어코드 연결 테스트 시작\n');
  
  // 1. 어코드 개수 확인
  const { data: accords, error: accordError } = await supabase
    .from('accords')
    .select('*');
  
  console.log('1️⃣ 어코드 테이블 확인:');
  console.log(`   총 ${accords ? accords.length : 0}개`);
  if (accordError) {
    console.error('   에러:', accordError);
  }
  if (accords && accords.length > 0) {
    console.log('   샘플:', accords.slice(0, 5).map(a => a.name).join(', '));
  }
  
  // 2. 향수 1개 조회
  const { data: perfumes, error: perfumeError } = await supabase
    .from('perfumes')
    .select('id, name_kr')
    .limit(1);
  
  console.log('\n2️⃣ 향수 테이블 확인:');
  if (perfumes && perfumes.length > 0) {
    console.log(`   샘플: ${perfumes[0].name_kr} (ID: ${perfumes[0].id})`);
  } else {
    console.log('   향수 없음');
  }
  if (perfumeError) {
    console.error('   에러:', perfumeError);
  }
  
  // 3. 어코드 1개로 연결 테스트
  if (accords && accords.length > 0 && perfumes && perfumes.length > 0) {
    console.log('\n3️⃣ 연결 테스트:');
    console.log(`   향수: ${perfumes[0].name_kr}`);
    console.log(`   어코드: ${accords[0].name}`);
    
    const { data: insertResult, error: insertError } = await supabase
      .from('perfume_accords')
      .insert({
        perfume_id: perfumes[0].id,
        accord_id: accords[0].id,
        priority: 1
      })
      .select();
    
    if (insertError) {
      console.error('   ❌ 연결 실패:', insertError.message);
      console.error('   에러 코드:', insertError.code);
      console.error('   상세:', insertError);
    } else {
      console.log('   ✅ 연결 성공!');
      console.log('   결과:', insertResult);
    }
  }
  
  // 4. perfume_accords 테이블 확인
  const { data: existingAccords, error: existingError } = await supabase
    .from('perfume_accords')
    .select('*')
    .limit(5);
  
  console.log('\n4️⃣ perfume_accords 테이블 확인:');
  console.log(`   총 ${existingAccords ? existingAccords.length : 0}개 (상위 5개만)`);
  if (existingError) {
    console.error('   에러:', existingError);
  }
}

test();


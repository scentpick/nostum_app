/**
 * 간단한 Supabase 쿼리 테스트
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSimpleQuery() {
  console.log('🧪 간단한 쿼리 테스트 시작\n');
  
  try {
    console.log('1️⃣ 단순 조회 테스트...');
    const { data, error } = await supabase
      .from('perfumes')
      .select('id, name')
      .limit(3);
    
    if (error) {
      console.error('❌ 에러:', error);
    } else {
      console.log('✅ 성공:', data);
    }
    
  } catch (err) {
    console.error('❌ 예외:', err);
  }
}

// 타임아웃 설정
const timeoutPromise = new Promise((_, reject) => 
  setTimeout(() => reject(new Error('테스트 타임아웃')), 10000)
);

Promise.race([
  testSimpleQuery(),
  timeoutPromise
]).catch(err => {
  console.error('❌ 전체 테스트 타임아웃:', err);
  process.exit(1);
});

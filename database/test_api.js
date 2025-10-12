/**
 * API 테스트 스크립트
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testGetPerfumes() {
  console.log('🧪 향수 API 테스트\n');
  
  try {
    console.log('1️⃣ 단순 조회 테스트 (limit 5)...');
    const { data, error, count } = await supabase
      .from('perfumes')
      .select('*, brand:brands(*)', { count: 'exact' })
      .limit(5);
    
    if (error) {
      console.error('❌ 에러:', error);
      return;
    }
    
    console.log(`✅ 성공! 총 ${count}개 중 ${data.length}개 조회`);
    console.log('샘플:', data.map(p => p.name_kr || p.name).slice(0, 3));
    
    console.log('\n2️⃣ 페이지네이션 테스트 (page 1, limit 12)...');
    const page = 1;
    const limit = 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    console.log(`   from: ${from}, to: ${to}`);
    
    const { data: pagedData, error: pagedError, count: pagedCount } = await supabase
      .from('perfumes')
      .select('*, brand:brands(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (pagedError) {
      console.error('❌ 에러:', pagedError);
      return;
    }
    
    console.log(`✅ 성공! 총 ${pagedCount}개 중 ${pagedData.length}개 조회`);
    console.log('샘플:', pagedData.map(p => p.name_kr || p.name).slice(0, 3));
    
  } catch (err) {
    console.error('❌ 치명적 오류:', err);
  }
}

testGetPerfumes();


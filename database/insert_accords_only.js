/**
 * 향수-어코드 연결만 INSERT하는 스크립트
 * 실행: node insert_accords_only.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 설정
const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

const supabase = createClient(supabaseUrl, supabaseKey);

// JSON 데이터 로드
const dataPath = path.join(__dirname, 'perfume_import_data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('📊 데이터 로드 완료');
console.log(`- 향수-어코드 연결 대상: ${Object.keys(data.accords).length}개 향수`);

let stats = {
  success: 0,
  fail: 0,
  skip: 0
};

// 향수-어코드 연결
async function insertPerfumeAccords() {
  console.log('\n🎨 향수-어코드 연결 시작...\n');
  
  let processedCount = 0;
  const totalPerfumes = Object.keys(data.accords).length;
  
  for (const [perfumeName, accords] of Object.entries(data.accords)) {
    processedCount++;
    
    try {
      // 향수 ID 조회
      const { data: perfume, error: perfumeError } = await supabase
        .from('perfumes')
        .select('id')
        .eq('name_kr', perfumeName)
        .maybeSingle();
      
      if (!perfume) {
        stats.skip++;
        continue;
      }
      
      // 각 어코드 연결
      let perfumeAccordSuccess = 0;
      for (const accord of accords) {
        if (accord.accord_name === '-' || !accord.accord_name || accord.accord_name.trim() === '') continue;
        
        try {
          // 어코드 ID 조회
          const { data: accordData, error: accordError } = await supabase
            .from('accords')
            .select('id')
            .eq('name', accord.accord_name)
            .maybeSingle();
          
          if (accordError) {
            console.error(`  ❌ 어코드 조회 에러: ${accord.accord_name}`, accordError.message);
            stats.fail++;
            continue;
          }
          
          if (!accordData) {
            console.error(`  ⚠️  어코드 없음 (DB에 없음): ${accord.accord_name}`);
            stats.fail++;
            continue;
          }
          
          // 연결
          const { error } = await supabase
            .from('perfume_accords')
            .insert({
              perfume_id: perfume.id,
              accord_id: accordData.id,
              priority: accord.priority
            });
          
          if (error) {
            if (error.code === '23505') { // 중복은 성공으로 간주
              stats.success++;
              perfumeAccordSuccess++;
            } else {
              stats.fail++;
            }
          } else {
            stats.success++;
            perfumeAccordSuccess++;
          }
          
        } catch (err) {
          stats.fail++;
        }
      }
      
      if (perfumeAccordSuccess > 0) {
        console.log(`  ✅ [${processedCount}/${totalPerfumes}] ${perfumeName}: ${perfumeAccordSuccess}개 어코드 연결`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (err) {
      console.error(`  ❌ 오류: ${perfumeName}`, err.message);
      stats.fail += accords.length;
    }
  }
}

// 메인 실행
async function main() {
  console.log('════════════════════════════════════════════════════════');
  console.log('🚀 향수-어코드 연결 시작');
  console.log('════════════════════════════════════════════════════════');
  
  const startTime = Date.now();
  
  try {
    await insertPerfumeAccords();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n════════════════════════════════════════════════════════');
    console.log('✅ 향수-어코드 연결 완료!');
    console.log('════════════════════════════════════════════════════════');
    console.log(`⏱️  소요 시간: ${duration}초`);
    console.log('\n📊 최종 통계:');
    console.log(`  성공: ${stats.success}개`);
    console.log(`  실패: ${stats.fail}개`);
    console.log(`  스킵 (향수 없음): ${stats.skip}개`);
    console.log('════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('\n❌ 치명적 오류:', error);
    process.exit(1);
  }
}

main();


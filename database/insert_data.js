/**
 * Supabase에 향수 데이터를 INSERT하는 스크립트
 * 실행: node insert_data.js
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
console.log(`- 브랜드: ${data.brands.length}개`);
console.log(`- 향수: ${data.perfumes.length}개`);
console.log(`- 고유 어코드: ${data.unique_accords.length}개`);

// 진행 상황 추적
let stats = {
  brands: { success: 0, fail: 0 },
  perfumes: { success: 0, fail: 0 },
  notes: { success: 0, fail: 0 },
  accords: { success: 0, fail: 0 },
  perfume_accords: { success: 0, fail: 0 }
};

// 1. 브랜드 INSERT
async function insertBrands() {
  console.log('\n🏢 브랜드 데이터 INSERT 중...');
  
  for (const brand of data.brands) {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('brands')
        .select('id')
        .eq('name_kr', brand.name_kr)
        .eq('name_en', brand.name_en)
        .single();
      
      if (existing) {
        console.log(`  ⏭️  이미 존재: ${brand.name_kr}`);
        stats.brands.success++;
        continue;
      }
      
      const { error } = await supabase
        .from('brands')
        .insert({
          name_kr: brand.name_kr,
          name_en: brand.name_en,
          official_url: brand.official_url
        });
      
      if (error) {
        console.error(`  ❌ 실패: ${brand.name_kr}`, error.message);
        stats.brands.fail++;
      } else {
        console.log(`  ✅ 성공: ${brand.name_kr}`);
        stats.brands.success++;
      }
      
      // Rate limiting 방지
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (err) {
      console.error(`  ❌ 오류: ${brand.name_kr}`, err.message);
      stats.brands.fail++;
    }
  }
}

// 2. 향수 INSERT
async function insertPerfumes() {
  console.log('\n💐 향수 데이터 INSERT 중...');
  
  for (const perfume of data.perfumes) {
    try {
      // 브랜드 ID 조회
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('name_kr', perfume.brand_kr)
        .single();
      
      if (!brand) {
        console.error(`  ❌ 브랜드 없음: ${perfume.name_kr} (브랜드: ${perfume.brand_kr})`);
        stats.perfumes.fail++;
        continue;
      }
      
      // 중복 확인
      const { data: existing } = await supabase
        .from('perfumes')
        .select('id')
        .eq('name_kr', perfume.name_kr)
        .single();
      
      if (existing) {
        console.log(`  ⏭️  이미 존재: ${perfume.name_kr}`);
        stats.perfumes.success++;
        continue;
      }
      
      const { error } = await supabase
        .from('perfumes')
        .insert({
          brand_id: brand.id,
          name: perfume.name,
          name_kr: perfume.name_kr,
          fragrantica_url: perfume.fragrantica_url,
          official_url: perfume.official_url
        });
      
      if (error) {
        console.error(`  ❌ 실패: ${perfume.name_kr}`, error.message);
        stats.perfumes.fail++;
      } else {
        console.log(`  ✅ 성공: ${perfume.name_kr}`);
        stats.perfumes.success++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (err) {
      console.error(`  ❌ 오류: ${perfume.name_kr}`, err.message);
      stats.perfumes.fail++;
    }
  }
}

// 3. 노트 INSERT
async function insertNotes() {
  console.log('\n🎵 노트 데이터 INSERT 중...');
  
  for (const [perfumeName, notes] of Object.entries(data.notes)) {
    try {
      // 향수 ID 조회
      const { data: perfume } = await supabase
        .from('perfumes')
        .select('id')
        .eq('name_kr', perfumeName)
        .single();
      
      if (!perfume) {
        console.error(`  ❌ 향수 없음: ${perfumeName}`);
        stats.notes.fail += notes.length;
        continue;
      }
      
      // 노트 INSERT (배치로 한번에)
      const notesData = notes.map(note => ({
        perfume_id: perfume.id,
        note_name: note.note_name,
        note_type: note.note_type
      }));
      
      const { error } = await supabase
        .from('perfume_notes')
        .insert(notesData);
      
      if (error) {
        console.error(`  ❌ 실패: ${perfumeName} (${notes.length}개 노트)`, error.message);
        stats.notes.fail += notes.length;
      } else {
        console.log(`  ✅ 성공: ${perfumeName} (${notes.length}개 노트)`);
        stats.notes.success += notes.length;
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (err) {
      console.error(`  ❌ 오류: ${perfumeName}`, err.message);
      stats.notes.fail += notes.length;
    }
  }
}

// 4. 어코드 INSERT
async function insertAccords() {
  console.log('\n🎨 어코드 데이터 INSERT 중...');
  
  // 4-1. 고유 어코드 먼저 INSERT
  console.log('  고유 어코드 INSERT...');
  for (const accordName of data.unique_accords) {
    if (accordName === '-' || !accordName || accordName.trim() === '') continue; // '-'는 스킵
    
    try {
      const { data: existing, error: checkError } = await supabase
        .from('accords')
        .select('id')
        .eq('name', accordName)
        .maybeSingle(); // single 대신 maybeSingle 사용
      
      if (existing) {
        stats.accords.success++;
        continue;
      }
      
      const { error } = await supabase
        .from('accords')
        .insert({ name: accordName });
      
      if (error) {
        if (error.code === '23505') { // 중복 에러는 성공으로 간주
          stats.accords.success++;
        } else {
          console.error(`  ❌ 실패: ${accordName}`, error.message);
          stats.accords.fail++;
        }
      } else {
        console.log(`  ✅ 추가: ${accordName}`);
        stats.accords.success++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 30));
      
    } catch (err) {
      console.error(`  ❌ 오류: ${accordName}`, err.message);
      stats.accords.fail++;
    }
  }
  
  console.log(`  ✅ 고유 어코드 INSERT 완료: ${stats.accords.success}개`);
  
  // 4-2. 향수-어코드 연결
  console.log('  향수-어코드 연결 중...');
  for (const [perfumeName, accords] of Object.entries(data.accords)) {
    try {
      // 향수 ID 조회
      const { data: perfume, error: perfumeError } = await supabase
        .from('perfumes')
        .select('id')
        .eq('name_kr', perfumeName)
        .maybeSingle(); // single 대신 maybeSingle 사용
      
      if (!perfume) {
        console.error(`  ❌ 향수 없음: ${perfumeName}`);
        stats.perfume_accords.fail += accords.length;
        continue;
      }
      
      // 각 어코드 연결
      for (const accord of accords) {
        if (accord.accord_name === '-' || !accord.accord_name || accord.accord_name.trim() === '') continue;
        
        try {
          // 어코드 ID 조회
          const { data: accordData, error: accordError } = await supabase
            .from('accords')
            .select('id')
            .eq('name', accord.accord_name)
            .maybeSingle(); // single 대신 maybeSingle 사용
          
          if (!accordData) {
            console.error(`  ❌ 어코드 없음: ${accord.accord_name}`);
            stats.perfume_accords.fail++;
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
              stats.perfume_accords.success++;
            } else {
              console.error(`  ❌ 연결 실패: ${perfumeName} - ${accord.accord_name}`, error.message);
              stats.perfume_accords.fail++;
            }
          } else {
            stats.perfume_accords.success++;
          }
          
        } catch (err) {
          stats.perfume_accords.fail++;
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (err) {
      console.error(`  ❌ 오류: ${perfumeName}`, err.message);
      stats.perfume_accords.fail += accords.length;
    }
  }
  
  console.log(`  ✅ 향수-어코드 연결 완료: ${stats.perfume_accords.success}개`);
}

// 메인 실행
async function main() {
  console.log('════════════════════════════════════════════════════════');
  console.log('🚀 Supabase 데이터 INSERT 시작');
  console.log('════════════════════════════════════════════════════════');
  
  const startTime = Date.now();
  
  try {
    await insertBrands();
    await insertPerfumes();
    await insertNotes();
    await insertAccords();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n════════════════════════════════════════════════════════');
    console.log('✅ 데이터 INSERT 완료!');
    console.log('════════════════════════════════════════════════════════');
    console.log(`⏱️  소요 시간: ${duration}초`);
    console.log('\n📊 최종 통계:');
    console.log(`  브랜드: ${stats.brands.success}개 성공, ${stats.brands.fail}개 실패`);
    console.log(`  향수: ${stats.perfumes.success}개 성공, ${stats.perfumes.fail}개 실패`);
    console.log(`  노트: ${stats.notes.success}개 성공, ${stats.notes.fail}개 실패`);
    console.log(`  어코드: ${stats.accords.success}개 성공, ${stats.accords.fail}개 실패`);
    console.log(`  향수-어코드 연결: ${stats.perfume_accords.success}개 성공, ${stats.perfume_accords.fail}개 실패`);
    console.log('════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('\n❌ 치명적 오류:', error);
    process.exit(1);
  }
}

main();


#!/usr/bin/env python3
"""
엑셀 파일(preDB.xlsx)의 향수 데이터를 Supabase DB로 임포트하는 스크립트
"""

import pandas as pd
import json
from typing import Dict, List, Set
import re

# 엑셀 파일 경로
EXCEL_FILE = '../assets/preDB.xlsx'

def clean_text(text):
    """텍스트 정리 (앞뒤 공백 제거, None 처리)"""
    if pd.isna(text) or text is None:
        return None
    return str(text).strip()

def load_excel_data():
    """엑셀 데이터 로드"""
    print("📁 엑셀 파일 로딩 중...")
    df = pd.read_excel(EXCEL_FILE)
    
    # 0번 행을 컬럼명으로 설정
    df.columns = df.iloc[0]
    df = df[1:].reset_index(drop=True)
    
    print(f"✅ 총 {len(df)}개 향수 데이터 로드 완료")
    return df

def extract_brands(df: pd.DataFrame) -> List[Dict]:
    """브랜드 데이터 추출"""
    print("\n🏢 브랜드 데이터 추출 중...")
    
    brands_dict = {}
    
    for _, row in df.iterrows():
        name_kr = clean_text(row['브랜드명 (국문)'])
        name_en = clean_text(row['브랜드명 (영문)'])
        official_url = clean_text(row['제품 링크(브랜드)'])
        
        if not name_kr or not name_en:
            continue
        
        # 브랜드가 이미 있으면 스킵, 없으면 추가
        brand_key = f"{name_kr}_{name_en}"
        if brand_key not in brands_dict:
            brands_dict[brand_key] = {
                'name_kr': name_kr,
                'name_en': name_en,
                'official_url': official_url if official_url else None
            }
    
    brands = list(brands_dict.values())
    print(f"✅ {len(brands)}개 브랜드 추출 완료")
    
    return brands

def extract_perfumes(df: pd.DataFrame) -> List[Dict]:
    """향수 기본 데이터 추출"""
    print("\n💐 향수 데이터 추출 중...")
    
    perfumes = []
    
    for _, row in df.iterrows():
        name = clean_text(row['향수명 (영문)'])
        name_kr = clean_text(row['향수명 (국문)'])
        brand_kr = clean_text(row['브랜드명 (국문)'])
        brand_en = clean_text(row['브랜드명 (영문)'])
        fragrantica_url = clean_text(row['프레그런티카 링크'])
        official_url = clean_text(row['제품 링크(브랜드)'])
        
        if not name_kr:  # 최소한 한글명은 있어야 함
            continue
        
        perfume = {
            'name': name if name else name_kr,  # 영문명 없으면 한글명 사용
            'name_kr': name_kr,
            'brand_kr': brand_kr,
            'brand_en': brand_en,
            'fragrantica_url': fragrantica_url,
            'official_url': official_url,
        }
        
        perfumes.append(perfume)
    
    print(f"✅ {len(perfumes)}개 향수 추출 완료")
    return perfumes

def extract_notes(df: pd.DataFrame) -> Dict[str, List[Dict]]:
    """향수 노트 데이터 추출 (탑/미들/베이스)"""
    print("\n🎵 향수 노트 데이터 추출 중...")
    
    all_notes = {}
    
    for idx, row in df.iterrows():
        perfume_name = clean_text(row['향수명 (국문)'])
        if not perfume_name:
            continue
        
        notes = []
        
        # 탑노트
        top_notes_raw = clean_text(row['탑노트'])
        if top_notes_raw:
            for note in top_notes_raw.split(','):
                note = note.strip()
                if note:
                    notes.append({'note_name': note, 'note_type': 'top'})
        
        # 미들노트
        middle_notes_raw = clean_text(row['미들노트'])
        if middle_notes_raw:
            for note in middle_notes_raw.split(','):
                note = note.strip()
                if note:
                    notes.append({'note_name': note, 'note_type': 'middle'})
        
        # 베이스노트
        base_notes_raw = clean_text(row['베이스노트'])
        if base_notes_raw:
            for note in base_notes_raw.split(','):
                note = note.strip()
                if note:
                    notes.append({'note_name': note, 'note_type': 'base'})
        
        if notes:
            all_notes[perfume_name] = notes
    
    total_notes = sum(len(notes) for notes in all_notes.values())
    print(f"✅ {len(all_notes)}개 향수의 {total_notes}개 노트 추출 완료")
    
    return all_notes

def extract_accords(df: pd.DataFrame) -> Dict[str, List[Dict]]:
    """향수 어코드 데이터 추출 (어코드 1~10)"""
    print("\n🎨 향수 어코드 데이터 추출 중...")
    
    all_accords = {}
    accord_columns = [f'어코드 {i}' for i in range(1, 11)]
    
    for idx, row in df.iterrows():
        perfume_name = clean_text(row['향수명 (국문)'])
        if not perfume_name:
            continue
        
        accords = []
        
        for priority, col in enumerate(accord_columns, start=1):
            accord_name = clean_text(row[col])
            if accord_name:
                accords.append({
                    'accord_name': accord_name.lower(),  # 소문자로 통일
                    'priority': priority
                })
        
        if accords:
            all_accords[perfume_name] = accords
    
    # 모든 고유 어코드 이름 추출
    unique_accords = set()
    for accords in all_accords.values():
        for accord in accords:
            unique_accords.add(accord['accord_name'])
    
    total_accords = sum(len(accords) for accords in all_accords.values())
    print(f"✅ {len(all_accords)}개 향수의 {total_accords}개 어코드 추출 완료")
    print(f"✅ 고유 어코드 종류: {len(unique_accords)}개")
    
    return all_accords, list(unique_accords)

def generate_insert_sql():
    """SQL INSERT 문 생성"""
    print("\n" + "="*60)
    print("📊 데이터 추출 시작")
    print("="*60)
    
    # 데이터 로드
    df = load_excel_data()
    
    # 각 데이터 추출
    brands = extract_brands(df)
    perfumes = extract_perfumes(df)
    notes = extract_notes(df)
    perfume_accords, unique_accords = extract_accords(df)
    
    print("\n" + "="*60)
    print("📝 JSON 파일 생성 중...")
    print("="*60)
    
    # JSON 파일로 저장
    output_data = {
        'brands': brands,
        'perfumes': perfumes,
        'notes': notes,
        'accords': perfume_accords,
        'unique_accords': unique_accords
    }
    
    output_file = 'perfume_import_data.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ JSON 파일 생성 완료: {output_file}")
    
    # 요약 출력
    print("\n" + "="*60)
    print("📊 데이터 요약")
    print("="*60)
    print(f"브랜드: {len(brands)}개")
    print(f"향수: {len(perfumes)}개")
    print(f"노트: {sum(len(n) for n in notes.values())}개")
    print(f"어코드 (고유): {len(unique_accords)}개")
    print(f"어코드 (전체): {sum(len(a) for a in perfume_accords.values())}개")
    
    # 샘플 데이터 출력
    print("\n" + "="*60)
    print("📋 샘플 데이터")
    print("="*60)
    print("\n[브랜드 샘플 (5개)]")
    for brand in brands[:5]:
        print(f"  - {brand['name_kr']} ({brand['name_en']})")
    
    print("\n[향수 샘플 (5개)]")
    for perfume in perfumes[:5]:
        print(f"  - {perfume['name_kr']}")
        print(f"    영문: {perfume['name']}")
        print(f"    브랜드: {perfume['brand_kr']}")
    
    print("\n[고유 어코드 샘플 (10개)]")
    for accord in sorted(unique_accords)[:10]:
        print(f"  - {accord}")
    
    print("\n" + "="*60)
    print("✅ 완료! 다음 단계:")
    print("="*60)
    print("1. perfume_import_data.json 파일 확인")
    print("2. Supabase SQL Editor에서 마이그레이션 실행:")
    print("   - migration_add_accord_and_fields.sql")
    print("3. Node.js 스크립트로 데이터 INSERT")
    print("="*60)

if __name__ == '__main__':
    generate_insert_sql()


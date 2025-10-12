import { 
  PerfumeWithBrand, 
  PerfumeSearchParams,
  ApiResponse,
  PaginatedResponse,
  Brand
} from '../types';

// Supabase 설정
const supabaseUrl = 'https://wrdsumdjamvsdxjwnpdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I';

// 직접 fetch를 사용한 최적화된 향수 목록 조회
export const getPerfumesOptimized = async (params: PerfumeSearchParams = {}): Promise<ApiResponse<PaginatedResponse<PerfumeWithBrand>>> => {
  try {
    console.log('🚀 getPerfumesOptimized: 직접 fetch 사용');
    const {
      query = '',
      brand_id,
      gender,
      price_min,
      price_max,
      sort_by = 'created_at',
      sort_order = 'desc',
      page = 1,
      limit = 10
    } = params;

    console.log('🔍 getPerfumesOptimized: 파라미터', { page, limit, sort_by, sort_order });

    // 기본 쿼리 구성 (브랜드 정보 포함)
    let url = `${supabaseUrl}/rest/v1/perfumes?select=id,name_kr,name,image_url,brand_id`;
    
    // 검색어 필터 추가 (향수명 한글, 영문)
    if (query && query.trim()) {
      const searchTerm = query.trim();
      // or 조건: name_kr 또는 name에 검색어 포함
      url += `&or=(name_kr.ilike.*${searchTerm}*,name.ilike.*${searchTerm}*)`;
      console.log('🔍 검색어 적용:', searchTerm);
    }
    
    // 페이지네이션 추가 (limit/offset 방식)
    const offset = (page - 1) * limit;
    url += `&limit=${limit}&offset=${offset}`;
    
    console.log('🔍 getPerfumesOptimized: 요청 URL', url);

    // 직접 fetch 실행
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 getPerfumesOptimized: fetch 성공', { dataLength: data?.length });

    // 전체 개수를 위한 별도 요청 (검색 조건 동일하게 적용)
    let totalCount = 182; // 기본값
    try {
      let countUrl = `${supabaseUrl}/rest/v1/perfumes?select=id`;
      
      // 검색어가 있으면 동일한 필터 적용
      if (query && query.trim()) {
        const searchTerm = query.trim();
        countUrl += `&or=(name_kr.ilike.*${searchTerm}*,name.ilike.*${searchTerm}*)`;
      }
      
      const countResponse = await fetch(countUrl, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (countResponse.ok) {
        const countData = await countResponse.json();
        totalCount = countData.length;
        console.log('✅ 전체 개수 조회 성공:', totalCount);
      }
    } catch (error) {
      console.log('⚠️ 전체 개수 조회 실패, 기본값 사용:', error);
    }

    // 브랜드 정보 별도 조회
    const perfumes = data as any[];
    const brandIds = [...new Set(perfumes.map(p => p.brand_id).filter(Boolean))];
    
    let brandsMap: { [key: string]: any } = {};
    if (brandIds.length > 0) {
      try {
        const brandsUrl = `${supabaseUrl}/rest/v1/brands?select=id,name_kr,name_en&id=in.(${brandIds.join(',')})`;
        const brandsResponse = await fetch(brandsUrl, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (brandsResponse.ok) {
          const brandsData = await brandsResponse.json();
          brandsMap = brandsData.reduce((acc: any, brand: any) => {
            acc[brand.id] = brand;
            return acc;
          }, {});
          console.log('✅ 브랜드 정보 조회 성공:', brandsData.length, '개');
        }
      } catch (error) {
        console.log('⚠️ 브랜드 정보 조회 실패:', error);
      }
    }
    
    // 데이터 변환 (브랜드 정보 포함)
    const perfumesWithBrands = perfumes.map((item: any) => ({
      id: item.id,
      name: item.name,
      name_kr: item.name_kr,
      image_url: item.image_url,
      brand_id: item.brand_id,
      description: null,
      price: null,
      volume_ml: null,
      gender: null,
      release_year: null,
      fragrantica_url: null,
      official_url: null,
      created_at: null,
      updated_at: null,
      brand: brandsMap[item.brand_id] || null
    }));

    const totalPages = Math.ceil(totalCount / limit);
    console.log('✅ getPerfumesOptimized: 성공', { totalCount, totalPages, perfumesCount: perfumesWithBrands.length });

    return {
      success: true,
      data: {
        data: perfumesWithBrands as PerfumeWithBrand[],
        count: totalCount,
        page,
        limit,
        total_pages: totalPages
      },
      error: null
    };

  } catch (err) {
    console.error('❌ getPerfumesOptimized: 예외', err);
    return { 
      success: false, 
      data: null, 
      error: err instanceof Error ? err.message : '향수 데이터를 불러오는 중 오류가 발생했습니다.' 
    };
  }
};

// 향수 상세 정보 조회
export const getPerfumeDetail = async (id: string): Promise<ApiResponse<PerfumeWithBrand>> => {
  try {
    console.log('🔍 getPerfumeDetail: 향수 상세 조회', id);
    
    // 향수 기본 정보 조회
    const perfumeUrl = `${supabaseUrl}/rest/v1/perfumes?select=*&id=eq.${id}`;
    const perfumeResponse = await fetch(perfumeUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!perfumeResponse.ok) {
      throw new Error(`HTTP error! status: ${perfumeResponse.status}`);
    }

    const perfumeData = await perfumeResponse.json();
    
    if (!perfumeData || perfumeData.length === 0) {
      return { success: false, data: null, error: '향수를 찾을 수 없습니다.' };
    }

    const perfume = perfumeData[0];
    console.log('✅ 향수 기본 정보 조회 성공:', perfume.name_kr);

    // 브랜드 정보 조회
    let brand = null;
    if (perfume.brand_id) {
      const brandUrl = `${supabaseUrl}/rest/v1/brands?select=*&id=eq.${perfume.brand_id}`;
      const brandResponse = await fetch(brandUrl, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (brandResponse.ok) {
        const brandData = await brandResponse.json();
        if (brandData && brandData.length > 0) {
          brand = brandData[0];
          console.log('✅ 브랜드 정보 조회 성공:', brand.name_kr);
        }
      }
    }

    const result: PerfumeWithBrand = {
      ...perfume,
      brand
    };

    return { success: true, data: result, error: null };
  } catch (err) {
    console.error('❌ getPerfumeDetail: 실패', err);
    return { 
      success: false, 
      data: null, 
      error: err instanceof Error ? err.message : '향수 상세 정보를 불러오는 중 오류가 발생했습니다.' 
    };
  }
};

// 향수 노트 정보 조회
export const getPerfumeNotes = async (perfumeId: string): Promise<ApiResponse<{ top: string[], middle: string[], base: string[] }>> => {
  try {
    console.log('🔍 getPerfumeNotes: 노트 정보 조회', perfumeId);
    
    const notesUrl = `${supabaseUrl}/rest/v1/perfume_notes?select=*&perfume_id=eq.${perfumeId}`;
    const notesResponse = await fetch(notesUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!notesResponse.ok) {
      throw new Error(`HTTP error! status: ${notesResponse.status}`);
    }

    const notesData = await notesResponse.json();
    
    const notes = {
      top: notesData.filter((n: any) => n.note_type === 'top').map((n: any) => n.note_name),
      middle: notesData.filter((n: any) => n.note_type === 'middle').map((n: any) => n.note_name),
      base: notesData.filter((n: any) => n.note_type === 'base').map((n: any) => n.note_name)
    };

    console.log('✅ 노트 정보 조회 성공:', { 
      top: notes.top.length, 
      middle: notes.middle.length, 
      base: notes.base.length 
    });

    return { success: true, data: notes, error: null };
  } catch (err) {
    console.error('❌ getPerfumeNotes: 실패', err);
    return { 
      success: false, 
      data: null, 
      error: err instanceof Error ? err.message : '노트 정보를 불러오는 중 오류가 발생했습니다.' 
    };
  }
};

// 브랜드 목록 조회 (직접 fetch 사용)
export const getBrands = async (): Promise<ApiResponse<Brand[]>> => {
  try {
    console.log('🚀 getBrands: 직접 fetch 사용');
    
    const url = `${supabaseUrl}/rest/v1/brands?select=*&order=name_kr`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ getBrands: 성공', { count: data?.length });

    return { success: true, data: data as Brand[], error: null };
  } catch (err) {
    console.error('❌ getBrands: 실패', err);
    return { 
      success: false, 
      data: null, 
      error: err instanceof Error ? err.message : '브랜드 데이터를 불러오는 중 오류가 발생했습니다.' 
    };
  }
};

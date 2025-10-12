import { supabase } from '../supabase/client';
import { 
  Perfume, 
  PerfumeWithBrand, 
  PerfumeWithDetails, 
  Brand, 
  PerfumeSearchParams,
  ApiResponse,
  PaginatedResponse 
} from '../types';

// 향수 목록 조회 (페이지네이션)
export const getPerfumes = async (params: PerfumeSearchParams = {}): Promise<ApiResponse<PaginatedResponse<PerfumeWithBrand>>> => {
  try {
    console.log('🔍 getPerfumes: 함수 호출됨');
    const {
      query = '',
      brand_id,
      gender,
      price_min,
      price_max,
      fragrant_wheel_ids = [],
      tag_ids = [],
      sort_by = 'created_at',
      sort_order = 'desc',
      page = 1,
      limit = 20
    } = params;

    console.log('🔍 getPerfumes: 파라미터 처리 완료', { page, limit, sort_by, sort_order });

    // JOIN 대신 간단한 쿼리로 변경
    let queryBuilder = supabase
      .from('perfumes')
      .select('*');

    // 검색어 필터 (향수명만 검색)
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,name_kr.ilike.%${query}%`);
    }

    // 브랜드 필터
    if (brand_id) {
      queryBuilder = queryBuilder.eq('brand_id', brand_id);
    }

    // 성별 필터
    if (gender) {
      queryBuilder = queryBuilder.eq('gender', gender);
    }

    // 가격 범위 필터
    if (price_min !== undefined) {
      queryBuilder = queryBuilder.gte('price', price_min);
    }
    if (price_max !== undefined) {
      queryBuilder = queryBuilder.lte('price', price_max);
    }

    // Fragrant Wheel 필터 (임시로 비활성화 - 복잡한 JOIN)
    if (fragrant_wheel_ids.length > 0) {
      console.log('⚠️ Fragrant Wheel 필터는 현재 비활성화됨');
    }

    // 태그 필터 (임시로 비활성화 - 복잡한 JOIN)
    if (tag_ids.length > 0) {
      console.log('⚠️ 태그 필터는 현재 비활성화됨');
    }

    // 정렬
    const sortColumn = sort_by === 'name' ? 'name' : 
                      sort_by === 'price' ? 'price' : 
                      sort_by === 'rating' ? 'rating' : 'created_at';
    
    queryBuilder = queryBuilder.order(sortColumn, { ascending: sort_order === 'asc' });

    // 페이지네이션 (안전한 방식)
    if (page > 0 && limit > 0) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      queryBuilder = queryBuilder.range(from, to);
      console.log('🔍 getPerfumes: 페이지네이션 적용', { from, to });
    }

    console.log('🔍 getPerfumes: 쿼리 실행 시작');
    const { data, error, count } = await queryBuilder;
    console.log('🔍 getPerfumes: 쿼리 실행 완료', { dataLength: data?.length, count, error });

    if (error) {
      console.error('❌ getPerfumes: 쿼리 에러', error);
      return { success: false, data: null, error: error.message };
    }

    // 브랜드 정보 별도 조회
    console.log('🔍 getPerfumes: 브랜드 정보 조회 시작');
    const perfumes = data as any[];
    const brandIds = [...new Set(perfumes.map(p => p.brand_id))]; // 중복 제거
    
    let brandsData: any[] = [];
    if (brandIds.length > 0) {
      const { data: brands, error: brandsError } = await supabase
        .from('brands')
        .select('*')
        .in('id', brandIds);
      
      if (brandsError) {
        console.error('❌ getPerfumes: 브랜드 조회 에러', brandsError);
      } else {
        brandsData = brands || [];
        console.log('✅ getPerfumes: 브랜드 정보 조회 완료', brandsData.length, '개');
      }
    }

    // 향수와 브랜드 정보 결합
    const perfumesWithBrands = perfumes.map(perfume => ({
      ...perfume,
      brand: brandsData.find(brand => brand.id === perfume.brand_id) || null
    }));

    const totalPages = Math.ceil((count || 0) / limit);
    console.log('✅ getPerfumes: 성공', { count, totalPages });

    return {
      success: true,
      data: {
        data: perfumesWithBrands as PerfumeWithBrand[],
        count: count || 0,
        page,
        limit,
        total_pages: totalPages
      },
      error: null
    };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 향수 상세 조회
export const getPerfumeById = async (id: string): Promise<ApiResponse<PerfumeWithDetails>> => {
  try {
    const { data, error } = await supabase
      .from('perfumes')
      .select(`
        *,
        brand:brands(*),
        notes:perfume_notes(*),
        fragrant_wheels:perfume_fragrant_wheels(
          *,
          fragrant_wheel:fragrant_wheels(*)
        ),
        tags:perfume_tags(
          *,
          tag:tags(*)
        ),
        reviews:reviews(
          *,
          user:profiles(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as PerfumeWithDetails, error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 브랜드 목록 조회
export const getBrands = async (): Promise<ApiResponse<Brand[]>> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name_kr');

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as Brand[], error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 브랜드별 향수 조회
export const getPerfumesByBrand = async (brandId: string, limit = 20): Promise<ApiResponse<PerfumeWithBrand[]>> => {
  try {
    const { data, error } = await supabase
      .from('perfumes')
      .select(`
        *,
        brand:brands(*)
      `)
      .eq('brand_id', brandId)
      .order('name')
      .limit(limit);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as PerfumeWithBrand[], error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 인기 향수 조회 (리뷰 수 기준)
export const getPopularPerfumes = async (limit = 10): Promise<ApiResponse<PerfumeWithBrand[]>> => {
  try {
    const { data, error } = await supabase
      .from('perfumes')
      .select(`
        *,
        brand:brands(*),
        reviews:reviews(count)
      `)
      .order('reviews.count', { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as PerfumeWithBrand[], error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 최신 향수 조회
export const getLatestPerfumes = async (limit = 10): Promise<ApiResponse<PerfumeWithBrand[]>> => {
  try {
    const { data, error } = await supabase
      .from('perfumes')
      .select(`
        *,
        brand:brands(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as PerfumeWithBrand[], error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};

// 향수 검색 (간단한 텍스트 검색)
export const searchPerfumes = async (query: string, limit = 20): Promise<ApiResponse<PerfumeWithBrand[]>> => {
  try {
    const { data, error } = await supabase
      .from('perfumes')
      .select(`
        *,
        brand:brands(*)
      `)
      .or(`name.ilike.%${query}%,brand.name_kr.ilike.%${query}%,brand.name_en.ilike.%${query}%`)
      .order('name')
      .limit(limit);

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as PerfumeWithBrand[], error: null };
  } catch (err) {
    return { success: false, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
};
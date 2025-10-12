import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getBrands } from '../lib/services/perfumeService';
import { getPerfumesOptimized, getPerfumeDetail, getPerfumeNotes } from '../lib/services/perfumeServiceOptimized';
import { PerfumeWithBrand, Brand } from '../lib/types';

export default function PerfumeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('향수');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPerfumes, setSelectedPerfumes] = useState<PerfumeWithBrand[]>([]);
  
  // 데이터 상태
  const [perfumes, setPerfumes] = useState<PerfumeWithBrand[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // 필터 상태
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'unisex' | null>(null);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [sortBy, setSortBy] = useState<'created_at' | 'price' | 'name'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // 필터 모달 상태
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  
  // 테스트 탭 상태
  const [testData, setTestData] = useState<any[]>([]);
  const [testLoading, setTestLoading] = useState(false);
  
  // 상세 화면 상태
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<string | null>(null);
  const [perfumeDetail, setPerfumeDetail] = useState<PerfumeWithBrand | null>(null);
  const [perfumeNotes, setPerfumeNotes] = useState<{ top: string[], middle: string[], base: string[] }>({ top: [], middle: [], base: [] });
  const [detailLoading, setDetailLoading] = useState(false);

  const tabs = ['향수', '분석', '통계', '향수테스트'];
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 상세 화면 로딩 함수
  const loadPerfumeDetail = async (perfumeId: string) => {
    try {
      setDetailLoading(true);
      setSelectedPerfumeId(perfumeId);
      
      console.log('🔍 향수 상세 정보 로딩:', perfumeId);
      
      // 향수 기본 정보 조회
      const perfumeResult = await getPerfumeDetail(perfumeId);
      
      if (!perfumeResult.success || !perfumeResult.data) {
        Alert.alert('오류', perfumeResult.error || '향수 정보를 불러올 수 없습니다.');
        setSelectedPerfumeId(null);
        return;
      }

      setPerfumeDetail(perfumeResult.data);
      console.log('✅ 향수 정보 로드 완료:', perfumeResult.data.name_kr);

      // 노트 정보 조회
      const notesResult = await getPerfumeNotes(perfumeId);
      
      if (notesResult.success && notesResult.data) {
        setPerfumeNotes(notesResult.data);
        console.log('✅ 노트 정보 로드 완료');
      } else {
        console.log('⚠️ 노트 정보 없음');
        setPerfumeNotes({ top: [], middle: [], base: [] });
      }

    } catch (error) {
      console.error('❌ 향수 상세 정보 로딩 오류:', error);
      Alert.alert('오류', '향수 정보를 불러오는 중 오류가 발생했습니다.');
      setSelectedPerfumeId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // 상세 화면 닫기
  const closePerfumeDetail = () => {
    setSelectedPerfumeId(null);
    setPerfumeDetail(null);
    setPerfumeNotes({ top: [], middle: [], base: [] });
  };

  // 향수 데이터 불러오기
  const loadPerfumes = async () => {
    try {
      console.log('🔍 loadPerfumes: 시작');
      setLoading(true);
      
      const params = {
        query: searchQuery,
        brand_id: selectedBrand || undefined,
        gender: selectedGender || undefined,
        price_min: priceRange.min || undefined,
        price_max: priceRange.max || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        page: currentPage,
        limit: itemsPerPage,
      };
      
      console.log('🔍 loadPerfumes: 파라미터:', params);
      const result = await getPerfumesOptimized(params);
      console.log('🔍 loadPerfumes: 결과:', result);

      if (result.success && result.data) {
        setPerfumes(result.data.data);
        setTotalCount(result.data.count);
        console.log('✅ loadPerfumes: 성공', result.data.data.length, '개 로드');
      } else {
        console.error('❌ loadPerfumes: 실패', result.error);
        Alert.alert('오류', result.error || '향수 데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ loadPerfumes: 예외:', error);
      Alert.alert('오류', '향수 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      console.log('✅ loadPerfumes: 완료');
    }
  };

  // 브랜드 목록 불러오기
  const loadBrands = async () => {
    try {
      const result = await getBrands();
      if (result.success && result.data) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error('브랜드 데이터 로딩 오류:', error);
    }
  };

  // 단순화된 향수 테스트 함수
  const testSimplePerfumeData = async () => {
    console.log('🧪 단순 테스트 시작');
    try {
      const response = await fetch('https://wrdsumdjamvsdxjwnpdx.supabase.co/rest/v1/perfumes?select=id,name,name_kr&limit=5', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZHN1bWRqYW12c2R4anducGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MTQ2NjUsImV4cCI6MjA3NDA5MDY2NX0.bzxenCFDlwqYCEvoBJvvW_kFpTiNfjFsViSUkUTrS4I'
        }
      });
      
      const data = await response.json();
      console.log('🧪 단순 테스트 성공:', data);
      return data;
    } catch (error) {
      console.error('🧪 단순 테스트 실패:', error);
      return null;
    }
  };

  // Supabase 클라이언트 테스트 함수
  const testSupabaseClient = async () => {
    console.log('🧪 Supabase 클라이언트 테스트 시작');
    try {
      const { getPerfumesOptimized } = await import('../lib/services/perfumeServiceOptimized');
      const result = await getPerfumesOptimized({ page: 1, limit: 3 });
      console.log('🧪 Supabase 클라이언트 테스트 결과:', result);
      return result;
    } catch (error) {
      console.error('🧪 Supabase 클라이언트 테스트 실패:', error);
      return null;
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    console.log('🔍 PerfumeScreen: 초기 데이터 로딩 시작');
    loadBrands();
    loadPerfumes();
  }, []);

  // 필터/정렬/페이지 변경 시 데이터 로딩 (초기 로딩 제외)
  useEffect(() => {
    // 초기 로딩이 아닐 때만 실행
    if (perfumes.length > 0 || !loading) {
      loadPerfumes();
    }
  }, [selectedBrand, selectedGender, sortBy, sortOrder, currentPage]);
  
  // 검색어 변경 시 자동 검색 (디바운싱 없이 엔터키나 검색 버튼으로만 검색)

  // 검색 실행
  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로
    loadPerfumes();
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setSelectedBrand(null);
    setSelectedGender(null);
    setPriceRange({});
    setCurrentPage(1);
  };

  // 정렬 변경
  const handleSortChange = (newSortBy: typeof sortBy, newSortOrder: typeof sortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setShowSortModal(false);
    setCurrentPage(1);
  };

  const handlePerfumeSelect = (perfume: PerfumeWithBrand) => {
    if (activeTab === '분석') {
      if (selectedPerfumes.find(p => p.id === perfume.id)) {
        setSelectedPerfumes(selectedPerfumes.filter(p => p.id !== perfume.id));
      } else if (selectedPerfumes.length < 5) {
        setSelectedPerfumes([...selectedPerfumes, perfume]);
      }
    }
  };

  const renderPerfumeTab = () => (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <TextInput
            style={styles.searchText}
            placeholder="향수명을 검색하세요 (한글/영문)"
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={async () => {
                setSearchQuery('');
                setCurrentPage(1);
                // 검색어를 지우고 전체 목록 다시 로드
                try {
                  setLoading(true);
                  const result = await getPerfumesOptimized({
                    query: '', // 빈 검색어로 전체 목록 조회
                    page: 1,
                    limit: itemsPerPage,
                    sort_by: sortBy,
                    sort_order: sortOrder,
                  });
                  
                  if (result.success && result.data) {
                    setPerfumes(result.data.data);
                    setTotalCount(result.data.count);
                    console.log('✅ 검색 취소: 전체 목록 복원', result.data.data.length, '개');
                  }
                } catch (error) {
                  console.error('❌ 검색 취소 오류:', error);
                } finally {
                  setLoading(false);
                }
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <View style={styles.resultsLeft}>
          <Text style={styles.resultsText}>
            전체 <Text style={styles.resultsCount}>{totalCount.toLocaleString()}</Text>건
            {' '}({currentPage}페이지, {perfumes.length}개 표시)
          </Text>
        </View>
        <View style={styles.sortContainer}>
          <Text style={styles.sortText}>
            {sortBy === 'created_at' ? '최신순' : sortBy === 'price' ? '가격순' : '이름순'}
          </Text>
          <TouchableOpacity onPress={() => setShowSortModal(true)}>
            <Ionicons name="chevron-down" size={16} color="#444444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A7BC9" />
          <Text style={styles.loadingText}>향수 데이터를 불러오는 중...</Text>
        </View>
      ) : perfumes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="flask-outline" size={60} color="#CCCCCC" />
          <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
          <Text style={styles.emptySubtext}>다른 검색어나 필터를 시도해보세요</Text>
        </View>
      ) : (
        <>
          {/* 향수 카드 그리드 */}
          <View style={styles.perfumeGrid}>
            {perfumes.map((perfume, index) => (
              <TouchableOpacity 
                key={perfume.id || index} 
                style={styles.perfumeCard}
                onPress={() => {
                  if (perfume.id) {
                    loadPerfumeDetail(perfume.id);
                  } else {
                    console.warn('향수 ID가 없습니다:', perfume);
                  }
                }}
              >
                {/* 향수 이미지 */}
                <View style={styles.perfumeImageContainer}>
                  {perfume.image_url ? (
                    <Image 
                      source={{ uri: perfume.image_url }} 
                      style={styles.perfumeImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.perfumeImagePlaceholder}>
                      <Text style={styles.perfumeImagePlaceholderText}>
                        향수 대표{'\n'}이미지
                      </Text>
                    </View>
                  )}
                </View>
                
                {/* 브랜드명 */}
                <View style={styles.perfumeBrandContainer}>
                  <Text style={styles.perfumeBrandText} numberOfLines={2}>
                    {perfume.brand?.name_kr || perfume.brand?.name_en || '브랜드 정보 없음'}
                  </Text>
                </View>
                
                {/* 향수명 */}
                <View style={styles.perfumeNameContainer}>
                  <Text style={styles.perfumeNameText} numberOfLines={2}>
                    {perfume.name_kr || perfume.name || '이름 없음'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Pagination */}
      {!loading && perfumes.length > 0 && (
        <View style={styles.pagination}>
          <View style={styles.paginationLeft}>
            <TouchableOpacity 
              style={styles.pageButton}
              onPress={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "#CCCCCC" : "#444444"} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.pageButton}
              onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "#CCCCCC" : "#444444"} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
              const pageNum = startPage + i;
              return (
                <TouchableOpacity
                  key={pageNum}
                  style={[
                    styles.pageNumber,
                    currentPage === pageNum ? styles.activePageNumber : styles.inactivePageNumber
                  ]}
                  onPress={() => setCurrentPage(pageNum)}
                >
                  <Text style={[
                    styles.pageNumberText,
                    currentPage === pageNum ? styles.activePageNumberText : styles.inactivePageNumberText
                  ]}>
                    {pageNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.paginationRight}>
            <TouchableOpacity 
              style={styles.pageButton}
              onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? "#CCCCCC" : "#444444"} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.pageButton}
              onPress={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? "#CCCCCC" : "#444444"} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );

  const renderAnalysisTab = () => (
    <>
      {/* Analysis Instructions */}
      <View style={styles.analysisInstructions}>
        <Text style={styles.instructionText}>
          분석을 진행할 향수를 선택해주세요.{'\n'}(ex. 내가 좋아하는 향수, 내가 구매했던 향수 등)
        </Text>
        <Text style={styles.analysisTitle}>분석할 향수 (최대 5개)</Text>
        
        {/* Selected Perfumes */}
        <View style={styles.selectedPerfumesContainer}>
          {selectedPerfumes.length === 0 ? (
            <Text style={styles.noSelectionText}>선택된 향수가 없습니다.</Text>
          ) : (
            <View style={styles.selectedPerfumesList}>
              {selectedPerfumes.map((perfume, index) => (
                <View key={perfume.id} style={styles.selectedPerfumeItem}>
                  <Text style={styles.selectedPerfumeText}>
                    {index + 1}. {perfume.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handlePerfumeSelect(perfume)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={20} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Search Section */}
      <Text style={styles.analysisTitle}>향수 검색</Text>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <TextInput
            style={styles.searchText}
            placeholder="향수명, 브랜드, 어코드를 검색하세요"
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <View style={styles.resultsLeft}>
          <Text style={styles.resultsText}>
            전체 <Text style={styles.resultsCount}>1,234</Text>건
          </Text>
          <TouchableOpacity>
            <Ionicons name="filter" size={20} color="#343330" />
          </TouchableOpacity>
        </View>
        <View style={styles.sortContainer}>
          <Text style={styles.sortText}>추천순</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-down" size={16} color="#444444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Perfume Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A7BC9" />
          <Text style={styles.loadingText}>향수 데이터를 불러오는 중...</Text>
        </View>
      ) : perfumes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="flask-outline" size={60} color="#CCCCCC" />
          <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
          <Text style={styles.emptySubtext}>다른 검색어나 필터를 시도해보세요</Text>
        </View>
      ) : (
        <View style={styles.perfumeGrid}>
          {perfumes.map((perfume) => {
            const isSelected = selectedPerfumes.find(p => p.id === perfume.id);
            return (
              <TouchableOpacity 
                key={perfume.id} 
                style={[
                  styles.perfumeCard,
                  isSelected && styles.analysisPerfumeCardSelected
                ]}
                onPress={() => handlePerfumeSelect(perfume)}
              >
                {/* 향수 이미지 */}
                <View style={styles.perfumeImageContainer}>
                  {perfume.image_url ? (
                    <Image 
                      source={{ uri: perfume.image_url }} 
                      style={styles.perfumeImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.perfumeImagePlaceholder}>
                      <Text style={styles.perfumeImagePlaceholderText}>
                        향수 대표{'\n'}이미지
                      </Text>
                    </View>
                  )}
                  {isSelected && (
                    <View style={styles.analysisSelectionOverlay}>
                      <Ionicons name="checkmark-circle" size={30} color="#5A7BC9" />
                    </View>
                  )}
                </View>
                
                {/* 브랜드명 */}
                <View style={styles.perfumeBrandContainer}>
                  <Text style={styles.perfumeBrandText} numberOfLines={2}>
                    {perfume.brand?.name_kr || perfume.brand?.name_en || '브랜드 정보 없음'}
                  </Text>
                </View>
                
                {/* 향수명 */}
                <View style={styles.perfumeNameContainer}>
                  <Text style={styles.perfumeNameText} numberOfLines={2}>
                    {perfume.name_kr || perfume.name || '이름 없음'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Pagination */}
      <View style={styles.pagination}>
        <View style={styles.paginationLeft}>
          <TouchableOpacity style={styles.pageButton}>
            <Ionicons name="chevron-back" size={20} color="#444444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.pageButton}>
            <Ionicons name="chevron-back" size={20} color="#444444" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.pageNumbers}>
          {[1, 2, 3, 4, 5].map((page) => (
            <TouchableOpacity
              key={page}
              style={[
                styles.pageNumber,
                currentPage === page ? styles.activePageNumber : styles.inactivePageNumber
              ]}
              onPress={() => setCurrentPage(page)}
            >
              <Text style={[
                styles.pageNumberText,
                currentPage === page ? styles.activePageNumberText : styles.inactivePageNumberText
              ]}>
                {page}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.paginationRight}>
          <TouchableOpacity style={styles.pageButton}>
            <Ionicons name="chevron-forward" size={20} color="#444444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.pageButton}>
            <Ionicons name="chevron-forward" size={20} color="#444444" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderStatsTab = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsText}>준비 중입니다.</Text>
    </View>
  );

  // 테스트 실행 함수들
  const handleTest = async () => {
    setTestLoading(true);
    const data = await testSimplePerfumeData();
    setTestData(data || []);
    setTestLoading(false);
  };

  const handleSupabaseClientTest = async () => {
    setTestLoading(true);
    const result = await testSupabaseClient();
    if (result && result.success && result.data) {
      setTestData(result.data.data || []);
    } else {
      setTestData([]);
    }
    setTestLoading(false);
  };

  const renderPerfumeTestTab = () => {
    return (
      <View style={styles.testContainer}>
        <Text style={styles.testTitle}>🧪 향수 데이터 단순 테스트</Text>
        
        <View style={styles.testButtonsContainer}>
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={handleTest}
            disabled={testLoading}
          >
            <Text style={styles.testButtonText}>
              {testLoading ? '테스트 중...' : '1. 직접 Fetch 테스트'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.testButton, styles.testButtonSecondary]} 
            onPress={handleSupabaseClientTest}
            disabled={testLoading}
          >
            <Text style={[styles.testButtonText, styles.testButtonSecondaryText]}>
              {testLoading ? '테스트 중...' : '2. Supabase 클라이언트 테스트'}
            </Text>
          </TouchableOpacity>
        </View>

        {testLoading && (
          <View style={styles.testLoading}>
            <ActivityIndicator size="small" color="#5A7BC9" />
            <Text style={styles.testLoadingText}>데이터 로딩 중...</Text>
          </View>
        )}

        {testData.length > 0 && (
          <View style={styles.testResults}>
            <Text style={styles.testResultsTitle}>✅ 테스트 결과 ({testData.length}개):</Text>
            {testData.map((perfume, index) => (
              <View key={perfume.id || index} style={styles.testResultItem}>
                <Text style={styles.testResultText}>
                  {index + 1}. {perfume.name_kr || perfume.name || '이름 없음'}
                </Text>
                <Text style={styles.testResultSubtext}>
                  ID: {perfume.id}
                </Text>
              </View>
            ))}
          </View>
        )}

        {testData.length === 0 && !testLoading && (
          <View style={styles.testEmpty}>
            <Text style={styles.testEmptyText}>
              위 버튼을 눌러서 향수 데이터를 테스트해보세요.
            </Text>
          </View>
        )}
      </View>
    );
  };

  // 상세 화면 렌더링
  const renderPerfumeDetail = () => {
    if (detailLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A7BC9" />
          <Text style={styles.loadingText}>향수 상세 정보를 불러오는 중...</Text>
        </View>
      );
    }

    if (!perfumeDetail) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="flask-outline" size={60} color="#CCCCCC" />
          <Text style={styles.emptyText}>향수 정보를 찾을 수 없습니다.</Text>
          <TouchableOpacity style={styles.backButton} onPress={closePerfumeDetail}>
            <Text style={styles.backButtonText}>목록으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const handleBrandLinkPress = () => {
      if (perfumeDetail?.brand?.official_url) {
        Linking.openURL(perfumeDetail.brand.official_url);
      }
    };

    const handleFragranticaLinkPress = () => {
      if (perfumeDetail?.fragrantica_url) {
        Linking.openURL(perfumeDetail.fragrantica_url);
      }
    };

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 브랜드명 */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>
            {perfumeDetail.brand?.name_kr || perfumeDetail.brand?.name_en || '브랜드 정보 없음'}
          </Text>
        </View>

        {/* 향수명 */}
        <View style={styles.perfumeNameDetailContainer}>
          <Text style={styles.perfumeNameDetailText}>
            {perfumeDetail.name_kr || perfumeDetail.name || '이름 없음'}
          </Text>
        </View>

        {/* 향수 이미지 */}
        <View style={styles.perfumeImageDetailContainer}>
          {perfumeDetail.image_url ? (
            <Image
              source={{ uri: perfumeDetail.image_url }}
              style={styles.perfumeImageDetail}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.perfumeImagePlaceholderDetail}>
              <Text style={styles.perfumeImagePlaceholderTextDetail}>
                향수 대표{'\n'}이미지
              </Text>
            </View>
          )}
          {perfumeDetail.brand?.official_url && (
            <TouchableOpacity style={styles.brandLink} onPress={handleBrandLinkPress}>
              <Text style={styles.brandLinkText}>브랜드 링크</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 노트 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>노트</Text>
            {perfumeDetail.fragrantica_url && (
              <TouchableOpacity onPress={handleFragranticaLinkPress}>
                <Text style={styles.sectionSourceText}>출처 : Fragrantica</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.notesContent}>
            <View style={styles.noteBars}>
              {/* Top Note Bar */}
              <View style={[styles.noteBar, { height: 44, backgroundColor: 'rgba(90, 123, 201, 0.40)' }]} />
              {/* Middle Note Bar */}
              <View style={[styles.noteBar, { height: 44, backgroundColor: 'rgba(90, 123, 201, 0.70)' }]} />
              {/* Base Note Bar */}
              <View style={[styles.noteBar, { height: 44, backgroundColor: '#5A7BC9' }]} />
            </View>
            <View style={styles.noteLists}>
              {perfumeNotes.top.length > 0 && (
                <View style={styles.noteListRow}>
                  {perfumeNotes.top.map((note, i) => (
                    <Text key={`top-${i}`} style={styles.noteText}>{note}</Text>
                  ))}
                </View>
              )}
              {perfumeNotes.middle.length > 0 && (
                <View style={styles.noteListRow}>
                  {perfumeNotes.middle.map((note, i) => (
                    <Text key={`middle-${i}`} style={styles.noteText}>{note}</Text>
                  ))}
                </View>
              )}
              {perfumeNotes.base.length > 0 && (
                <View style={styles.noteListRow}>
                  {perfumeNotes.base.map((note, i) => (
                    <Text key={`base-${i}`} style={styles.noteText}>{note}</Text>
                  ))}
                </View>
              )}
              {perfumeNotes.top.length === 0 && perfumeNotes.middle.length === 0 && perfumeNotes.base.length === 0 && (
                <Text style={styles.noNotesText}>노트 정보가 없습니다.</Text>
              )}
            </View>
          </View>
        </View>

        {/* Fragrance Wheel 섹션 - 향후 구현 예정 (현재 주석처리) */}
        {/* 
        TODO: 향수 어코드 데이터를 활용한 Fragrance Wheel 차트 구현
        - perfume_accords 테이블의 accord_id를 활용
        - 원형 차트로 어코드별 분포 표시
        - 사용자 상호작용 (터치, 줌 등) 지원
        - 어코드별 색상 구분 및 라벨 표시
        */}
        {/*
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fragrance Wheel</Text>
            <TouchableOpacity style={styles.feedbackButton}>
              <Text style={styles.feedbackButtonText}>의견 보내기</Text>
              <Ionicons name="chevron-forward" size={12} color="#666666" />
            </TouchableOpacity>
          </View>
          <View style={styles.fragranceWheelPlaceholder}>
            <Text style={styles.fragranceWheelPlaceholderText}>Fragrance Wheel 차트 (추후 구현)</Text>
          </View>
        </View>
        */}

        {/* Tommy's Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TOMMY의 설명</Text>
          <Text style={styles.descriptionText}>
            {perfumeDetail.description || '향수 설명이 없습니다.'}
          </Text>
        </View>
      </ScrollView>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '향수':
        return renderPerfumeTab();
      case '분석':
        return renderAnalysisTab();
      case '통계':
        return renderStatsTab();
      case '향수테스트':
        return renderPerfumeTestTab();
      default:
        return renderPerfumeTab();
    }
  };

  // 상세 화면이 활성화된 경우 상세 화면 렌더링
  if (selectedPerfumeId) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closePerfumeDetail}>
            <Ionicons name="chevron-back" size={24} color="#444444" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>향수 상세</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#444444" />
          </TouchableOpacity>
        </View>

        {/* 상세 화면 내용 */}
        {renderPerfumeDetail()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>향수정보</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#444444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab ? styles.activeTab : styles.inactiveTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab ? styles.activeTabText : styles.inactiveTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tab: {
    height: 36,
    paddingHorizontal: 24,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#5A7BC9',
  },
  inactiveTab: {
    backgroundColor: '#F8F8F8',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 26,
  },
  activeTabText: {
    color: '#ffffff',
  },
  inactiveTabText: {
    color: '#999999',
    fontWeight: '400',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: '#222222',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resultsText: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '500',
  },
  resultsCount: {
    color: '#5A7BC9',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '400',
  },
  perfumeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  perfumeCard: {
    width: '47%', // 2열 그리드
    flexDirection: 'column',
    gap: 10,
  },
  perfumeImageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#F6E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  perfumeImage: {
    width: '100%',
    height: '100%',
  },
  perfumeImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F6E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  perfumeImagePlaceholderText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  perfumeBrandContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfumeBrandText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
  },
  perfumeNameContainer: {
    width: '100%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfumeNameText: {
    color: '#222222',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
  },
  // Analysis Tab - Selected Card Style
  analysisPerfumeCardSelected: {
    borderWidth: 2,
    borderColor: '#5A7BC9',
    borderRadius: 8,
    padding: 8,
  },
  analysisSelectionOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  paginationLeft: {
    flexDirection: 'row',
    gap: 6,
  },
  paginationRight: {
    flexDirection: 'row',
    gap: 6,
  },
  pageButton: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 20,
  },
  pageNumber: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePageNumber: {
    backgroundColor: '#5A7BC9',
  },
  inactivePageNumber: {
    backgroundColor: 'transparent',
  },
  pageNumberText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
  activePageNumberText: {
    color: '#ffffff',
  },
  inactivePageNumberText: {
    color: '#444444',
    fontWeight: '400',
  },
  // Analysis Tab Styles
  analysisInstructions: {
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 8,
  },
  analysisTitle: {
    fontSize: 15,
    color: '#444444',
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 8,
  },
  selectedPerfumesContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  noSelectionText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
    lineHeight: 22,
  },
  selectedPerfumesList: {
    width: '100%',
    paddingHorizontal: 16,
  },
  selectedPerfumeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  selectedPerfumeText: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '500',
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#888888',
    marginVertical: 20,
  },
  // Stats Tab Styles
  statsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  statsText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '500',
  },
  // Loading & Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '400',
  },
  perfumePrice: {
    fontSize: 14,
    color: '#5A7BC9',
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  // Test Tab Styles
  testContainer: {
    padding: 20,
    gap: 20,
  },
  testTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 10,
  },
  testButtonsContainer: {
    gap: 12,
  },
  testButton: {
    backgroundColor: '#5A7BC9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonSecondary: {
    backgroundColor: '#FF6B6B',
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  testButtonSecondaryText: {
    color: '#ffffff',
  },
  testLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
  },
  testLoadingText: {
    fontSize: 14,
    color: '#666666',
  },
  testResults: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  testResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 12,
  },
  testResultItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  testResultText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222222',
    marginBottom: 2,
  },
  testResultSubtext: {
    fontSize: 12,
    color: '#666666',
  },
  testEmpty: {
    padding: 40,
    alignItems: 'center',
  },
  testEmptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  // Simple List Styles
  simpleList: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  simpleListItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  simpleListText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222222',
    marginBottom: 2,
  },
  simpleListSubtext: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  // 상세 화면 스타일
  brandContainer: {
    marginBottom: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
  },
  perfumeNameDetailContainer: {
    marginBottom: 20,
  },
  perfumeNameDetailText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
  },
  perfumeImageDetailContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  perfumeImageDetail: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  perfumeImagePlaceholderDetail: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  perfumeImagePlaceholderTextDetail: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
  brandLink: {
    backgroundColor: '#5A7BC9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  brandLinkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
  },
  sectionSourceText: {
    fontSize: 12,
    color: '#666666',
    textDecorationLine: 'underline',
  },
  notesContent: {
    flexDirection: 'row',
    gap: 16,
  },
  noteBars: {
    width: 8,
    gap: 4,
  },
  noteBar: {
    borderRadius: 4,
  },
  noteLists: {
    flex: 1,
    gap: 4,
  },
  noteListRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#444444',
    backgroundColor: '#F8F9FA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  noNotesText: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedbackButtonText: {
    fontSize: 12,
    color: '#666666',
  },
  fragranceWheelPlaceholder: {
    backgroundColor: '#F8F9FA',
    padding: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  fragranceWheelPlaceholderText: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
  descriptionText: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: '#5A7BC9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 
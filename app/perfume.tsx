import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PerfumeScreen() {
  const [activeTab, setActiveTab] = useState('향수');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPerfumes, setSelectedPerfumes] = useState<any[]>([]);

  const tabs = ['향수', '분석', '통계'];
  
  const mockPerfumes = [
    {
      id: 1,
      brand: '메종 마르지엘라',
      name: '레플리카 레이지 선데이 모닝 더 클래식 에디션 오 드 뚜왈렛',
      image: '#F6E0E0'
    },
    {
      id: 2,
      brand: '바이레도',
      name: '블랑쉬 오 드 퍼퓸',
      image: '#F6E0E0'
    },
    {
      id: 3,
      brand: '바이레도',
      name: '블랑쉬 오 드 퍼퓸',
      image: '#F6E0E0'
    },
    {
      id: 4,
      brand: '바이레도',
      name: '블랑쉬 오 드 퍼퓸',
      image: '#F6E0E0'
    },
    {
      id: 5,
      brand: '바이레도',
      name: '블랑쉬 오 드 퍼퓸',
      image: '#F6E0E0'
    },
    {
      id: 6,
      brand: '바이레도',
      name: '블랑쉬 오 드 퍼퓸',
      image: '#F6E0E0'
    }
  ];

  const totalItems = 1234;
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePerfumeSelect = (perfume: any) => {
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
      <View style={styles.perfumeGrid}>
        {mockPerfumes.map((perfume) => (
          <TouchableOpacity key={perfume.id} style={styles.perfumeCard}>
            <View style={[styles.perfumeImage, { backgroundColor: perfume.image }]}>
              <Text style={styles.imagePlaceholder}>향수 대표{'\n'}이미지</Text>
            </View>
            <Text style={styles.perfumeBrand}>{perfume.brand}</Text>
            <Text style={styles.perfumeName} numberOfLines={2}>
              {perfume.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
      <View style={styles.perfumeGrid}>
        {mockPerfumes.map((perfume) => {
          const isSelected = selectedPerfumes.find(p => p.id === perfume.id);
          return (
            <TouchableOpacity 
              key={perfume.id} 
              style={[
                styles.perfumeCard,
                isSelected && styles.selectedPerfumeCard
              ]}
              onPress={() => handlePerfumeSelect(perfume)}
            >
              <View style={[styles.perfumeImage, { backgroundColor: perfume.image }]}>
                <Text style={styles.imagePlaceholder}>향수 대표{'\n'}이미지</Text>
                {isSelected && (
                  <View style={styles.selectionOverlay}>
                    <Ionicons name="checkmark-circle" size={30} color="#5A7BC9" />
                  </View>
                )}
              </View>
              <Text style={styles.perfumeBrand}>{perfume.brand}</Text>
              <Text style={styles.perfumeName} numberOfLines={2}>
                {perfume.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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

  const renderTabContent = () => {
    switch (activeTab) {
      case '향수':
        return renderPerfumeTab();
      case '분석':
        return renderAnalysisTab();
      case '통계':
        return renderStatsTab();
      default:
        return renderPerfumeTab();
    }
  };

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
    justifyContent: 'center',
  },
  searchText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
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
  },
  perfumeCard: {
    width: 150,
    alignItems: 'flex-start',
    gap: 10,
  },
  selectedPerfumeCard: {
    borderWidth: 2,
    borderColor: '#5A7BC9',
    borderRadius: 8,
    padding: 8,
  },
  perfumeImage: {
    width: '100%',
    height: 150,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
  },
  imagePlaceholder: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  perfumeBrand: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
  },
  perfumeName: {
    fontSize: 16,
    color: '#222222',
    fontWeight: '500',
    textAlign: 'center',
    width: '100%',
    height: 32,
    lineHeight: 16,
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
}); 
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCommunityPosts, getBoardCategories } from '../lib/services/communityService';
import { CommunityPostWithDetails, BoardCategory } from '../lib/types';
import { testCommunityConnection } from '../lib/supabase/client';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('향수게시판');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // 데이터 상태
  const [posts, setPosts] = useState<CommunityPostWithDetails[]>([]);
  const [categories, setCategories] = useState<BoardCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // 게시글 상세 화면 상태
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postDetail, setPostDetail] = useState<CommunityPostWithDetails | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  // TODO: 향후 구현 예정인 탭들은 주석처리
  const tabs = ['향수게시판', '공지사항'];
  // const tabs = ['향수게시판', '자유게시판', '메거진', '이벤트', '공지사항'];
  const itemsPerPage = 10;
  // totalPages가 0이면 최소 1페이지로 설정 (게시글이 있을 때)
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / itemsPerPage) : (posts.length > 0 ? Math.ceil(posts.length / itemsPerPage) : 0);

  // 카테고리 매핑 (실제 카테고리 이름으로 ID 찾기)
  const getCategoryId = (tabName: string): string | undefined => {
    const category = categories.find(cat => cat.name === tabName);
    console.log('🔍 getCategoryId:', { 
      tabName, 
      foundCategory: category?.name, 
      categoryId: category?.id,
      allCategories: categories.map(c => c.name)
    });
    return category?.id;
  };

  // 게시글 상세 로딩
  const loadPostDetail = async (postId: string) => {
    try {
      setDetailLoading(true);
      setSelectedPostId(postId);
      
      console.log('🔍 게시글 상세 로딩:', postId);
      
      // 현재 posts 배열에서 찾기 (임시)
      const found = posts.find(p => p.id === postId);
      if (found) {
        setPostDetail(found);
        console.log('✅ 게시글 상세 로드 완료:', found.title);
      } else {
        Alert.alert('오류', '게시글을 찾을 수 없습니다.');
        setSelectedPostId(null);
      }
    } catch (error) {
      console.error('❌ 게시글 상세 로딩 오류:', error);
      Alert.alert('오류', '게시글을 불러오는 중 오류가 발생했습니다.');
      setSelectedPostId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // 게시글 상세 닫기
  const closePostDetail = () => {
    setSelectedPostId(null);
    setPostDetail(null);
  };

  // 게시글 목록 로딩
  const loadPosts = async () => {
    try {
      const categoryId = getCategoryId(activeTab);
      console.log('🔍 loadPosts: 시작', { 
        activeTab, 
        categoryId,
        categoriesCount: categories.length,
        searchQuery, 
        currentPage 
      });
      setLoading(true);
      
      const result = await getCommunityPosts({
        category_id: categoryId,
        query: searchQuery,
        page: currentPage,
        limit: itemsPerPage,
        sort_by: 'created_at',
        sort_order: 'desc'
      });

      if (result.success && result.data) {
        setPosts(result.data.data);
        setTotalCount(result.data.count); // 서비스에서 반환한 값 그대로 사용
        console.log('✅ 게시글 로딩 성공:', {
          loaded: result.data.data.length,
          totalCount: result.data.count,
          totalPages: result.data.total_pages,
          page: currentPage
        });
      } else {
        console.error('❌ 게시글 로딩 실패:', result.error);
        Alert.alert('오류', result.error || '게시글을 불러오는 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('❌ loadPosts 예외:', error);
      Alert.alert('오류', '게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 목록 로딩
  const loadCategories = async () => {
    try {
      console.log('🔍 loadCategories: 시작');
      const result = await getBoardCategories();
      
      if (result.success && result.data) {
        setCategories(result.data);
        console.log('✅ 카테고리 로딩 성공:', result.data.length, '개');
      } else {
        console.error('❌ 카테고리 로딩 실패:', result.error);
      }
    } catch (error) {
      console.error('❌ loadCategories 예외:', error);
    }
  };

  // 초기 데이터 로딩 (API 키 문제 해결 후 다시 활성화)
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('🚀 커뮤니티 초기 데이터 로딩 시작');
      
      // 먼저 연결 테스트
      const testResult = await testCommunityConnection();
      if (!testResult.success) {
        console.error('❌ 커뮤니티 연결 테스트 실패:', testResult.error);
        setLoading(false);
        return;
      }
      
      console.log('✅ 커뮤니티 연결 테스트 성공');
      
      // 카테고리를 먼저 로드하고 완료 후 게시글 로드
      await loadCategories();
    };
    
    loadInitialData();
  }, []);

  // 카테고리가 로드되면 처음 한 번만 게시글 로드
  useEffect(() => {
    if (categories.length > 0 && posts.length === 0) {
      loadPosts();
    }
  }, [categories.length]);

  // 탭 변경 시 데이터 다시 로딩
  useEffect(() => {
    if (activeTab && categories.length > 0) {
      setCurrentPage(1); // 페이지 초기화
      loadPosts();
    }
  }, [activeTab]);

  // 페이지 변경 시 데이터 다시 로딩
  useEffect(() => {
    if (currentPage > 0) {
      loadPosts();
    }
  }, [currentPage]);

  // 검색 실행
  const handleSearch = async () => {
    setCurrentPage(1); // 페이지 초기화
    await loadPosts();
  };
  
  // 시간 포맷팅 함수
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return postDate.toLocaleDateString('ko-KR');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // 게시글 상세 화면 렌더링
  const renderPostDetail = () => {
    if (detailLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A7BC9" />
          <Text style={styles.loadingText}>게시글을 불러오는 중...</Text>
        </View>
      );
    }

    if (!postDetail) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>게시글을 찾을 수 없습니다</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
        {/* 게시글 본문 */}
        <View style={styles.detailPostCard}>
          {/* 제목 및 메타 정보 */}
          <View style={styles.detailPostHeader}>
            <Text style={styles.detailPostTitle}>{postDetail.title}</Text>
            
            {/* 작성자 정보 */}
            <View style={styles.authorSection}>
              <View style={styles.authorAvatar}>
                {postDetail.user?.avatar_url ? (
                  <Image 
                    source={{ uri: postDetail.user.avatar_url }} 
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={20} color="#999999" />
                  </View>
                )}
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>
                  {postDetail.user?.nickname || '익명'}
                </Text>
                <View style={styles.postMeta}>
                  <Text style={styles.metaText}>조회</Text>
                  <Text style={styles.metaText}>{formatNumber(postDetail.view_count || 0)}</Text>
                  <Text style={styles.metaSeparator}>•</Text>
                  <Text style={styles.metaText}>{formatTimeAgo(postDetail.created_at)}</Text>
                </View>
              </View>
            </View>

            {/* 통계 정보 */}
            <View style={styles.detailStatsRow}>
              <View style={styles.detailStatItem}>
                <Ionicons name="chatbubble-outline" size={20} color="#444444" />
                <Text style={styles.detailStatText}>{formatNumber(postDetail.comment_count || 0)}</Text>
              </View>
              <View style={styles.detailStatItem}>
                <Ionicons name="heart-outline" size={20} color="#AB8A73" />
                <Text style={styles.detailStatText}>{formatNumber(postDetail.like_count || 0)}</Text>
              </View>
              <TouchableOpacity style={styles.detailStatItem}>
                <Ionicons name="share-outline" size={20} color="#444444" />
                <Text style={styles.detailStatText}>공유하기</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 본문 내용 */}
          <View style={styles.detailPostBody}>
            <Text style={styles.detailPostContent}>{postDetail.content}</Text>
            
            {/* TODO: 이미지 갤러리 (향후 구현) */}
            {postDetail.image_urls && postDetail.image_urls.length > 0 && (
              <View style={styles.detailImageGallery}>
                {postDetail.image_urls.map((url, index) => (
                  <Image 
                    key={index}
                    source={{ uri: url }} 
                    style={styles.detailPostImage}
                    resizeMode="cover"
                  />
                ))}
              </View>
            )}
          </View>

          {/* 하단 액션 바 */}
          <View style={styles.postActions}>
            <View style={styles.actionLeft}>
              <View style={styles.actionItem}>
                <Ionicons name="chatbubble-outline" size={20} color="#444444" />
                <Text style={styles.actionLabel}>댓글수</Text>
                <Text style={styles.actionValue}>{formatNumber(postDetail.comment_count || 0)}</Text>
              </View>
              <View style={styles.actionItem}>
                <Ionicons name="heart-outline" size={20} color="#AB8A73" />
                <Text style={styles.actionLabel}>좋아요</Text>
                <Text style={styles.actionValue}>{formatNumber(postDetail.like_count || 0)}</Text>
              </View>
            </View>
            
            <View style={styles.actionRight}>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share-outline" size={20} color="#444444" />
                <Text style={styles.shareButtonText}>공유하기</Text>
              </TouchableOpacity>
              
              {/* 작성자만 수정/삭제 가능 (TODO: 권한 체크) */}
              <View style={styles.ownerActions}>
                <TouchableOpacity style={styles.ownerActionItem}>
                  <Ionicons name="create-outline" size={20} color="#444444" />
                  <Text style={styles.ownerActionText}>수정하기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ownerActionItem}>
                  <Ionicons name="trash-outline" size={20} color="#444444" />
                  <Text style={styles.ownerActionText}>삭제하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 댓글 섹션 (임시 UI) */}
        <View style={styles.commentsSection}>
          <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <View style={styles.commentAvatar}>
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={16} color="#999999" />
                </View>
              </View>
              <View style={styles.commentInfo}>
                <Text style={styles.commentAuthor}>승범 yang</Text>
                <Text style={styles.commentTime}>25.04.18</Text>
                <Text style={styles.commentText}>
                  저 향 너무좋죠. 돌체 엔 가바나는 자주쓰는데 레이어링으로 샤넬 써봐야 겠어요.
                </Text>
                <TouchableOpacity style={styles.replyButton}>
                  <Ionicons name="chatbubble-outline" size={16} color="#444444" />
                  <Text style={styles.replyButtonText}>답글쓰기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 대댓글 예시 */}
          <View style={[styles.commentCard, styles.replyComment]}>
            <View style={styles.commentHeader}>
              <View style={styles.commentAvatar}>
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={16} color="#999999" />
                </View>
              </View>
              <View style={styles.commentInfo}>
                <View style={styles.authorWithBadge}>
                  <Text style={styles.commentAuthor}>현걍걍걍걍</Text>
                  <View style={styles.authorBadge}>
                    <Text style={styles.authorBadgeText}>작성자</Text>
                  </View>
                </View>
                <Text style={styles.commentTime}>8시간 전</Text>
                <Text style={styles.commentText}>
                  <Text style={styles.mentionText}>@제서니 </Text>
                  오 작성자님 다른 향수 또 추천해 주실 수 있나요? 저랑 취향이 비슷하시네요.
                </Text>
                <TouchableOpacity style={styles.replyButton}>
                  <Ionicons name="chatbubble-outline" size={16} color="#444444" />
                  <Text style={styles.replyButtonText}>답글쓰기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 댓글 입력창 */}
          <View style={styles.commentInputCard}>
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="댓글을 남겨주세요."
                placeholderTextColor="#999999"
                multiline
              />
              <View style={styles.commentInputActions}>
                <Ionicons name="attach-outline" size={16} color="#444444" />
                <TouchableOpacity>
                  <Text style={styles.commentSubmitText}>등록</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 이전글/다음글 네비게이션 */}
        <View style={styles.postNavigation}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="chevron-up-outline" size={20} color="#444444" />
            <Text style={styles.navText}>이전글</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.backToListButton} onPress={closePostDetail}>
            <Text style={styles.backToListText}>목록으로</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>다음글</Text>
            <Ionicons name="chevron-down-outline" size={20} color="#444444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // 상세 화면이 활성화된 경우 상세 화면 렌더링
  if (selectedPostId) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closePostDetail}>
            <Ionicons name="chevron-back" size={24} color="#444444" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>게시글</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#444444" />
          </TouchableOpacity>
        </View>
        {renderPostDetail()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>커뮤니티</Text>
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

        {/* Posts List - 간단한 UI */}
        <View style={styles.postsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5A7BC9" />
              <Text style={styles.loadingText}>게시글을 불러오는 중...</Text>
            </View>
          ) : posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubble-outline" size={60} color="#CCCCCC" />
              <Text style={styles.emptyText}>게시글이 없습니다</Text>
              <Text style={styles.emptySubtext}>첫 번째 게시글을 작성해보세요!</Text>
            </View>
          ) : (
            posts.map((post) => (
              <TouchableOpacity 
                key={post.id} 
                style={styles.simplePostItem}
                onPress={() => loadPostDetail(post.id)}
              >
                <Text style={styles.simplePostTitle}>{post.title}</Text>
                <Text style={styles.simplePostContent} numberOfLines={2}>
                  {post.content}
                </Text>
                <Text style={styles.simplePostMeta}>
                  {post.user?.nickname || '익명'} • {formatTimeAgo(post.created_at)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Pagination - 향수 페이지와 동일한 방식 */}
        {(() => {
          console.log('🔍 페이지네이션 렌더링:', {
            loading,
            postsLength: posts.length,
            totalCount,
            totalPages,
            shouldShow: !loading && posts.length > 0
          });
          return !loading && posts.length > 0;
        })() && (
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
              {(() => {
                const pageCount = Math.min(5, totalPages || 1);
                console.log('🔍 페이지 번호 생성:', { totalPages, pageCount });
                return Array.from({ length: pageCount }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
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
                });
              })()}
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

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <TextInput
              style={styles.searchText}
              placeholder="게시글을 검색하세요"
              placeholderTextColor="#666666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                  handleSearch();
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
      </ScrollView>

      {/* Write Button */}
      <TouchableOpacity style={styles.writeButton}>
        <Text style={styles.writeButtonText}>글쓰기</Text>
      </TouchableOpacity>
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
    flexWrap: 'wrap',
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
  postsContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  postCard: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  postContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 20,
  },
  postLeft: {
    flex: 1,
  },
  postInfo: {
    gap: 2,
  },
  postCategory: {
    fontSize: 12,
    color: '#222222',
    fontWeight: '500',
    lineHeight: 14,
  },
  noticeCategory: {
    color: '#5A7BC9',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  listPostTitle: {
    flex: 1,
    fontSize: 14,
    color: '#222222',
    fontWeight: '500',
    lineHeight: 28,
  },
  newBadge: {
    width: 16,
    height: 16,
    backgroundColor: '#5A7BC9',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '500',
    lineHeight: 10,
  },
  postAuthor: {
    fontSize: 12,
    color: '#222222',
    fontWeight: '500',
    lineHeight: 14,
    marginTop: 2,
  },
  postImage: {
    width: 60,
    height: 60,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 10,
    color: '#666666',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '400',
    lineHeight: 14,
  },
  statValue: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '400',
    lineHeight: 14,
  },
  timeAgo: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '400',
    lineHeight: 14,
  },
  interactionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  interactionText: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '400',
    lineHeight: 14,
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
  writeButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    height: 44,
    paddingHorizontal: 24,
    backgroundColor: '#222222',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  writeButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '400',
    lineHeight: 24,
  },
  // 로딩 및 빈 상태 스타일
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 10,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  // 검색 관련 스타일
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
  },
  // 페이지네이션 스타일 (향수 페이지와 동일)
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
    alignItems: 'center',
  },
  pageNumber: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 4,
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
    lineHeight: 24,
    textAlign: 'center',
  },
  activePageNumberText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  inactivePageNumberText: {
    color: '#444444',
    fontWeight: '400',
  },
  // 간단한 게시글 스타일
  simplePostItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  simplePostTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  simplePostContent: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  simplePostMeta: {
    fontSize: 12,
    color: '#999999',
  },
  // 게시글 상세 화면 스타일
  detailContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  detailPostCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 0,
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  detailPostHeader: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    gap: 16,
  },
  detailPostTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222222',
    lineHeight: 30,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
    lineHeight: 22,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  metaSeparator: {
    fontSize: 14,
    color: '#666666',
    marginHorizontal: 4,
  },
  detailStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailStatText: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 22,
  },
  detailPostBody: {
    paddingVertical: 16,
    gap: 16,
  },
  detailPostContent: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 22,
  },
  detailImageGallery: {
    gap: 10,
  },
  detailPostImage: {
    width: '100%',
    height: 240,
    borderRadius: 8,
  },
  postActions: {
    paddingTop: 20,
    gap: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444444',
    lineHeight: 22,
  },
  actionValue: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444444',
    lineHeight: 22,
  },
  ownerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ownerActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ownerActionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444444',
    lineHeight: 22,
  },
  // 댓글 섹션 스타일
  commentsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  commentCard: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  replyComment: {
    paddingLeft: 50,
    backgroundColor: '#ffffff',
  },
  commentHeader: {
    flexDirection: 'row',
    gap: 10,
  },
  commentAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInfo: {
    flex: 1,
    gap: 8,
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222222',
    lineHeight: 22,
  },
  authorWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorBadge: {
    backgroundColor: '#5A7BC9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  authorBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    lineHeight: 16,
  },
  commentTime: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  commentText: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 22,
  },
  mentionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#947A5D',
    lineHeight: 22,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  replyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444444',
    lineHeight: 20,
  },
  commentInputCard: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  commentInputContainer: {
    minHeight: 94,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    justifyContent: 'space-between',
  },
  commentInput: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 22,
    flex: 1,
  },
  commentInputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  commentSubmitText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
  },
  // 이전글/다음글 네비게이션
  postNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444444',
    lineHeight: 22,
  },
  backToListButton: {
    minWidth: 106,
    height: 44,
    paddingHorizontal: 24,
    backgroundColor: '#222222',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToListText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
}); 
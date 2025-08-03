import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('향수게시판');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ['향수게시판', '자유게시판', '메거진', '이벤트', '공지사항'];
  
  const mockPosts = [
    {
      id: 1,
      category: '[공지사항]',
      title: '드디어 왔습니다! 브아도르망, 이리스 토르',
      author: '현걍걍걍',
      views: 1200,
      likes: 1014,
      comments: 1144,
      timeAgo: '21시간 전',
      hasImage: true,
      isNotice: true,
      isNew: false,
      backgroundColor: '#F8F8F8'
    },
    {
      id: 2,
      category: '[일반]',
      title: '드디어 왔습니다! 브아도르망, 이리스 토르',
      author: '현걍걍걍',
      views: 1200,
      likes: 1014,
      comments: 1144,
      timeAgo: '21시간 전',
      hasImage: true,
      isNotice: false,
      isNew: true,
      backgroundColor: '#ffffff'
    },
    {
      id: 3,
      category: '[일반]',
      title: '드디어 왔습니다! 브아도르망, 이리스 토르',
      author: '현걍걍걍',
      views: 1200,
      likes: 1014,
      comments: 1144,
      timeAgo: '21시간 전',
      hasImage: true,
      isNotice: false,
      isNew: false,
      backgroundColor: '#ffffff'
    },
    {
      id: 4,
      category: '[일반]',
      title: '드디어 왔습니다! 브아도르망, 이리스 토르',
      author: '현걍걍걍',
      views: 1200,
      likes: 1014,
      comments: 1144,
      timeAgo: '21시간 전',
      hasImage: true,
      isNotice: false,
      isNew: false,
      backgroundColor: '#ffffff'
    },
    {
      id: 5,
      category: '[일반]',
      title: '드디어 왔습니다! 브아도르망, 이리스 토르 아아그렇구',
      author: '현걍걍걍',
      views: 1200,
      likes: 1014,
      comments: 1144,
      timeAgo: '21시간 전',
      hasImage: false,
      isNotice: false,
      isNew: false,
      backgroundColor: '#ffffff'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

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

        {/* Posts List */}
        <View style={styles.postsContainer}>
          {mockPosts.map((post) => (
            <TouchableOpacity key={post.id} style={[styles.postCard, { backgroundColor: post.backgroundColor }]}>
              <View style={styles.postContent}>
                <View style={styles.postLeft}>
                  <View style={styles.postInfo}>
                    <Text style={[
                      styles.postCategory,
                      post.isNotice && styles.noticeCategory
                    ]}>
                      {post.category}
                    </Text>
                    <View style={styles.titleContainer}>
                      <Text style={styles.postTitle} numberOfLines={1}>
                        {post.title}
                      </Text>
                      {post.isNew && (
                        <View style={styles.newBadge}>
                          <Text style={styles.newBadgeText}>N</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.postAuthor}>{post.author}</Text>
                  </View>
                </View>
                {post.hasImage && (
                  <View style={styles.postImage}>
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.imageText}>이미지</Text>
                    </View>
                  </View>
                )}
              </View>
              
              <View style={styles.postFooter}>
                <View style={styles.postStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>조회</Text>
                    <Text style={styles.statValue}>{formatNumber(post.views)}</Text>
                  </View>
                  <Text style={styles.timeAgo}>{post.timeAgo}</Text>
                </View>
                
                <View style={styles.interactionStats}>
                  <View style={styles.interactionItem}>
                    <Ionicons name="heart" size={14} color="#444444" />
                    <Text style={styles.interactionText}>{formatNumber(post.likes)}</Text>
                  </View>
                  <View style={styles.interactionItem}>
                    <Ionicons name="chatbubble" size={14} color="#444444" />
                    <Text style={styles.interactionText}>{formatNumber(post.comments)}</Text>
                  </View>
                </View>
              </View>
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

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <TextInput
              style={styles.searchText}
              placeholder="게시글을 검색하세요"
              placeholderTextColor="#666666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.searchButton}>
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
  postTitle: {
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
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
}); 
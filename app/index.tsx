import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('공지사항');

  const posts = [
    { id: 1, title: '드디어 왔습니다! 브아도르망, 이리스 토르피', time: '6시간 전' },
    { id: 2, title: '저, 오르페옹 모른다고 생각했거둔요?🙄 (고양이는향수를싫어해님의 소분)', time: '12시간 전' },
    { id: 3, title: '샤넬 샹스 오 스플렌디드 이거.... 랑방 에끌라쥬랑 너무 비슷한데요?', time: '25.04.15' },
    { id: 4, title: '시향 후 들였는데도 실패한 후기 ㅠㅠ😥', time: '25.04.15' },
    { id: 5, title: '드디어 왔습니다! 브아도르망, 이리스 토르피', time: '25.04.15' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nostum</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#444444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Perfume Section */}
        <View style={styles.todaySection}>
          <View style={styles.todayIllustration}>
            {/* 일러스트레이션 영역 - 추후 SVG나 이미지로 교체 */}
            <View style={styles.illustrationPlaceholder}>
              <View style={styles.illustrationCircle} />
              <View style={styles.illustrationRect1} />
              <View style={styles.illustrationRect2} />
            </View>
          </View>
          
          <Text style={styles.todayText}>오늘 뿌린 향수를{'\n'}등록해주세요</Text>
          
          <TouchableOpacity 
            style={styles.todayButton}
            onPress={() => {
              // TODO: 향수 등록 화면으로 이동
              console.log('향수 등록하기');
            }}
          >
            <Ionicons name="add" size={24} color="#CCCCCC" />
          </TouchableOpacity>
          
          <Text style={styles.todaySubtext}>오늘은 어떤 향이날까?</Text>
          
          <TouchableOpacity 
            style={styles.tommyButton}
            onPress={() => {
              router.push('/chatbot');
            }}
          >
            <Text style={styles.tommyButtonText}>Tommy와 대화하기</Text>
            <Ionicons name="chevron-forward" size={16} color="#444444" />
          </TouchableOpacity>
        </View>

        {/* Latest Posts Section */}
        <View style={styles.postsSection}>
          <View style={styles.postsSectionHeader}>
            <Text style={styles.postsSectionTitle}>최신글</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === '향수게시판' && styles.activeTab]}
              onPress={() => setActiveTab('향수게시판')}
            >
              <Text style={[styles.tabText, activeTab === '향수게시판' && styles.activeTabText]}>
                향수게시판
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === '공지사항' && styles.activeTab]}
              onPress={() => setActiveTab('공지사항')}
            >
              <Text style={[styles.tabText, activeTab === '공지사항' && styles.activeTabText]}>
                공지사항
              </Text>
            </TouchableOpacity>
          </View>

          {/* Posts List */}
          <View style={styles.postsList}>
            {posts.map((post, index) => (
              <TouchableOpacity
                key={post.id}
                style={[
                  styles.postItem,
                  index === posts.length - 1 && styles.postItemLast
                ]}
                onPress={() => {
                  // TODO: 게시글 상세로 이동
                  console.log('게시글 클릭:', post.title);
                }}
              >
                <View style={styles.postContent}>
                  <Text style={styles.postTitle} numberOfLines={1}>
                    {post.title}
                  </Text>
                </View>
                <Text style={styles.postTime}>{post.time}</Text>
              </TouchableOpacity>
            ))}

            {/* Go to Board Button */}
            <TouchableOpacity
              style={styles.goToBoardButton}
              onPress={() => {
                router.push('/community');
              }}
            >
              <Text style={styles.goToBoardText}>공지사항 바로가기</Text>
              <Ionicons name="chevron-forward" size={14} color="#444444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 하단 여백 */}
        <View style={{ height: 40 }} />
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
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  todaySection: {
    alignSelf: 'stretch',
    position: 'relative',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  todayIllustration: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#F0F4FF',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  illustrationCircle: {
    width: 100,
    height: 100,
    backgroundColor: '#9BB6F6',
    borderRadius: 50,
  },
  illustrationRect1: {
    position: 'absolute',
    width: 40,
    height: 60,
    backgroundColor: '#87A7F3',
    borderRadius: 4,
    top: 70,
    left: 60,
  },
  illustrationRect2: {
    position: 'absolute',
    width: 30,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#222222',
    bottom: 50,
    right: 50,
  },
  todayText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 14,
  },
  todayButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F4F4F4',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todaySubtext: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
  },
  tommyButton: {
    position: 'absolute',
    left: 12,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tommyButtonText: {
    color: '#222222',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  postsSection: {
    alignSelf: 'stretch',
    gap: 10,
  },
  postsSectionHeader: {
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postsSectionTitle: {
    color: '#222222',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 36,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    height: 36,
    paddingHorizontal: 24,
    backgroundColor: '#F8F8F8',
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#5A7BC9',
  },
  tabText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  postsList: {
    alignSelf: 'stretch',
    borderRadius: 10,
    overflow: 'hidden',
  },
  postItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  postItemLast: {
    borderBottomWidth: 0,
  },
  postContent: {
    flex: 1,
  },
  postTitle: {
    color: '#222222',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 28,
  },
  postTime: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
  },
  goToBoardButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  goToBoardText: {
    color: '#444444',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
});

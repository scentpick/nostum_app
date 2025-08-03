import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const menuSections = [
    {
      id: 1,
      title: '내 정보',
      items: [
        { id: 1, title: '오늘 뿌린 향수들', icon: 'flask' },
        { id: 2, title: '향수 보관함', icon: 'archive' },
        { id: 3, title: '분석 이력', icon: 'analytics' }
      ]
    },
    {
      id: 2,
      title: '내가 쓴 글',
      items: [
        { id: 4, title: '나의 게시글', icon: 'document-text' },
        { id: 5, title: '나의 댓글', icon: 'chatbubble' }
      ]
    },
    {
      id: 3,
      title: '계정',
      items: [
        { id: 6, title: '로그아웃', icon: 'log-out-outline' },
        { id: 7, title: '탈퇴하기', icon: 'trash-outline' }
      ]
    },
    {
      id: 4,
      title: '기타',
      items: [
        { id: 8, title: '개인정보처리방침', icon: 'shield-checkmark' },
        { id: 9, title: '문의하기', icon: 'mail' }
      ]
    }
  ];

  const handleMenuPress = (item: any) => {
    console.log(`${item.title} 메뉴 선택`);
    // TODO: 각 메뉴별 화면으로 이동
  };

  const renderProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileInfo}>
        <View style={styles.profileImage}>
          <View style={styles.avatarPlaceholder}>
            <View style={styles.avatarFace}>
              <View style={styles.avatarHead} />
              <View style={styles.avatarBody} />
              <View style={styles.avatarEye1} />
              <View style={styles.avatarEye2} />
              <View style={styles.avatarMouth} />
            </View>
          </View>
        </View>
        <View style={styles.profileDetails}>
          <View style={styles.profileText}>
                    <Text style={styles.profileName}>승범 yang</Text>
        <Text style={styles.profileEmail}>seungbumyang@gmail.com</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderMenuSection = (section: any) => (
    <View key={section.id} style={styles.menuSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      <View style={styles.menuContainer}>
        {section.items.map((item: any) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item)}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon as any} size={20} color="#222222" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#CCCCCC" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내정보</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#444444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        {renderProfileSection()}

        {/* Menu Sections */}
        {menuSections.map(section => renderMenuSection(section))}
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
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileSection: {
    marginBottom: 20,
  },
  profileInfo: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarFace: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  avatarHead: {
    width: 22,
    height: 22,
    backgroundColor: '#DFDFDF',
    borderRadius: 11,
  },
  avatarBody: {
    width: 24,
    height: 16,
    backgroundColor: '#DFDFDF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: -2,
  },
  avatarEye1: {
    width: 2,
    height: 2,
    backgroundColor: '#999999',
    borderRadius: 1,
    position: 'absolute',
    top: 6,
    left: 6,
  },
  avatarEye2: {
    width: 2,
    height: 2,
    backgroundColor: '#999999',
    borderRadius: 1,
    position: 'absolute',
    top: 6,
    right: 6,
  },
  avatarMouth: {
    width: 4,
    height: 1.5,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 0.75,
    position: 'absolute',
    bottom: 4,
    left: 10,
  },
  profileDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  profileText: {
    gap: 8,
  },
  profileName: {
    color: '#222222',
  },
  profileEmail: {
    color: '#666666',
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#222222',
  },
  menuContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
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
  menuItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuItemText: {
    color: '#222222',
  },
}); 
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatbotScreen() {
  const chatbots = [
    {
      id: 1,
      name: 'Tommy',
      description: '안녕하세요 저는 향을 추천해 주는 Tommy예요.\n당신의 이야기를 바탕으로 \n딱 맞는 향수를 추천해 드려요!',
      buttonText: '향수 추천받기',
      color: '#9BB6F6',
      icon: 'flask'
    },
    {
      id: 2,
      name: 'Nora',
      description: '안녕하세요! 저는 조향체험 도우미 Nora예요.\n조향을 쉽고 재미있게 즐길 수 있도록 \n향료 추천부터 조향 가이드까지 도와드려요~',
      buttonText: '조향 체험하기',
      color: '#F8CCE7',
      icon: 'person'
    },
    {
      id: 3,
      name: 'Scentie',
      description: '안녕하세요. 저는 전문 조향사 Scentie예요.            향료 정보부터 조향 팁까지 고독한 조향 과정의 \n진정한 파트너가 되어드릴께요.',
      buttonText: '전문가용 조향하기',
      color: '#B59B89',
      icon: 'heart'
    }
  ];

  const handleChatbotPress = (chatbot: any) => {
    console.log('Selected chatbot:', chatbot.name);
    // TODO: 챗봇 채팅 화면으로 이동
  };

  const renderAvatar = (color: string, name: string) => {
    return (
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.avatarText}>{name.charAt(0)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>챗봇</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#444444" />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.chatbotsContainer}>
          {chatbots.map((chatbot) => (
            <View key={chatbot.id} style={styles.chatbotCard}>
              <View style={styles.chatbotContent}>
                {renderAvatar(chatbot.color, chatbot.name)}
                <View style={styles.chatbotInfo}>
                  <Text style={styles.chatbotName}>{chatbot.name}</Text>
                  <Text style={styles.chatbotDescription}>{chatbot.description}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleChatbotPress(chatbot)}
              >
                <Text style={styles.actionButtonText}>{chatbot.buttonText}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
  chatbotsContainer: {
    gap: 20,
  },
  chatbotCard: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 6,
  },
  chatbotContent: {
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  chatbotInfo: {
    alignItems: 'center',
    gap: 10,
  },
  chatbotName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222222',
    lineHeight: 32,
  },
  chatbotDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#444444',
    lineHeight: 24,
    textAlign: 'center',
  },
  actionButton: {
    height: 44,
    minWidth: 106,
    paddingHorizontal: 24,
    backgroundColor: '#222222',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
}); 
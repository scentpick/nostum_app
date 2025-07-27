import { ScrollView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/ui/Header';
import { Skeleton } from '@/components/ui/Skeleton';
import { createStyles, spacing } from '@/utils/styles';

export default function ChatbotScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header title="AI 챗봇" />
      
      {/* Chat Messages */}
      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {/* AI Message */}
        <ThemedView style={styles.messageContainer}>
          <ThemedView style={styles.aiAvatar}>
            <Skeleton width={32} height={32} borderRadius={16} />
          </ThemedView>
          <ThemedView style={styles.aiMessage}>
            <Skeleton width="80%" height={16} />
            <Skeleton width="60%" height={16} style={styles.messageLine} />
            <Skeleton width="70%" height={16} style={styles.messageLine} />
          </ThemedView>
        </ThemedView>

        {/* User Message */}
        <ThemedView style={styles.userMessageContainer}>
          <ThemedView style={styles.userMessage}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="50%" height={16} style={styles.messageLine} />
          </ThemedView>
        </ThemedView>

        {/* AI Message */}
        <ThemedView style={styles.messageContainer}>
          <ThemedView style={styles.aiAvatar}>
            <Skeleton width={32} height={32} borderRadius={16} />
          </ThemedView>
          <ThemedView style={styles.aiMessage}>
            <Skeleton width="90%" height={16} />
            <Skeleton width="75%" height={16} style={styles.messageLine} />
            <Skeleton width="65%" height={16} style={styles.messageLine} />
          </ThemedView>
        </ThemedView>

        {/* User Message */}
        <ThemedView style={styles.userMessageContainer}>
          <ThemedView style={styles.userMessage}>
            <Skeleton width="60%" height={16} />
          </ThemedView>
        </ThemedView>

        {/* AI Typing Indicator */}
        <ThemedView style={styles.messageContainer}>
          <ThemedView style={styles.aiAvatar}>
            <Skeleton width={32} height={32} borderRadius={16} />
          </ThemedView>
          <ThemedView style={styles.typingIndicator}>
            <Skeleton width={8} height={8} borderRadius={4} />
            <Skeleton width={8} height={8} borderRadius={4} style={styles.typingDot} />
            <Skeleton width={8} height={8} borderRadius={4} style={styles.typingDot} />
          </ThemedView>
        </ThemedView>

        {/* Bottom Spacing for Tab Bar */}
        <ThemedView style={styles.bottomSpacing} />
      </ScrollView>

      {/* Input Area */}
      <ThemedView style={styles.inputContainer}>
        <ThemedView style={styles.inputBox}>
          <Skeleton width="80%" height={20} />
        </ThemedView>
        <ThemedView style={styles.sendButton}>
          <Skeleton width={24} height={24} borderRadius={12} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = createStyles({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
  },
  aiAvatar: {
    marginRight: spacing.sm,
  },
  aiMessage: {
    padding: spacing.md,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    maxWidth: '80%',
  },
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
  },
  userMessage: {
    padding: spacing.md,
    borderRadius: 18,
    borderTopRightRadius: 4,
    maxWidth: '80%',
  },
  messageLine: {
    marginTop: spacing.xs,
  },
  typingIndicator: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    alignItems: 'center',
  },
  typingDot: {
    marginLeft: spacing.xs,
  },
  bottomSpacing: {
    height: spacing.xxl + spacing.lg, // 탭 바 높이 + 추가 여백
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    alignItems: 'center',
  },
  inputBox: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 
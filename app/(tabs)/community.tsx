import { ScrollView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/ui/Header';
import { Skeleton } from '@/components/ui/Skeleton';
import { createStyles, spacing } from '@/utils/styles';

export default function CommunityScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header title="커뮤니티" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Post 1 */}
        <ThemedView style={styles.post}>
          <ThemedView style={styles.postHeader}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <ThemedView style={styles.postInfo}>
              <Skeleton width={100} height={16} />
              <Skeleton width={80} height={12} style={styles.postTime} />
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.postContent}>
            <Skeleton width="90%" height={16} />
            <Skeleton width="70%" height={16} style={styles.postLine} />
            <Skeleton width="85%" height={16} style={styles.postLine} />
          </ThemedView>
          
          <ThemedView style={styles.postImage}>
            <Skeleton width="100%" height={200} borderRadius={8} />
          </ThemedView>
          
          <ThemedView style={styles.postActions}>
            <ThemedView style={styles.actionItem}>
              <Skeleton width={16} height={16} />
              <Skeleton width={30} height={14} style={styles.actionText} />
            </ThemedView>
            <ThemedView style={styles.actionItem}>
              <Skeleton width={16} height={16} />
              <Skeleton width={30} height={14} style={styles.actionText} />
            </ThemedView>
            <ThemedView style={styles.actionItem}>
              <Skeleton width={16} height={16} />
              <Skeleton width={30} height={14} style={styles.actionText} />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Post 2 */}
        <ThemedView style={styles.post}>
          <ThemedView style={styles.postHeader}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <ThemedView style={styles.postInfo}>
              <Skeleton width={120} height={16} />
              <Skeleton width={60} height={12} style={styles.postTime} />
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.postContent}>
            <Skeleton width="95%" height={16} />
            <Skeleton width="80%" height={16} style={styles.postLine} />
            <Skeleton width="60%" height={16} style={styles.postLine} />
            <Skeleton width="75%" height={16} style={styles.postLine} />
          </ThemedView>
          
          <ThemedView style={styles.postActions}>
            <ThemedView style={styles.actionItem}>
              <Skeleton width={16} height={16} />
              <Skeleton width={30} height={14} style={styles.actionText} />
            </ThemedView>
            <ThemedView style={styles.actionItem}>
              <Skeleton width={16} height={16} />
              <Skeleton width={30} height={14} style={styles.actionText} />
            </ThemedView>
            <ThemedView style={styles.actionItem}>
              <Skeleton width={16} height={16} />
              <Skeleton width={30} height={14} style={styles.actionText} />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Post 3 */}
        <ThemedView style={styles.post}>
          <ThemedView style={styles.postHeader}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <ThemedView style={styles.postInfo}>
              <Skeleton width={90} height={16} />
              <Skeleton width={70} height={12} style={styles.postTime} />
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.postContent}>
            <Skeleton width="85%" height={16} />
            <Skeleton width="65%" height={16} style={styles.postLine} />
          </ThemedView>
          
          <ThemedView style={styles.postActions}>
            <ThemedView style={styles.actionItem}>
              <Skeleton width={16} height={16} />
              <Skeleton width={30} height={14} style={styles.actionText} />
            </ThemedView>
            <ThemedView style={styles.actionItem}>
              <Skeleton width={16} height={16} />
              <Skeleton width={30} height={14} style={styles.actionText} />
            </ThemedView>
            <ThemedView style={styles.actionItem}>
              <Skeleton width={16} height={16} />
              <Skeleton width={30} height={14} style={styles.actionText} />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Bottom Spacing */}
        <ThemedView style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <ThemedView style={styles.fab}>
        <Skeleton width={24} height={24} borderRadius={12} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = createStyles({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  post: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    padding: spacing.lg,
    borderRadius: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  postInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  postTime: {
    marginTop: spacing.xs,
  },
  postContent: {
    marginBottom: spacing.md,
  },
  postLine: {
    marginTop: spacing.xs,
  },
  postImage: {
    marginBottom: spacing.md,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: spacing.xs,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 
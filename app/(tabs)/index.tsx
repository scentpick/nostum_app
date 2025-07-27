import { ScrollView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/ui/Header';
import { Skeleton } from '@/components/ui/Skeleton';
import { createStyles, spacing } from '@/utils/styles';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header title="Nostum" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <ThemedView style={styles.heroSection}>
          <Skeleton width="100%" height={200} borderRadius={12} />
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={styles.section}>
          <Skeleton width={120} height={24} style={styles.sectionTitle} />
          <ThemedView style={styles.quickActions}>
            {[1, 2, 3, 4].map((item) => (
              <ThemedView key={item} style={styles.actionCard}>
                <Skeleton width={40} height={40} borderRadius={20} />
                <Skeleton width={60} height={16} style={styles.actionText} />
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Featured Content */}
        <ThemedView style={styles.section}>
          <Skeleton width={150} height={24} style={styles.sectionTitle} />
          <ThemedView style={styles.featuredGrid}>
            {[1, 2].map((item) => (
              <ThemedView key={item} style={styles.featuredCard}>
                <Skeleton width="100%" height={120} borderRadius={8} />
                <Skeleton width="80%" height={18} style={styles.cardTitle} />
                <Skeleton width="60%" height={14} style={styles.cardSubtitle} />
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Recent Items */}
        <ThemedView style={styles.section}>
          <Skeleton width={120} height={24} style={styles.sectionTitle} />
          {[1, 2, 3].map((item) => (
            <ThemedView key={item} style={styles.listItem}>
              <Skeleton width={60} height={60} borderRadius={8} />
              <ThemedView style={styles.listItemContent}>
                <Skeleton width="70%" height={18} />
                <Skeleton width="50%" height={14} style={styles.listItemSubtitle} />
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Bottom Spacing */}
        <ThemedView style={styles.bottomSpacing} />
      </ScrollView>
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
  heroSection: {
    padding: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  actionCard: {
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginTop: spacing.sm,
  },
  featuredGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  featuredCard: {
    flex: 1,
  },
  cardTitle: {
    marginTop: spacing.sm,
  },
  cardSubtitle: {
    marginTop: spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  listItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  listItemSubtitle: {
    marginTop: spacing.xs,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

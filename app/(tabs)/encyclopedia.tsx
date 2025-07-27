import { ScrollView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/ui/Header';
import { Skeleton } from '@/components/ui/Skeleton';
import { createStyles, spacing } from '@/utils/styles';

export default function EncyclopediaScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header title="향수 도감" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <ThemedView style={styles.searchContainer}>
          <ThemedView style={styles.searchBar}>
            <Skeleton width="80%" height={20} />
          </ThemedView>
        </ThemedView>

        {/* Categories */}
        <ThemedView style={styles.section}>
          <Skeleton width={120} height={24} style={styles.sectionTitle} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {[1, 2, 3, 4, 5].map((item) => (
              <ThemedView key={item} style={styles.categoryItem}>
                <Skeleton width={60} height={60} borderRadius={30} />
                <Skeleton width={50} height={14} style={styles.categoryText} />
              </ThemedView>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Featured Perfumes */}
        <ThemedView style={styles.section}>
          <Skeleton width={150} height={24} style={styles.sectionTitle} />
          <ThemedView style={styles.perfumeGrid}>
            {[1, 2, 3, 4].map((item) => (
              <ThemedView key={item} style={styles.perfumeCard}>
                <Skeleton width="100%" height={120} borderRadius={8} />
                <Skeleton width="80%" height={16} style={styles.perfumeName} />
                <Skeleton width="60%" height={12} style={styles.perfumeBrand} />
                <ThemedView style={styles.perfumeRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton key={star} width={12} height={12} borderRadius={6} style={styles.star} />
                  ))}
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Popular Perfumes */}
        <ThemedView style={styles.section}>
          <Skeleton width={140} height={24} style={styles.sectionTitle} />
          {[1, 2, 3].map((item) => (
            <ThemedView key={item} style={styles.perfumeListItem}>
              <Skeleton width={80} height={80} borderRadius={8} />
              <ThemedView style={styles.perfumeListInfo}>
                <Skeleton width="70%" height={18} />
                <Skeleton width="50%" height={14} style={styles.perfumeListBrand} />
                <Skeleton width="40%" height={12} style={styles.perfumeListPrice} />
              </ThemedView>
              <ThemedView style={styles.perfumeListActions}>
                <Skeleton width={16} height={16} />
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Perfume Details */}
        <ThemedView style={styles.section}>
          <Skeleton width={160} height={24} style={styles.sectionTitle} />
          <ThemedView style={styles.detailCard}>
            <Skeleton width="100%" height={200} borderRadius={12} />
            <ThemedView style={styles.detailInfo}>
              <Skeleton width="90%" height={20} />
              <Skeleton width="70%" height={16} style={styles.detailLine} />
              <Skeleton width="80%" height={16} style={styles.detailLine} />
              <Skeleton width="60%" height={16} style={styles.detailLine} />
            </ThemedView>
            <ThemedView style={styles.detailSpecs}>
              <ThemedView style={styles.specItem}>
                <Skeleton width={60} height={16} />
                <Skeleton width="70%" height={14} />
              </ThemedView>
              <ThemedView style={styles.specItem}>
                <Skeleton width={60} height={16} />
                <Skeleton width="60%" height={14} />
              </ThemedView>
              <ThemedView style={styles.specItem}>
                <Skeleton width={60} height={16} />
                <Skeleton width="80%" height={14} />
              </ThemedView>
            </ThemedView>
          </ThemedView>
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchBar: {
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  categoriesScroll: {
    marginTop: spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  categoryText: {
    marginTop: spacing.sm,
  },
  perfumeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  perfumeCard: {
    width: '48%',
    marginBottom: spacing.md,
  },
  perfumeName: {
    marginTop: spacing.sm,
  },
  perfumeBrand: {
    marginTop: spacing.xs,
  },
  perfumeRating: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  star: {
    marginRight: spacing.xs,
  },
  perfumeListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  perfumeListInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  perfumeListBrand: {
    marginTop: spacing.xs,
  },
  perfumeListPrice: {
    marginTop: spacing.xs,
  },
  perfumeListActions: {
    marginLeft: spacing.md,
  },
  detailCard: {
    borderRadius: 12,
    padding: spacing.lg,
  },
  detailInfo: {
    marginTop: spacing.md,
  },
  detailLine: {
    marginTop: spacing.xs,
  },
  detailSpecs: {
    marginTop: spacing.lg,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
}); 
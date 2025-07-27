
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { colors, createStyles, fontSize, spacing, text } from '@/utils/styles';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export function Header({ title = 'Nostum', showBackButton = false, onBackPress }: HeaderProps) {
  return (
    <ThemedView style={styles.header}>
      {showBackButton && (
        <ThemedView style={styles.backButton} onTouchEnd={onBackPress}>
          <ThemedText style={styles.backButtonText}>‹</ThemedText>
        </ThemedView>
      )}
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.logo}>🌱</ThemedText>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.rightContainer}>
        {/* Future: Add notification bell, search, etc. */}
      </ThemedView>
    </ThemedView>
  );
}

const styles = createStyles({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
    opacity: 0.1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  backButtonText: {
    fontSize: fontSize.xl,
    color: colors.text,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: fontSize.lg,
    marginRight: spacing.sm,
  },
  title: {
    ...text.title,
    fontSize: fontSize.lg,
  },
  rightContainer: {
    width: 40,
    height: 40,
  },
}); 
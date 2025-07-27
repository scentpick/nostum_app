import { router } from 'expo-router';
import { Alert, ScrollView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { colors, createStyles, fontSize, spacing, text } from '@/utils/styles';

export default function ProfileScreen() {
  const { user, logout, clearAllData, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Alert.alert('로그아웃 완료', '성공적으로 로그아웃되었습니다.');
              router.replace('/login');
            } catch (error) {
              Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const handleAccountDelete = () => {
    Alert.alert(
      '계정 삭제',
      '정말 계정을 삭제하시겠습니까?\n모든 데이터가 영구적으로 삭제되며, 이 작업은 되돌릴 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('계정 삭제 완료', '계정이 성공적으로 삭제되었습니다.');
              router.replace('/login');
            } catch (error) {
              Alert.alert('오류', '계정 삭제 중 문제가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated || !user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>로그인이 필요합니다</ThemedText>
        <ThemedText style={styles.subtitle}>
          계정 정보를 보려면 로그인해주세요
        </ThemedText>
        <ThemedView style={styles.loginButton} onTouchEnd={() => router.push('/login')}>
          <ThemedText style={styles.loginButtonText}>로그인하기</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.container}>
        {/* Profile Header */}
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={styles.avatarContainer}>
            <ThemedText style={styles.avatar}>👤</ThemedText>
          </ThemedView>
          <ThemedText style={styles.userName}>{user.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
        </ThemedView>

        {/* Profile Menu */}
        <ThemedView style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>계정 설정</ThemedText>
          
          <ThemedView style={styles.menuItem}>
            <ThemedText style={styles.menuItemText}>개인정보 수정</ThemedText>
            <ThemedText style={styles.menuItemArrow}>›</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.menuItem}>
            <ThemedText style={styles.menuItemText}>비밀번호 변경</ThemedText>
            <ThemedText style={styles.menuItemArrow}>›</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.menuItem}>
            <ThemedText style={styles.menuItemText}>알림 설정</ThemedText>
            <ThemedText style={styles.menuItemArrow}>›</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>앱 정보</ThemedText>
          
          <ThemedView style={styles.menuItem}>
            <ThemedText style={styles.menuItemText}>버전 정보</ThemedText>
            <ThemedText style={styles.menuItemValue}>1.0.0</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.menuItem}>
            <ThemedText style={styles.menuItemText}>이용약관</ThemedText>
            <ThemedText style={styles.menuItemArrow}>›</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.menuItem}>
            <ThemedText style={styles.menuItemText}>개인정보처리방침</ThemedText>
            <ThemedText style={styles.menuItemArrow}>›</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Account Actions */}
        <ThemedView style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>계정 관리</ThemedText>
          
          <ThemedView style={styles.menuItem} onTouchEnd={handleLogout}>
            <ThemedText style={styles.menuItemText}>로그아웃</ThemedText>
            <ThemedText style={styles.menuItemArrow}>›</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.menuItem} onTouchEnd={handleAccountDelete}>
            <ThemedText style={[styles.menuItemText, styles.dangerText]}>계정 삭제</ThemedText>
            <ThemedText style={[styles.menuItemArrow, styles.dangerText]}>›</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Logout Button */}
        <ThemedView style={styles.logoutSection}>
          <ThemedView style={styles.logoutButton} onTouchEnd={handleLogout}>
            <ThemedText style={styles.logoutButtonText}>로그아웃</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = createStyles({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...text.title,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...text.subtitle,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    fontSize: fontSize.xxxl,
  },
  userName: {
    ...text.title,
    fontSize: fontSize.xl,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...text.subtitle,
    color: colors.textSecondary,
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...text.body,
    fontWeight: '600',
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
    opacity: 0.1,
  },
  menuItemText: {
    ...text.body,
  },
  menuItemValue: {
    ...text.body,
    color: colors.textSecondary,
  },
  menuItemArrow: {
    ...text.body,
    color: colors.textSecondary,
  },
  dangerText: {
    color: colors.error,
  },
  logoutSection: {
    marginTop: spacing.xl,
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: spacing.sm,
    padding: spacing.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    ...text.body,
    color: colors.background,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginButtonText: {
    ...text.body,
    color: colors.background,
    fontWeight: '600',
  },
}); 
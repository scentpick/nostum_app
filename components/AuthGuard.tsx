import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { colors, container, createStyles } from '@/utils/styles';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    // 로딩 중일 때는 로딩 인디케이터 표시
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (!isAuthenticated) {
    // 인증되지 않은 경우 로그인 화면으로 리다이렉트
    return null;
  }

  return <>{children}</>;
}

const styles = createStyles({
  loadingContainer: {
    ...container.center,
    backgroundColor: colors.background,
  },
}); 
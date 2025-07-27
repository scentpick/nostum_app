import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { colors, createStyles, fontSize, spacing, text } from '@/utils/styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('오류', '로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      Alert.alert('오류', '로그인 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('알림', `${provider} 로그인 기능은 준비 중입니다.`);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.container}>
          {/* Header */}
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title}>환영합니다</ThemedText>
            <ThemedText style={styles.subtitle}>
              계정에 로그인하여 모든 기능을 이용해보세요
            </ThemedText>
          </ThemedView>

          {/* Login Form */}
          <ThemedView style={styles.form}>
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>이메일</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="example@email.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>비밀번호</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </ThemedView>

            <ThemedView style={styles.forgotPassword}>
              <ThemedText style={styles.forgotPasswordText}>
                비밀번호를 잊으셨나요?
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.loginButton} onTouchEnd={handleLogin}>
              <ThemedText style={styles.loginButtonText}>
                {isLoading ? '로그인 중...' : '로그인'}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Divider */}
          <ThemedView style={styles.divider}>
            <ThemedView style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>또는</ThemedText>
            <ThemedView style={styles.dividerLine} />
          </ThemedView>

          {/* Social Login */}
          <ThemedView style={styles.socialContainer}>
            <ThemedView 
              style={styles.socialButton} 
              onTouchEnd={() => handleSocialLogin('Google')}
            >
              <ThemedText style={styles.socialButtonText}>Google로 계속하기</ThemedText>
            </ThemedView>
            
            <ThemedView 
              style={styles.socialButton} 
              onTouchEnd={() => handleSocialLogin('Apple')}
            >
              <ThemedText style={styles.socialButtonText}>Apple로 계속하기</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* Sign Up */}
          <ThemedView style={styles.signUpContainer}>
            <ThemedText style={styles.signUpText}>계정이 없으신가요? </ThemedText>
            <ThemedText style={styles.signUpLink}>회원가입</ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = createStyles({
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: 90,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: fontSize.xxxl * 2,
    marginBottom: spacing.md,
  },
  title: {
    ...text.title,
    fontSize: fontSize.xxl,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...text.subtitle,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...text.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: spacing.sm,
    padding: spacing.md,
    minHeight: 48,
    fontSize: fontSize.md,
    color: colors.text,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...text.caption,
    color: colors.primary,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  loginButtonText: {
    ...text.body,
    color: colors.background,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textSecondary,
  },
  dividerText: {
    ...text.caption,
    marginHorizontal: spacing.md,
    color: colors.textSecondary,
  },
  socialContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: spacing.sm,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  socialButtonText: {
    ...text.body,
    color: colors.text,
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    ...text.body,
    color: colors.textSecondary,
  },
  signUpLink: {
    ...text.body,
    color: colors.primary,
    fontWeight: '600',
  },
}); 
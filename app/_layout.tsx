import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../lib/contexts/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [fontsLoaded, fontError] = useFonts({
    'Pretendard': require('../assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.ttf'),
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#d946ef',
          tabBarInactiveTintColor: '#64748b',
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#ffffff',
            borderTopColor: colorScheme === 'dark' ? '#334155' : '#e2e8f0',
          },
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#ffffff',
          },
          headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '홈',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfume"
          options={{
            title: '향수',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flask" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: '커뮤니티',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chatbot"
          options={{
            title: '챗봇',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '내정보',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            href: null, // 탭에서 숨기기
          }}
        />
        <Tabs.Screen
          name="test"
          options={{
            title: '테스트',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flask-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}

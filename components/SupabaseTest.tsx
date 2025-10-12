import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { testConnection, checkDatabaseSchema, testTypes, testApiServices } from '../lib/supabase/client';
import { Brand, Perfume } from '../lib/types';

export default function SupabaseTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const handleConnectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await testConnection();
      setTestResults({ type: 'connection', result });
      
      if (result.success) {
        Alert.alert('✅ 연결 성공', 'Supabase에 성공적으로 연결되었습니다!');
      } else {
        Alert.alert('❌ 연결 실패', `오류: ${result.error}`);
      }
    } catch (error) {
      Alert.alert('❌ 오류 발생', `테스트 중 오류가 발생했습니다: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchemaTest = async () => {
    setIsLoading(true);
    try {
      const result = await checkDatabaseSchema();
      setTestResults({ type: 'schema', result });
      
      if (result.success) {
        Alert.alert('✅ 스키마 확인 완료', '데이터베이스 테이블 상태를 확인했습니다.');
      } else {
        Alert.alert('❌ 스키마 확인 실패', `오류: ${result.error}`);
      }
    } catch (error) {
      Alert.alert('❌ 오류 발생', `테스트 중 오류가 발생했습니다: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeTest = async () => {
    setIsLoading(true);
    try {
      const result = await testTypes();
      setTestResults({ type: 'types', result });
      
      if (result.success) {
        Alert.alert('✅ 타입 테스트 완료', 'TypeScript 타입이 정상적으로 작동합니다!');
      } else {
        Alert.alert('❌ 타입 테스트 실패', `오류: ${result.error}`);
      }
    } catch (error) {
      Alert.alert('❌ 오류 발생', `테스트 중 오류가 발생했습니다: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiServiceTest = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 API 서비스 테스트 시작...');
      const result = await testApiServices();
      console.log('📊 API 서비스 테스트 결과:', result);
      setTestResults({ type: 'api_services', result });
      
      if (result.success) {
        Alert.alert('✅ API 서비스 테스트 완료', 'API 서비스가 정상적으로 작동합니다!');
      } else {
        Alert.alert('❌ API 서비스 테스트 실패', `오류: ${result.error}`);
      }
    } catch (error) {
      console.error('💥 API 서비스 테스트 중 예외 발생:', error);
      Alert.alert('❌ 오류 발생', `테스트 중 오류가 발생했습니다: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase 연결 테스트</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleConnectionTest}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '테스트 중...' : '연결 테스트'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSchemaTest}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '테스트 중...' : '스키마 확인'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleTypeTest}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '테스트 중...' : '타입 테스트'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleApiServiceTest}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '테스트 중...' : 'API 서비스 테스트'}
        </Text>
      </TouchableOpacity>

      {testResults && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {testResults.type === 'connection' ? '연결 테스트 결과' : 
             testResults.type === 'schema' ? '스키마 확인 결과' : 
             testResults.type === 'types' ? '타입 테스트 결과' : 'API 서비스 테스트 결과'}
          </Text>
          <ScrollView 
            style={styles.resultsScrollView}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <Text style={styles.resultsText}>
              {JSON.stringify(testResults.result, null, 2)}
            </Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    maxHeight: 300, // 최대 높이 제한
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultsScrollView: {
    flex: 1,
    maxHeight: 250, // 스크롤 영역 최대 높이
  },
  resultsText: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
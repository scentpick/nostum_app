import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  // 기본 텍스트 스타일
  body: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    lineHeight: 24,
  },
  
  // 제목 스타일
  h1: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    lineHeight: 28,
  },
  h5: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    lineHeight: 26,
  },
  h6: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  
  // 본문 텍스트 스타일
  bodyLarge: {
    fontFamily: 'Pretendard',
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMedium: {
    fontFamily: 'Pretendard',
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: 'Pretendard',
    fontSize: 14,
    lineHeight: 20,
  },
  bodyXSmall: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    lineHeight: 16,
  },
  
  // 강조 텍스트 스타일
  bodyMediumBold: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmallBold: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  
  // 버튼 텍스트 스타일
  button: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  buttonSmall: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  
  // 캡션 스타일
  caption: {
    fontFamily: 'Pretendard',
    fontSize: 12,
    lineHeight: 16,
  },
  captionBold: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  
  // 링크 스타일
  link: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  linkSmall: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
});

// 폰트 웨이트별 스타일 헬퍼
export const fontWeights = {
  regular: 'Pretendard',
  medium: 'Pretendard-Medium',
  semiBold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
} as const;

// 폰트 사이즈별 스타일 헬퍼
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
} as const; 
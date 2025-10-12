# 디자인 시스템 가이드

## 📝 Pretendard 폰트 시스템

이 프로젝트는 **Pretendard** 폰트를 전역적으로 사용합니다.

### 🎯 폰트 웨이트

- `Pretendard` (Regular) - 기본 텍스트
- `Pretendard-Medium` - 중간 굵기
- `Pretendard-SemiBold` - 세미볼드
- `Pretendard-Bold` - 볼드

### 📱 사용법

#### 1. 커스텀 Text 컴포넌트 사용 (권장)

```tsx
import { Text, Heading1, BodyText, Caption } from '../components/ui/Text';

// 기본 사용
<Text>기본 텍스트</Text>

// 제목 사용
<Heading1>큰 제목</Heading1>
<Heading2>중간 제목</Heading2>
<Heading3>작은 제목</Heading3>

// 본문 텍스트
<BodyText>본문 텍스트</BodyText>
<BodySmall>작은 본문 텍스트</BodySmall>

// 캡션
<Caption>캡션 텍스트</Caption>

// 버튼 텍스트
<ButtonText>버튼 텍스트</ButtonText>

// 링크 텍스트
<LinkText>링크 텍스트</LinkText>
```

#### 2. 폰트 웨이트 직접 지정

```tsx
import { Text } from '../components/ui/Text';

<Text weight="bold">볼드 텍스트</Text>
<Text weight="medium">중간 굵기 텍스트</Text>
<Text weight="semiBold">세미볼드 텍스트</Text>
```

#### 3. 기존 React Native Text 컴포넌트 사용

```tsx
import { Text } from 'react-native';

<Text style={{ fontFamily: 'Pretendard' }}>기본 텍스트</Text>
<Text style={{ fontFamily: 'Pretendard-Medium' }}>중간 굵기</Text>
<Text style={{ fontFamily: 'Pretendard-SemiBold' }}>세미볼드</Text>
<Text style={{ fontFamily: 'Pretendard-Bold' }}>볼드</Text>
```

### 🎨 타이포그래피 스타일

#### 제목 스타일
- `h1`: 32px, Bold
- `h2`: 28px, SemiBold
- `h3`: 24px, SemiBold
- `h4`: 20px, Medium
- `h5`: 18px, Medium
- `h6`: 16px, Medium

#### 본문 스타일
- `bodyLarge`: 18px, Regular
- `bodyMedium`: 16px, Regular (기본)
- `bodySmall`: 14px, Regular
- `bodyXSmall`: 12px, Regular

#### 강조 스타일
- `bodyMediumBold`: 16px, SemiBold
- `bodySmallBold`: 14px, SemiBold

#### 특수 스타일
- `button`: 16px, Medium
- `buttonSmall`: 14px, Medium
- `caption`: 12px, Regular
- `captionBold`: 12px, Medium
- `link`: 16px, Medium
- `linkSmall`: 14px, Medium

### 🎨 색상 시스템

```tsx
import { colors } from '../lib/styles/global';

// Primary Colors
colors.primary[500] // 메인 컬러

// Neutral Colors
colors.neutral[500] // 중간 회색

// Semantic Colors
colors.success // 성공
colors.warning // 경고
colors.error // 에러
colors.info // 정보

// Background Colors
colors.background.primary // 기본 배경
colors.background.secondary // 보조 배경

// Text Colors
colors.text.primary // 기본 텍스트
colors.text.secondary // 보조 텍스트
```

### 📏 간격 시스템

```tsx
import { spacing } from '../lib/styles/global';

spacing.xs  // 4px
spacing.sm  // 8px
spacing.md  // 16px
spacing.lg  // 24px
spacing.xl  // 32px
spacing['2xl'] // 48px
spacing['3xl'] // 64px
```

### 🔄 마이그레이션 가이드

기존 코드를 새로운 디자인 시스템으로 마이그레이션할 때:

1. **Text 컴포넌트 교체**
   ```tsx
   // 이전
   <Text style={{ fontSize: 16, fontWeight: 'bold' }}>텍스트</Text>
   
   // 이후
   <BodyText weight="bold">텍스트</BodyText>
   ```

2. **스타일 정리**
   ```tsx
   // 이전
   const styles = StyleSheet.create({
     title: {
       fontSize: 24,
       fontWeight: 'bold',
       color: '#000000',
     }
   });
   
   // 이후
   const styles = StyleSheet.create({
     title: {
       color: '#000000',
     }
   });
   ```

### ✅ 체크리스트

새로운 컴포넌트를 만들 때 확인할 사항:

- [ ] Pretendard 폰트 사용
- [ ] 커스텀 Text 컴포넌트 사용
- [ ] 전역 색상 팔레트 사용
- [ ] 전역 간격 시스템 사용
- [ ] 폰트 관련 스타일 제거 (fontSize, fontWeight, lineHeight) 
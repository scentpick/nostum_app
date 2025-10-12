# 공통 컴포넌트 목록 ✅ 최종 확정

> **목적:** 필요한 모든 공통 컴포넌트를 파악하고 우선순위 설정  
> **기준:** 2개 이상 페이지에서 사용되면 공통 컴포넌트로 추출  
> **업데이트:** 2025-10-12 (최근 확정된 기능 반영)

---

## 우선순위별 목록

### 🔴 Priority 1: 즉시 필요 (현재 중복 구현됨)

#### 1. Pagination
- **사용처:** 향수, 커뮤니티, 프로필, 관리자
- **현재 상태:** 향수, 커뮤니티 각각 구현 (중복)
- **개발 시간:** 0.5일 (이미 구현되어 있어 추출만)

#### 2. SearchBar
- **사용처:** 향수, 커뮤니티, 관리자
- **현재 상태:** 향수, 커뮤니티 각각 구현 (중복)
- **개발 시간:** 0.5일

#### 3. Avatar
- **사용처:** 커뮤니티, 프로필, 댓글, 리뷰
- **현재 상태:** 커뮤니티에만 인라인 구현
- **개발 시간:** 0.5일

---

### 🟡 Priority 2: 곧 필요

#### 4. ImageUploader
- **사용처:** 커뮤니티, 리뷰, 프로필, 챗봇
- **기능:** 카메라/앨범 선택, 압축, 업로드
- **개발 시간:** 1-2일

#### 5. ImageGallery
- **사용처:** 커뮤니티, 리뷰
- **기능:** 여러 이미지 표시, 스와이프, 확대
- **개발 시간:** 1일

#### 6. ConfirmDialog
- **사용처:** 삭제, 중요한 액션 전반
- **개발 시간:** 0.5일

#### 7. LikeButton ✅ 새로 추가
- **사용처:** 커뮤니티 게시글, 댓글 (COMMUNITY.md 확정)
- **기능:** 좋아요 토글, 낙관적 업데이트, 카운트 표시
- **개발 시간:** 0.5일

---

### 🟢 Priority 3: 나중에

#### 8. Badge
- **사용처:** NEW 뱃지, 작성자 뱃지, 관리자 뱃지
- **개발 시간:** 0.3일

#### 9. Card
- **사용처:** 향수 카드, 게시글 카드, 리뷰 카드
- **개발 시간:** 1일

#### 10. EmptyState
- **사용처:** 데이터 없을 때
- **개발 시간:** 0.3일

#### 11. LoadingSpinner
- **사용처:** 모든 로딩 상태
- **개발 시간:** 0.3일

---

### 📱 기능별 컴포넌트 (공통 아님)

#### Home 화면 (HOME.md 확정)
- `SpeechBubble` - 캐릭터 말풍선 (홈 화면 전용)
- `TodayPerfumeSection` - 오늘의 향수 (홈 화면 전용)

#### Chatbot (CHATBOT.md 확정)
- `ChatMessage` - 메시지 버블 (챗봇 전용, 텍스트/이미지)
- `ChatInput` - 입력창 (챗봇 전용, 텍스트+이미지)
- `ChatHeader` - 헤더 (챗봇 전용, 사용 방법 버튼)
- `UsageGuideModal` - 사용 방법 모달 (챗봇 전용)
- `TypingIndicator` - 타이핑 중... (챗봇 전용, 스트리밍)

#### Perfume (PERFUME.md 확정)
- `PerfumeCalendar` - 향수 캘린더 (향수 전용, Phase 2)
- `FragranceWheel` - 향기 휠 (향수 전용, SVG)

---

## 컴포넌트 상세

### Pagination

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'compact';
}
```

### SearchBar

```typescript
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
  minLength?: number;
}
```

### Avatar

```typescript
interface AvatarProps {
  imageUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
}
```

### ImageUploader

```typescript
interface ImageUploaderProps {
  maxImages?: number;
  maxSize?: number; // MB
  onUpload: (urls: string[]) => void;
  initialImages?: string[];
  folder: 'avatars' | 'posts' | 'reviews' | 'chat'; // ✅ 챗봇 추가
}
```

### LikeButton ✅ 새로 추가

```typescript
interface LikeButtonProps {
  targetId: string; // 게시글 or 댓글 ID
  targetType: 'post' | 'comment';
  initialLiked: boolean;
  initialCount: number;
  onLike: (targetId: string, targetType: string) => Promise<void>;
  onUnlike: (targetId: string, targetType: string) => Promise<void>;
}
```

---

## 개발 순서 ✅ DEVELOPMENT_STRATEGY.md와 일치

```
Week 3: 공통 컴포넌트 집중 개발 🔴
  Day 1: Pagination (추출) + SearchBar (추출)
  Day 2: Avatar + LikeButton
  Day 3: ImageUploader (챗봇 포함)
  Day 4: ImageGallery + ConfirmDialog
  Day 5: Badge + EmptyState + LoadingSpinner
  
Week 4-5: 기능별 컴포넌트 🟡
  - SpeechBubble (Home)
  - ChatMessage, ChatInput, TypingIndicator (Chatbot)
  - FragranceWheel (Perfume)
```

---

## 📊 개발 시간 요약 ✅

| 우선순위 | 컴포넌트 수 | 예상 시간 |
|---------|-----------|----------|
| 🔴 Priority 1 | 3개 | 1.5일 |
| 🟡 Priority 2 | 4개 | 4-5일 |
| 🟢 Priority 3 | 4개 | 2일 |
| **총계** | **11개** | **7.5-8.5일** |

---

## 🎯 **COMPONENT_INVENTORY.md 최종 확정 완료!**

**모든 공통 컴포넌트가 정리되고 개발 순서가 확정되었습니다!** 🚀

### 📋 **주요 확정 사항**

#### ✅ **Priority 1 (즉시 필요)**
- Pagination, SearchBar, Avatar

#### ✅ **Priority 2 (곧 필요)**
- ImageUploader (챗봇 포함), ImageGallery, ConfirmDialog, LikeButton

#### ✅ **Priority 3 (나중에)**
- Badge, Card, EmptyState, LoadingSpinner

#### ✅ **기능별 컴포넌트 (공통 아님)**
- Home: SpeechBubble, TodayPerfumeSection
- Chatbot: ChatMessage, ChatInput, ChatHeader, UsageGuideModal, TypingIndicator
- Perfume: PerfumeCalendar, FragranceWheel

---

**이 목록을 기반으로 공통 컴포넌트를 체계적으로 개발합니다.**


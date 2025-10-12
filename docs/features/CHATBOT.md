# Tommy 챗봇 기능 명세서 ✅ 확정

> **작성일:** 2025-10-11  
> **버전:** 2.0 (최종 확정)  
> **상태:** 개발 준비 완료 ✅

---

## 1. 개요 ✅ 확정

### 1.1 목적
**Tommy**라는 이름의 향수 추천 AI 챗봇으로, 사용자와 대화를 통해 취향에 맞는 향수를 추천하고, 향수 관련 질문에 답변

### 1.2 핵심 역할
- 🤖 **향수 추천**: 대화를 통해 취향 파악 후 맞춤 추천
- 💬 **대화형 인터페이스**: 자연스러운 대화로 향수 검색
- 📝 **대화 이력 관리**: 30일간 대화 저장 (프로필에서 관리)
- 🎯 **개인화**: 이전 대화 기반 추천 개선

### 1.3 사용자 스토리
- "나한테 어울리는 향수를 추천받고 싶어요"
- "특정 상황에 맞는 향수를 찾고 싶어요"
- "이 향수와 비슷한 다른 향수는 뭐가 있나요?"
- "향수 용어가 궁금해요"

### 1.4 AI 연동 ✅ 확정
- **AI 모델**: OpenAI GPT (GPT-4 or GPT-3.5-turbo)
- **연동 방식**: Supabase Edge Functions + OpenAI API
- **특징**: 자연스러운 대화, 향수 DB와 연동된 추천

---

## 2. 기능 상세

### 2.1 대화형 추천 ✅ MVP 확정

#### 현재 구현 상태
- ✅ UI 구조 (채팅 화면)
- ❌ OpenAI GPT 연동 (미구현)
- ❌ 추천 로직 (미구현)

#### Tommy의 추천 프로세스
```
1. 인사 및 질문
   Tommy: "안녕하세요! 저는 Tommy예요. 어떤 향수를 찾으시나요?"

2. 자연스러운 대화로 취향 파악
   - GPT가 사용자의 답변을 분석
   - 필요한 정보를 자연스럽게 질문
   예시:
   Tommy: "어떤 상황에서 사용하실 건가요?"
   사용자: "데이트할 때 쓸 향수요"
   Tommy: "좋아요! 달콤한 느낌과 시원한 느낌 중 어떤 게 더 좋으세요?"

3. 향수 DB 검색 및 추천 결과 (3-5개)
   [향수 카드]
   - 이미지
   - 브랜드, 이름
   - Tommy의 추천 이유 (GPT 생성)
   - 가격
   - [상세 보기] 버튼 → 향수 상세 페이지

4. 피드백 및 추가 추천
   Tommy: "이 중에 마음에 드는 게 있나요?"
   → 추가 추천 or 재질문
```

#### UI/UX ✅ 확정
```
┌─────────────────────┐
│ Tommy 챗봇    [❓]  │ ← 헤더 (사용 방법 버튼)
├─────────────────────┤
│                     │
│ 🤖 안녕하세요!       │ ← Tommy 메시지
│    저는 Tommy예요.  │   (왼쪽, 회색 버블)
│    어떤 향수를       │
│    찾으시나요?       │
│                     │
│     여름에 쓸 향수를 │ ← 사용자 메시지
│     추천해주세요 👤  │   (오른쪽, 파란 버블)
│                     │
│ 🤖 좋아요! 어떤      │ ← Tommy 답변
│    느낌을 원하세요?  │   (GPT 응답)
│                     │
│ [향수 이미지]        │ ← 이미지 메시지
│ 이 향수와 비슷한 거  │   (사용자가 업로드)
│ 추천해주세요         │
│                     │
├─────────────────────┤
│ [📷] 💬 메시지...   │ ← 입력창
│              [전송] │   (텍스트 + 이미지)
└─────────────────────┘
```

#### 대화 특징
- **텍스트 + 이미지 입력**: 향수 사진 업로드 가능
- **채팅 형태 UI**: 메시지 버블, 시간 표시
- **사용 방법 안내**: 헤더의 [❓] 버튼으로 확인

---

### 2.2 향수 검색 도우미 ✅ MVP 포함

#### 기능
Tommy와의 대화를 통해 자연어로 향수 검색:
- **자연어 검색 예시**
  - "달콤하면서 상쾌한 향수"
  - "10만원 이하 여성 향수"
  - "디올 향수 중 인기 있는 거"

- **Tommy의 처리**
  - GPT가 사용자 의도 파악
  - DB에서 매칭되는 향수 조회
  - 우선순위 정렬 및 추천 이유 설명

---

### 2.3 향수 정보 Q&A ✅ MVP 포함

Tommy가 향수 관련 질문에 답변:

#### 질문 유형
1. **용어 설명**
   - 사용자: "Top Note가 뭐예요?"
   - Tommy: "Top Note는 향수를 처음 뿌렸을 때 가장 먼저 느껴지는 향이에요..."

2. **비교 질문**
   - 사용자: "샤넬 No.5와 디올 J'adore 차이는?"
   - Tommy: "샤넬 No.5는 클래식한 알데하이드 플로럴이고, 디올 J'adore는..."

3. **추천 질문**
   - 사용자: "20대 여성에게 인기 있는 향수는?"
   - Tommy: "20대 여성분들께 인기 있는 향수는..." (DB 데이터 기반)

---

### 2.4 대화 이력 ✅ 확정

#### 저장 방식
- **저장 위치**: 프로필 (각 사용자별)
- **저장 기간**: 30일
- **자동 삭제**: 30일 이상 지난 대화는 자동 삭제
- **저장 내용**: 대화 ID, 메시지 내용, 추천 향수 정보

#### 기능
- ✅ **이전 대화 불러오기**: 프로필에서 대화 이력 조회
- ✅ **대화 삭제**: 개별 대화 삭제 or 전체 삭제
- ✅ **새 대화 시작**: 언제든지 새로운 대화 시작

#### 활용
- 📊 **취향 분석**: 이전 대화를 기반으로 사용자 취향 파악
- 🎯 **추천 개선**: 과거 대화 내용을 참고하여 더 정확한 추천
- 📈 **통계** (관리자): 자주 묻는 질문, 인기 향수 트렌드 분석

---

## 3. 데이터베이스 ✅ 확정

### 3.1 테이블 구조 (DATABASE_SCHEMA_FINAL.md 참고)

#### `chatbot_conversations` (기존)
```sql
CREATE TABLE chatbot_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT, -- 대화 제목 (첫 메시지 기반 자동 생성)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_chatbot_conversations_user ON chatbot_conversations(user_id, created_at DESC);

-- 30일 자동 삭제
CREATE INDEX idx_chatbot_conversations_cleanup ON chatbot_conversations(created_at)
WHERE created_at < NOW() - INTERVAL '30 days';
```

#### `chatbot_messages`
```sql
CREATE TABLE chatbot_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB, -- 추천 향수 ID, 이유 등
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_chatbot_messages_conversation ON chatbot_messages(conversation_id, created_at ASC);
```

#### `chatbot_recommendations` (선택)
```sql
CREATE TABLE chatbot_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES chatbot_conversations(id) ON DELETE CASCADE NOT NULL,
  message_id UUID REFERENCES chatbot_messages(id) ON DELETE CASCADE,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE NOT NULL,
  score DECIMAL, -- 매칭 점수 (선택)
  reason TEXT, -- Tommy의 추천 이유 (GPT 생성)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_chatbot_recommendations_conversation ON chatbot_recommendations(conversation_id, created_at DESC);
CREATE INDEX idx_chatbot_recommendations_perfume ON chatbot_recommendations(perfume_id, created_at DESC);
```

---

## 4. AI 연동 ✅ 최종 확정

### 4.1 선택된 옵션: OpenAI GPT ✅

#### 기술 스택
- **AI 모델**: OpenAI GPT-4 or GPT-3.5-turbo
- **연동 방식**: Supabase Edge Functions
- **API 호출**: OpenAI API (Node.js SDK)

#### 장점
- ✅ 강력한 자연어 이해
- ✅ 자연스러운 대화 생성
- ✅ 향수 DB와의 유연한 연동
- ✅ 추천 이유 생성 가능

#### 고려 사항
- 💰 **비용**: 사용량 기반 과금 (모니터링 필요)
- 🔑 **API 키 관리**: Supabase Secrets로 안전하게 관리
- ⏱️ **응답 시간**: 평균 2-3초 (스트리밍 가능)

### 4.2 구현 방식 ✅

#### A. OpenAI GPT와 통신
```typescript
// lib/services/tommyChat.ts
interface SendMessageRequest {
  conversationId: string
  message: string
  imageUri?: string // 향수 이미지 (선택)
}

async function sendMessageToTommy(request: SendMessageRequest): Promise<TommyResponse> {
  // 1. 이미지가 있으면 먼저 업로드
  let imageUrl: string | undefined
  if (request.imageUri) {
    imageUrl = await uploadChatImage(request.imageUri)
  }
  
  // 2. Supabase Edge Function 호출 (OpenAI GPT와 통신)
  const { data, error } = await supabase.functions.invoke('tommy-chat', {
    body: {
      conversationId: request.conversationId,
      message: request.message,
      imageUrl: imageUrl
    }
  })
  
  // 3. GPT 응답 반환
  return data
}
```

#### B. Supabase Edge Function (OpenAI GPT 연동) ✅ 스트리밍 포함
```typescript
// supabase/functions/tommy-chat/index.ts
// OpenAI GPT에 메시지 전달하고 스트리밍 응답 받아오기

serve(async (req) => {
  const { conversationId, message, imageUrl } = await req.json()
  
  // 1. 대화 이력 조회 (최근 5개)
  const history = await getConversationHistory(conversationId)
  
  // 2. OpenAI GPT 스트리밍 호출
  const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY')
  })
  
  const systemPrompt = `
    당신은 향수 전문가 Tommy입니다.
    사용자와 자연스럽게 대화하며 취향에 맞는 향수를 추천해주세요.
  `
  
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // 또는 gpt-4
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ],
    stream: true // ✅ 스트리밍 활성화
  })
  
  // 3. 스트리밍 응답을 클라이언트로 전달
  const encoder = new TextEncoder()
  let fullMessage = ''
  
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        fullMessage += content
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
      }
      
      // 4. 완료 후 메시지 저장
      await saveMessage(conversationId, 'assistant', fullMessage)
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    }
  })
  
  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
})
```

#### C. 클라이언트에서 스트리밍 수신 ✅ MVP
```typescript
// lib/services/tommyChat.ts
async function sendMessageToTommyStreaming(
  conversationId: string,
  message: string,
  onChunk: (content: string) => void,
  onComplete: () => void
) {
  const response = await supabase.functions.invoke('tommy-chat', {
    body: { conversationId, message }
  })
  
  // Server-Sent Events (SSE) 스트리밍 수신
  const reader = response.data.getReader()
  const decoder = new TextDecoder()
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const text = decoder.decode(value)
    const lines = text.split('\n')
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') {
          onComplete()
          return
        }
        
        const parsed = JSON.parse(data)
        onChunk(parsed.content) // 실시간으로 UI 업데이트
      }
    }
  }
}

// 사용 예시
const [streamingMessage, setStreamingMessage] = useState('')

sendMessageToTommyStreaming(
  conversationId,
  userMessage,
  (chunk) => {
    // 실시간으로 메시지 추가
    setStreamingMessage(prev => prev + chunk)
  },
  () => {
    // 완료 시 처리
    console.log('스트리밍 완료')
  }
)
```

#### D. 개발 핵심 포인트 ✅
```
✅ OpenAI GPT 스트리밍 API 호출 (MVP)
✅ 대화 데이터 전달 및 실시간 응답 받기
✅ 채팅 UI로 실시간 타이핑 효과 표시
✅ 텍스트 + 이미지 입력 처리
✅ 대화 이력 저장 (30일)

개발자는 AI 로직을 구현할 필요 없음!
→ OpenAI GPT가 모든 대화/추천 처리
→ 우리는 UI와 스트리밍 데이터 흐름만 개발
```

---

## 5. UI 컴포넌트 ✅ 확정

### 5.1 필요한 컴포넌트

```
components/chatbot/
├── ChatHeader.tsx         # 헤더 (제목 + 사용 방법 버튼)
├── ChatMessage.tsx        # 메시지 버블 (Tommy/사용자, 텍스트/이미지)
├── PerfumeRecommendCard.tsx # 추천 향수 카드
├── ChatInput.tsx          # 메시지 입력 (텍스트 + 이미지)
├── ImagePicker.tsx        # 이미지 선택 (카메라/앨범)
├── ConversationList.tsx   # 대화 이력 (프로필 페이지)
├── TypingIndicator.tsx    # Tommy 입력 중 표시
└── UsageGuideModal.tsx    # 사용 방법 모달
```

### 5.2 개발 핵심 사항 ✅

#### A. 채팅 UI 개발
```typescript
// ChatMessage.tsx - 메시지 버블 컴포넌트
interface ChatMessageProps {
  role: 'user' | 'assistant' // 사용자 or Tommy
  content: string // 텍스트 메시지
  imageUrl?: string // 이미지 URL (선택)
  timestamp: Date // 시간
  perfumes?: Perfume[] // 추천 향수 (Tommy만)
}

// 특징:
- 왼쪽 (Tommy, 회색), 오른쪽 (사용자, 파란색)
- 이미지 메시지 표시
- 시간 표시
- 추천 향수 카드 (Tommy만)
```

#### B. 입력창 개발
```typescript
// ChatInput.tsx - 텍스트 + 이미지 입력
interface ChatInputProps {
  onSendMessage: (message: string, imageUri?: string) => void
  disabled: boolean // Tommy 응답 대기 중
}

// 기능:
✅ 텍스트 입력
✅ 이미지 선택 (카메라/앨범)
✅ 이미지 미리보기
✅ 전송 버튼 (텍스트 or 이미지 있을 때만 활성화)
```

#### C. 사용 방법 모달
```typescript
// UsageGuideModal.tsx
// 헤더의 [❓] 버튼 클릭 시 표시

내용:
1. Tommy는 향수 추천 챗봇입니다
2. 텍스트로 질문하거나 향수 사진을 보내주세요
3. Tommy가 취향에 맞는 향수를 추천해드립니다
4. 대화 이력은 프로필에서 확인할 수 있습니다
```

### 5.3 API ✅

```typescript
// Tommy 챗봇 API
interface TommyChatAPI {
  // 메시지 전송 (텍스트 + 이미지)
  sendMessage(
    conversationId: string, 
    message: string, 
    imageUri?: string
  ): Promise<TommyResponse>
  
  // 대화 시작
  startConversation(userId: string): Promise<Conversation>
  
  // 대화 이력 조회
  getConversations(userId: string): Promise<Conversation[]>
  
  // 대화 삭제
  deleteConversation(conversationId: string): Promise<void>
}

interface TommyResponse {
  message: string // Tommy의 답변 (GPT 응답)
  perfumes?: Perfume[] // 추천 향수 (있는 경우)
  timestamp: Date
}
```

---

## 6. 성능 목표 ✅ 확정

| 항목 | 목표 | 중요도 |
|------|------|--------|
| 메시지 응답 (GPT) | < 3s | ⭐⭐⭐⭐⭐ |
| 추천 생성 | < 3s | ⭐⭐⭐⭐ |
| 대화 이력 로딩 | < 500ms | ⭐⭐⭐ |
| 메시지 저장 | < 200ms | ⭐⭐⭐⭐ |

**전략:**
- 스트리밍 응답 (가능하면)
- 대화 이력 캐싱
- 로딩 인디케이터 (Tommy 입력 중...)

---

## 7. 개발 우선순위 ✅ 최종 확정

### Phase 1: 채팅 UI 개발 ✅ MVP
- [ ] ChatHeader 컴포넌트 (제목 + 사용 방법 버튼)
- [ ] ChatMessage 컴포넌트 (메시지 버블, 텍스트/이미지)
- [ ] ChatInput 컴포넌트 (텍스트 + 이미지 입력)
- [ ] ImagePicker 컴포넌트 (카메라/앨범)
- [ ] TypingIndicator 컴포넌트 (Tommy 입력 중...)
- [ ] UsageGuideModal 컴포넌트 (사용 방법)

### Phase 2: OpenAI GPT 연동 ✅ MVP
- [ ] Supabase Edge Function 생성 (`tommy-chat`)
- [ ] OpenAI GPT API 호출 (메시지 전달 및 응답 받기)
- [ ] 시스템 프롬프트 설계 (Tommy 캐릭터)
- [ ] 대화 데이터 흐름 구현
- [ ] 메시지 저장/조회

### Phase 3: 이미지 업로드 ✅ MVP
- [ ] 채팅 이미지 업로드 (Supabase Storage)
- [ ] 이미지 미리보기
- [ ] 이미지 메시지 표시

### Phase 4: 대화 이력 관리 ✅ MVP
- [ ] 대화 이력 조회 (프로필 페이지)
- [ ] 대화 삭제 기능
- [ ] 30일 자동 삭제 로직

### Phase 5: 스트리밍 응답 ✅ MVP
- [ ] OpenAI GPT 스트리밍 API 연동
- [ ] 실시간 타이핑 효과 (Tommy 답변이 실시간으로 표시)
- [ ] 스트리밍 중단 기능 (선택)

### Phase 6: 최적화 (Phase 2)
- [ ] 대화 이력 기반 개인화
- [ ] 비용 모니터링 및 최적화
- [ ] 향수 추천 결과 최적화

---

## 8. 권한 및 보안 ✅ 확정

### 8.1 권한
- **비로그인**: 챗봇 접근 불가 (로그인 유도)
- **로그인**: Tommy와 대화, 대화 이력 조회/삭제

### 8.2 보안
- **API 키 관리**: Supabase Secrets에 안전하게 저장
- **사용량 제한**: 사용자당 일일 메시지 제한 (예: 50개)
- **대화 이력**: 본인만 조회 가능 (RLS 적용)

---

## 9. 비용 관리 ✅ 확정

### 9.1 OpenAI API 비용
- **GPT-3.5-turbo**: $0.002 / 1K tokens (저렴, 빠름)
- **GPT-4**: $0.03 / 1K tokens (고급, 정확)
- **예상**: 메시지당 평균 500 tokens = $0.001 ~ $0.015

### 9.2 절약 전략
- 초기에는 GPT-3.5-turbo 사용
- 시스템 프롬프트 최적화 (토큰 수 최소화)
- 대화 이력은 최근 5개만 컨텍스트로 전달
- 사용량 모니터링 (관리자 페이지)

---

## 🎯 **CHATBOT.md 최종 확정 완료!**

**모든 결정 사항이 확정되어 개발을 시작할 준비가 완료되었습니다!** 🚀

### 📋 **주요 확정 사항 요약**

#### ✅ **Tommy 챗봇 핵심**
- **AI 모델**: OpenAI GPT (GPT-4 or GPT-3.5-turbo)
- **연동 방식**: Supabase Edge Functions (메시지 전달 및 응답 받기)
- **대화 이력**: 30일 저장 (프로필에서 관리)

#### ✅ **개발 핵심 (MVP)**
- **채팅 UI**: 메시지 버블, 텍스트/이미지 표시
- **입력창**: 텍스트 + 이미지 입력
- **사용 방법**: 헤더 [❓] 버튼으로 안내
- **GPT 통신**: OpenAI API 호출 및 응답 처리
- **대화 이력**: 프로필에서 조회/삭제

#### ✅ **개발 우선순위 (MVP)**
- Phase 1: 채팅 UI 개발 (메시지 버블, 입력창, 사용 방법)
- Phase 2: OpenAI GPT 연동 (메시지 전달/응답)
- Phase 3: 이미지 업로드
- Phase 4: 대화 이력 관리
- Phase 5: 스트리밍 응답 (실시간 타이핑 효과) ✅ MVP 포함!

#### ✅ **개발자 역할**
```
개발자는 AI 로직을 구현할 필요 없음!
✅ OpenAI GPT에 메시지 전달
✅ GPT 스트리밍 응답을 실시간으로 수신
✅ 채팅 UI로 실시간 타이핑 효과 표시
✅ 텍스트 + 이미지 입력 처리
✅ 대화 이력 저장/조회

→ AI는 OpenAI GPT가 처리
→ 우리는 UI와 스트리밍 데이터 흐름만 개발
```

---

**이 문서를 기반으로 Tommy 챗봇을 체계적으로 개발합니다.**


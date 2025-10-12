# 이미지 업로드 표준 패턴 ✅ 확정

> **목적:** 이미지 업로드, 압축, 갤러리 표시의 일관된 구현  
> **적용:** 커뮤니티 게시글, 리뷰, 프로필 아바타

---

## 표준 프로세스

```
1. 이미지 선택
   - 카메라 직접 촬영 ✅
   - 앨범에서 선택 ✅
   - 권한 요청
   ↓
2. 압축 및 변환
   - 품질: 80%
   - 형식: JPG (아바타), 원본 유지 (게시글/리뷰)
   - 비율: 1:1 (아바타만), 자유 (게시글/리뷰)
   - 메타데이터 제거
   ↓
3. Supabase Storage 업로드
   - 진행률 표시
   - 에러 처리
   ↓
4. Public URL 획득
   ↓
5. DB에 URL 저장
```

---

## 이미지 타입별 설정 ✅ 확정

### 1. 프로필 아바타 (썸네일)
- **형식:** JPG만 허용 (PNG 업로드 시 자동 변환)
- **비율:** 1:1 강제
- **크기:** 400x400px
- **압축:** 80% 품질
- **Storage:** `avatars/` 폴더

### 2. 커뮤니티 게시글
- **형식:** JPG, PNG, WebP 허용
- **비율:** 자유
- **크기:** 최대 1200px (width 기준)
- **압축:** 80% 품질
- **개수 제한:** 무제한
- **Storage:** `posts/` 폴더

### 3. 리뷰 이미지
- **형식:** JPG, PNG, WebP 허용
- **비율:** 자유
- **크기:** 최대 1200px (width 기준)
- **압축:** 80% 품질
- **개수 제한:** 무제한
- **Storage:** `reviews/` 폴더

### 4. 댓글 이미지
- **형식:** JPG, PNG, WebP 허용
- **비율:** 자유
- **크기:** 최대 800px (width 기준)
- **압축:** 80% 품질
- **개수 제한:** 1개만
- **Storage:** `comments/` 폴더

---

## 라이브러리

```bash
# 설치 필요
npx expo install expo-image-picker
npx expo install expo-image-manipulator
npx expo install @supabase/storage-js  # 이미 설치됨
```

**라이브러리 역할:**
- `expo-image-picker`: 카메라/앨범 접근, 권한 요청
- `expo-image-manipulator`: 이미지 압축, 크기 조정, 형식 변환
- `@supabase/storage-js`: Supabase Storage 업로드/다운로드

---

## 코드 템플릿 ✅ 확정

### 1. 공통 업로드 유틸리티

```typescript
// lib/utils/imageUpload.ts

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { SaveFormat } from 'expo-image-manipulator';
import { supabase } from '@/lib/supabase/client';

export type ImageFolder = 'avatars' | 'posts' | 'reviews' | 'comments';

export interface ImageUploadOptions {
  folder: ImageFolder;
  maxWidth?: number;
  aspectRatio?: [number, number];  // 1:1 for avatars
  quality?: number;
  format?: SaveFormat;
}

/**
 * 이미지 선택 및 업로드 (카메라 or 앨범)
 */
export const pickAndUploadImage = async (
  options: ImageUploadOptions,
  useCamera: boolean = false
): Promise<string> => {
  // 1. 권한 요청
  const permissionResult = useCamera
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    throw new Error('이미지 업로드 권한이 필요합니다.');
  }

  // 2. 이미지 선택
  const result = useCamera
    ? await ImagePicker.launchCameraAsync({
        allowsEditing: !!options.aspectRatio,
        aspect: options.aspectRatio,
        quality: options.quality || 0.8,
      })
    : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: !!options.aspectRatio,
        aspect: options.aspectRatio,
        quality: options.quality || 0.8,
      });

  if (result.canceled) {
    throw new Error('이미지 선택이 취소되었습니다.');
  }

  // 3. 압축 및 업로드
  return uploadImage(result.assets[0].uri, options);
};

/**
 * 이미지 압축 및 업로드
 */
export const uploadImage = async (
  uri: string,
  options: ImageUploadOptions
): Promise<string> => {
  // 1. 압축 설정
  const actions: ImageManipulator.Action[] = [];
  if (options.maxWidth) {
    actions.push({ resize: { width: options.maxWidth } });
  }

  // 2. 이미지 압축
  const compressed = await ImageManipulator.manipulateAsync(
    uri,
    actions,
    {
      compress: options.quality || 0.8,
      format: options.format || SaveFormat.JPEG,
    }
  );

  // 3. 파일명 생성
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const extension = options.format === SaveFormat.PNG ? 'png' : 'jpg';
  const fileName = `${options.folder}/${timestamp}_${randomStr}.${extension}`;

  // 4. Supabase Storage 업로드
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, {
      uri: compressed.uri,
      type: `image/${extension}`,
      name: fileName,
    } as any);

  if (error) throw error;

  // 5. Public URL 반환
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};

/**
 * 여러 이미지 업로드
 */
export const uploadMultipleImages = async (
  uris: string[],
  options: ImageUploadOptions
): Promise<string[]> => {
  return Promise.all(uris.map((uri) => uploadImage(uri, options)));
};

/**
 * 이미지 삭제
 */
export const deleteImage = async (url: string): Promise<void> => {
  // URL에서 파일 경로 추출
  const path = url.split('/images/')[1];
  if (!path) return;

  const { error } = await supabase.storage.from('images').remove([path]);
  if (error) throw error;
};
```

---

### 2. 사용 예시

#### 아바타 업로드 (1:1, JPG)

```typescript
// components/profile/AvatarUploader.tsx

import { pickAndUploadImage } from '@/lib/utils/imageUpload';

export const AvatarUploader = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (useCamera: boolean) => {
    try {
      setUploading(true);
      
      const url = await pickAndUploadImage(
        {
          folder: 'avatars',
          maxWidth: 400,
          aspectRatio: [1, 1],
          quality: 0.8,
          format: SaveFormat.JPEG,
        },
        useCamera
      );

      // profiles 테이블 업데이트
      await updateUserAvatar(url);
      
      Alert.alert('성공', '프로필 이미지가 변경되었습니다.');
    } catch (error) {
      Alert.alert('오류', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <Button onPress={() => handleUpload(false)}>앨범에서 선택</Button>
      <Button onPress={() => handleUpload(true)}>카메라로 촬영</Button>
    </View>
  );
};
```

#### 게시글 이미지 업로드 (여러 개)

```typescript
// components/community/PostImagePicker.tsx

import { pickAndUploadImage } from '@/lib/utils/imageUpload';

export const PostImagePicker = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = async () => {
    try {
      const url = await pickAndUploadImage({
        folder: 'posts',
        maxWidth: 1200,
        quality: 0.8,
      });

      setImages([...images, url]);
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  const handleRemoveImage = async (url: string) => {
    try {
      await deleteImage(url);
      setImages(images.filter((img) => img !== url));
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  return (
    <View>
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
            <Button onPress={() => handleRemoveImage(item)}>삭제</Button>
          </View>
        )}
      />
      <Button onPress={handleAddImage}>이미지 추가</Button>
    </View>
  );
};
```

---

## 에러 처리

```typescript
// 예상 에러 케이스
export enum ImageUploadError {
  PERMISSION_DENIED = '이미지 업로드 권한이 필요합니다.',
  CANCELED = '이미지 선택이 취소되었습니다.',
  COMPRESSION_FAILED = '이미지 압축에 실패했습니다.',
  UPLOAD_FAILED = '이미지 업로드에 실패했습니다.',
  INVALID_FORMAT = '지원하지 않는 이미지 형식입니다.',
  FILE_TOO_LARGE = '이미지 파일이 너무 큽니다. (최대 10MB)',
}

// 에러 처리 예시
try {
  const url = await pickAndUploadImage(options);
} catch (error) {
  if (error.message.includes('permission')) {
    Alert.alert('권한 필요', ImageUploadError.PERMISSION_DENIED);
  } else if (error.message.includes('canceled')) {
    // 무시
  } else {
    Alert.alert('오류', ImageUploadError.UPLOAD_FAILED);
  }
}
```

---

## Storage 설정 (Supabase)

### 버킷 생성

```sql
-- Supabase Dashboard > Storage > New Bucket
-- Bucket Name: images
-- Public: true
```

### RLS 정책

```sql
-- 업로드: 인증된 사용자만
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- 읽기: 모두 가능 (Public)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- 삭제: 자신이 업로드한 이미지만
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

**✅ 모든 이미지 업로드는 이 패턴을 사용합니다.**


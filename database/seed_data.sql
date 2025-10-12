-- 향수 앱 초기 데이터 삽입 스크립트
-- Supabase에서 실행할 SQL 스크립트

-- 1. 향수 브랜드 데이터 삽입
INSERT INTO brands (name_kr, name_en, nickname, description, country) VALUES
('메종 마르지엘라', 'Maison Margiela', '마르지엘라', '벨기에 출신의 패션 디자이너 마르지엘라가 설립한 브랜드', '벨기에'),
('바이레도', 'Byredo', '바이레도', '스웨덴의 프리미엄 향수 브랜드', '스웨덴'),
('디올', 'Dior', '디올', '프랑스의 럭셔리 패션 브랜드', '프랑스'),
('샤넬', 'Chanel', '샤넬', '프랑스의 고급 패션 브랜드', '프랑스'),
('톰 포드', 'Tom Ford', '톰포드', '미국의 럭셔리 패션 브랜드', '미국'),
('조 말론', 'Jo Malone', '조말론', '영국의 프리미엄 향수 브랜드', '영국'),
('르 라보', 'Le Labo', '르라보', '프랑스의 니치 향수 브랜드', '프랑스'),
('크리드', 'Creed', '크리드', '프랑스의 전통 향수 브랜드', '프랑스');

-- 2. Fragrant Wheel 데이터 삽입
INSERT INTO fragrant_wheels (name, description, color_code) VALUES
-- 주요 카테고리
('플로럴', '꽃 향이 나는 향수', '#FFB6C1'),
('시트러스', '감귤류 향이 나는 향수', '#FFD700'),
('우디', '나무 향이 나는 향수', '#8B4513'),
('스파이시', '향신료 향이 나는 향수', '#FF4500'),
('프레시', '상쾌하고 깔끔한 향수', '#00CED1'),
('스위트', '달콤한 향이 나는 향수', '#FF69B4'),
('오리엔탈', '동양적인 향이 나는 향수', '#DAA520'),
('아쿠아틱', '바다나 물의 향이 나는 향수', '#87CEEB'),
('그린', '풀잎이나 허브 향이 나는 향수', '#32CD32'),
('파우더리', '가루 같은 부드러운 향이 나는 향수', '#DDA0DD'),
('알데하이드', '세척제 같은 깔끔한 향', '#F0F8FF'),
('머스크', '동물성 향이 나는 향수', '#F5DEB3');

-- 3. 향수 태그 데이터 삽입 (기존 태그를 Fragrant Wheel로 통합)
INSERT INTO tags (name, description) VALUES
('플로럴', '꽃 향이 나는 향수'),
('시트러스', '감귤류 향이 나는 향수'),
('우디', '나무 향이 나는 향수'),
('스파이시', '향신료 향이 나는 향수'),
('프레시', '상쾌하고 깔끔한 향수'),
('스위트', '달콤한 향이 나는 향수'),
('오리엔탈', '동양적인 향이 나는 향수'),
('아쿠아틱', '바다나 물의 향이 나는 향수'),
('그린', '풀잎이나 허브 향이 나는 향수'),
('파우더리', '가루 같은 부드러운 향이 나는 향수');

-- 3. 커뮤니티 게시판 카테고리 데이터 삽입
INSERT INTO board_categories (name, description, order_index) VALUES
('향수게시판', '향수에 대한 정보와 리뷰를 공유하는 게시판', 1),
('자유게시판', '자유롭게 이야기를 나누는 게시판', 2),
('메거진', '향수 관련 기사와 트렌드 정보', 3),
('이벤트', '다양한 이벤트와 프로모션 정보', 4),
('공지사항', '앱 운영과 관련된 공지사항', 5);

-- 4. 샘플 향수 데이터 삽입
INSERT INTO perfumes (brand_id, name, description, price, volume_ml, gender, release_year) VALUES
((SELECT id FROM brands WHERE name_kr = '메종 마르지엘라'), '레플리카 레이지 선데이 모닝 더 클래식 에디션 오 드 뚜왈렛', '일요일 아침의 평화로운 분위기를 담은 향수', 120000, 100, 'unisex', 2020),
((SELECT id FROM brands WHERE name_kr = '바이레도'), '블랑쉬 오 드 퍼퓸', '깔끔하고 우아한 화이트 플로럴 향수', 180000, 50, 'unisex', 2019),
((SELECT id FROM brands WHERE name_kr = '디올'), '미스 디올 오 드 뚜왈렛', '우아하고 로맨틱한 플로럴 향수', 150000, 100, 'female', 2018),
((SELECT id FROM brands WHERE name_kr = '샤넬'), '샤넬 No.5 오 드 뚜왈렛', '클래식한 알데하이드 플로럴 향수', 200000, 100, 'female', 1921),
((SELECT id FROM brands WHERE name_kr = '톰 포드'), '블랙 오키드 오 드 퍼퓸', '신비롭고 세련된 오리엔탈 향수', 250000, 50, 'unisex', 2016),
((SELECT id FROM brands WHERE name_kr = '조 말론'), '잉글리쉬 페어 앤 프리지아 코롱', '상쾌하고 달콤한 과일 향수', 80000, 30, 'unisex', 2010);

-- 5. 향수 노트 데이터 삽입 (샘플)
INSERT INTO perfume_notes (perfume_id, note_name, note_type) VALUES
((SELECT id FROM perfumes WHERE name = '레플리카 레이지 선데이 모닝 더 클래식 에디션 오 드 뚜왈렛'), '라벤더', 'top'),
((SELECT id FROM perfumes WHERE name = '레플리카 레이지 선데이 모닝 더 클래식 에디션 오 드 뚜왈렛'), '오렌지 블라썸', 'top'),
((SELECT id FROM perfumes WHERE name = '레플리카 레이지 선데이 모닝 더 클래식 에디션 오 드 뚜왈렛'), '화이트 머스크', 'base'),
((SELECT id FROM perfumes WHERE name = '블랑쉬 오 드 퍼퓸'), '핑크 페퍼', 'top'),
((SELECT id FROM perfumes WHERE name = '블랑쉬 오 드 퍼퓸'), '로즈', 'middle'),
((SELECT id FROM perfumes WHERE name = '블랑쉬 오 드 퍼퓸'), '화이트 머스크', 'base');

-- 6. 향수-Fragrant Wheel 연결 데이터 삽입 (샘플)
INSERT INTO perfume_fragrant_wheels (perfume_id, fragrant_wheel_id, intensity) VALUES
((SELECT id FROM perfumes WHERE name = '레플리카 레이지 선데이 모닝 더 클래식 에디션 오 드 뚜왈렛'), (SELECT id FROM fragrant_wheels WHERE name = '플로럴'), 4),
((SELECT id FROM perfumes WHERE name = '레플리카 레이지 선데이 모닝 더 클래식 에디션 오 드 뚜왈렛'), (SELECT id FROM fragrant_wheels WHERE name = '프레시'), 3),
((SELECT id FROM perfumes WHERE name = '블랑쉬 오 드 퍼퓸'), (SELECT id FROM fragrant_wheels WHERE name = '플로럴'), 5),
((SELECT id FROM perfumes WHERE name = '블랑쉬 오 드 퍼퓸'), (SELECT id FROM fragrant_wheels WHERE name = '스위트'), 2),
((SELECT id FROM perfumes WHERE name = '미스 디올 오 드 뚜왈렛'), (SELECT id FROM fragrant_wheels WHERE name = '플로럴'), 4),
((SELECT id FROM perfumes WHERE name = '미스 디올 오 드 뚜왈렛'), (SELECT id FROM fragrant_wheels WHERE name = '스위트'), 3),
((SELECT id FROM perfumes WHERE name = '샤넬 No.5 오 드 뚜왈렛'), (SELECT id FROM fragrant_wheels WHERE name = '플로럴'), 4),
((SELECT id FROM perfumes WHERE name = '샤넬 No.5 오 드 뚜왈렛'), (SELECT id FROM fragrant_wheels WHERE name = '알데하이드'), 5),
((SELECT id FROM perfumes WHERE name = '블랙 오키드 오 드 퍼퓸'), (SELECT id FROM fragrant_wheels WHERE name = '오리엔탈'), 5),
((SELECT id FROM perfumes WHERE name = '블랙 오키드 오 드 퍼퓸'), (SELECT id FROM fragrant_wheels WHERE name = '스파이시'), 3),
((SELECT id FROM perfumes WHERE name = '잉글리쉬 페어 앤 프리지아 코롱'), (SELECT id FROM fragrant_wheels WHERE name = '프레시'), 4),
((SELECT id FROM perfumes WHERE name = '잉글리쉬 페어 앤 프리지아 코롱'), (SELECT id FROM fragrant_wheels WHERE name = '스위트'), 3);

-- 7. 향수-태그 연결 데이터 삽입 (기존 태그 유지)
INSERT INTO perfume_tags (perfume_id, tag_id) VALUES
((SELECT id FROM perfumes WHERE name = '레플리카 레이지 선데이 모닝 더 클래식 에디션 오 드 뚜왈렛'), (SELECT id FROM tags WHERE name = '플로럴')),
((SELECT id FROM perfumes WHERE name = '레플리카 레이지 선데이 모닝 더 클래식 에디션 오 드 뚜왈렛'), (SELECT id FROM tags WHERE name = '프레시')),
((SELECT id FROM perfumes WHERE name = '블랑쉬 오 드 퍼퓸'), (SELECT id FROM tags WHERE name = '플로럴')),
((SELECT id FROM perfumes WHERE name = '블랑쉬 오 드 퍼퓸'), (SELECT id FROM tags WHERE name = '스위트')),
((SELECT id FROM perfumes WHERE name = '미스 디올 오 드 뚜왈렛'), (SELECT id FROM tags WHERE name = '플로럴')),
((SELECT id FROM perfumes WHERE name = '미스 디올 오 드 뚜왈렛'), (SELECT id FROM tags WHERE name = '스위트')),
((SELECT id FROM perfumes WHERE name = '샤넬 No.5 오 드 뚜왈렛'), (SELECT id FROM tags WHERE name = '플로럴')),
((SELECT id FROM perfumes WHERE name = '샤넬 No.5 오 드 뚜왈렛'), (SELECT id FROM tags WHERE name = '파우더리')),
((SELECT id FROM perfumes WHERE name = '블랙 오키드 오 드 퍼퓸'), (SELECT id FROM tags WHERE name = '오리엔탈')),
((SELECT id FROM perfumes WHERE name = '블랙 오키드 오 드 퍼퓸'), (SELECT id FROM tags WHERE name = '스파이시')),
((SELECT id FROM perfumes WHERE name = '잉글리쉬 페어 앤 프리지아 코롱'), (SELECT id FROM tags WHERE name = '프레시')),
((SELECT id FROM perfumes WHERE name = '잉글리쉬 페어 앤 프리지아 코롱'), (SELECT id FROM tags WHERE name = '스위트'));
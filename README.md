# 유하은*프론트엔드*과제 (haeun-social-feed)

## 구동 방법

### 구동 전 install 및 Build

```shell
nvm use 20
npm i
```

### 개발 서버 구동

```shell
pnpm dev
```

- dev 서버: http://localhost:5173/

## 사용한 기술 스택 및 선택 이유

- **Vite + React + TypeScript**: 빠른 개발 경험과 타입 안정성.
- **react-router-dom**: `/`, `/create` 라우팅. 선언적 라우팅이라 확장/테스트 용이.
- **CSS Modules**: - 의존성 추가 없이 안전하게 가기 위해, 컴포넌트-로컬 스코프가 보장되는 CSS Modules 선택.
- **유틸 함수**: 상대시간 포맷을 유틸로 분리해 책임 분리와 재사용성 향상.

## 디렉토리 구조 (간략)

```
src/
  api/           # 목 API (getPosts 등)
  components/    # PostCard, skeleton 등 UI 컴포넌트
    skeletons/
  mock/          # mockPosts, mockCategories, currentUser
  pages/         # FeedPage, CreatePage
  types/         # 도메인 타입 정의
  utils/         # formatRelativeTime 등 공용 유틸
```

## 구현한 기능

- 반응형 기본 레이아웃
- 라우팅: `/`(게시물 리스트), `/create`(게시물 작성)
- Mock API 연동
- 상대 시간 표기(“방금 전”, “n분 전”, “n시간 전”)
- 카드 UI(작성자/카테고리/이미지/카운트)
- 로딩/에러 상태 표시
- (적용 시) 스켈레톤 로딩 및 PostCard 컴포넌트 분리

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

- **Vite**: 빠른 개발 서버와 번들 속도.
- **React + TypeScript**: 컴포넌트 단위 UI, 강력한 타입 안전성으로 유지보수/리팩토링 용이.
- **react-router-dom**: `/`, `/create` 라우팅. 선언적 라우팅이라 확장/테스트 용이.
- **CSS Modules**: - 의존성 추가 없이 안전하게 가기 위해, 컴포넌트-로컬 스코프가 보장, 클래스 충돌 방지.
- **유틸 함수**: 상대시간 포맷을 유틸로 분리해 책임 분리와 재사용성 향상.
- **IntersectionObserver**: 무한 스크롤(센티널 관찰)로 추가 페이지 자동 로드. rootMargin 선로딩으로 체감 끊김 개선.
- **상태 관리**: 로컬 상태(useState, useEffect, useMemo, useRef)로 충분하다고 생각.

## 디렉토리 구조 (간략)

```
src/
├─ api/
│   ├─ posts.ts            # getPosts(page, limit)
│   └─ interactions.ts     # toggleLike, toggleRetweet
├─ components/
│   ├─ FilterBar.tsx
│   ├─ FilterBar.module.css
│   ├─ PostCard.tsx
│   ├─ PostCard.module.css
│   ├─ ImageModal.tsx      # 이미지 라이트박스
│   └─ skeletons/
│       └─ PostCardSkeleton.tsx
├─ pages/
│   ├─ FeedPage.tsx        # 목록(무한 스크롤, 필터/정렬)
│   └─ CreatePage.tsx      # 글쓰기(280자 제한, 이미지 미리보기, 카테고리)
├─ mock/
│   ├─ mockPosts.ts
│   ├─ mockCategories.ts
│   └─ currentUser.ts
├─ utils/
│   └─ highlight.tsx       # URL/해시태그 하이라이트 변환
├─ types.ts
├─ App.tsx                 # 라우팅 구성
```

## 구현한 기능

1. 공통

- 반응형 UI
- 스켈레톤 로딩
- 에러 표시

2. 피드 목록

- 무한 스크롤
- `/` 경로에게시물 리스트 기능을 개발
  - 작성자 정보(프로필 이미지, 닉네임)
  - 게시물 내용(텍스트, 이미지, 카테고리)
  - 작성시간(상대적 시간: “방금전”, “1시간 전”)
  - 상호작용 관련 내용(좋아요 수, 리트윗수, 댓글 수)
  - 상호작용 버튼(좋아요, 리트윗)
- `/create` 경로에게시물 게시물 작성을 개발
  - 텍스트 입력(최대 280자)
  - 실시간 글자 수 카운터
  - 이미지 첨부 기능 (미리보기 포함, 최대 4장)
  - 카테고리 선택(1개만)
  - 작성 완료 후 피드에 새 게시물 반영

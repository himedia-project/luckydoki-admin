# LuckyDoki Admin

## 프로젝트 개요

LuckyDoki Admin은 LuckyDoki 플랫폼의 관리자 페이지입니다. 이 시스템은 상품 관리, 회원 관리, 주문 처리, 쿠폰 발급, 이벤트 관리 등 전자상거래 관리에 필요한 모든 기능을 제공하여 관리자가 플랫폼을 효율적으로 운영할 수 있도록 지원합니다. 직관적인 UI와 강력한 기능을 통해 복잡한 비즈니스 프로세스를 단순화합니다.

## 주요 기능

1. **안전한 인증 시스템**: JWT 토큰 기반의 인증 시스템을 구현하여 보안을 강화했습니다. 토큰 만료 자동 감지 및 리프레시 메커니즘을 구현하여 사용자 경험을 개선했습니다.

2. **통합 상품 관리**: 상품 등록, 수정, 삭제 및 재고 관리 기능을 제공합니다. 다양한 필터링과 검색 옵션을 통해 대량의 상품도 효율적으로 관리할 수 있습니다.

3. **실시간 주문 처리**: 주문 상태 실시간 업데이트 및 관리 기능을 구현했습니다. 결제 상태 확인, 배송 추적 등 주문 라이프사이클 전반을 관리할 수 있습니다.

4. **데이터 시각화 대시보드**: Material UI를 활용해 직관적인 차트와 그래프로 판매 데이터, 방문자 통계, 주문 정보 등을 시각화했습니다. 복잡한 데이터를 한눈에 파악할 수 있는 UI를 설계했습니다.

5. **회원 관리 시스템**: 고객 정보 관리, 회원 등급 관리, 고객 활동 모니터링 등의 기능을 통해 고객 관계 관리를 용이하게 했습니다.

## 기술 스택

### 프론트엔드

- **React 19**: 최신 React 버전을 활용하여 선언적이고 효율적인 UI 개발
- **Redux Toolkit & Redux Persist**: 전역 상태 관리와 상태 지속성 관리
- **React Router v7**: 클라이언트 사이드 라우팅
- **Material UI v6**: 세련된 디자인 시스템과 반응형 컴포넌트
- **Axios**: 인터셉터를 활용한 HTTP 요청 관리

### 인증 및 보안

- **JWT 인증**: 액세스 토큰 및 리프레시 토큰 기반 인증 시스템
- **권한 기반 접근 제어**: 관리자 권한에 따른 기능 접근 제한

### 개발 도구

- **Create React App**: 프로젝트 설정 및 빌드
- **Cross-env**: 환경 변수 관리

## 설치 및 실행 방법

### 사전 요구사항

- Node.js 18 이상
- npm 9 이상

### 설치 단계

1. 리포지토리 복제

```bash
git clone https://github.com/yourusername/luckydoki-admin.git
cd luckydoki-admin
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 다음 변수를 설정합니다:

```
REACT_APP_API_BASE_URL=http://your-api-server-url.com
```

4. 개발 서버 실행

```bash
npm start
```

개발 서버는 기본적으로 http://localhost:3001 에서 실행됩니다.

5. 프로덕션 빌드 생성

```bash
npm run build
```

## 사용 방법

### 로그인

관리자 계정으로 로그인하여 대시보드에 접근합니다. 인증 토큰은 브라우저 세션에 저장되며 일정 시간 후 자동으로 갱신됩니다.

```javascript
// 로그인 예시 코드
const loginData = {
  email: 'admin@example.com',
  password: 'yourpassword',
};

const handleLogin = async () => {
  try {
    const response = await axios.post('/api/admin/login', loginData);
    // 로그인 성공 처리
  } catch (error) {
    // 에러 처리
  }
};
```

### API 요청

Axios 인스턴스를 사용하여 API 요청을 보냅니다. 모든 요청에는 인증 토큰이 자동으로 포함됩니다.

```javascript
// API 요청 예시
import axiosInstance from '../api/axiosInstance';

const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get('/product/list');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
```

## 개발 과정 및 문제 해결

### 인증 관련 문제 해결

JWT 토큰 기반 인증 시스템 구현 중 토큰 만료 문제를 해결했습니다. 액세스 토큰이 만료되면 리프레시 토큰을 사용하여 자동으로 갱신하는 메커니즘을 구현했습니다.

```javascript
// 토큰 리프레시 메커니즘
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.data?.error === 'ERROR_ACCESS_TOKEN') {
      try {
        const result = await refreshJWT();
        store.dispatch(
          login({
            email: result.email,
            roles: result.roles,
            accessToken: result.accessToken,
          }),
        );
        return axiosInstance(error.config); // 재요청
      } catch (refreshError) {
        // 리프레시 토큰 만료 처리
        handleLoginError('인증이 만료되었습니다.');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
```

### 상태 관리 최적화

Redux Toolkit을 사용하여 상태 관리를 단순화하고, Redux Persist를 통해 새로고침 후에도 상태를 유지하도록 구현했습니다. 이를 통해 사용자 경험을 개선하고 개발 효율성을 높였습니다.

```javascript
// Redux 스토어 설정
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['loginSlice'], // 유지할 상태 지정
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
```

### 커스텀 훅 활용

반복되는 로직을 커스텀 훅으로 추출하여 코드 재사용성을 높였습니다. 특히 로그인 관련 로직을 `useCustomLogin` 훅으로 분리하여 여러 컴포넌트에서 일관된 방식으로 사용할 수 있도록 했습니다.

```javascript
// useCustomLogin 훅 활용 예시
const { email, handleLogout, checkLoginAndNavigate, handleApiError } =
  useCustomLogin();

// 로그인 상태 확인 후 페이지 이동
const handleClick = () => {
  checkLoginAndNavigate('/product');
};
```

## 기여

이 프로젝트는 개인 프로젝트로 시작되었지만, 팀 프로젝트로 확장되어 여러 개발자가 참여했습니다. 주요 기여 영역은 다음과 같습니다:

- **인증 시스템 개발**: JWT 토큰 기반 인증 시스템 구현 및 보안 강화
- **UI/UX 디자인**: Material UI를 활용한 직관적인 인터페이스 설계
- **상태 관리 최적화**: Redux Toolkit 및 Redux Persist를 통한 상태 관리 개선
- **API 인터페이스**: 백엔드 API와의 통신 인터페이스 구현

## 개발자 역량 향상

이 프로젝트를 통해 다음과 같은 기술적 역량을 향상시켰습니다:

1. **인증 및 보안**: JWT 토큰 기반 인증 시스템 구현 경험을 통해 웹 보안에 대한 이해도를 높였습니다.
2. **상태 관리**: Redux Toolkit과 같은 최신 상태 관리 도구를 활용한 복잡한 애플리케이션 상태 관리 능력을 향상시켰습니다.
3. **UI 프레임워크**: Material UI와 같은 현대적인 UI 프레임워크를 활용한 효율적인 인터페이스 구현 역량을 키웠습니다.
4. **문제 해결 능력**: 인증 토큰 만료와 같은 복잡한 문제를 해결하는 과정에서 디버깅 및 문제 해결 능력이 크게 향상되었습니다.
5. **최신 웹 개발 기술**: React 19, React Router v7 등 최신 웹 개발 기술에 대한 경험을 쌓았습니다.

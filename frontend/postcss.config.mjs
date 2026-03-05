// Tailwind CSS를 PostCSS와 함께 사용할 때 필요한 설정 파일

// PostCSS 설정 객체
const config = {
  // 사용할 PostCSS 플러그인 목록
  plugins: {
    // Tailwind CSS 공식 PostCSS 플러그인
    "@tailwindcss/postcss": {},

    // 필요에 따라 추가 플러그인 등록 가능
  },
};

// ES 모듈 방식으로 내보내기
export default config;

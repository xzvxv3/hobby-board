// 이 파일은 클라이언트 컴포넌트로 사용됨
"use client";

// 재사용 가능한 Button 컴포넌트 (다양한 스타일 변형 지원)
export default function Button({
                                   variant = 'primary',   // 버튼 스타일 종류 (기본값: primary)
                                   children,              // 버튼 내부 콘텐츠 (텍스트, 아이콘 등)
                                   className,             // 추가 커스텀 클래스 (Tailwind 클래스 등)
                                   ...props               // 나머지 모든 button 속성 (type, onClick, disabled 등)
                               }) {
    // variant별 스타일 정의 (배경색 + 호버 색상 + 텍스트 색상)
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        success: "bg-emerald-600 hover:bg-emerald-700 text-white",
        danger:  "bg-rose-600 hover:bg-rose-700 text-white",
    };

    return (
        <button
            // 기본 스타일 + variant 스타일 + 사용자 지정 클래스 결합
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${variants[variant]} ${className || ''}`}
            // 나머지 속성 전달 (disabled, onClick, type 등)
            {...props}
        >
            {children}
        </button>
    );
}
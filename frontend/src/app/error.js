"use client";

export default function Error({ reset }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 gap-4">
            <p className="text-red-500 text-lg font-medium">게시글을 불러오지 못했습니다.</p>
            <button
                onClick={reset}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
            >
                다시 시도
            </button>
        </div>
    );
}
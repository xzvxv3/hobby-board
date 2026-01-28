"use client";

export default function Button({ variant = 'primary', children, className, ...props }) {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        success: "bg-emerald-600 hover:bg-emerald-700 text-white",
        danger: "bg-rose-600 hover:bg-rose-700 text-white",
    };

    return (
        <button
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
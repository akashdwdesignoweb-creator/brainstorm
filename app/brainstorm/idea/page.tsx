"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function IdeaPage() {
    const router = useRouter();
    const [idea, setIdea] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const user = sessionStorage.getItem("user");
        if (!user) router.push("/brainstorm/start");
    }, [router]);

    const handleNext = () => {
        if (!idea.trim()) return alert("Please describe your idea");
        setIsLoading(true);
        sessionStorage.setItem("idea", idea);
        router.push("/brainstorm/map");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.ctrlKey) {
            handleNext();
        }
    };

    const charCount = idea.length;
    const minChars = 20;
    const isValid = charCount >= minChars;

    return (
        <main className="min-h-screen flex flex-col justify-center items-center p-8 md:p-12 relative bg-white">

            {/* Minimal Breadcrumb */}
            <div className={`absolute top-8 left-8 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <Link href="/">
                    <button className="text-xs font-bold text-slate-300 hover:text-slate-900 uppercase tracking-widest transition-colors">
                        ← Home
                    </button>
                </Link>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="spinner mx-auto mb-6 !border-slate-200 !border-t-slate-900"></div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Architecting...</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Parsing requirements into nodes.
                        </p>
                    </div>
                </div>
            )}

            <div className={`w-full max-w-4xl text-center transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Header */}
                <div className="mb-12">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 block">
                        Phase 01: Concept
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
                        Define Your <br />
                        <span className="text-brand-500">Vision</span>.
                    </h1>
                </div>

                {/* Input Area - Borderless Centered */}
                <div className="mb-16 group">
                    <textarea
                        className="input-clean w-full min-h-[150px] text-2xl md:text-4xl text-center placeholder:text-slate-200 resize-none font-bold leading-tight tracking-tight"
                        placeholder="Start typing your ideas..."
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        onKeyDown={handleKeyPress}
                        autoFocus
                    />

                    {/* Minimal Toolbar */}
                    <div className="flex items-center justify-center gap-8 mt-8 border-t border-slate-50 pt-6 max-w-md mx-auto">
                        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            {charCount} Characters
                        </div>
                        <div className={`text-xs font-bold uppercase tracking-wider transition-colors ${isValid ? 'text-brand-600' : 'text-slate-300'}`}>
                            {isValid ? 'Ready to Synthesize' : 'Keep Writing'}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={handleNext}
                        disabled={!isValid || isLoading}
                        className={`text-xl md:text-2xl font-black tracking-tight flex items-center gap-4 transition-all hover:text-brand-500 ${!isValid ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}`}
                    >
                        Generate Architecture
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>

                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                        Press Cmd+Enter
                    </span>
                </div>

            </div>

        </main>
    );
}

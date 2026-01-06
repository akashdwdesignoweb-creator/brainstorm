"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StartPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNext = () => {
        if (!name || !email) return alert("Please fill all fields");
        sessionStorage.setItem("user", JSON.stringify({ name, email }));
        router.push("/brainstorm/idea");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleNext();
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float delay-300"></div>
            </div>

            {/* Main Card */}
            <div
                className={`relative z-10 w-full max-w-xl px-4 ${mounted ? 'animate-scale-in' : 'opacity-0'
                    }`}
            >
                <div className="glass-card p-12 md:p-16">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/10 mb-6 uppercase tracking-widest">
                            Initialisation
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-slate-900 leading-tight">
                            Create Your <span className="gradient-text">Identity</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                            Personalise your session to begin the neural mapping process.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-8">
                        {/* Name Input */}
                        <div className={mounted ? 'animate-fade-in-up delay-100' : 'opacity-0'}>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                                Full Designation
                            </label>
                            <input
                                type="text"
                                className="input-modern !bg-slate-50/50 !border-slate-200/60 !p-5 !rounded-2xl focus:!bg-white focus:!shadow-xl transition-all duration-500 uppercase tracking-wider font-bold text-slate-900"
                                placeholder="E.g. ALAN TURING"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        {/* Email Input */}
                        <div className={mounted ? 'animate-fade-in-up delay-200' : 'opacity-0'}>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                                Neural Link Alias
                            </label>
                            <input
                                type="email"
                                className="input-modern !bg-slate-50/50 !border-slate-200/60 !p-5 !rounded-2xl focus:!bg-white focus:!shadow-xl transition-all duration-500 font-medium text-slate-700"
                                placeholder="your.email@nexus.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className={mounted ? 'animate-fade-in-up delay-300' : 'opacity-0'}>
                            <button
                                onClick={handleNext}
                                className="w-full btn-primary text-xl py-6 rounded-2xl shadow-xl shadow-primary/20 transition-all duration-500 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
                            >
                                <span className="font-black">Proceed to Logic Phase</span>
                                <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className={`mt-10 pt-8 border-t border-slate-100 text-center ${mounted ? 'animate-fade-in delay-400' : 'opacity-0'}`}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Secure Session Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

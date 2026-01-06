"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-8 md:p-12 relative bg-white">

      {/* Hero Section */}
      <div className={`w-full max-w-5xl mx-auto flex flex-col items-center text-center transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Minimal Badge */}
        <span className="inline-block text-xs font-bold text-slate-300 uppercase tracking-[0.2em] mb-8">
          Architectural Intelligence
        </span>

        {/* Heading */}
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[1.1] text-center">
          Think <span className="text-brand-500">Boundless</span>.
        </h1>

        {/* Subtitle - Explicitly centered with Flex */}
        <p className="text-xl md:text-2xl text-slate-500 w-full max-w-3xl mx-auto mb-16 leading-relaxed font-normal text-center">
          No boxes. No limits. Just your raw ideas synthesized into structured mental maps.
        </p>

        {/* CTA Button - Sole & Centered */}
        <div className="flex items-center justify-center mb-12">
          <Link href="/brainstorm/start">
            <button className="btn-primary text-lg px-12 py-5 h-auto min-w-[200px] shadow-2xl shadow-brand-500/20 hover:shadow-brand-500/30 hover:-translate-y-1 transition-all duration-300">
              Start Project
            </button>
          </Link>
        </div>

      </div>

      {/* Footer / Copyright */}
      <div className="absolute bottom-8 text-[10px] text-slate-200 font-bold uppercase tracking-widest text-center w-full">
        Designoweb AI Research
      </div>
    </main>
  );
}

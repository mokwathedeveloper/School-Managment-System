'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function PremiumLoader({ message = "Synchronizing Terminal", fullScreen = false }: PremiumLoaderProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-6",
      fullScreen ? "h-screen w-full bg-white organic-grain" : "py-12"
    )}>
      <div className="relative">
        {/* Outer Ring */}
        <div className="h-20 w-20 rounded-[2.5rem] border-4 border-blue-600/10 border-t-blue-600 animate-spin duration-[1500ms]" />
        
        {/* Middle Floating Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 animate-pulse">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        {/* Orbiting Particles */}
        <div className="absolute -inset-2 animate-spin-slow">
            <div className="h-2 w-2 rounded-full bg-blue-400 absolute top-0 left-1/2 -translate-x-1/2 shadow-lg shadow-blue-400/50" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
          {message}
        </p>
        <div className="flex gap-1">
            <div className="h-1 w-1 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
            <div className="h-1 w-1 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
            <div className="h-1 w-1 rounded-full bg-blue-600 animate-bounce" />
        </div>
      </div>
    </div>
  );
}

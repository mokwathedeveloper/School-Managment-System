'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  value: string | number;
  subValue: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'emerald' | 'indigo' | 'orange' | 'rose' | 'slate';
  className?: string;
}

export function InsightCard({
  title,
  value,
  subValue,
  icon: Icon,
  trend,
  trendType = 'neutral',
  color = 'blue',
  className
}: InsightCardProps) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 ring-blue-600/10",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-600/10",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 ring-indigo-600/10",
    orange: "bg-orange-50 text-orange-600 border-orange-100 ring-orange-600/10",
    rose: "bg-rose-50 text-rose-600 border-rose-100 ring-rose-600/10",
    slate: "bg-slate-50 text-slate-600 border-slate-100 ring-slate-600/10",
  };

  const accentMap = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    indigo: "bg-indigo-600",
    orange: "bg-orange-600",
    rose: "bg-rose-600",
    slate: "bg-slate-600",
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 rounded-[2rem]",
      className
    )}>
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        accentMap[color]
      )} />
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm border",
            colorMap[color]
          )}>
            <Icon className="h-6 w-6" />
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
              trendType === 'up' && "bg-emerald-50 text-emerald-600",
              trendType === 'down' && "bg-rose-50 text-rose-600",
              trendType === 'neutral' && "bg-slate-50 text-slate-400",
            )}>
              {trendType === 'up' && <ArrowUpRight className="h-3 w-3" />}
              {trendType === 'down' && <ArrowDownRight className="h-3 w-3" />}
              {trend}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-3xl font-black tracking-tighter text-slate-900">
            {value}
          </h3>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {title}
            </span>
            <span className="text-xs font-bold text-slate-500 italic mt-0.5">
              {subValue}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  UserCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Insights({ stats }: { stats: any }) {
  const items = [
    {
      title: "Total Enrollment",
      value: stats?.totalStudents || 0,
      sub: "Active Scholars",
      icon: Users,
      trend: "+2.4%",
      trendType: "up",
      color: "blue"
    },
    {
      title: "Fee Collection",
      value: `${stats?.collectionRate || 0}%`,
      sub: `KES ${stats?.totalInvoiced?.toLocaleString()}`,
      icon: CreditCard,
      trend: stats?.debtPercentage ? `-${stats.debtPercentage}% Debt` : "Stable",
      trendType: stats?.debtPercentage > 15 ? "down" : "up",
      color: "emerald"
    },
    {
      title: "Avg Attendance",
      value: `${stats?.attendanceRate || 0}%`,
      sub: "Weekly Momentum",
      icon: UserCheck,
      trend: "+0.8%",
      trendType: "up",
      color: "indigo"
    },
    {
      title: "Academic Grade",
      value: "B+",
      sub: "Institutional Avg",
      icon: Zap,
      trend: "Steady",
      trendType: "neutral",
      color: "orange"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, i) => (
        <Card 
          key={i} 
          className="group relative overflow-hidden border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-premium hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 rounded-[2rem]"
        >
          <div className={cn(
            "absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            item.color === 'blue' && "bg-blue-600",
            item.color === 'emerald' && "bg-emerald-600",
            item.color === 'indigo' && "bg-indigo-600",
            item.color === 'orange' && "bg-orange-600",
          )} />
          
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center transition-premium group-hover:scale-110 group-hover:rotate-3",
                item.color === 'blue' && "bg-blue-50 text-blue-600",
                item.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                item.color === 'indigo' && "bg-indigo-50 text-indigo-600",
                item.color === 'orange' && "bg-orange-50 text-orange-600",
              )}>
                <item.icon className="h-6 w-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                item.trendType === 'up' && "bg-emerald-50 text-emerald-600",
                item.trendType === 'down' && "bg-rose-50 text-rose-600",
                item.trendType === 'neutral' && "bg-slate-50 text-slate-400",
              )}>
                {item.trendType === 'up' && <ArrowUpRight className="h-3 w-3" />}
                {item.trendType === 'down' && <ArrowDownRight className="h-3 w-3" />}
                {item.trend}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-black tracking-tighter text-slate-900">
                {item.value}
              </h3>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {item.title}
                </span>
                <span className="text-xs font-bold text-slate-500 italic mt-0.5">
                  {item.sub}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  GraduationCap, 
  Users, 
  CreditCard, 
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  description: string;
}

export function InsightCard({ title, value, icon, trend, trendType, description }: InsightCardProps) {
  return (
    <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2rem] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
          {React.cloneElement(icon as React.ReactElement, { size: 80 })}
      </div>
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
            {icon}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm",
              trendType === 'up' ? "bg-emerald-50 text-emerald-600" : 
              trendType === 'down' ? "bg-rose-50 text-rose-600" : 
              "bg-slate-50 text-slate-600"
            )}>
              {trendType === 'up' ? <ArrowUpRight className="h-3 w-3" /> : 
               trendType === 'down' ? <ArrowDownRight className="h-3 w-3" /> : null}
              {trend}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
        </div>
        <p className="text-xs font-medium text-slate-500 mt-4 flex items-center gap-1.5 italic">
            <span className="h-1 w-1 rounded-full bg-blue-600" />
            {description}
        </p>
      </CardContent>
    </Card>
  );
}

export function Insights({ stats }: { stats: any }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <InsightCard 
        title="Total Students" 
        value={stats?.totalStudents?.toLocaleString() || '0'} 
        icon={<GraduationCap className="h-5 w-5" />} 
        trend="+4.3%" 
        trendType="up"
        description="New enrollment cycle"
      />
      <InsightCard 
        title="Institutional Attendance" 
        value={`${stats?.attendanceRate || 0}%`} 
        icon={<CalendarCheck className="h-5 w-5" />} 
        trend="+1.2%" 
        trendType="up"
        description="Real-time synchronized"
      />
      <InsightCard 
        title="Collection Rate" 
        value={`${stats?.collectionRate || 0}%`} 
        icon={<CreditCard className="h-5 w-5" />} 
        trend="+5.1%" 
        trendType="up"
        description="Revenue efficiency"
      />
      <InsightCard 
        title="Active Grades" 
        value={stats?.totalGrades || '0'} 
        icon={<Users className="h-5 w-5" />} 
        trend="Stable" 
        trendType="neutral"
        description="Academic levels"
      />
    </div>
  );
}

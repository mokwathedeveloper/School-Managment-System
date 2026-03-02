'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CreditCard, 
  GraduationCap, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { InsightCard } from '@/components/dashboard/insight-card';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard');
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Synthesizing Institutional Intelligence" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <Activity className="h-8 w-8 text-blue-600" />
            Analytics Terminal
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Institutional Performance & Big Data</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <InsightCard 
          title="Consolidated Growth" 
          value={stats?.studentCount || 0} 
          subValue="Active Enrollment"
          icon={Users}
          trend="+12.4%"
          trendType="up"
          color="blue"
        />
        <InsightCard 
          title="Revenue Velocity" 
          value={`${stats?.feeCollectionRate || 0}%`} 
          subValue="Collection Efficiency"
          icon={CreditCard}
          trend="+2.1%"
          trendType="up"
          color="emerald"
        />
        <InsightCard 
          title="Academic Momentum" 
          value="B+" 
          subValue="Institutional GPA"
          icon={GraduationCap}
          trend="Stable"
          trendType="neutral"
          color="indigo"
        />
        <InsightCard 
          title="Operational Uptime" 
          value="99.9%" 
          subValue="System Reliability"
          icon={Activity}
          trend="+0.1%"
          trendType="up"
          color="slate"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-blue-100">
                    <LineChart className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Enrollment Trajectory</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Historical student registration trends</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-12">
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-50 rounded-[2rem] bg-slate-50/30">
                <div className="text-center space-y-2 opacity-20">
                    <LineChart className="h-12 w-12 mx-auto" />
                    <p className="font-black uppercase tracking-widest text-[10px]">Data Visualization Rendering</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-emerald-100">
                    <PieChart className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Resource Distribution</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Allocation across academic departments</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-12">
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-50 rounded-[2rem] bg-slate-50/30">
                <div className="text-center space-y-2 opacity-20">
                    <PieChart className="h-12 w-12 mx-auto" />
                    <p className="font-black uppercase tracking-widest text-[10px]">Data Visualization Rendering</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

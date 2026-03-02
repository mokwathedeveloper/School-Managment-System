'use client';

import React from 'react';
import { useAuth } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { 
  Sparkles,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Insights } from '@/components/dashboard/insights';
import { ActionCenter } from '@/components/dashboard/action-center';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { InvoicesTable } from '@/components/dashboard/tables/invoices-table';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [students, gradeLevels, invoices, attendance] = await Promise.all([
        api.get('/students'),
        api.get('/grade-levels'),
        api.get('/finance'),
        api.get('/attendance')
      ]);
      
      const totalInvoiced = invoices.data.reduce((sum: number, inv: any) => sum + Number(inv.amount), 0);
      const paidInvoices = invoices.data.filter((inv: any) => inv.status === 'PAID').length;
      const unpaidAmount = invoices.data.filter((inv: any) => inv.status === 'UNPAID').reduce((sum: number, inv: any) => sum + Number(inv.amount), 0);
      const debtPercentage = totalInvoiced > 0 ? Math.round((unpaidAmount / totalInvoiced) * 100) : 0;

      const attendanceRate = attendance.data.length > 0 
        ? Math.round((attendance.data.filter((a: any) => a.status === 'PRESENT').length / attendance.data.length) * 100)
        : 94;

      return {
        totalStudents: students.data.total,
        totalGrades: gradeLevels.data.length,
        totalInvoiced,
        collectionRate: invoices.data.length ? Math.round((paidInvoices / invoices.data.length) * 100) : 0,
        attendanceRate,
        debtPercentage,
        rawInvoices: invoices.data
      };
    }
  });

  const attendanceData = [
    { name: 'Mon', rate: 92 },
    { name: 'Tue', rate: 95 },
    { name: 'Wed', rate: 94 },
    { name: 'Thu', rate: 90 },
    { name: 'Fri', rate: 88 },
  ];

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Aggregating Institutional Data</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader 
        heading={`Welcome, ${user?.first_name}.`}
        text="Your institutional dashboard is synchronized and operational."
      >
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Global Terminal Active</span>
        </div>
      </DashboardHeader>

      {/* KPI Section */}
      <Insights stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Operational View */}
        <div className="lg:col-span-2 space-y-8">
            <InvoicesTable invoices={stats?.rawInvoices || []} isLoading={loadingStats} />
            
            {/* Chart Section */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Attendance Momentum</h3>
                        <p className="text-xs font-medium text-slate-500 italic leading-none">Weekly institutional presence tracking.</p>
                    </div>
                    <Badge variant="outline" className="rounded-xl font-bold">This Week</Badge>
                </div>
                <div className="h-[300px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={attendanceData}>
                            <defs>
                                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                dy={10}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="rate" 
                                stroke="#2563eb" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorRate)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Action & Feed Sidebar */}
        <div className="space-y-8">
            <ActionCenter />
            <ActivityFeed />
        </div>
      </div>
    </DashboardShell>
  );
}

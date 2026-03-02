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
  Loader2,
  Activity,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Layout,
  Clock,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Insights } from '@/components/dashboard/insights';
import { ActionCenter } from '@/components/dashboard/action-center';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { InvoicesTable } from '@/components/dashboard/tables/invoices-table';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { InsightCard } from '@/components/dashboard/insight-card';

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

  if (loadingStats) return <PremiumLoader message="Aggregating Institutional Data" />;

  const isManagement = ['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user?.role);

  return (
    <DashboardShell>
      <DashboardHeader 
        heading={`Welcome, ${user?.first_name}.`}
        text={isManagement ? "Institutional infrastructure is synchronized and operational." : "Your academic terminal is active and updated."}
      >
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 transition-all hover:shadow-md cursor-default group">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Registry Node Active</span>
        </div>
      </DashboardHeader>

      {/* KPI Section */}
      {isManagement ? (
        <Insights stats={stats} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InsightCard 
                title="Academic Performance" 
                value="B+" 
                subValue="Current Term Avg"
                icon={GraduationCap}
                trend="+0.4"
                trendType="up"
                color="blue"
            />
            <InsightCard 
                title="Presence Rate" 
                value={`${stats?.attendanceRate || 0}%`} 
                subValue="Registry Compliance"
                icon={Activity}
                trend="Stable"
                trendType="neutral"
                color="indigo"
            />
            <InsightCard 
                title="Pending Tasks" 
                value="4" 
                subValue="Course Assignments"
                icon={Clock}
                trend="Due Soon"
                trendType="down"
                color="orange"
            />
            <InsightCard 
                title="Library Assets" 
                value="2" 
                subValue="Active Circulations"
                icon={BookOpen}
                trend="On Time"
                trendType="up"
                color="emerald"
            />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Operational View */}
        <div className="lg:col-span-2 space-y-8">
            {isManagement && (
                <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden border-none group">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Financial Inflow Registry</CardTitle>
                            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time terminal billing tracking</CardDescription>
                        </div>
                        <Badge variant="outline" className="rounded-xl border-slate-200 font-bold px-3 py-1 bg-white">Sync: Active</Badge>
                    </CardHeader>
                    <InvoicesTable invoices={stats?.rawInvoices || []} isLoading={loadingStats} />
                </div>
            )}
            
            {/* Chart Section */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8 border-none group hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-premium">
                <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-3">
                            <Activity className="h-6 w-6 text-blue-600" />
                            Engagement Velocity
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Weekly institutional participation metrics</p>
                    </div>
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-inner">
                        <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 transition-all">This Cycle</button>
                        <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Previous</button>
                    </div>
                </div>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={attendanceData}>
                            <defs>
                                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                dy={15}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip 
                                cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }}
                                contentStyle={{ 
                                    borderRadius: '20px', 
                                    border: 'none', 
                                    boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.1)',
                                    padding: '12px 16px'
                                }}
                                itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="rate" 
                                stroke="#2563eb" 
                                strokeWidth={5}
                                fillOpacity={1} 
                                fill="url(#colorRate)" 
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {!isManagement && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2rem] overflow-hidden group">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black">Next Session</CardTitle>
                            <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Upcoming classroom synchronization</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-premium">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg leading-tight">Advanced Calculus</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Hall • 09:00 HRS</p>
                                </div>
                            </div>
                            <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px]">
                                Join Stream
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-blue-600 text-white rounded-[2rem] overflow-hidden group">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black">Performance Brief</CardTitle>
                            <CardDescription className="text-blue-100 font-bold uppercase tracking-widest text-[10px]">Summary of academic trajectory</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-premium">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg leading-tight">Top 5% of Cohort</h4>
                                    <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Global Institutional Rank</p>
                                </div>
                            </div>
                            <Button className="w-full h-12 bg-black/20 hover:bg-black/30 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px]">
                                View Analytics
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
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

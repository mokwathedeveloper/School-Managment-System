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
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity,
  Filter,
  Download,
  BookOpen,
  DollarSign,
  TrendingDown,
  Trophy
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { InsightCard } from '@/components/dashboard/insight-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

const COLORS = ['#2563eb', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#64748b'];

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard');
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Synthesizing Institutional Intelligence" />;

  const enrollmentData = stats?.enrollment?.trend.map((val: number, i: number) => ({
    month: stats?.enrollment?.months[i] || '',
    students: val
  }));

  const gradeDistribution = stats?.academics?.distribution || [];
  const financialData = stats?.finance?.monthlyTrends || [];
  const topSubjects = stats?.academics?.topSubjects || [];

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Intelligence Terminal"
        text="Institutional Performance & Big Data"
      >
        <div className="flex gap-3">
            <Button variant="outline" size="sm" className="h-11 px-4 rounded-xl border-slate-100">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                Configure Parameters
            </Button>
            <Button variant="premium" size="sm" className="h-11 px-6 rounded-xl shadow-xl shadow-blue-600/20">
                <Download className="h-4 w-4 mr-2" />
                Export Brief
            </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-4">
        <InsightCard 
          title="Consolidated Growth" 
          value={stats?.overview?.totalStudents || 0} 
          subValue="Active Registry"
          icon={Users}
          trend="+12.4%"
          trendType="up"
          color="blue"
        />
        <InsightCard 
          title="Revenue Velocity" 
          value={`${Math.round(stats?.finance?.collectionRate || 0)}%`} 
          subValue="Settlement Rate"
          icon={CreditCard}
          trend="+2.1%"
          trendType="up"
          color="emerald"
        />
        <InsightCard 
          title="Presence Rate" 
          value={`${stats?.overview?.attendanceRate || 0}%`} 
          subValue="Institutional Presence"
          icon={Activity}
          trend="Stable"
          trendType="neutral"
          color="indigo"
        />
        <InsightCard 
          title="Library Circulations" 
          value={stats?.overview?.activeBorrows || 0} 
          subValue="Active Sessions"
          icon={BookOpen}
          trend="High"
          trendType="up"
          color="slate"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Enrollment Trend Chart */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-blue-100">
                    <LineChartIcon className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Enrollment Trajectory</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Active student registration momentum</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrollmentData}>
                        <defs>
                            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                            dy={15}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                        />
                        <Tooltip 
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
                            dataKey="students" 
                            stroke="#2563eb" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorStudents)" 
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Financial Matrix Chart */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-emerald-100">
                    <DollarSign className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Financial Matrix</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Consolidated revenue vs expense flow</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                            dy={15}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                        />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ 
                                borderRadius: '20px', 
                                border: 'none', 
                                boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.1)',
                                padding: '12px 16px'
                            }}
                        />
                        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                        <Bar 
                            dataKey="revenue" 
                            name="Revenue"
                            fill="#10b981" 
                            radius={[6, 6, 0, 0]} 
                            barSize={20}
                        />
                        <Bar 
                            dataKey="expenses" 
                            name="Expenses"
                            fill="#ef4444" 
                            radius={[6, 6, 0, 0]} 
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Grade Distribution Chart */}
        <Card className="lg:col-span-1 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-indigo-100">
                    <PieChartIcon className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Academic Bell Curve</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Grade distribution matrix</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={gradeDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                            animationDuration={1500}
                        >
                            {gradeDistribution.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '20px', 
                                border: 'none', 
                                boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.1)',
                                padding: '12px 16px'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
                {gradeDistribution.map((d: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.name} ({d.value})</span>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Subject Leaderboard */}
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-amber-100">
                        <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black text-slate-900">Subject Performance Index</CardTitle>
                        <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Top performing disciplines by academic sequence</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8">
                <div className="space-y-6">
                    {topSubjects.map((subject: any, idx: number) => (
                        <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-slate-300">0{idx + 1}</span>
                                    <span className="text-sm font-black text-slate-900 tracking-tight">{subject.name}</span>
                                </div>
                                <span className="text-sm font-black text-blue-600">{subject.average}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <div 
                                    className="h-full bg-blue-600 transition-all duration-1000" 
                                    style={{ width: `${subject.average}%` }} 
                                />
                            </div>
                        </div>
                    ))}
                    {topSubjects.length === 0 && (
                        <div className="h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px] py-12">
                            Academic sequence data pending...
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

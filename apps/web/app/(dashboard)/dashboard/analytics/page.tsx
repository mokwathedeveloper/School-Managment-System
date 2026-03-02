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
  Download
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
  Bar
} from 'recharts';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { InsightCard } from '@/components/dashboard/insight-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    month: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'][i],
    students: val
  }));

  const gradeDistribution = stats?.academics?.distribution || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <Activity className="h-8 w-8 text-blue-600" />
            Intelligence Terminal
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Institutional Performance & Big Data</p>
        </div>
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
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <InsightCard 
          title="Consolidated Growth" 
          value={stats?.enrollment?.total || 0} 
          subValue="Active Registry"
          icon={Users}
          trend="+12.4%"
          trendType="up"
          color="blue"
        />
        <InsightCard 
          title="Revenue Velocity" 
          value={`${Math.round(stats?.finance?.collectionRate || 0)}%`} 
          subValue="Invoiced Settlement"
          icon={CreditCard}
          trend="+2.1%"
          trendType="up"
          color="emerald"
        />
        <InsightCard 
          title="Academic Momentum" 
          value="B+" 
          subValue="Global institutional GPA"
          icon={GraduationCap}
          trend="Stable"
          trendType="neutral"
          color="indigo"
        />
        <InsightCard 
          title="Operational Uptime" 
          value="99.9%" 
          subValue="System Infrastructure"
          icon={Activity}
          trend="Operational"
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

        {/* Grade Distribution Chart */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-indigo-100">
                    <PieChartIcon className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Academic Bell Curve</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Consolidated grade distribution matrix</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 flex items-center justify-center">
            <div className="h-[350px] w-full max-w-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={gradeDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
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
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {gradeDistribution.map((d: any, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.name} ({d.value})</span>
                        </div>
                    ))}
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-black text-slate-900">Institutional Vitality Index</CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Key performance metrics across multiple academic sequences</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enrollmentData}>
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
                        <Bar 
                            dataKey="students" 
                            fill="#2563eb" 
                            radius={[8, 8, 0, 0]} 
                            barSize={40}
                            animationDuration={2000}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Activity, 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Download,
  Printer,
  ChevronRight,
  Filter,
  BarChart3,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';
import { cn } from '@/lib/utils';

export default function AttendanceReportsPage() {
  const { data: report, isLoading } = useQuery({
    queryKey: ['attendance-report'],
    queryFn: async () => {
      const res = await api.get('/attendance/reports');
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Aggregating Institutional Presence Data" />;

  const COLORS = ['#2563eb', '#10b981', '#6366f1', '#f59e0b', '#ef4444'];

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Presence Analytics"
        text="Institutional Attendance Intelligence & Retention Monitoring"
      >
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="h-11 px-4 rounded-xl border-slate-100 font-black uppercase tracking-widest text-[10px]">
            <Printer className="h-4 w-4 mr-2" />
            Registry Print
          </Button>
          <Button variant="premium" size="sm" className="h-11 px-6 rounded-xl shadow-xl shadow-blue-600/20 font-black uppercase tracking-widest text-[10px]">
            <Download className="h-4 w-4 mr-2" />
            Export Intelligence
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden group">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-premium group-hover:scale-110">
                        <Activity className="h-5 w-5" />
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest">+2.1%</Badge>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Presence</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mt-1">{report?.overallRate}%</h3>
            </CardContent>
        </Card>

        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden group">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center transition-premium group-hover:scale-110">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <Badge className="bg-rose-50 text-rose-600 border-none font-black text-[9px] uppercase tracking-widest">Action Required</Badge>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Alerts</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mt-1">{report?.alerts?.length || 0}</h3>
            </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-slate-900 text-white rounded-[2rem] overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between h-full">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Pulse</p>
                    <h3 className="text-xl font-black tracking-tight text-emerald-400">Registry Stabilized</h3>
                    <p className="text-xs font-bold text-slate-500 max-w-[200px] mt-2">Presence metrics are currently within high-retention parameters across all grade levels.</p>
                </div>
                <div className="h-20 w-32">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={report?.dailyTrends}>
                            <Area type="monotone" dataKey="rate" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Daily Trends Chart */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-blue-100">
                    <LineChart className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Historical Trajectory</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">30-Day presence window</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={report?.dailyTrends}>
                        <defs>
                            <linearGradient id="presenceColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                            dy={15}
                            tickFormatter={(v) => v.split('-')[2]}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                            domain={[0, 100]}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '20px', 
                                border: 'none', 
                                boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.1)',
                                padding: '12px 16px'
                            }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="rate" 
                            stroke="#2563eb" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#presenceColor)" 
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Class-wise performance */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-indigo-100">
                    <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Stream Matrix</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Presence index by classroom unit</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report?.classStats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar 
                            dataKey="attendanceRate" 
                            radius={[8, 8, 0, 0]} 
                            barSize={32}
                        >
                            {report?.classStats.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts Registry */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center transition-premium group-hover:scale-110 shadow-sm border border-rose-100">
                    <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Vulnerability Registry</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Students below the 75% presence threshold</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader className="bg-slate-50/30">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Scholar Identity</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Registry Node</TableHead>
                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400 text-center">Score Index</TableHead>
                        <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Action Terminal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {report?.alerts?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-48 text-center text-slate-300 font-black uppercase tracking-widest text-[10px] italic">No Vulnerabilities Identified</TableCell>
                        </TableRow>
                    ) : (
                        report?.alerts.map((alert: any) => (
                            <TableRow key={alert.id} className="group hover:bg-slate-50/50 transition-all border-b-slate-50">
                                <TableCell className="pl-8 py-5">
                                    <p className="font-black text-slate-900 text-sm">{alert.name}</p>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mt-0.5">{alert.admission_no}</p>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest border-slate-200 text-slate-500 rounded-lg">
                                        {alert.class}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="text-sm font-black text-rose-600">{alert.rate}%</span>
                                    <div className="w-12 h-1 bg-rose-100 rounded-full mx-auto mt-1" />
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <Button size="sm" variant="ghost" className="h-9 px-4 rounded-xl text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-[9px]">
                                        Initialize Outreach
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

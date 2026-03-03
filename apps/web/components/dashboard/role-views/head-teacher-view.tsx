'use client';

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Insights } from '../insights';
import { GraduationCap, Activity, TrendingUp, Users } from 'lucide-react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export function HeadTeacherView({ stats }: { stats: any }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const performanceData = [
    { name: 'T1 2023', score: 68 },
    { name: 'T2 2023', score: 72 },
    { name: 'T3 2023', score: 75 },
    { name: 'T1 2024', score: 78 },
  ];

  return (
    <div className="space-y-8">
      <Insights stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8 border-none group">
                <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-3">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                            Academic Growth Velocity
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Institutional mean score progression</p>
                    </div>
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest">Global Trend</Badge>
                </div>
                <div className="h-[320px] w-full">
                    {mounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
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
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="score" 
                                    stroke="#2563eb" 
                                    strokeWidth={5}
                                    fillOpacity={1} 
                                    fill="url(#colorScore)" 
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full bg-slate-50 animate-pulse rounded-[2rem]" />
                    )}
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-24 w-24" />
                </div>
                <div className="relative z-10 space-y-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Faculty Pulse</p>
                        <h3 className="text-xl font-black tracking-tight">Staff Overview</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <span className="text-xs font-bold text-white/60">Total Educators</span>
                            <span className="text-xs font-black">{stats?.overview?.totalStaff || 0}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <span className="text-xs font-bold text-white/60">Today's Attendance</span>
                            <span className="text-xs font-black text-emerald-400 tracking-widest uppercase">98%</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-xs font-bold text-white/60">Pending Leaves</span>
                            <span className="text-xs font-black text-amber-400">2</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

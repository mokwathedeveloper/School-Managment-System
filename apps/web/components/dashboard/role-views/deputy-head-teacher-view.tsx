'use client';

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Insights } from '../insights';
import { ShieldCheck, Activity, Users, BookOpen } from 'lucide-react';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

export function DeputyHeadTeacherView({ stats }: { stats: any }) {
  const disciplineData = [
    { category: 'Attendance', count: 12 },
    { category: 'Conduct', count: 5 },
    { category: 'Academic', count: 8 },
    { category: 'Uniform', count: 15 },
  ];

  const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444'];

  return (
    <div className="space-y-8">
      <Insights stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8 border-none group">
                <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-blue-600" />
                            Operations & Discipline
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Institutional stability metrics</p>
                    </div>
                    <Badge className="bg-amber-50 text-amber-600 border-amber-100 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest">Active Monitoring</Badge>
                </div>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={disciplineData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="category" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                dy={15}
                            />
                            <YAxis hide />
                            <Tooltip 
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={60}>
                                {disciplineData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Academic Oversight</p>
                    <h3 className="text-xl font-black tracking-tight text-slate-900">Class Performance</h3>
                </div>
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-xs font-bold text-slate-700">Assignments Marked</span>
                        </div>
                        <span className="text-xs font-black text-slate-900">84%</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                <Users className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-xs font-bold text-slate-700">Teacher Check-ins</span>
                        </div>
                        <span className="text-xs font-black text-slate-900">18/22</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

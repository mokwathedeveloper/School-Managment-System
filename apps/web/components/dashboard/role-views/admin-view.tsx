'use client';

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Insights } from '../insights';
import { InvoicesTable } from '../tables/invoices-table';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Activity } from 'lucide-react';

export function AdminView({ stats }: { stats: any }) {
  const attendanceData = [
    { name: 'Mon', rate: 92 },
    { name: 'Tue', rate: 95 },
    { name: 'Wed', rate: 94 },
    { name: 'Thu', rate: 90 },
    { name: 'Fri', rate: 88 },
  ];

  return (
    <div className="space-y-8">
      <Insights stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden border-none group">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Institutional Revenue Registry</CardTitle>
                        <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time terminal billing tracking</CardDescription>
                    </div>
                    <Badge variant="outline" className="rounded-xl border-slate-200 font-bold px-3 py-1 bg-white text-[10px]">Sync: Active</Badge>
                </CardHeader>
                <InvoicesTable invoices={stats?.rawInvoices || []} isLoading={!stats} />
            </div>
            
            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8 border-none group">
                <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-3">
                            <Activity className="h-6 w-6 text-blue-600" />
                            Engagement Velocity
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Weekly institutional participation metrics</p>
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
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.1)' }}
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
        </div>
      </div>
    </div>
  );
}

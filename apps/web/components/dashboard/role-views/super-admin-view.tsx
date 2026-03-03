'use client';

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  CreditCard, 
  Activity,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { InsightCard } from '../insight-card';
import { OnboardSchoolDialog } from '../onboard-school-dialog';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export function SuperAdminView({ stats }: { stats: any }) {
  const overview = stats?.overview;
  
  const insights = [
    {
      title: "Global Enrollment",
      value: overview?.totalStudents || 0,
      subValue: "Across all nodes",
      icon: Users,
      trend: "+12%",
      trendType: "up" as const,
      color: "blue" as const
    },
    {
      title: "Active Institutions",
      value: overview?.totalSchools || 0,
      subValue: "Provisioned schools",
      icon: Building2,
      trend: "+2",
      trendType: "up" as const,
      color: "emerald" as const
    },
    {
      title: "System Revenue",
      value: `KES ${(stats?.finance?.totalRevenue || 0).toLocaleString()}`,
      subValue: "Aggregate billing",
      icon: CreditCard,
      trend: "+8.4%",
      trendType: "up" as const,
      color: "indigo" as const
    },
    {
      title: "Avg Attendance",
      value: `${overview?.attendanceRate || 0}%`,
      subValue: "Global momentum",
      icon: Activity,
      trend: "Stable",
      trendType: "neutral" as const,
      color: "orange" as const
    }
  ];

  return (
    <div className="space-y-8">
      {/* Super Admin Quick Actions */}
      <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">System Control Plane</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global platform management and provisioning</p>
        </div>
        <OnboardSchoolDialog />
      </div>

      {/* Global Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((item, i) => (
          <InsightCard key={i} {...item} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8 border-none group">
                <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-3">
                            <Activity className="h-6 w-6 text-blue-600" />
                            Global Growth Velocity
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Aggregate institutional performance</p>
                    </div>
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest">Platform Stats</Badge>
                </div>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats?.finance?.monthlyTrends || []}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
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
                            <YAxis hide />
                            <Tooltip 
                                cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }}
                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -12px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#2563eb" 
                                strokeWidth={5}
                                fillOpacity={1} 
                                fill="url(#colorRev)" 
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Building2 className="h-24 w-24" />
                </div>
                <div className="relative z-10 space-y-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Node Status</p>
                        <h3 className="text-xl font-black tracking-tight">Active Infrastructure</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <span className="text-xs font-bold text-white/60">Global Nodes</span>
                            <span className="text-xs font-black">12</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <span className="text-xs font-bold text-white/60">System Health</span>
                            <span className="text-xs font-black text-emerald-400 tracking-widest uppercase">Optimal</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-xs font-bold text-white/60">Active Sessions</span>
                            <span className="text-xs font-black">1,429</span>
                        </div>
                    </div>
                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2">
                        View Node Registry
                        <ArrowUpRight className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Plus, 
  ShieldCheck,
  Loader2,
  TrendingUp,
  BarChart3,
  Globe,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { InsightCard } from '@/components/dashboard/insight-card';
import { OnboardSchoolDialog } from '@/components/dashboard/onboard-school-dialog';
import { cn } from '@/lib/utils';

export default function SuperAdminDashboard() {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['super-admin-stats'],
    queryFn: async () => {
      const res = await api.get('/super-admin/stats');
      return res.data;
    },
  });

  const { data: schools, isLoading: loadingSchools } = useQuery({
    queryKey: ['super-admin-schools'],
    queryFn: async () => {
      const res = await api.get('/super-admin/schools');
      return res.data;
    },
  });

  if (loadingStats || loadingSchools) return <PremiumLoader message="Syncing Platform Nodes" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            Platform Command Center
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Global Ecosystem Management</p>
        </div>
        <OnboardSchoolDialog />
      </div>

      {/* Global Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <InsightCard 
          title="Total Institutions" 
          value={(stats?.schoolCount || 0).toString()} 
          icon={Building2}
          subValue="Active schools on platform"
          color="blue"
          trend="+12%"
          trendType="up"
        />
        <InsightCard 
          title="Global Students" 
          value={(stats?.totalStudents?.toLocaleString() || "0")} 
          icon={GraduationCap}
          subValue="Total enrolled learners"
          color="emerald"
          trend="+8.4%"
          trendType="up"
        />
        <InsightCard 
          title="Platform Users" 
          value={(stats?.totalUsers?.toLocaleString() || "0")} 
          icon={Users}
          subValue="Consolidated user base"
          color="indigo"
          trend="+5.2%"
          trendType="up"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Schools Directory */}
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black text-slate-900">Institutional Directory</CardTitle>
              <CardDescription className="font-bold text-slate-400 uppercase tracking-tighter text-xs">Managed school entities and operational metrics</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">School Identity</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">System Slug</TableHead>
                  <TableHead className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400">Students</TableHead>
                  <TableHead className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400">Users</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools?.map((school: any) => (
                  <TableRow key={school.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                    <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs border border-blue-100 group-hover:scale-110 transition-all duration-500">
                                {school.name[0]}
                            </div>
                            <span className="font-black text-slate-900">{school.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-1 rounded-lg">
                            /{school.slug}
                        </span>
                    </TableCell>
                    <TableCell className="text-center font-black text-slate-700">{school._count.students}</TableCell>
                    <TableCell className="text-center font-black text-slate-700">{school._count.users}</TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm">
                        Active Node
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Platform Insights */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Platform Vitality
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
             <div className="bg-slate-900 rounded-[2rem] p-8 text-center space-y-4 shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp className="h-20 w-20 text-white" />
                </div>
                <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-blue-600/20 relative z-10 group-hover:scale-110 transition-all duration-500">
                    <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="relative z-10">
                    <h4 className="text-3xl font-black text-white tracking-tighter">+12.4%</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Monthly Expansion</p>
                </div>
                <Button variant="ghost" className="w-full bg-white/5 hover:bg-white/10 text-white border-none h-10 text-[10px] font-black uppercase tracking-widest mt-4">
                    Analytics Report
                </Button>
             </div>
             
             <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Health Registry</h4>
                <div className="space-y-2">
                   <SystemStatusItem text="Provisioned Nodes" status="Verified" icon={Globe} />
                   <SystemStatusItem text="M-Pesa Gateway" status="Active" icon={Activity} />
                   <SystemStatusItem text="Global Auth" status="Encrypted" icon={ShieldCheck} />
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SystemStatusItem({ text, status, icon: Icon }: any) {
  return (
    <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 transition-all cursor-default group">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm border border-slate-100 transition-colors">
            <Icon className="h-4 w-4" />
        </div>
        <span className="font-bold text-xs text-slate-600 group-hover:text-slate-900 transition-colors">{text}</span>
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">{status}</span>
    </div>
  );
}

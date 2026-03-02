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
  Search, 
  Globe, 
  ShieldCheck,
  Loader2,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
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

  const onboardMutation = useMutation({
    mutationFn: async (data: any) => api.post('/super-admin/schools', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-schools'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-stats'] });
      toast.success('New institution has been successfully integrated.');
    }
  });

  const handleOnboard = () => {
    const name = window.prompt('Enter school name:');
    if (!name) return;
    const slug = window.prompt('Enter school slug:');
    if (!slug) return;
    const email = window.prompt('Enter contact email:');
    if (!email) return;

    onboardMutation.mutate({ name, slug, email });
  };

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
        <Button onClick={handleOnboard} disabled={onboardMutation.isPending} className="h-12 px-8 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
          {onboardMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
          Onboard Institution
        </Button>
      </div>

      {/* Global Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Total Institutions" 
          value={(stats?.schoolCount || 0).toString()} 
          icon={<Building2 className="h-5 w-5" />}
          description="Active schools on platform"
          color="blue"
        />
        <StatCard 
          title="Global Students" 
          value={(stats?.totalStudents?.toLocaleString() || "0")} 
          icon={<GraduationCap className="h-5 w-5" />}
          description="Total enrolled learners"
          color="emerald"
        />
        <StatCard 
          title="Platform Users" 
          value={(stats?.totalUsers?.toLocaleString() || "0")} 
          icon={<Users className="h-5 w-5" />}
          description="Consolidated user base"
          color="indigo"
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
                  <TableRow key={school.id} className="group hover:bg-slate-50/50 transition-colors border-b-slate-50">
                    <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs border border-blue-100">
                                {school.name[0]}
                            </div>
                            <span className="font-black text-slate-900">{school.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50/50 px-2 py-1 rounded-lg inline-block mt-4 ml-4">
                        /{school.slug}
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
             <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2rem] text-center space-y-3 shadow-inner">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <TrendingUp className="h-8 w-8 text-blue-600 animate-bounce" />
                </div>
                <div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">+12.4%</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Monthly Expansion</p>
                </div>
             </div>
             
             <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status Registry</h4>
                <div className="space-y-3">
                   <ActivityItem text={`${stats?.schoolCount || 0} provisioned nodes`} time="Verified" />
                   <ActivityItem text="M-Pesa Gateway" time="Operational" />
                   <ActivityItem text="Auth Service (JWT)" time="Encrypted" />
                   <ActivityItem text="Database Backups" time="Daily" />
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description, color }: any) {
  return (
    <Card className="group relative overflow-hidden border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-premium hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 rounded-[2rem]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center transition-premium group-hover:scale-110 group-hover:rotate-3 shadow-sm",
            color === 'blue' && "bg-blue-50 text-blue-600",
            color === 'emerald' && "bg-emerald-50 text-emerald-600",
            color === 'indigo' && "bg-indigo-50 text-indigo-600",
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black tracking-tighter text-slate-900 mb-1">{value}</div>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter italic">{description}</p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ text, time }: any) {
  return (
    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-transparent hover:border-blue-100 transition-all cursor-default group">
      <span className="font-bold text-xs text-slate-600 group-hover:text-slate-900 transition-colors">{text}</span>
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">{time}</span>
    </div>
  );
}

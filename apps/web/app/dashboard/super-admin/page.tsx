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

export default function SuperAdminDashboard() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Platform Command Center
        </h1>
        <p className="text-muted-foreground mt-1">Manage all institutions and monitor global ecosystem health.</p>
      </div>

      {/* Global Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Total Institutions" 
          value={stats?.schoolCount || 0} 
          icon={<Building2 className="h-5 w-5" />}
          description="Active schools on platform"
        />
        <StatCard 
          title="Global Students" 
          value={stats?.totalStudents?.toLocaleString() || 0} 
          icon={<GraduationCap className="h-5 w-5" />}
          description="Total enrolled learners"
        />
        <StatCard 
          title="Platform Users" 
          value={stats?.totalUsers?.toLocaleString() || 0} 
          icon={<Users className="h-5 w-5" />}
          description="Consolidated user base"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Schools Directory */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle>Institutional Directory</CardTitle>
              <CardDescription>Managed schools and their operational metrics.</CardDescription>
            </div>
            <Button onClick={() => setIsAdding(true)} className="shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Onboard School
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Students</TableHead>
                  <TableHead className="text-center">Staff</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingSchools ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : (
                  schools?.map((school: any) => (
                    <TableRow key={school.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-bold">{school.name}</TableCell>
                      <TableCell className="font-mono text-xs">{school.slug}</TableCell>
                      <TableCell className="text-center font-medium">{school._count.students}</TableCell>
                      <TableCell className="text-center font-medium">{school._count.users}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Platform Insights */}
        <Card className="shadow-sm border-muted/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Platform Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="bg-primary/5 p-6 rounded-2xl text-center space-y-2">
                <TrendingUp className="h-10 w-10 text-primary mx-auto opacity-50" />
                <h4 className="text-2xl font-black">+12.4%</h4>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Growth this month</p>
             </div>
             <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-tight">Recent Activity</h4>
                <div className="space-y-3">
                   <ActivityItem text="Nairobi Academy onboarded" time="2h ago" />
                   <ActivityItem text="500+ invoices generated" time="5h ago" />
                   <ActivityItem text="M-Pesa reconciliation synced" time="1d ago" />
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description }: any) {
  return (
    <Card className="overflow-hidden shadow-sm border-muted/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tracking-tighter">{value}</div>
        <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">{description}</p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ text, time }: any) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="font-medium text-slate-700">{text}</span>
      <span className="text-muted-foreground font-mono">{time}</span>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  HeartPulse, 
  Search, 
  Plus, 
  Users, 
  Loader2,
  Stethoscope,
  Activity,
  History,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { RecordHealthVisitDialog } from '@/components/dashboard/record-health-visit-dialog';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function HealthPage() {
  const queryClient = useQueryClient();
  const { data: visits, isLoading } = useQuery({
    queryKey: ['health-visits'],
    queryFn: async () => {
      const res = await api.get('/health/visits');
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Syncing Clinical Registry" />;

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Institutional Health"
        text="Student Wellness & Clinical Logs"
      >
        <RecordHealthVisitDialog />
      </DashboardHeader>

      <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-none">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <Input 
            placeholder="Search health records..." 
            className="pl-12 h-12 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-blue-600/10 font-bold"
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-slate-100">
            <Filter className="h-4 w-4 text-slate-400" />
        </Button>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-xl font-black text-slate-900">Clinical Encounters</CardTitle>
                <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time log of student visits and diagnosis</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-slate-100 font-bold uppercase tracking-widest text-[9px]">
                <History className="mr-2 h-4 w-4" />
                Audit Logs
            </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Student Patient</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Symptoms</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Diagnosis</TableHead>
                <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                        <HeartPulse className="h-12 w-12 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs">Registry Empty</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                visits?.map((visit: any) => (
                  <TableRow key={visit.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-rose-50 group-hover:text-rose-600 transition-all">
                          {visit.student.user.first_name[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{visit.student.user.first_name} {visit.student.user.last_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adm: {visit.student.admission_no}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Activity className="h-3 w-3 text-rose-400" />
                        {visit.symptoms}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                        <Stethoscope className="h-3 w-3 text-blue-600" />
                        {visit.diagnosis}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(visit.created_at).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-rose-600 transition-premium">
                        <ChevronRight className="h-5 w-5" />
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

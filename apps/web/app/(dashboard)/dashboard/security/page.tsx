'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Shield, 
  Users, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Loader2,
  Lock,
  UserCheck,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { AddVisitorDialog } from '@/components/dashboard/add-visitor-dialog';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function SecurityDashboard() {
  const queryClient = useQueryClient();
  const [verifyId, setVerifyId] = useState('');

  const { data: activeVisitors, isLoading } = useQuery({
    queryKey: ['active-visitors'],
    queryFn: async () => {
      const res = await api.get('/gate/active');
      return res.data;
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async (id: string) => api.post(`/gate/check-out/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-visitors'] });
      toast.success('Visitor check-out sequence verified.');
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => api.post('/gate/verify', { admission_no: id }),
    onSuccess: (res) => {
      toast.success(`Verified: ${res.data.name} (${res.data.status})`);
      setVerifyId('');
    },
    onError: () => {
      toast.error('Identity verification failed.');
    }
  });

  if (isLoading) return <PremiumLoader message="Syncing Gate Terminal" />;

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Institutional Security"
        text="Gate Entry & Identity Verification"
      >
        <AddVisitorDialog />
      </DashboardHeader>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Verification Terminal */}
        <Card className="lg:col-span-1 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-slate-900 rounded-[2.5rem] overflow-hidden text-white group">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-premium">
                    <UserCheck className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black">Identity Terminal</CardTitle>
                    <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Real-time credential check</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-6">
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Admission/Employee ID</Label>
                <div className="flex gap-2">
                    <Input 
                        placeholder="e.g. SCH-001" 
                        className="bg-white/5 border-white/10 h-12 rounded-xl focus:ring-blue-600/20 text-white font-black tracking-widest"
                        value={verifyId}
                        onChange={(e) => setVerifyId(e.target.value.toUpperCase())}
                    />
                    <Button 
                        size="icon" 
                        variant="premium" 
                        className="h-12 w-12 rounded-xl"
                        onClick={() => verifyMutation.mutate(verifyId)}
                        disabled={!verifyId || verifyMutation.isPending}
                    >
                        {verifyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scanner Online & Ready</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Visitors */}
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-black text-slate-900">Active Campus Visitors</CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Personnel currently checked-in at various nodes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Visitor Identity</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Purpose</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Check-in</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeVisitors?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                            <Users className="h-12 w-12 opacity-20" />
                            <p className="font-black uppercase tracking-widest text-xs">No Active Visitors</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  activeVisitors?.map((visit: any) => (
                    <TableRow key={visit.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                      <TableCell className="pl-8 py-5">
                        <div className="font-black text-slate-900 text-sm">{visit.full_name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">ID: {visit.id_number}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-slate-700 text-sm">{visit.purpose}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">See: {visit.whom_to_see}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                          <Clock className="h-3 w-3 text-blue-600" />
                          {new Date(visit.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-9 px-4 rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-[9px]"
                          onClick={() => checkOutMutation.mutate(visit.id)}
                        >
                          <LogOut className="h-3 w-3 mr-2" />
                          Check-out
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

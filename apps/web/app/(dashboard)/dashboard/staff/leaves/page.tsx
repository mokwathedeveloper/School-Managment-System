'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ChevronRight,
  Filter,
  User,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function LeavesPage() {
  const queryClient = useQueryClient();

  const { data: leaves, isLoading } = useQuery({
    queryKey: ['hr-leaves'],
    queryFn: async () => {
      const res = await api.get('/hr/leaves');
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.patch(`/hr/leaves?id=${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-leaves'] });
      toast.success('Leave status updated successfully.');
    }
  });

  if (isLoading) return <PremiumLoader message="Syncing Personnel Leave Registry" />;

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Leave Management"
        text="Personnel Absence Tracking & Approval Terminal"
      >
        <Button className="h-11 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-600/20">
            <Plus className="h-4 w-4 mr-2" />
            Submit Request
        </Button>
      </DashboardHeader>

      <div className="grid gap-8">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-black text-slate-900">Active Petitions</CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pending and historical leave requests</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Personnel</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Classification</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Duration</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Status</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaves?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-64 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">Registry Clean</TableCell></TableRow>
                ) : (
                  leaves?.map((leave: any) => (
                    <TableRow key={leave.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px]">
                            {leave.staff.user.first_name[0]}{leave.staff.user.last_name[0]}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm">{leave.staff.user.first_name} {leave.staff.user.last_name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{leave.staff.designation}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg">
                          {leave.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                                <Clock className="h-3 w-3 text-blue-400" />
                                {new Date(leave.start_date).toLocaleDateString()}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Until {new Date(leave.end_date).toLocaleDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-black text-[9px] uppercase tracking-widest border-none shadow-sm px-3 py-1 rounded-lg",
                          leave.status === 'APPROVED' ? "bg-emerald-50 text-emerald-600" : 
                          leave.status === 'REJECTED' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {leave.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        {leave.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-9 w-9 p-0 rounded-xl border-slate-100 hover:bg-rose-50 hover:text-rose-600"
                                onClick={() => updateMutation.mutate({ id: leave.id, status: 'REJECTED' })}
                            >
                                <XCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-9 w-9 p-0 rounded-xl border-slate-100 hover:bg-emerald-50 hover:text-emerald-600"
                                onClick={() => updateMutation.mutate({ id: leave.id, status: 'APPROVED' })}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        )}
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

'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Gavel, 
  AlertTriangle, 
  Search, 
  Plus, 
  User, 
  Loader2,
  FileWarning,
  ShieldAlert,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { ReportIncidentDialog } from '@/components/dashboard/report-incident-dialog';

export default function ConductPage() {
  const queryClient = useQueryClient();
  const { data: records, isLoading } = useQuery({
    queryKey: ['discipline-records'],
    queryFn: async () => {
      const res = await api.get('/discipline');
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Syncing Compliance Registry" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <Gavel className="h-8 w-8 text-blue-600" />
            Student Conduct
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Behavioral Analytics & Compliance</p>
        </div>
        <ReportIncidentDialog />
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-none">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <Input 
            placeholder="Search incident records..." 
            className="pl-12 h-12 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-blue-600/10 font-bold"
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-slate-100">
            <Filter className="h-4 w-4 text-slate-400" />
        </Button>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Student Scholar</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Incident Details</TableHead>
                <TableHead className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400">Severity</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400 text-right pr-8">Resolution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                        <ShieldAlert className="h-12 w-12 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs">Registry Clean</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                records?.map((record: any) => (
                  <TableRow key={record.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                          {record.student.user.first_name[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{record.student.user.first_name} {record.student.user.last_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{record.student.class?.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-700 text-sm">{record.title}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{new Date(record.incident_date).toLocaleDateString()}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg border-none shadow-sm",
                        record.severity === 'CRITICAL' ? "bg-rose-50 text-rose-600" :
                        record.severity === 'HIGH' ? "bg-orange-50 text-orange-600" :
                        record.severity === 'MEDIUM' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {record.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                            {record.action_taken || 'Awaiting Review'}
                        </span>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-blue-600 transition-premium">
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

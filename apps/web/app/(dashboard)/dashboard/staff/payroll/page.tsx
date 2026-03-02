'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  CreditCard, 
  Plus, 
  History, 
  CheckCircle2, 
  Loader2,
  ChevronRight,
  TrendingUp,
  Wallet,
  Calendar,
  Filter,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';
import { FormSelect } from '@/components/ui/form-select';

export default function PayrollPage() {
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: records, isLoading } = useQuery({
    queryKey: ['hr-payroll', selectedMonth, selectedYear],
    queryFn: async () => {
      const res = await api.get(`/hr/payroll?month=${selectedMonth}&year=${selectedYear}`);
      return res.data;
    },
  });

  const processMutation = useMutation({
    mutationFn: async () => {
      return api.post('/hr/payroll', { month: selectedMonth, year: selectedYear });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['hr-payroll'] });
      toast.success(`Payroll processed for ${res.data.processed} staff members.`);
    }
  });

  if (isLoading) return <PremiumLoader message="Syncing Financial Disbursement Registry" />;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Payroll Registry"
        text="Personnel Disbursement & Salary Administration"
      >
        <div className="flex items-center gap-3">
            <FormSelect 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="h-11 rounded-xl bg-white border-slate-100 font-bold text-xs"
            >
                {months.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
            </FormSelect>
            <Button 
                onClick={() => processMutation.mutate()}
                disabled={processMutation.isPending}
                className="h-11 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-600/20"
            >
                {processMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <DollarSign className="h-4 w-4 mr-2" />}
                Generate Roll
            </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-8">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Disbursement Ledger</CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Personnel compensation registry for {months[selectedMonth-1]} {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Personnel</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Base Salary</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Net Payable</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400 text-center">Status</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Registry Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-64 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">No Records Generated</TableCell></TableRow>
                ) : (
                  records?.map((record: any) => (
                    <TableRow key={record.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">
                            {record.staff.user.first_name[0]}{record.staff.user.last_name[0]}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm">{record.staff.user.first_name} {record.staff.user.last_name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{record.staff.designation}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-500 text-xs">KES {Number(record.base_pay).toLocaleString()}</TableCell>
                      <TableCell className="font-black text-slate-900 text-sm">KES {Number(record.net_pay).toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "font-black text-[9px] uppercase tracking-widest border-none shadow-sm px-3 py-1 rounded-lg",
                          record.status === 'PAID' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                        )}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-100 font-black uppercase tracking-widest text-[9px] hover:bg-blue-50 hover:text-blue-600">
                            Disburse
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

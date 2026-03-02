'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Banknote, 
  Plus, 
  Search, 
  Filter, 
  ArrowDownCircle, 
  Loader2,
  FileText,
  Calendar,
  Tag,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { RecordExpenseDialog } from '@/components/dashboard/record-expense-dialog';

export default function ExpensesPage() {
  const queryClient = useQueryClient();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['finance-expenses'],
    queryFn: async () => {
      const res = await api.get('/finance', { params: { type: 'expenses' } });
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Syncing Expenditure Terminal" />;

  const totalSpent = expenses?.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <ArrowDownCircle className="h-8 w-8 text-rose-600" />
            Expenditure Matrix
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Institutional Cash Outflow & Operational Costs</p>
        </div>
        <RecordExpenseDialog />
      </div>

      {/* Financial Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden group">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Total Monthly Outflow</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">KES {totalSpent.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm transition-all group-hover:scale-110 group-hover:rotate-3 border border-rose-100">
              <Banknote className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-black text-slate-900">Expenditure History</CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Consolidated log of all institutional payments</CardDescription>
          </div>
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
                placeholder="Search expense records..." 
                className="pl-12 h-12 rounded-2xl border-2 border-slate-100 bg-white focus:ring-blue-600/10 font-bold" 
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Description</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Classification</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Amount</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Date Logged</TableHead>
                <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Authorizer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                        <Banknote className="h-12 w-12 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs">No Records Found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                expenses?.map((exp: any) => (
                  <TableRow key={exp.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all">
                          <FileText className="h-6 w-6" />
                        </div>
                        <span className="font-black text-slate-900 text-sm">{exp.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-black text-[9px] uppercase tracking-widest bg-slate-50 text-slate-500 border-none px-2.5 py-1 rounded-lg">
                        {exp.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black text-rose-600 text-sm">KES {parseFloat(exp.amount).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Calendar className="h-3.5 w-3.5 text-slate-300" />
                        {new Date(exp.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                        {exp.recorded_by ? `${exp.recorded_by.user.first_name} ${exp.recorded_by.user.last_name[0]}.` : 'System Node'}
                      </span>
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

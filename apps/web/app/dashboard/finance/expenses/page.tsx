'use client';

import React, { useState } from 'react';
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
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['finance-expenses'],
    queryFn: async () => {
      const res = await api.get('/finance/expenses');
      return res.data;
    },
  });

  const totalSpent = expenses?.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ArrowDownCircle className="h-8 w-8 text-rose-600" />
            Expense Management
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Track institutional spending and manage overhead costs.</p>
        </div>
        <Button className="shadow-md bg-rose-600 hover:bg-rose-700 text-white" onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Record New Expense
        </Button>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-muted/50 bg-rose-50/30 border-rose-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-rose-900 uppercase tracking-widest mb-1">Total Month Outflow</p>
                <p className="text-3xl font-black text-rose-700">KES {totalSpent.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
                <Banknote className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-muted/50 overflow-hidden">
        <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle>Expenditure History</CardTitle>
            <CardDescription>Consolidated log of all outgoing payments.</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search expenses..." className="pl-10 h-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Recorded By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
              ) : expenses?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-48">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Banknote className="h-12 w-12 opacity-20 mb-4" />
                      <p className="font-bold text-lg text-slate-900">No expenses recorded yet.</p>
                      <p className="text-sm max-w-sm mx-auto mb-4">Start tracking your institutional spending to gain insights into operational costs.</p>
                      <Button variant="outline" onClick={() => setIsAdding(true)}>Record First Expense</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                expenses?.map((exp: any) => (
                  <TableRow key={exp.id} className="hover:bg-muted/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-sm">{exp.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold border-slate-200">
                        <Tag className="h-3 w-3 mr-1" /> {exp.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-black text-rose-600">KES {parseFloat(exp.amount).toLocaleString()}</TableCell>
                    <TableCell className="text-sm font-medium text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 opacity-50" />
                        {new Date(exp.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs font-medium text-muted-foreground">
                      {exp.recorded_by ? `${exp.recorded_by.user.first_name} ${exp.recorded_by.user.last_name[0]}.` : 'System'}
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

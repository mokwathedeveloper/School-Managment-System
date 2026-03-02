'use client';

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  ArrowUpRight, 
  Loader2, 
  Search,
  History,
  ArrowRight,
  User
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PremiumLoader } from '@/components/ui/premium-loader';

export function InvoicesTable({ invoices, isLoading }: { invoices: any[], isLoading: boolean }) {
  if (isLoading) return <div className="h-64 flex items-center justify-center"><PremiumLoader message="Syncing Ledger" /></div>;

  return (
    <Card className="border-none bg-white shadow-none rounded-none overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/30">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Reference</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Scholar Identity</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Amount</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Status</TableHead>
              <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                        <History className="h-12 w-12 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs italic">Registry Clean</p>
                    </div>
                </TableCell>
              </TableRow>
            ) : (
              invoices?.slice(0, 5).map((inv: any) => (
                <TableRow key={inv.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 text-[9px] font-black group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                            REF
                        </div>
                        <span className="font-mono text-[10px] font-black text-slate-400 tracking-widest">#{inv.id.substring(0,8).toUpperCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <User className="h-3.5 w-3.5" />
                        </div>
                        <div>
                            <p className="font-black text-slate-900 text-sm tracking-tight">{inv.student?.user ? `${inv.student.user.first_name} ${inv.student.user.last_name}` : 'Institutional Scholar'}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inv.title}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-slate-900">
                    <span className="text-[10px] text-slate-400 mr-1 font-bold">KES</span>
                    {Number(inv.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg border-none shadow-sm",
                      inv.status === 'PAID' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-premium">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

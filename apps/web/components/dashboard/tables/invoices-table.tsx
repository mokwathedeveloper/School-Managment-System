
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
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function InvoicesTable({ invoices, isLoading }: { invoices: any[], isLoading: boolean }) {
  return (
    <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-xl font-black text-slate-900">Recent Transactions</CardTitle>
            </div>
            <CardDescription className="font-medium text-slate-500 italic">Live financial ledger and student billing status.</CardDescription>
          </div>
          <Link href="/dashboard/finance">
            <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-all">
              Audit Ledger <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="pl-8 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Reference</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Student Entity</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Amount</TableHead>
              <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="text-right pr-8 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 opacity-20" />
                </TableCell>
              </TableRow>
            ) : invoices?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-slate-400 italic font-medium">
                  No institutional transactions found.
                </TableCell>
              </TableRow>
            ) : (
              invoices?.slice(0, 5).map((inv: any) => (
                <TableRow key={inv.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                  <TableCell className="pl-8 font-bold text-slate-900 text-xs">
                    #{inv.id.substring(0,8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-700">{inv.student_id.substring(0,13)}...</div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{inv.title}</div>
                  </TableCell>
                  <TableCell className="font-black text-slate-900">
                    KES {Number(inv.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border-none shadow-sm",
                      inv.status === 'PAID' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                      <ArrowUpRight className="h-4 w-4" />
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

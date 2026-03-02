'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InsightCard } from '../insight-card';
import { 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight,
  History,
  FileText,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvoicesTable } from '../tables/invoices-table';
import { Badge } from '@/components/ui/badge';

export function AccountantView({ stats }: { stats: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InsightCard 
              title="Fee Collection" 
              value={`${stats?.collectionRate || 0}%`} 
              subValue={`KES ${stats?.totalInvoiced?.toLocaleString()}`}
              icon={CreditCard}
              trend={stats?.debtPercentage ? `-${stats.debtPercentage}% Debt` : "Stable"}
              trendType={stats?.debtPercentage > 15 ? "down" : "up"}
              color="emerald"
          />
          <InsightCard 
              title="Revenue Node" 
              value={`KES ${stats?.totalInvoiced?.toLocaleString()}`} 
              subValue="Gross Invoiced"
              icon={Wallet}
              trend="+4.2%"
              trendType="up"
              color="blue"
          />
          <InsightCard 
              title="Draft Payroll" 
              value="KES 4.2M" 
              subValue="Pending Disbursement"
              icon={DollarSign}
              trend="Cycle Active"
              trendType="neutral"
              color="indigo"
          />
          <InsightCard 
              title="Financial Pulse" 
              value="Optimal" 
              subValue="Ledger Health"
              icon={TrendingUp}
              trend="Synced"
              trendType="up"
              color="emerald"
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden border-none group">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Institutional Revenue Registry</CardTitle>
                        <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time terminal billing tracking</CardDescription>
                    </div>
                    <Badge variant="outline" className="rounded-xl border-slate-200 font-bold px-3 py-1 bg-white text-[10px]">Financial Node Active</Badge>
                </CardHeader>
                <InvoicesTable invoices={stats?.rawInvoices || []} isLoading={!stats} />
            </div>
        </div>

        <div className="space-y-8">
            <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2rem] overflow-hidden group">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl font-black tracking-tight">Disbursement Center</CardTitle>
                    <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Initialize salary run</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-premium">
                            <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-black text-lg leading-tight text-white">Monthly Payroll</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">March 2026 Cycle</p>
                        </div>
                    </div>
                    <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px]">
                        Execute Roll
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white border border-slate-100 rounded-[2rem] overflow-hidden group">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl font-black tracking-tight text-slate-900">Audit Node</CardTitle>
                    <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Export financial reports</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-premium">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-black text-lg leading-tight text-slate-900">Quarterly Brief</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital PDF Synthesis</p>
                        </div>
                    </div>
                    <Button className="w-full h-12 bg-slate-900 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-900/20">
                        Generate Audit
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

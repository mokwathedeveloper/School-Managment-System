'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Mail, 
  FileText, 
  UserPlus, 
  Calendar, 
  CreditCard,
  ArrowRight,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { AddStudentDialog } from './add-student-dialog';
import { AddStaffDialog } from './add-staff-dialog';

export function ActionCenter() {
  return (
    <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] overflow-hidden group">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-premium group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-blue-100">
                <Zap className="h-5 w-5" />
            </div>
            <div>
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Institutional Hub</CardTitle>
                <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Rapid Workflow Terminal</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AddStudentDialog />
          <AddStaffDialog />
          
          <Link href="/dashboard/finance" className="w-full">
            <Button variant="outline" className="w-full h-16 justify-start gap-4 rounded-2xl border-slate-100 px-5 group/btn">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100 group-hover/btn:scale-110 transition-premium">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-900 leading-none">Generate Billing</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Invoicing & Fees</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-300 group-hover/btn:translate-x-1 transition-premium" />
            </Button>
          </Link>

          <Link href="/dashboard/messaging" className="w-full">
            <Button variant="outline" className="w-full h-16 justify-start gap-4 rounded-2xl border-slate-100 px-5 group/btn">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm border border-purple-100 group-hover/btn:scale-110 transition-premium">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-900 leading-none">Broadcast Alert</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">SMS & Push</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-300 group-hover/btn:translate-x-1 transition-premium" />
            </Button>
          </Link>
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-6 shadow-2xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity className="h-20 w-20 text-white" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Platform Intelligence</p>
            </div>
            <p className="text-xs font-medium text-slate-300 leading-relaxed italic mb-6 relative z-10">
                Automated end-of-term reporting is currently generating for 428 students across 12 academic streams.
            </p>
            <Button variant="ghost" className="h-10 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white border-none relative z-10">
                Review Status <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}


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
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { AddStudentDialog } from './add-student-dialog';
import { AddStaffDialog } from './add-staff-dialog';

export function ActionCenter() {
  return (
    <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-xl font-black text-slate-900">Institutional Hub</CardTitle>
        </div>
        <CardDescription className="font-medium text-slate-500 italic">Rapid command execution and primary workflows.</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AddStudentDialog />
          <AddStaffDialog />
          
          <Link href="/dashboard/finance" className="w-full">
            <Button variant="outline" className="w-full h-14 justify-start gap-3 rounded-2xl border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 font-bold transition-all text-slate-700">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                <CreditCard className="h-4 w-4" />
              </div>
              Generate Billing
              <ArrowRight className="ml-auto h-4 w-4 opacity-30" />
            </Button>
          </Link>

          <Link href="/dashboard/messaging" className="w-full">
            <Button variant="outline" className="w-full h-14 justify-start gap-3 rounded-2xl border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 font-bold transition-all text-slate-700">
              <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                <Mail className="h-4 w-4" />
              </div>
              Broadcast Alert
              <ArrowRight className="ml-auto h-4 w-4 opacity-30" />
            </Button>
          </Link>
        </div>

        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                    <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-sm font-black text-slate-900">Platform Intelligence</p>
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed italic mb-4">
                Automated end-of-term reporting is currently generating for 428 students across 12 academic streams.
            </p>
            <Button variant="link" className="p-0 h-auto text-xs font-bold text-blue-600 hover:text-blue-700">
                Review Status <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

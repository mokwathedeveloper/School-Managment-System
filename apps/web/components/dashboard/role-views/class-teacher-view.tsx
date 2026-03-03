'use client';

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { InvoicesTable } from '../tables/invoices-table';

export function ClassTeacherView({ stats }: { stats: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Users className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">My Scholars</p>
                <h4 className="text-2xl font-black text-slate-900">42</h4>
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Attendance</p>
                <h4 className="text-2xl font-black text-slate-900">95%</h4>
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <BookOpen className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Lessons</p>
                <h4 className="text-2xl font-black text-slate-900">6</h4>
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertCircle className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Behavior Alerts</p>
                <h4 className="text-2xl font-black text-slate-900">3</h4>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Class Performance
                </h3>
                <Badge className="bg-blue-50 text-blue-600">Grade 10 North</Badge>
            </div>
            <div className="space-y-4">
                {['Mathematics', 'English', 'Science'].map((subject) => (
                    <div key={subject} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-600">{subject}</span>
                            <span className="text-slate-900">78%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '78%' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6">
            <h3 className="text-xl font-black tracking-tight">Upcoming Deadlines</h3>
            <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-bold">Math Assignment #4</p>
                        <p className="text-[10px] text-white/40 uppercase font-black">Due in 2 days</p>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-400 border-none">Pending</Badge>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-bold">Science Lab Reports</p>
                        <p className="text-[10px] text-white/40 uppercase font-black">Due tomorrow</p>
                    </div>
                    <Badge className="bg-rose-500/20 text-rose-400 border-none">Urgent</Badge>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

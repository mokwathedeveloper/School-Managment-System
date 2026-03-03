'use client';

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bed, Utensils, HeartPulse, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function MatronView({ stats }: { stats: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Bed className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dorm Capacity</p>
                <h4 className="text-2xl font-black text-slate-900">184/200</h4>
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Utensils className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meals Served</p>
                <h4 className="text-2xl font-black text-slate-900">1,240</h4>
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <HeartPulse className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinic Visits</p>
                <h4 className="text-2xl font-black text-slate-900">8</h4>
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maintenance</p>
                <h4 className="text-2xl font-black text-slate-900">4</h4>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Bed className="h-5 w-5 text-blue-600" />
                Dormitory Status
            </h3>
            <div className="space-y-4">
                {['Everest House', 'Kilimanjaro House', 'Kenya House'].map((dorm) => (
                    <div key={dorm} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-700">{dorm}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase">95% Occupancy</p>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none">Clean</Badge>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-rose-600" />
                Health Alerts
            </h3>
            <div className="space-y-4">
                <div className="p-4 border-2 border-rose-50 rounded-2xl flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-black text-slate-900">Jane Doe (G10)</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">High Fever • 10:30 AM</p>
                    </div>
                    <Badge className="bg-rose-600 text-white border-none">Urgent</Badge>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between opacity-60">
                    <div className="space-y-1">
                        <p className="text-xs font-black text-slate-900">John Smith (G8)</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Medication Administered</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

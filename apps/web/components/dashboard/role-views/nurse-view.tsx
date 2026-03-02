'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InsightCard } from '../insight-card';
import { 
  HeartPulse, 
  Activity, 
  Search, 
  Plus,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NurseView({ stats }: { stats: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InsightCard 
              title="Daily Visits" 
              value="8" 
              subValue="Clinical Sessions"
              icon={HeartPulse}
              trend="+2"
              trendType="up"
              color="blue"
          />
          <InsightCard 
              title="Medication Track" 
              value="12" 
              subValue="Active Prescriptions"
              icon={ClipboardList}
              trend="Monitored"
              trendType="neutral"
              color="indigo"
          />
          <InsightCard 
              title="Critical Alerts" 
              value="0" 
              subValue="Emergency Node"
              icon={Activity}
              trend="All Clear"
              trendType="up"
              color="emerald"
          />
          <InsightCard 
              title="Medical Registry" 
              value="94%" 
              subValue="Record Sync"
              icon={Stethoscope}
              trend="Updated"
              trendType="up"
              color="blue"
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">Clinical Intake</CardTitle>
                  <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Initialize medical session</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-premium">
                          <Plus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                          <h4 className="font-black text-lg leading-tight text-white">Record Health Visit</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document symptoms and treatment</p>
                      </div>
                  </div>
                  <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px]">
                      New Registry Entry
                  </Button>
              </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white border border-slate-100 rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight text-slate-900">Scholar Search</CardTitle>
                  <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieve medical history</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-premium">
                          <Search className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                          <h4 className="font-black text-lg leading-tight text-slate-900">Medical Archive</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access student clinical profiles</p>
                      </div>
                  </div>
                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-600/20">
                      Search Registry
                  </Button>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

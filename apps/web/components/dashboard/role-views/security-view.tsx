'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InsightCard } from '../insight-card';
import { 
  ShieldAlert, 
  Users, 
  Plus, 
  LogOut,
  Activity,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SecurityView({ stats }: { stats: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InsightCard 
              title="Active Visitors" 
              value="4" 
              subValue="Current In-Campus"
              icon={Users}
              trend="Monitored"
              trendType="neutral"
              color="indigo"
          />
          <InsightCard 
              title="Today's Total" 
              value="18" 
              subValue="Registry Entries"
              icon={History}
              trend="+4"
              trendType="up"
              color="blue"
          />
          <InsightCard 
              title="Unchecked Exit" 
              value="0" 
              subValue="Protocol Status"
              icon={ShieldAlert}
              trend="Secure"
              trendType="up"
              color="emerald"
          />
          <InsightCard 
              title="Gate Activity" 
              value="High" 
              subValue="Movement Index"
              icon={Activity}
              trend="Peak Hours"
              trendType="neutral"
              color="orange"
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">Access Control</CardTitle>
                  <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Gate entry initialization</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-premium">
                          <Plus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                          <h4 className="font-black text-lg leading-tight text-white">Register Visitor</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digitalize identification and purpose</p>
                      </div>
                  </div>
                  <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px]">
                      Initialize Entry
                  </Button>
              </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white border border-slate-100 rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight text-slate-900">Active Manifest</CardTitle>
                  <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Personnel currently within perimeter</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100 group-hover:scale-110 transition-premium">
                          <LogOut className="h-6 w-6 text-rose-600" />
                      </div>
                      <div>
                          <h4 className="font-black text-lg leading-tight text-slate-900">Initialize Check-out</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Log visitor exit from registry</p>
                      </div>
                  </div>
                  <Button className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-600/20">
                      View Active Manifest
                  </Button>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

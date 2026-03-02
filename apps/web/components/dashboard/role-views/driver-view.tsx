'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InsightCard } from '../insight-card';
import { 
  Bus, 
  MapPin, 
  Users, 
  Clock,
  Navigation,
  Fuel
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DriverView({ stats }: { stats: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InsightCard 
              title="Active Route" 
              value="Route 4" 
              subValue="Eastern Pipeline"
              icon={MapPin}
              trend="On Track"
              trendType="up"
              color="blue"
          />
          <InsightCard 
              title="Scholar List" 
              value="24" 
              subValue="Passenger Registry"
              icon={Users}
              trend="Full Capacity"
              trendType="neutral"
              color="indigo"
          />
          <InsightCard 
              title="Fleet Status" 
              value="Optimal" 
              subValue="Vehicle Node"
              icon={Bus}
              trend="Verified"
              trendType="up"
              color="emerald"
          />
          <InsightCard 
              title="Next Dispatch" 
              value="16:00" 
              subValue="Time Terminal"
              icon={Clock}
              trend="On Schedule"
              trendType="neutral"
              color="blue"
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">Navigation Terminal</CardTitle>
                  <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Active route synchronization</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-premium">
                          <Navigation className="h-6 w-6 text-white" />
                      </div>
                      <div>
                          <h4 className="font-black text-lg leading-tight text-white">Initialize Route Dispatch</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activate GPS tracking and passenger manifest</p>
                      </div>
                  </div>
                  <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px]">
                      Start Navigation
                  </Button>
              </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white border border-slate-100 rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight text-slate-900">Maintenance Node</CardTitle>
                  <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Fleet integrity registry</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-premium">
                          <Fuel className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                          <h4 className="font-black text-lg leading-tight text-slate-900">Record Logistics</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Log fuel, mileage, and incident reports</p>
                      </div>
                  </div>
                  <Button className="w-full h-12 bg-slate-900 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-900/20">
                      Update Fleet Logs
                  </Button>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

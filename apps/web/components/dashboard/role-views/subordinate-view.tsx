'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InsightCard } from '../insight-card';
import { 
  Briefcase, 
  MessageSquare, 
  History, 
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SubordinateView({ stats }: { stats: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InsightCard 
              title="Daily Duty" 
              value="Active" 
              subValue="Registry Status"
              icon={Briefcase}
              trend="Check-in: 07:45"
              trendType="up"
              color="blue"
          />
          <InsightCard 
              title="Notifications" 
              value="3" 
              subValue="Unread Alerts"
              icon={Bell}
              trend="New"
              trendType="neutral"
              color="indigo"
          />
          <InsightCard 
              title="Work Schedule" 
              value="Optimal" 
              subValue="Performance Index"
              icon={History}
              trend="Registry Sync"
              trendType="up"
              color="emerald"
          />
          <InsightCard 
              title="Messaging" 
              value="Active" 
              subValue="Comm Hub"
              icon={MessageSquare}
              trend="Connected"
              trendType="neutral"
              color="blue"
          />
      </div>

      <Card className="border-none shadow-sm bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black tracking-tight text-slate-900">Institutional Announcements</CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Latest updates from the administration</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
              <div className="h-48 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-50 rounded-3xl">
                  <MessageSquare className="h-12 w-12 text-slate-100 mb-4" />
                  <p className="font-black text-slate-300 uppercase tracking-widest text-[10px] italic">No active broadcasts for your segment.</p>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}

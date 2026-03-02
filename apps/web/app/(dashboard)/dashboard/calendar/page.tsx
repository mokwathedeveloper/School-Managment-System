'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Tag, 
  Search, 
  Loader2,
  Bell,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { AddEventDialog } from '@/components/dashboard/add-event-dialog';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function CalendarPage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const res = await api.get('/calendar');
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Syncing Institutional Calendar" />;

  const upcomingEvents = events?.filter((e: any) => new Date(e.start_date) >= new Date())
    .sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 5);

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Institutional Calendar"
        text="Academic Events & Operational Milestones"
      >
        <AddEventDialog />
      </DashboardHeader>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Calendar View Placeholder */}
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden p-1">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">March 2026</h2>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <Button variant="ghost" size="sm" className="bg-white text-slate-900 shadow-sm rounded-lg px-4 font-black text-[10px] uppercase tracking-widest">Month</Button>
                <Button variant="ghost" size="sm" className="text-slate-400 rounded-lg px-4 font-black text-[10px] uppercase tracking-widest">Week</Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-7 gap-4 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className={cn(
                        "h-24 rounded-2xl border-2 border-slate-50 p-2 transition-all hover:border-blue-100 hover:bg-blue-50/30 group relative cursor-pointer",
                        i + 1 === 2 && "border-blue-600/20 bg-blue-50/50 shadow-inner ring-2 ring-blue-600/5"
                    )}>
                        <span className={cn(
                            "text-xs font-black text-slate-400 group-hover:text-blue-600",
                            i + 1 === 2 && "text-blue-600"
                        )}>{i + 1}</span>
                        {i === 14 && (
                            <div className="mt-2 p-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase truncate border border-emerald-100">
                                Half Term
                            </div>
                        )}
                        {i === 24 && (
                            <div className="mt-2 p-1 bg-rose-50 text-rose-600 rounded-lg text-[8px] font-black uppercase truncate border border-rose-100">
                                Finals
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Upcoming Highlights</CardTitle>
              <Bell className="h-4 w-4 text-slate-300" />
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {upcomingEvents?.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                    <Sparkles className="h-8 w-8 text-slate-100 mx-auto" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No events scheduled</p>
                </div>
              ) : (
                upcomingEvents?.map((event: any) => (
                  <div key={event.id} className="p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white transition-all duration-300 group cursor-default shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-2">
                        <Badge className={cn(
                            "font-black text-[8px] uppercase tracking-widest border-none px-2 h-4 rounded-md",
                            event.category === 'EXAM' ? "bg-rose-50 text-rose-600" : 
                            event.category === 'ACADEMIC' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                            {event.category}
                        </Badge>
                        <span className="text-[9px] font-black text-slate-400 font-mono">{new Date(event.start_date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm group-hover:text-blue-600 transition-colors leading-tight">{event.title}</h4>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            <Clock className="h-3 w-3 text-slate-300" />
                            All Day
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            <MapPin className="h-3 w-3 text-slate-300" />
                            Main Hall
                        </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-none rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calendar className="h-20 w-20 text-white" />
            </div>
            <div className="relative z-10 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-premium">
                    <Sparkles className="h-6 w-6" />
                </div>
                <div>
                    <h4 className="text-xl font-black tracking-tight">Sync Academic Term</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Automatic Google/iCal Integration</p>
                </div>
                <p className="text-xs font-medium text-slate-400 leading-relaxed italic pt-2">
                    Distribute institutional milestones directly to parent and staff personal devices with one-click synchronization.
                </p>
                <Button variant="ghost" className="w-full bg-white/5 hover:bg-white/10 text-white border-none h-12 text-[10px] font-black uppercase tracking-widest mt-4 active:scale-100">
                    Initialize External Sync
                </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

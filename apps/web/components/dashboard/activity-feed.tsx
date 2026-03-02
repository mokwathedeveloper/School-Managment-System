'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  UserPlus,
  AlertCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: 'payment',
      title: 'M-Pesa Reconciliation',
      description: 'Fee payment confirmed for John Doe (ADM001)',
      time: '12m ago',
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      id: 2,
      type: 'admission',
      title: 'New Admission',
      description: 'Application received for Grade 1: Sarah Smith',
      time: '45m ago',
      icon: <UserPlus className="h-3.5 w-3.5" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      id: 3,
      type: 'attendance',
      title: 'Attendance Alert',
      description: 'Absentee SMS broadcasted to 12 parents',
      time: '2h ago',
      icon: <MessageSquare className="h-3.5 w-3.5" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Backup',
      description: 'Cloud synchronization completed successfully',
      time: '5h ago',
      icon: <Activity className="h-3.5 w-3.5" />,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-100'
    }
  ];

  return (
    <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] overflow-hidden group">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center transition-premium group-hover:rotate-6 shadow-lg shadow-slate-900/20">
                    <Activity className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Activity Matrix</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Real-time institutional events</CardDescription>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4 space-y-6">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-5 group/item cursor-default">
              <div className={cn(
                "h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-premium group-hover/item:scale-110 shadow-sm border",
                activity.bg,
                activity.color,
                activity.border
              )}>
                {activity.icon}
              </div>
              <div className="flex-1 space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-slate-900 leading-none group-hover/item:text-blue-600 transition-colors">{activity.title}</p>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{activity.time}</span>
                </div>
                <p className="text-xs font-medium text-slate-500 italic leading-relaxed">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:bg-blue-50 mt-4">
            View Consolidated Logs <ArrowRight className="ml-2 h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
}

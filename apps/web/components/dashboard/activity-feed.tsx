
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  UserPlus,
  AlertCircle,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      bg: 'bg-emerald-50'
    },
    {
      id: 2,
      type: 'admission',
      title: 'New Admission',
      description: 'Application received for Grade 1: Sarah Smith',
      time: '45m ago',
      icon: <UserPlus className="h-3.5 w-3.5" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      id: 3,
      type: 'attendance',
      title: 'Attendance Alert',
      description: 'Absentee SMS broadcasted to 12 parents',
      time: '2h ago',
      icon: <MessageSquare className="h-3.5 w-3.5" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Backup',
      description: 'Cloud synchronization completed successfully',
      time: '5h ago',
      icon: <Activity className="h-3.5 w-3.5" />,
      color: 'text-slate-600',
      bg: 'bg-slate-50'
    }
  ];

  return (
    <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-xl font-black text-slate-900">Event Stream</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4 space-y-6">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 group cursor-pointer">
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-sm",
                activity.bg,
                activity.color
              )}>
                {activity.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-slate-900 leading-none">{activity.title}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{activity.time}</span>
                </div>
                <p className="text-xs font-medium text-slate-500 italic leading-relaxed">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

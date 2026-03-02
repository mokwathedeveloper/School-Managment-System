'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  ChevronRight, 
  Calendar, 
  CreditCard, 
  FileText,
  User,
  Heart,
  TrendingUp,
  Receipt,
  Bell,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { cn } from '@/lib/utils';

export default function ParentDashboard() {
  const { data: children, isLoading } = useQuery({
    queryKey: ['my-children'],
    queryFn: async () => {
      const res = await api.get('/parents/my-children');
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Syncing Family Terminal" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <Heart className="h-8 w-8 text-rose-600 fill-rose-600/10" />
            Parent Portal
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Family Academic Hub & Fee Management</p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Guardian Node Active</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {children?.length === 0 ? (
          <Card className="col-span-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] p-12 text-center">
            <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto mb-6 border border-slate-100">
                <User className="h-10 w-10 text-slate-200" />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">No Dependents Linked</CardTitle>
            <CardDescription className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-sm mx-auto leading-relaxed">
                Please contact the institutional registrar to link your student profiles to this terminal.
            </CardDescription>
          </Card>
        ) : (
          children?.map((child: any) => (
            <Card key={child.id} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-premium">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-blue-600 text-white shadow-xl shadow-blue-600/20 flex items-center justify-center font-black text-2xl group-hover:scale-110 group-hover:rotate-3 transition-premium">
                    {child.user.first_name[0]}{child.user.last_name[0]}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">{child.user.first_name} {child.user.last_name}</CardTitle>
                    <CardDescription className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                      {child.class?.grade.name} {child.class?.name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <QuickStat 
                    icon={<Calendar className="h-4 w-4" />} 
                    label="Presence" 
                    value={`${child.stats.attendanceRate}%`} 
                    color="emerald"
                  />
                  <QuickStat 
                    icon={<TrendingUp className="h-4 w-4" />} 
                    label="Academic" 
                    value={child.stats.lastGrade} 
                    color="blue"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <Link href={`/dashboard/students/${child.id}`} className="block">
                    <Button variant="outline" className="w-full h-14 justify-between rounded-2xl border-slate-100 group/btn px-6">
                      <span className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100 group-hover/btn:scale-110 transition-premium">
                            <FileText className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-black text-slate-900">Transcript Hub</p>
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover/btn:translate-x-1 transition-premium" />
                    </Button>
                  </Link>
                  <Button variant="premium" className="w-full h-14 justify-between rounded-2xl px-6 shadow-2xl shadow-blue-600/20">
                    <span className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-white/20 text-white flex items-center justify-center backdrop-blur-md">
                        <Receipt className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-black">Fee Checkout</p>
                    </span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-widest px-2">M-Pesa</Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Announcements / Notifications for Parents */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black text-slate-900">Institutional Stream</CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Broadcast notifications and academic alerts</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-blue-600">
            <Bell className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="divide-y divide-slate-50 p-0">
          <AnnouncementItem 
            title="Term 1 Mid-Term Recess" 
            date="Oct 24, 2024" 
            content="Institutional operations will suspend from 24th to 28th October for mid-term break."
            icon={<Sparkles className="h-4 w-4" />}
          />
          <AnnouncementItem 
            title="Annual Athletics Carnival" 
            date="Nov 05, 2024" 
            content="Join the institutional community for the annual sports gala starting at 09:00 HRS."
            icon={<Calendar className="h-4 w-4" />}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function QuickStat({ icon, label, value, color }: any) {
  return (
    <div className="bg-slate-50/50 p-5 rounded-[1.5rem] flex flex-col items-center justify-center text-center border border-slate-100 shadow-sm transition-premium hover:bg-white hover:shadow-md group">
      <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110 shadow-sm",
          color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
      )}>{icon}</div>
      <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black">{label}</p>
      <p className="text-xl font-black text-slate-900 tracking-tighter mt-0.5">{value}</p>
    </div>
  );
}

function AnnouncementItem({ title, date, content, icon }: any) {
  return (
    <div className="p-8 hover:bg-slate-50/50 transition-all duration-300 group cursor-default">
      <div className="flex items-start gap-5">
        <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
            {icon}
        </div>
        <div className="flex-1 space-y-1">
            <div className="flex justify-between items-center">
                <h4 className="font-black text-slate-900 text-sm tracking-tight group-hover:text-blue-600 transition-colors">{title}</h4>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date}</span>
            </div>
            <p className="text-xs font-medium text-slate-500 italic leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
}

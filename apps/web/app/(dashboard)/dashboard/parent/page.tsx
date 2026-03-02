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
  Loader2,
  Heart,
  TrendingUp,
  Receipt
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ParentDashboard() {
  const { data: children, isLoading } = useQuery({
    queryKey: ['my-children'],
    queryFn: async () => {
      const res = await api.get('/parents/my-children');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          Parent Portal
          <Heart className="h-6 w-6 text-red-500 fill-red-500" />
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">Manage your children&apos;s academic journey and school payments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children?.length === 0 ? (
          <Card className="col-span-full border-dashed p-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
            <CardTitle>No children linked</CardTitle>
            <CardDescription>Please contact the school administration to link your children to your account.</CardDescription>
          </Card>
        ) : (
          children?.map((child: any) => (
            <Card key={child.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-muted/50">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent pb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
                    {child.user.first_name[0]}{child.user.last_name[0]}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{child.user.first_name} {child.user.last_name}</CardTitle>
                    <CardDescription className="font-medium text-primary/80">
                      {child.class?.grade.name} {child.class?.name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <QuickStat 
                    icon={<Calendar className="h-4 w-4" />} 
                    label="Attendance" 
                    value={child.stats.attendanceRate} 
                    color="text-green-600"
                  />
                  <QuickStat 
                    icon={<TrendingUp className="h-4 w-4" />} 
                    label="Last Grade" 
                    value={child.stats.lastGrade} 
                    color="text-blue-600"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <Link href={`/dashboard/students/${child.id}`}>
                    <Button className="w-full justify-between group/btn shadow-sm" variant="outline">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        View Report Card
                      </span>
                      <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button className="w-full justify-between group/btn shadow-md" variant="default">
                    <span className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Pay School Fees
                    </span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-none">M-Pesa</Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Announcements / Notifications for Parents */}
      <Card className="shadow-sm border-muted/50 overflow-hidden">
        <CardHeader className="bg-muted/5">
          <CardTitle className="text-lg">School Announcements</CardTitle>
        </CardHeader>
        <CardContent className="divide-y p-0">
          <AnnouncementItem 
            title="Term 1 Mid-Term Break" 
            date="Oct 24, 2024" 
            content="School will be closed from 24th to 28th October for mid-term break."
          />
          <AnnouncementItem 
            title="Annual Sports Day" 
            date="Nov 05, 2024" 
            content="Join us for the annual sports day starting at 9:00 AM."
          />
        </CardContent>
      </Card>
    </div>
  );
}

function QuickStat({ icon, label, value, color }: any) {
  return (
    <div className="bg-muted/30 p-3 rounded-xl flex flex-col items-center justify-center text-center">
      <div className={cn("mb-1", color)}>{icon}</div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{label}</p>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
}

function AnnouncementItem({ title, date, content }: any) {
  return (
    <div className="p-4 hover:bg-muted/20 transition-colors">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-sm">{title}</h4>
        <span className="text-[10px] text-muted-foreground font-mono">{date}</span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-1">{content}</p>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

'use client';

import React from 'react';
import { useAuth } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();

  // 1. Fetch Stats
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // In a real app, you'd have a dedicated /dashboard/stats endpoint
      const [students, gradeLevels, invoices] = await Promise.all([
        api.get('/students'),
        api.get('/grade-levels'),
        api.get('/finance')
      ]);
      
      const totalInvoiced = invoices.data.reduce((sum: number, inv: any) => sum + Number(inv.amount), 0);
      const paidInvoices = invoices.data.filter((inv: any) => inv.status === 'PAID').length;

      return {
        totalStudents: students.data.total,
        totalGrades: gradeLevels.data.length,
        totalInvoiced,
        collectionRate: invoices.data.length ? Math.round((paidInvoices / invoices.data.length) * 100) : 0
      };
    }
  });

  const attendanceData = [
    { name: 'Mon', rate: 92 },
    { name: 'Tue', rate: 95 },
    { name: 'Wed', rate: 94 },
    { name: 'Thu', rate: 90 },
    { name: 'Fri', rate: 88 },
  ];

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.first_name}!</h1>
          <p className="text-muted-foreground mt-1 text-lg">Your institution is running smoothly today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm border-primary/20 hover:bg-primary/5">Download Report</Button>
          <Button className="shadow-lg bg-primary hover:bg-primary/90">Add New Admission</Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Students" 
          value={stats?.totalStudents.toString()} 
          icon={<GraduationCap className="h-5 w-5" />} 
          trend="+4.3%" 
          trendType="up"
          description="New enrollment"
        />
        <StatCard 
          title="Attendance" 
          value="94.2%" 
          icon={<CalendarCheck className="h-5 w-5" />} 
          trend="+1.2%" 
          trendType="up"
          description="Today's average"
        />
        <StatCard 
          title="Collection Rate" 
          value={`${stats?.collectionRate}%`} 
          icon={<CreditCard className="h-5 w-5" />} 
          trend="+5.1%" 
          trendType="up"
          description="Term-to-date"
        />
        <StatCard 
          title="Active Grades" 
          value={stats?.totalGrades.toString()} 
          icon={<Users className="h-5 w-5" />} 
          trend="Stable" 
          trendType="neutral"
          description="Academic levels"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        {/* Attendance Trends */}
        <Card className="lg:col-span-4 shadow-sm border-muted/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 bg-muted/5">
            <div className="space-y-1">
              <CardTitle className="text-xl">Weekly Attendance</CardTitle>
              <CardDescription>Presence trends across all streams.</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="pt-6 h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tickMargin={10} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRate)" 
                  />
                </AreaChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Finance Snapshot */}
        <Card className="lg:col-span-3 shadow-sm border-muted/50 overflow-hidden">
          <CardHeader className="bg-muted/5">
            <CardTitle className="text-xl">Revenue Health</CardTitle>
            <CardDescription>Termly fee reconciliation status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <FinanceItem 
              label="Payments Reconciled" 
              amount={`${stats?.collectionRate}%`} 
              color="bg-emerald-500" 
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            />
            <FinanceItem 
              label="Pending STK Push" 
              amount="12%" 
              color="bg-amber-500" 
              icon={<Clock className="h-4 w-4 text-amber-500" />}
            />
            <FinanceItem 
              label="Outstanding Balances" 
              amount="10%" 
              color="bg-rose-500" 
              icon={<AlertCircle className="h-4 w-4 text-rose-500" />}
            />
            
            <div className="pt-6 border-t mt-6 bg-slate-50 -mx-6 px-6 pb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Term Revenue</span>
                <span className="text-2xl font-black text-slate-900">KES {(stats?.totalInvoiced || 0).toLocaleString()}</span>
              </div>
              <Button className="w-full shadow-md font-bold" variant="outline">
                Financial Report Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendType, description }: any) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-xl transition-all group border-muted/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">{title}</CardTitle>
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:rotate-12 duration-300">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className={cn(
            "text-[10px] font-black flex items-center px-2 py-0.5 rounded-full uppercase tracking-tighter",
            trendType === 'up' ? "bg-emerald-100 text-emerald-700" : 
            trendType === 'down' ? "bg-rose-100 text-rose-700" : 
            "bg-muted text-muted-foreground"
          )}>
            {trendType === 'up' && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
            {trendType === 'down' && <ArrowDownRight className="h-3 w-3 mr-0.5" />}
            {trend}
          </span>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FinanceItem({ label, amount, color, icon }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className={cn("p-1 rounded-md bg-opacity-10", color.replace('bg-', 'bg-'))}>
            {icon}
          </div>
          <span className="font-bold text-slate-700">{label}</span>
        </div>
        <span className="font-black text-slate-900">{amount}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", color)} 
          style={{ width: amount }}
        ></div>
      </div>
    </div>
  );
}

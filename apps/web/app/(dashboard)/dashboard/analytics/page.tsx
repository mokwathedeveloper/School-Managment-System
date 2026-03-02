'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Loader2 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard');
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Transform trend data for Recharts
  const enrollmentData = analytics?.enrollment.trend.map((val: number, i: number) => ({
    name: `Month ${i+1}`,
    students: val
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Executive Insights
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">High-level performance metrics and strategic forecasts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <KPICard 
          title="Total Revenue" 
          value={`KES ${analytics?.finance.revenue.toLocaleString()}`} 
          sub={`+${analytics?.finance.collectionRate.toFixed(1)}% Collection Rate`}
          icon={<DollarSign className="h-5 w-5" />}
          trend="up"
        />
        <KPICard 
          title="Total Enrollment" 
          value={analytics?.enrollment.total.toLocaleString()} 
          sub="Consistent Growth"
          icon={<Users className="h-5 w-5" />}
          trend="up"
        />
        <KPICard 
          title="Academic Health" 
          value="B+ Average" 
          sub="Stable Performance"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="neutral"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Enrollment Trend */}
        <Card className="shadow-sm border-muted/50">
          <CardHeader>
            <CardTitle>Enrollment Growth</CardTitle>
            <CardDescription>Student population trend over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="students" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card className="shadow-sm border-muted/50">
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Academic performance spread across all exams.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.academics.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics?.academics.distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-4">
              {analytics?.academics.distribution.map((entry: any, index: number) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span>{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, sub, icon, trend }: any) {
  return (
    <Card className="shadow-sm border-muted/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground font-medium mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

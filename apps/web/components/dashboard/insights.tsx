'use client';

import React from 'react';
import { 
  Users, 
  CreditCard, 
  UserCheck, 
  Zap
} from 'lucide-react';
import { InsightCard } from './insight-card';

export function Insights({ stats }: { stats: any }) {
  const items = [
    {
      title: "Total Enrollment",
      value: stats?.totalStudents || 0,
      subValue: "Active Scholars",
      icon: Users,
      trend: "+2.4%",
      trendType: "up" as const,
      color: "blue" as const
    },
    {
      title: "Fee Collection",
      value: `${stats?.collectionRate || 0}%`,
      subValue: `KES ${stats?.totalInvoiced?.toLocaleString()}`,
      icon: CreditCard,
      trend: stats?.debtPercentage ? `-${stats.debtPercentage}% Debt` : "Stable",
      trendType: stats?.debtPercentage > 15 ? ("down" as const) : ("up" as const),
      color: "emerald" as const
    },
    {
      title: "Avg Attendance",
      value: `${stats?.attendanceRate || 0}%`,
      subValue: "Weekly Momentum",
      icon: UserCheck,
      trend: "+0.8%",
      trendType: "up" as const,
      color: "indigo" as const
    },
    {
      title: "Academic Grade",
      value: "B+",
      subValue: "Institutional Avg",
      icon: Zap,
      trend: "Steady",
      trendType: "neutral" as const,
      color: "orange" as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, i) => (
        <InsightCard key={i} {...item} />
      ))}
    </div>
  );
}

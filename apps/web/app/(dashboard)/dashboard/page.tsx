'use client';

import React from 'react';
import { useAuth } from '@/components/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { ActionCenter } from '@/components/dashboard/action-center';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

// Role-specific views
import { SuperAdminView } from '@/components/dashboard/role-views/super-admin-view';
import { AdminView } from '@/components/dashboard/role-views/admin-view';
import { TeacherView } from '@/components/dashboard/role-views/teacher-view';
import { LibrarianView } from '@/components/dashboard/role-views/librarian-view';
import { NurseView } from '@/components/dashboard/role-views/nurse-view';
import { SecurityView } from '@/components/dashboard/role-views/security-view';
import { DriverView } from '@/components/dashboard/role-views/driver-view';
import { SubordinateView } from '@/components/dashboard/role-views/subordinate-view';
import { AccountantView } from '@/components/dashboard/role-views/accountant-view';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Specialized fetch based on role if needed, or consolidated dashboard stats
      const res = await api.get('/analytics/dashboard');
      return res.data;
    }
  });

  if (loadingStats) return <PremiumLoader message="Aggregating Institutional Intelligence" />;

  const renderRoleView = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
        return <SuperAdminView stats={stats} />;
      case 'SCHOOL_ADMIN':
      case 'HEAD_TEACHER':
      case 'DEPUTY_HEAD_TEACHER':
        return <AdminView stats={stats} />;
      case 'ACCOUNTANT':
        return <AccountantView stats={stats} />;
      case 'TEACHER':
      case 'CLASS_TEACHER':
        return <TeacherView stats={stats} />;
      case 'LIBRARIAN':
        return <LibrarianView stats={stats} />;
      case 'NURSE':
      case 'MATRON':
        return <NurseView stats={stats} />;
      case 'SECURITY':
        return <SecurityView stats={stats} />;
      case 'DRIVER':
        return <DriverView stats={stats} />;
      default:
        return <SubordinateView stats={stats} />;
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader 
        heading={`Terminal Home: ${user?.first_name}`}
        text={`${user?.role?.replace('_', ' ')} Command Interface`}
      >
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 transition-all hover:shadow-md cursor-default group">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Registry Node Active</span>
        </div>
      </DashboardHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            {renderRoleView()}
        </div>

        {/* Action & Feed Sidebar */}
        <div className="space-y-8">
            <ActionCenter />
            <ActivityFeed />
        </div>
      </div>
    </DashboardShell>
  );
}

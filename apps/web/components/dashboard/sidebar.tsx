'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell,
  BookOpen,
  Layers,
  Heart,
  Building2,
  X,
  ShieldCheck,
  MessageSquare,
  ClipboardList,
  BarChart3,
  Package,
  Bus,
  Home,
  Gavel,
  Library,
  Shield,
  HeartPulse,
  ArrowDownCircle
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PARENT', 'STUDENT'] },
  { name: 'Learning Hub', href: '/dashboard/lms', icon: BookOpen, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT'] },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PARENT', 'STUDENT'] },
  { name: 'Platform Admin', href: '/dashboard/super-admin', icon: ShieldCheck, roles: ['SUPER_ADMIN'] },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
  { name: 'Admissions', href: '/dashboard/admissions', icon: ClipboardList, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
  { name: 'Alumni', href: '/dashboard/alumni', icon: GraduationCap, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
  { name: 'Health', href: '/dashboard/health', icon: HeartPulse, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
  { name: 'Security', href: '/dashboard/security', icon: Shield, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
  { name: 'Library', href: '/dashboard/library', icon: Library, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
  { name: 'Transport', href: '/dashboard/transport', icon: Bus, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
  { name: 'Hostels', href: '/dashboard/hostels', icon: Home, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
  { name: 'Conduct', href: '/dashboard/conduct', icon: Gavel, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
  { name: 'Messaging', href: '/dashboard/messaging', icon: MessageSquare, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
  { name: 'Parent Portal', href: '/dashboard/parent', icon: Heart, roles: ['PARENT'] },
  { name: 'Grade Levels', href: '/dashboard/grade-levels', icon: Layers, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
  { name: 'Students', href: '/dashboard/students', icon: GraduationCap, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
  { name: 'Staff', href: '/dashboard/staff', icon: Users, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
  { name: 'Classes', href: '/dashboard/classes', icon: BookOpen, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
  { name: 'Timetable', href: '/dashboard/timetable', icon: Calendar, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT'] },
  { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
  { name: 'Exams', href: '/dashboard/exams', icon: FileText, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
  { name: 'Finance', href: '/dashboard/finance', icon: CreditCard, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PARENT'] },
  { name: 'Fee Structures', href: '/dashboard/finance/fee-structures', icon: FileText, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
  { name: 'Expenses', href: '/dashboard/finance/expenses', icon: ArrowDownCircle, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="flex flex-col h-full w-full bg-card border-r shadow-sm">
      <div className="flex items-center justify-between px-6 py-6 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">SchoolOS</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-muted/50 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-muted-foreground truncate opacity-80 uppercase tracking-wider">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}

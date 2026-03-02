
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
  ArrowDownCircle,
  Trophy,
  UserCheck,
  UserCog,
  BookText,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export function Sidebar({ collapsed = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Terminal Home', href: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PARENT', 'STUDENT'] },
    { name: 'Platform Admin', href: '/dashboard/super-admin', icon: ShieldCheck, roles: ['SUPER_ADMIN'] },
    { name: 'Student Enrollment', href: '/dashboard/students', icon: GraduationCap, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
    { name: 'Academic Hierarchy', href: '/dashboard/grade-levels', icon: Layers, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
    { name: 'Class Management', href: '/dashboard/classes', icon: BookOpen, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
    { name: 'Admissions Pipeline', href: '/dashboard/admissions', icon: ClipboardList, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
    { name: 'Attendance Matrix', href: '/dashboard/attendance', icon: UserCheck, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
    { name: 'Examination Hub', href: '/dashboard/exams', icon: Trophy, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
    { name: 'Financial Engine', href: '/dashboard/finance', icon: CreditCard, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PARENT'] },
    { name: 'Learning Hub (LMS)', href: '/dashboard/lms', icon: Library, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT'] },
    { name: 'Institutional Staff', href: '/dashboard/staff', icon: UserCog, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
    { name: 'Transport & Fleet', href: '/dashboard/transport', icon: Bus, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
    { name: 'Hostel & Boarding', href: '/dashboard/hostels', icon: Home, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
    { name: 'Resource Library', href: '/dashboard/library', icon: BookText, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
    { name: 'Security & Gate', href: '/dashboard/security', icon: ShieldAlert, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
    { name: 'Messaging Central', href: '/dashboard/messaging', icon: MessageSquare, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
    { name: 'Institutional Settings', href: '/dashboard/settings', icon: Settings, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand Identity */}
      <div className={cn(
        "h-20 flex items-center px-6 border-b border-slate-100 transition-all duration-500",
        collapsed && "px-0 justify-center"
      )}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 transform transition-transform hover:scale-105 active:scale-95 cursor-pointer">
            <Building2 className="h-6 w-6" />
          </div>
          {!collapsed && (
            <span className="text-xl font-black tracking-tighter text-slate-900 animate-in fade-in slide-in-from-left-2 duration-500">
              SchoolOS
            </span>
          )}
        </div>
        {onClose && !collapsed && (
          <button onClick={onClose} className="ml-auto lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-none">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 group",
                isActive 
                  ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-600/5" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              {!collapsed && (
                <span className="truncate animate-in fade-in slide-in-from-left-1 duration-300">
                  {item.name}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 animate-in zoom-in duration-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Institutional Context (Footer) */}
      <div className={cn(
        "p-4 border-t border-slate-100 bg-slate-50/50 transition-all duration-500",
        collapsed && "px-0 flex justify-center"
      )}>
        {!collapsed ? (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">System Status</p>
                <p className="text-xs font-black text-slate-900">Synchronized</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="w-full h-9 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all"
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/5">
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}

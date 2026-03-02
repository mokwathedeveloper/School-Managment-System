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
  CheckCircle2,
  User,
  Search,
  BellRing,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CommandMenu } from './command-menu';

interface SidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onClose, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = React.useState(false);

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
      {/* Brand Identity & School Info */}
      <div className={cn(
        "pt-6 pb-4 flex flex-col px-6 border-b border-slate-100 transition-all duration-500 relative",
        collapsed && "px-0 items-center"
      )}>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 min-w-[40px] rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 transform transition-transform hover:scale-105 active:scale-95 cursor-pointer">
            <Building2 className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xl font-black tracking-tighter text-slate-900 animate-in fade-in slide-in-from-left-2 duration-500">
                SchoolOS
              </span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest truncate">
                {user?.school?.name || 'Institutional Terminal'}
              </span>
            </div>
          )}
          
          {/* Collapse Toggle - Desktop */}
          <button 
            onClick={onToggle}
            className={cn(
              "hidden lg:flex absolute -right-3 top-8 h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all z-50",
              collapsed && "rotate-180"
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {/* Close Button - Mobile */}
          {onClose && !collapsed && (
            <button onClick={onClose} className="ml-auto lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {!collapsed && (
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setCommandOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-100 hover:border-slate-200 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Search className="h-3.5 w-3.5 group-hover:text-blue-600 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">Search...</span>
              </div>
              <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border shadow-sm">
                <span className="text-[8px] font-black">⌘</span>
                <span className="text-[8px] font-black">K</span>
              </div>
            </button>
          </div>
        )}
      </div>

      <CommandMenu open={commandOpen} setOpen={setCommandOpen} />

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-none">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group",
                isActive 
                  ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-600/5" 
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              {!collapsed && (
                <span className="truncate animate-in fade-in slide-in-from-left-1 duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & System Footer */}
      <div className={cn(
        "p-4 border-t border-slate-100 bg-slate-50/50 transition-all duration-500",
        collapsed && "px-0 flex flex-col items-center gap-4"
      )}>
        {!collapsed ? (
          <div className="space-y-4">
            {/* User Profile Card */}
            <div className="bg-white rounded-[1.5rem] p-3 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">{user?.first_name} {user?.last_name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{user?.role?.replace('_', ' ')}</p>
                </div>
                <button 
                  onClick={() => router.push('/dashboard/settings/profile')}
                  className="ml-auto p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <UserCog className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push('/dashboard/settings')}
                  className="h-8 rounded-lg text-[9px] px-2"
                >
                  <Settings className="mr-1 h-3 w-3" />
                  Settings
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={logout}
                  className="h-8 rounded-lg text-[9px] px-2 shadow-rose-500/10"
                >
                  <LogOut className="mr-1 h-3 w-3" />
                  Logout
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active</span>
              </div>
              <button className="text-slate-400 hover:text-blue-600 transition-colors">
                <BellRing className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/settings/profile')} className="rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="danger" size="icon" onClick={logout} className="rounded-xl shadow-rose-500/10 h-10 w-10">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

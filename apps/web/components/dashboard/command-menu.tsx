'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  FileText, 
  CreditCard, 
  Settings, 
  Search,
  BookOpen,
  Layers,
  ShieldCheck,
  MessageSquare,
  ClipboardList,
  Library,
  UserCog,
  Bus,
  Home,
  ShieldAlert,
  Trophy,
  Activity,
  Plus,
  Zap
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

export function CommandMenu({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const navigation = [
    { name: 'Dashboard Home', href: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PARENT', 'STUDENT'] },
    { name: 'Platform Admin', href: '/dashboard/super-admin', icon: ShieldCheck, roles: ['SUPER_ADMIN'] },
    { name: 'Student Registry', href: '/dashboard/students', icon: GraduationCap, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] },
    { name: 'Admissions Pipeline', href: '/dashboard/admissions', icon: ClipboardList, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
    { name: 'Finance Terminal', href: '/dashboard/finance', icon: CreditCard, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PARENT'] },
    { name: 'LMS Center', href: '/dashboard/lms', icon: Library, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT'] },
    { name: 'HR Directory', href: '/dashboard/staff', icon: UserCog, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['SUPER_ADMIN', 'SCHOOL_ADMIN'] },
  ].filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <CommandInput placeholder="Type a command or search..." className="h-14 border-none focus:ring-0 font-bold" />
      <CommandList className="max-h-[400px] scrollbar-none pb-4">
        <CommandEmpty className="py-12 text-center">
            <Search className="h-10 w-10 text-slate-100 mx-auto mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No results found in registry</p>
        </CommandEmpty>
        
        <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2 py-4 block">Institutional Navigation</span>}>
          {navigation.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => router.push(item.href))}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-blue-50 aria-selected:text-blue-600 rounded-xl mx-2 transition-all duration-200"
            >
              <item.icon className="h-4 w-4" />
              <span className="font-bold text-sm tracking-tight">{item.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="my-2 bg-slate-50" />

        <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2 py-4 block">Quick Actions</span>}>
          <CommandItem className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-emerald-50 aria-selected:text-emerald-600 rounded-xl mx-2 transition-all duration-200">
            <Plus className="h-4 w-4" />
            <span className="font-bold text-sm tracking-tight">New Student Enrollment</span>
          </CommandItem>
          <CommandItem className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-purple-50 aria-selected:text-purple-600 rounded-xl mx-2 transition-all duration-200">
            <Zap className="h-4 w-4" />
            <span className="font-bold text-sm tracking-tight">Dispatch SMS Broadcast</span>
          </CommandItem>
          <CommandItem className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-rose-50 aria-selected:text-rose-600 rounded-xl mx-2 transition-all duration-200">
            <Activity className="h-4 w-4" />
            <span className="font-bold text-sm tracking-tight">Record Health Encounter</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-2 bg-slate-50" />

        <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2 py-4 block">System Control</span>}>
          <CommandItem 
            onSelect={() => runCommand(() => router.push('/dashboard/settings/profile'))}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer aria-selected:bg-slate-100 aria-selected:text-slate-900 rounded-xl mx-2 transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
            <span className="font-bold text-sm tracking-tight">Personal Identity Configuration</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border shadow-sm">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Esc</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Close</span>
          </div>
          <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">SchoolOS Enterprise v1.4</span>
          </div>
      </div>
    </CommandDialog>
  );
}

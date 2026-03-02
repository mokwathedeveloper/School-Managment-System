'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  UserCog, 
  Mail, 
  Phone,
  ShieldCheck,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddStaffDialog } from '@/components/dashboard/add-staff-dialog';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { cn } from '@/lib/utils';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function StaffPage() {
  const [search, setSearch] = useState('');

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff', search],
    queryFn: async () => {
      const res = await api.get(`/hr/directory?search=${search}`);
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Syncing Staff Terminal" />;

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Staff Directory"
        text="Personnel Management & HR"
      >
        <AddStaffDialog />
      </DashboardHeader>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search staff by name or email..." 
              className="pl-12 h-12 rounded-2xl border-2 border-slate-100 bg-white focus:ring-blue-600/10 font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Personnel Identity</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Designation</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Contact</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Role</TableHead>
                <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                        <Users className="h-12 w-12 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs italic">No Personnel Records</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                staff?.map((member: any) => (
                  <TableRow key={member.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-premium group-hover:scale-110 group-hover:rotate-3">
                          <span className="font-black text-xs">{member.user.first_name[0]}{member.user.last_name[0]}</span>
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1">{member.user.first_name} {member.user.last_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{member.employee_id || 'Employee'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
                            <Briefcase className="h-3 w-3 text-blue-600" />
                            {member.designation}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{member.department || 'Academic Dept'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Mail className="h-3 w-3 text-slate-300" />
                          {member.user.email}
                        </div>
                        {member.user.phone && (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                            <Phone className="h-3 w-3 text-slate-300" />
                            {member.user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-black text-[9px] uppercase tracking-widest bg-blue-50 text-blue-600 border-none px-2.5 py-1 rounded-lg">
                        {member.user.role.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-premium">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

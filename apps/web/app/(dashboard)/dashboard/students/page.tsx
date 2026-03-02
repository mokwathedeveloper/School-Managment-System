'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  GraduationCap, 
  Mail, 
  Phone,
  ChevronRight,
  Download
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
import { AddStudentDialog } from '@/components/dashboard/add-student-dialog';
import { BulkImportDialog } from '@/components/dashboard/bulk-import-dialog';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { cn } from '@/lib/utils';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const take = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['students', search, skip],
    queryFn: async () => {
      const res = await apiClient.get(`/students?search=${search}&skip=${skip}&take=${take}`);
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Syncing Student Registry" />;

  const students = data?.items || [];
  const total = data?.total || 0;

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Student Directory"
        text="Registry Management & Enrollment"
      >
        <div className="flex items-center gap-3">
          <BulkImportDialog />
          <AddStudentDialog />
        </div>
      </DashboardHeader>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <Input 
                placeholder="Search by name or admission number..." 
                className="pl-12 h-12 rounded-2xl border-2 border-slate-100 bg-white focus:ring-blue-600/10 font-bold"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSkip(0);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-xl font-bold uppercase tracking-tighter text-[10px]">
                    <Filter className="h-3 w-3 mr-2" />
                    Filters
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl font-bold uppercase tracking-tighter text-[10px]">
                    <Download className="h-3 w-3 mr-2" />
                    Export
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Student Identity</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Class/Level</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Parental Context</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Status</TableHead>
                <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                        <Users className="h-12 w-12 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs italic">No Records Found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student: any) => (
                  <TableRow key={student.id} className="group hover:bg-slate-50/50 transition-colors border-b-slate-50">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-premium group-hover:scale-110 group-hover:rotate-3">
                          <span className="font-black text-xs">{student.user.first_name[0]}{student.user.last_name[0]}</span>
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1">{student.user.first_name} {student.user.last_name}</p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{student.admission_no}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">{student.class?.grade?.name} {student.class?.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Stream</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Mail className="h-3 w-3 text-slate-300" />
                          {student.user.email}
                        </div>
                        {student.user.phone && (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                            <Phone className="h-3 w-3 text-slate-300" />
                            {student.user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-black text-[9px] uppercase tracking-widest border-none px-2.5 py-1 rounded-lg shadow-sm",
                        student.user.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                      )}>
                        {student.user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Link href={`/dashboard/students/${student.id}`}>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-premium">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing <span className="text-slate-900">{students.length}</span> of <span className="text-slate-900">{total}</span> Registry Entries
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl font-black uppercase tracking-widest text-[9px] px-4"
                disabled={skip === 0}
                onClick={() => setSkip(Math.max(0, skip - take))}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-xl font-black uppercase tracking-widest text-[9px] px-4"
                disabled={skip + take >= total}
                onClick={() => setSkip(skip + take)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

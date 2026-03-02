'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Plus, 
  Users, 
  Search, 
  Loader2, 
  ChevronRight,
  MoreHorizontal,
  GraduationCap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AddClassDialog } from '@/components/dashboard/add-class-dialog';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { cn } from '@/lib/utils';

export default function ClassesListPage() {
  const [search, setSearch] = useState('');

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Fetching Academic Hierarchy" />;

  const filteredClasses = classes?.filter((cls: any) => 
    cls.name.toLowerCase().includes(search.toLowerCase()) || 
    cls.grade?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Class Management
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Browse & Organize Institutional Streams</p>
        </div>
        <AddClassDialog />
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-none">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <Input 
            placeholder="Search streams (e.g. Grade 1 West)..." 
            className="pl-12 h-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-blue-600/10 font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Class Identifier</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Form Teacher</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Enrollment</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Status</TableHead>
                <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                        <GraduationCap className="h-12 w-12 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs">No Classes Defined</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses?.map((cls: any) => (
                  <TableRow key={cls.id} className="group hover:bg-slate-50/50 transition-colors border-b-slate-50">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-premium group-hover:scale-110 group-hover:rotate-3">
                          <span className="font-black text-xs">{cls.grade?.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1">{cls.grade?.name} {cls.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{cls.room?.name || 'Mobile Station'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {cls.form_teacher ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">{cls.form_teacher.user.first_name} {cls.form_teacher.user.last_name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Head of Stream</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-[9px] uppercase font-bold text-slate-300 border-dashed">Unassigned</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                        <span className="font-black text-slate-900">{cls._count?.students || 0}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Scholars</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-premium">
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
    </div>
  );
}

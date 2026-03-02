'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  Search, 
  Plus, 
  GraduationCap, 
  Briefcase, 
  Building, 
  Loader2,
  Phone,
  Mail,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { RegisterAlumnusDialog } from '@/components/dashboard/register-alumnus-dialog';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function AlumniPage() {
  const [search, setSearch] = useState('');

  const { data: alumni, isLoading } = useQuery({
    queryKey: ['alumni'],
    queryFn: async () => {
      const res = await api.get('/alumni');
      return res.data;
    },
  });

  if (isLoading) return <PremiumLoader message="Syncing Alumni Network" />;

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Alumni Network"
        text="Institutional Legacy & Community"
      >
        <RegisterAlumnusDialog />
      </DashboardHeader>

      <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-none">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <Input 
            placeholder="Search by name, year, or employer..." 
            className="pl-12 h-12 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-blue-600/10 font-bold"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-slate-100">
            <Filter className="h-4 w-4 text-slate-400" />
        </Button>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Alumnus Identity</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Class Of</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Career Profile</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Contact</TableHead>
                <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alumni?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                        <GraduationCap className="h-12 w-12 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs">Registry Empty</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                alumni?.map((grad: any) => (
                  <TableRow key={grad.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-premium group-hover:scale-110 group-hover:rotate-3">
                          <span className="font-black text-xs">{grad.first_name[0]}{grad.last_name[0]}</span>
                        </div>
                        <div className="font-black text-slate-900 text-sm">{grad.first_name} {grad.last_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-black text-[10px] px-3 py-1 bg-slate-50 border-none rounded-lg">{grad.graduation_year}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {grad.current_occupation ? (
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Briefcase className="h-3 w-3 text-blue-600" /> {grad.current_occupation}
                          </div>
                        ) : (
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Profile Pending</span>
                        )}
                        {grad.employer && (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            <Building className="h-3 w-3" /> {grad.employer}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {grad.email && (
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                <Mail className="h-3 w-3 text-slate-300" /> {grad.email}
                            </div>
                        )}
                        {grad.phone && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                <Phone className="h-3 w-3 text-slate-300" /> {grad.phone}
                            </div>
                        )}
                      </div>
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

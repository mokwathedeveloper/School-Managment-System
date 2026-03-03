'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone, Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AddParentDialog } from '@/components/dashboard/add-parent-dialog';

export default function ParentsPage() {
  const [search, setSearch] = React.useState('');

  const { data: parents, isLoading } = useQuery({
    queryKey: ['parents', search],
    queryFn: async () => {
      const res = await apiClient.get(`/parents?search=${search}`);
      return res.data;
    }
  });

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Guardian Registry" 
        text="Manage institutional parent and guardian records"
      >
        <div className="flex items-center gap-4">
            <div className="relative group w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    placeholder="Search guardians..." 
                    className="h-11 pl-12 rounded-xl border-slate-200 bg-white shadow-sm focus:ring-blue-600/10 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <AddParentDialog />
        </div>
      </DashboardHeader>

      {isLoading ? (
        <PremiumLoader message="Synchronizing Guardian Records" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parents?.map((parent: any) => (
            <Card key={parent.id} className="group hover:shadow-xl transition-premium border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7" />
                  </div>
                  <Badge variant="outline" className="rounded-xl border-slate-100 font-bold px-3 py-1 bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-widest">
                    {parent.students?.length || 0} Scholars
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
                    {parent.user.first_name} {parent.user.last_name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{parent.user.email}</span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50 space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-tighter">Phone Contact</span>
                    <span className="text-slate-900">{parent.user.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-tighter">Registration Date</span>
                    <span className="text-slate-900">{new Date(parent.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {parent.students?.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Linked Scholars</p>
                    <div className="flex flex-wrap gap-2">
                        {parent.students.map((student: any) => (
                            <Badge key={student.id} variant="secondary" className="bg-slate-50 text-slate-900 rounded-lg font-bold px-3 py-1 text-[10px]">
                                {student.user.first_name} {student.user.last_name}
                            </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

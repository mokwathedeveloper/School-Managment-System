'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  HeartPulse, 
  Search, 
  Plus, 
  Stethoscope, 
  User, 
  Loader2,
  Calendar,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function HealthPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: visits, isLoading } = useQuery({
    queryKey: ['clinic-visits'],
    queryFn: async () => {
      const res = await api.get('/health/visits');
      return res.data;
    },
  });

  const logVisitMutation = useMutation({
    mutationFn: async (data: any) => api.post('/health/visits', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-visits'] });
      toast.success('Clinic visit has been successfully logged and student records updated.');
    }
  });

  const handleLogVisit = () => {
    const student_id = window.prompt('Enter student UUID:');
    if (!student_id) return;
    const symptoms = window.prompt('Enter symptoms:');
    if (!symptoms) return;
    const diagnosis = window.prompt('Enter diagnosis:');
    if (!diagnosis) return;

    logVisitMutation.mutate({
      student_id,
      symptoms,
      diagnosis,
      visit_date: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <HeartPulse className="h-8 w-8 text-primary" />
            School Clinic
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage student health records and daily clinic visits.</p>
        </div>
        <Button onClick={handleLogVisit} disabled={logVisitMutation.isPending} className="shadow-md bg-rose-600 hover:bg-rose-700 text-white">
          {logVisitMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Stethoscope className="mr-2 h-4 w-4" />}
          Log New Visit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Quick Stats */}
        <Card className="shadow-sm border-muted/50 bg-rose-50/30 border-rose-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-rose-900 uppercase tracking-wide">Visits Today</p>
                <p className="text-3xl font-black text-rose-700">
                  {visits?.filter((v: any) => new Date(v.visit_date).toDateString() === new Date().toDateString()).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visit Log */}
        <div className="md:col-span-3">
          <Card className="shadow-sm border-muted/50 overflow-hidden">
            <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle>Clinic Logbook</CardTitle>
                <CardDescription>Recent medical attention and treatments.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search student or diagnosis..." 
                  className="pl-10 h-9" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Symptoms & Diagnosis</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Attended By</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
                  ) : visits?.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-32 text-muted-foreground italic">No clinic visits recorded.</TableCell></TableRow>
                  ) : (
                    visits?.filter((v: any) => 
                      v.medical_record.student.user.first_name.toLowerCase().includes(search.toLowerCase()) || 
                      v.symptoms.toLowerCase().includes(search.toLowerCase())
                    ).map((visit: any) => (
                      <TableRow key={visit.id} className="hover:bg-muted/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                              {visit.medical_record.student.user.first_name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{visit.medical_record.student.user.first_name} {visit.medical_record.student.user.last_name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{visit.diagnosis || 'Pending Diagnosis'}</span>
                            <span className="text-xs text-muted-foreground italic">{visit.symptoms}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{visit.treatment || '—'}</TableCell>
                        <TableCell className="text-xs font-medium">
                          {visit.attended_by ? `Nurse ${visit.attended_by.user.last_name}` : 'External'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-slate-700">{new Date(visit.visit_date).toLocaleDateString()}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(visit.visit_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

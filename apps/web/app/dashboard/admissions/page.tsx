'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  Search, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2,
  Mail,
  Smartphone,
  ClipboardList,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AdmissionsDashboard() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState('');

  const { data: applications, isLoading } = useQuery({
    queryKey: ['admissions', selectedStatus],
    queryFn: async () => {
      const res = await api.get('/admissions/applications', { params: { status: selectedStatus || undefined } });
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.patch(`/admissions/applications/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    }
  });

  const statusColors: any = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    REVIEWING: "bg-blue-100 text-blue-700 border-blue-200",
    INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-700 border-purple-200",
    ACCEPTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
    ENROLLED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-primary" />
            Admissions Pipeline
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Track and manage prospective student applications.</p>
        </div>
        <Button className="shadow-md">
          <Mail className="mr-2 h-4 w-4" />
          Broadcast to Applicants
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatusSummaryCard title="Total Applied" value={applications?.length || 0} icon={<Users className="h-4 w-4" />} />
        <StatusSummaryCard title="In Review" value={applications?.filter((a: any) => a.status === 'REVIEWING').length || 0} icon={<Clock className="h-4 w-4" />} />
        <StatusSummaryCard title="Accepted" value={applications?.filter((a: any) => a.status === 'ACCEPTED').length || 0} icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} />
        <StatusSummaryCard title="Enrolled" value={applications?.filter((a: any) => a.status === 'ENROLLED').length || 0} icon={<GraduationCap className="h-4 w-4 text-primary" />} />
      </div>

      <Card className="shadow-sm border-muted/50 overflow-hidden">
        <CardHeader className="bg-muted/10 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Applicant Directory</CardTitle>
              <CardDescription>Review credentials and manage enrollment stages.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
               <select 
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
               >
                 <option value="">All Statuses</option>
                 <option value="PENDING">Pending</option>
                 <option value="REVIEWING">In Review</option>
                 <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                 <option value="ACCEPTED">Accepted</option>
                 <option value="ENROLLED">Enrolled</option>
               </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Applied For</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : applications?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No applications found matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                applications?.map((app: any) => (
                  <TableRow key={app.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="font-bold">{app.first_name} {app.last_name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Applied {new Date(app.created_at).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{app.applied_grade.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="h-3 w-3 opacity-50" /> {app.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Smartphone className="h-3 w-3 opacity-50" /> {app.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("font-bold shadow-sm border-none", statusColors[app.status])}>
                        {app.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {app.status === 'PENDING' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'REVIEWING' })}
                          >
                            Mark Review
                          </Button>
                        )}
                        {app.status === 'REVIEWING' && (
                          <Button 
                            size="sm" 
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'INTERVIEW_SCHEDULED' })}
                          >
                            Schedule Interview
                          </Button>
                        )}
                        {app.status === 'INTERVIEW_SCHEDULED' && (
                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'ACCEPTED' })}
                          >
                            Accept Student
                          </Button>
                        )}
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
  );
}

function StatusSummaryCard({ title, value, icon }: any) {
  return (
    <Card className="shadow-sm border-muted/50">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{title}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

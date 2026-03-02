'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Gavel, 
  AlertTriangle, 
  Search, 
  Plus, 
  User, 
  Loader2,
  FileWarning
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function ConductPage() {
  const queryClient = useQueryClient();
  const { data: records, isLoading } = useQuery({
    queryKey: ['discipline-records'],
    queryFn: async () => {
      const res = await api.get('/discipline');
      return res.data;
    },
  });

  const reportMutation = useMutation({
    mutationFn: async (data: any) => api.post('/discipline', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discipline-records'] });
      toast.success('Incident has been officially recorded and logged for administrative review.');
    }
  });

  const handleReport = () => {
    const student_id = window.prompt('Enter student UUID:');
    if (!student_id) return;
    const title = window.prompt('Enter incident title:');
    if (!title) return;
    const severity = window.prompt('Enter severity (LOW, MEDIUM, HIGH, CRITICAL):');
    if (!severity) return;

    reportMutation.mutate({
      student_id,
      title,
      severity: severity.toUpperCase(),
      incident_date: new Date().toISOString(),
    });
  };

  const severityColors: any = {
    LOW: "bg-blue-100 text-blue-700 border-blue-200",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
    HIGH: "bg-orange-100 text-orange-700 border-orange-200",
    CRITICAL: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Gavel className="h-8 w-8 text-primary" />
            Student Conduct
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Track behavioral incidents and disciplinary actions.</p>
        </div>
        <Button onClick={handleReport} disabled={reportMutation.isPending} className="shadow-md bg-rose-600 hover:bg-rose-700 text-white">
          {reportMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
          Report Incident
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-4">
          <Card className="shadow-sm border-muted/50 overflow-hidden">
            <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle>Incident Log</CardTitle>
                <CardDescription>Recent disciplinary records across the institution.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search records..." className="pl-10 h-9" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Incident</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Action Taken</TableHead>
                    <TableHead className="text-right">Reported By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
                  ) : records?.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center h-32 text-muted-foreground italic">No incidents recorded.</TableCell></TableRow>
                  ) : (
                    records?.map((record: any) => (
                      <TableRow key={record.id} className="hover:bg-muted/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
                              {record.student.user.first_name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{record.student.user.first_name} {record.student.user.last_name}</p>
                              <p className="text-[10px] text-muted-foreground">{record.student.class?.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">{record.title}</div>
                          <div className="text-xs text-muted-foreground">{new Date(record.incident_date).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("font-bold text-[10px]", severityColors[record.severity])}>
                            {record.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm italic text-slate-600">{record.action_taken || 'Pending Action'}</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {record.reported_by ? `${record.reported_by.user.first_name} ${record.reported_by.user.last_name}` : 'System'}
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

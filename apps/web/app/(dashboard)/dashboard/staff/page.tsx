'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  Search, 
  Plus, 
  UserCircle, 
  Briefcase, 
  Mail, 
  Phone,
  Banknote,
  Loader2,
  CalendarCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { AddStaffDialog } from '@/components/dashboard/add-staff-dialog';

export default function StaffDirectoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff-directory'],
    queryFn: async () => {
      const res = await api.get('/hr/directory');
      return res.data;
    },
  });

  const payrollMutation = useMutation({
    mutationFn: async () => {
      const now = new Date();
      return api.post('/hr/payroll/process', { 
        month: now.getMonth() + 1, 
        year: now.getFullYear() 
      });
    },
    onSuccess: (res) => {
      toast.success(`Payroll disbursement completed successfully. ${res.data.processed} staff records were processed for this period.`);
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Institutional Staff
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage employee records, contracts, and monthly payroll.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => payrollMutation.mutate()}
            disabled={payrollMutation.isPending}
          >
            {payrollMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Banknote className="mr-2 h-4 w-4" />}
            Process Payroll
          </Button>
          <AddStaffDialog />
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, ID or department..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="shadow-sm border-muted/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Salary</TableHead>
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
            ) : (
              staff?.map((member: any) => (
                <TableRow key={member.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {member.user.first_name[0]}{member.user.last_name[0]}
                      </div>
                      <div>
                        <p className="font-bold">{member.user.first_name} {member.user.last_name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">{member.id_number || 'No ID'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-3 w-3 opacity-50" />
                      {member.designation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      {member.department}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-emerald-600">
                      KES {parseFloat(member.base_salary).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="font-bold">View Profile</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

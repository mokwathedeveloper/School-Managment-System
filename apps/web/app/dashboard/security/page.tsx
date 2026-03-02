'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Shield, 
  Search, 
  Plus, 
  UserPlus, 
  LogOut, 
  Loader2,
  Clock,
  CheckCircle2,
  User,
  Phone,
  DoorOpen,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function SecurityGatePage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'active' | 'registry'>('active');

  const { data: activeVisits, isLoading: loadingActive } = useQuery({
    queryKey: ['active-visitors'],
    queryFn: async () => {
      const res = await api.get('/gate/active');
      return res.data;
    },
  });

  const { data: visitors, isLoading: loadingRegistry } = useQuery({
    queryKey: ['visitor-registry'],
    queryFn: async () => {
      const res = await api.get('/gate/visitors');
      return res.data;
    },
  });

  const registerVisitorMutation = useMutation({
    mutationFn: async (data: any) => api.post('/gate/visitors', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-visitors'] });
      queryClient.invalidateQueries({ queryKey: ['visitor-registry'] });
      alert('Visitor has been successfully registered and checked into the campus.');
    }
  });

  const handleNewVisitor = () => {
    const full_name = window.prompt('Enter visitor full name:');
    if (!full_name) return;
    const id_number = window.prompt('Enter ID number:');
    if (!id_number) return;
    const purpose = window.prompt('Enter purpose of visit:');
    if (!purpose) return;
    const whom_to_see = window.prompt('Enter whom to see:');
    if (!whom_to_see) return;

    registerVisitorMutation.mutate({
      full_name,
      id_number,
      purpose,
      whom_to_see,
    });
  };

  const checkOutMutation = useMutation({
    mutationFn: async (visitId: string) => {
      return api.patch(`/gate/check-out/${visitId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-visitors'] });
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/gate/verify?id=${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.verified) {
        alert(`VERIFIED: ${data.student.name}\nClass: ${data.student.class}\nAdmission: ${data.student.admissionNo}`);
      } else {
        alert(`ACCESS DENIED: ${data.message}`);
      }
    }
  });

  const handleVerify = () => {
    const id = window.prompt('Enter student admission number to verify:');
    if (id) verifyMutation.mutate(id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Security Gate Console
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Real-time visitor logs and campus access management.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="shadow-sm" onClick={handleVerify} disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Verify ID
          </Button>
          <Button onClick={handleNewVisitor} disabled={registerVisitorMutation.isPending} className="shadow-md">
            {registerVisitorMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            New Visitor
          </Button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex p-1 bg-muted/50 rounded-xl w-fit border shadow-inner">
        <button 
          onClick={() => setView('active')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
            view === 'active' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <DoorOpen className="h-4 w-4" />
          Currently In Campus
          <Badge variant="secondary" className="ml-2 bg-slate-100">{activeVisits?.length || 0}</Badge>
        </button>
        <button 
          onClick={() => setView('registry')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
            view === 'registry' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="h-4 w-4" />
          Visitor Registry
        </button>
      </div>

      {view === 'active' ? (
        <Card className="shadow-sm border-muted/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Visitor Details</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Check-In Time</TableHead>
                <TableHead>Whom to See</TableHead>
                <TableHead className="text-right">Check Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingActive ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
              ) : activeVisits?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32 text-muted-foreground italic">No visitors currently in campus.</TableCell></TableRow>
              ) : (
                activeVisits?.map((visit: any) => (
                  <TableRow key={visit.id} className="hover:bg-muted/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                          {visit.visitor.full_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{visit.visitor.full_name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">{visit.visitor.id_number || 'No ID'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="bg-white">{visit.purpose}</Badge></TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{new Date(visit.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-[10px] text-muted-foreground">Today</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{visit.whom_to_see || 'General'}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-rose-600 hover:bg-rose-50 border-rose-100 font-bold"
                        onClick={() => checkOutMutation.mutate(visit.id)}
                        disabled={checkOutMutation.isPending}
                      >
                        <LogOut className="h-3 w-3 mr-1" /> Check Out
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="shadow-sm border-muted/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingRegistry ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
              ) : (
                visitors?.map((visitor: any) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-bold text-sm">{visitor.full_name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{visitor.id_number || '—'}</TableCell>
                    <TableCell className="text-sm">{visitor.phone || '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(visitor.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="font-bold text-primary">Quick Check-In</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

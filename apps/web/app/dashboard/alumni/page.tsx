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
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AlumniPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: alumni, isLoading } = useQuery({
    queryKey: ['alumni'],
    queryFn: async () => {
      const res = await api.get('/alumni');
      return res.data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => api.post('/alumni', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumni'] });
      alert('Alumnus has been successfully registered in the network.');
    }
  });

  const handleRegister = () => {
    const first_name = window.prompt('Enter first name:');
    if (!first_name) return;
    const last_name = window.prompt('Enter last name:');
    if (!last_name) return;
    const graduation_year = window.prompt('Enter graduation year (e.g. 2023):');
    if (!graduation_year) return;
    const email = window.prompt('Enter email:');
    if (!email) return;

    registerMutation.mutate({ 
      first_name, 
      last_name, 
      graduation_year: parseInt(graduation_year), 
      email 
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            Alumni Network
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Track graduate careers and foster institutional community.</p>
        </div>
        <Button onClick={handleRegister} disabled={registerMutation.isPending} className="shadow-md">
          {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Register Alumnus
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, year, or employer..." 
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
              <TableHead>Alumnus Name</TableHead>
              <TableHead>Class Of</TableHead>
              <TableHead>Career Profile</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
            ) : alumni?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center h-32 text-muted-foreground italic">No alumni records found.</TableCell></TableRow>
            ) : (
              alumni?.map((grad: any) => (
                <TableRow key={grad.id} className="hover:bg-muted/5">
                  <TableCell>
                    <div className="font-bold">{grad.first_name} {grad.last_name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">{grad.graduation_year}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {grad.current_occupation && (
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Briefcase className="h-3 w-3 text-muted-foreground" /> {grad.current_occupation}
                        </div>
                      )}
                      {grad.employer && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Building className="h-3 w-3" /> {grad.employer}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      {grad.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3 opacity-50"/> {grad.email}</div>}
                      {grad.phone && <div className="flex items-center gap-2"><Phone className="h-3 w-3 opacity-50"/> {grad.phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="font-bold text-primary">View Profile</Button>
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

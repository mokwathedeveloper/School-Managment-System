
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
  Users, 
  GraduationCap, 
  Search, 
  Plus,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AddClassDialog } from '@/components/dashboard/add-class-dialog';

export default function ClassesListPage() {
  const [search, setSearch] = useState('');

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const res = await api.get('/classes');
      return res.data;
    },
  });

  const filteredClasses = classes?.filter((cls: any) => 
    cls.name.toLowerCase().includes(search.toLowerCase()) ||
    cls.grade.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Class Management
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Browse and manage all institutional streams and student groups.</p>
        </div>
        <AddClassDialog />
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search classes or grades..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm border-muted/50 overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Active Institutional Streams
            </CardTitle>
            <CardDescription>Consolidated list of all registered student groups.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Class Name</TableHead>
                  <TableHead>Grade Level</TableHead>
                  <TableHead>Form Teacher</TableHead>
                  <TableHead className="text-center">Students</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : filteredClasses?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                      No classes found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses?.map((cls: any) => (
                    <TableRow key={cls.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {cls.name[0]}
                          </div>
                          <span className="font-bold text-slate-900">{cls.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 px-3">
                          {cls.grade.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {cls.form_teacher ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                              {cls.form_teacher.user.first_name[0]}
                            </div>
                            <span className="text-sm font-medium">{cls.form_teacher.user.first_name} {cls.form_teacher.user.last_name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Not Assigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-1.5 font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                          {cls._count?.students || 0}
                          <GraduationCap className="h-3 w-3 opacity-50" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm" className="font-bold group">
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
    </div>
  );
}

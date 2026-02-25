'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BulkImportDialog } from '@/components/dashboard/bulk-import-dialog';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Filter, 
  Download,
  GraduationCap
} from 'lucide-react';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const take = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['students', search, skip],
    queryFn: async () => {
      const response = await apiClient.get('/students', {
        params: { search, skip, take }
      });
      return response.data;
    },
  });

  const students = data?.items || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Enrollment</h1>
          <p className="text-muted-foreground mt-1">Manage and track all students in your institution.</p>
        </div>
        <div className="flex items-center gap-3">
          <BulkImportDialog />
          <Button size="sm" className="shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Add New Student
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or admission number..." 
            className="pl-10"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="w-full md:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[100px]">Adm No</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    Loading students...
                  </div>
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student: any) => (
                <TableRow key={student.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-bold text-primary">{student.admission_no}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/students/${student.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {student.user.first_name[0]}{student.user.last_name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{student.user.first_name} {student.user.last_name}</p>
                        <p className="text-xs text-muted-foreground">{student.user.email}</p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{student.class?.name || 'Unassigned'}</TableCell>
                  <TableCell className="capitalize">{student.gender || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between p-4 border-t bg-muted/10">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{students.length}</span> of <span className="font-medium">{total}</span> students
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={skip === 0}
              onClick={() => setSkip(Math.max(0, skip - take))}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={skip + take >= total}
              onClick={() => setSkip(skip + take)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

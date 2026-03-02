'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, GraduationCap, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function GradeLevelsPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newGrade, setNewGrade] = useState({ name: '', level: '' });

  const { data: grades, isLoading } = useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      const res = await api.get('/grade-levels');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/grade-levels', {
        ...data,
        level: parseInt(data.level),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
      setIsAdding(false);
      setNewGrade({ name: '', level: '' });
      alert('Academic grade level has been successfully established.');
    },
  });

  const addStreamMutation = useMutation({
    mutationFn: async ({ gradeId, name }: { gradeId: string, name: string }) => {
      return api.post('/classes', { grade_id: gradeId, name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
      alert('New academic stream has been successfully initialized.');
    }
  });

  const handleAddStream = (gradeId: string) => {
    const name = window.prompt('Enter stream name (e.g. North, East, Blue):');
    if (!name) return;
    addStreamMutation.mutate({ gradeId, name });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Hierarchy</h1>
          <p className="text-muted-foreground mt-1">Manage grade levels and streams for your school.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Add Grade Level
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">New Grade Level</CardTitle>
            <CardDescription>Define a new academic level (e.g. Grade 1, Year 7).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="name">Grade Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Grade 1" 
                  value={newGrade.name}
                  onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
                />
              </div>
              <div className="grid w-full max-w-[150px] items-center gap-1.5">
                <Label htmlFor="level">Order/Level</Label>
                <Input 
                  id="level" 
                  type="number" 
                  placeholder="1" 
                  value={newGrade.level}
                  onChange={(e) => setNewGrade({ ...newGrade, level: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => createMutation.mutate(newGrade)}
                  disabled={createMutation.isPending || !newGrade.name || !newGrade.level}
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Grade
                </Button>
                <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Active Grade Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">Level</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Streams</TableHead>
                  <TableHead className="text-right">Total Students</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No grade levels defined yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  grades?.map((grade: any) => (
                    <TableRow key={grade.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                          {grade.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{grade.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {grade.classes?.length > 0 ? (
                            grade.classes.map((cls: any) => (
                              <Badge key={cls.id} variant="outline" className="bg-white">
                                {cls.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No streams yet</span>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleAddStream(grade.id)}
                            disabled={addStreamMutation.isPending}
                          >
                            {addStreamMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 font-medium">
                          {grade.classes?.reduce((acc: number, cls: any) => acc + (cls._count?.students || 0), 0)}
                          <Layers className="h-4 w-4 text-muted-foreground opacity-50" />
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
  );
}

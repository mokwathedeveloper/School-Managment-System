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
import { Plus, Loader2, GraduationCap, Layers, ChevronRight, Hash, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { DialogShell } from '@/components/ui/dialog-shell';
import { cn } from '@/lib/utils';

export default function GradeLevelsPage() {
  const queryClient = useQueryClient();
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [isAddingStream, setIsAddingStream] = useState(false);
  const [selectedGradeId, setSelectedClassGradeId] = useState('');
  
  const [newGrade, setNewGrade] = useState({ name: '', level: '' });
  const [newStream, setNewStream] = useState({ name: '' });

  const { data: grades, isLoading } = useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      const res = await api.get('/grade-levels');
      return res.data;
    },
  });

  const createGradeMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/grade-levels', {
        ...data,
        level: parseInt(data.level),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
      setIsAddingGrade(false);
      setNewGrade({ name: '', level: '' });
      toast.success('Academic grade level has been successfully established.');
    },
  });

  const createStreamMutation = useMutation({
    mutationFn: async ({ gradeId, name }: { gradeId: string, name: string }) => {
      return api.post('/classes', { grade_id: gradeId, name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grade-levels'] });
      setIsAddingStream(false);
      setNewStream({ name: '' });
      toast.success('New academic stream has been successfully initialized.');
    }
  });

  const handleAddStream = (gradeId: string) => {
    setSelectedClassGradeId(gradeId);
    setIsAddingStream(true);
  };

  if (isLoading) return <PremiumLoader message="Syncing Academic Hierarchy" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <Layers className="h-8 w-8 text-blue-600" />
            Academic Hierarchy
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Grade Levels & Class Structural Organization</p>
        </div>
        <Button variant="premium" onClick={() => setIsAddingGrade(true)} className="h-12 px-8 shadow-xl">
          <Plus className="mr-2 h-4 w-4" />
          Add Grade Level
        </Button>
      </div>

      <div className="grid gap-8">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400 w-[120px]">Index/Level</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Level Descriptor</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Institutional Streams</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Enrollment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                            <Layers className="h-12 w-12 opacity-20" />
                            <p className="font-black uppercase tracking-widest text-xs">Hierarchy Empty</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  grades?.map((grade: any) => (
                    <TableRow key={grade.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                      <TableCell className="pl-8 py-5">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs shadow-sm">
                          {grade.level}
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-slate-900 text-sm tracking-tight">{grade.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2 items-center">
                          {grade.classes?.length > 0 ? (
                            grade.classes.map((cls: any) => (
                              <Badge key={cls.id} variant="secondary" className="bg-white border-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-lg shadow-sm group-hover:border-blue-100 transition-all">
                                {cls.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No streams defined</span>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-full hover:bg-blue-50 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                            onClick={() => handleAddStream(grade.id)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-3">
                            <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900">{grade.classes?.reduce((acc: number, cls: any) => acc + (cls._count?.students || 0), 0)}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Scholars</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-blue-600 transition-premium">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
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

      {/* Add Grade Dialog */}
      <DialogShell
        open={isAddingGrade}
        onOpenChange={setIsAddingGrade}
        title="Establish Grade Level"
        description="Define a new academic tier in the institution"
        icon={Layers}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Grade Name</Label>
            <div className="relative group">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    placeholder="e.g. Grade 1 or Year 7"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                    value={newGrade.name}
                    onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
                />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sequence Level (Index)</Label>
            <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    type="number"
                    placeholder="e.g. 1"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-black"
                    value={newGrade.level}
                    onChange={(e) => setNewGrade({ ...newGrade, level: e.target.value })}
                />
            </div>
          </div>
          <Button 
            variant="premium" 
            className="w-full h-14 rounded-2xl shadow-xl shadow-blue-600/20"
            onClick={() => createGradeMutation.mutate(newGrade)}
            disabled={createGradeMutation.isPending || !newGrade.name || !newGrade.level}
          >
            {createGradeMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Establish Level
          </Button>
        </div>
      </DialogShell>

      {/* Add Stream Dialog */}
      <DialogShell
        open={isAddingStream}
        onOpenChange={setIsAddingStream}
        title="Initialize Stream"
        description="Create a new academic group within this grade"
        icon={Plus}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stream Name</Label>
            <Input 
                placeholder="e.g. North, Blue, or Alpha"
                className="h-12 rounded-xl border-2 border-slate-100 font-bold"
                value={newStream.name}
                onChange={(e) => setNewStream({ name: e.target.value })}
            />
          </div>
          <Button 
            variant="premium" 
            className="w-full h-14 rounded-2xl shadow-xl shadow-blue-600/20"
            onClick={() => createStreamMutation.mutate({ gradeId: selectedGradeId, name: newStream.name })}
            disabled={createStreamMutation.isPending || !newStream.name}
          >
            {createStreamMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Initialize Stream
          </Button>
        </div>
      </DialogShell>
    </div>
  );
}

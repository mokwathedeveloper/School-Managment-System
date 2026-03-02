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
import { toast } from 'react-hot-toast';
import { 
  FileText, 
  Plus, 
  Loader2, 
  Search, 
  Trophy, 
  TrendingUp,
  Save
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AddExamDialog } from '@/components/dashboard/add-exam-dialog';

export default function ExamsPage() {
  const queryClient = useQueryClient();
  const [selectedExamId, setSelectedExamId] = useState('');
  const [marks, setMarks] = useState<Record<string, number>>({});

  const { data: exams, isLoading: loadingExams } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const res = await api.get('/exams');
      return res.data;
    },
  });

  const { data: results, isLoading: loadingResults } = useQuery({
    queryKey: ['results', selectedExamId],
    queryFn: async () => {
      if (!selectedExamId) return null;
      const res = await api.get(`/exams/${selectedExamId}/results`);
      return res.data;
    },
    enabled: !!selectedExamId,
  });

  const { data: students } = useQuery({
    queryKey: ['students-for-exam', selectedExamId],
    queryFn: async () => {
      const res = await api.get('/students'); 
      return res.data;
    },
    enabled: !!selectedExamId,
  });

  const saveResultsMutation = useMutation({
    mutationFn: async (records: any[]) => {
      return api.post(`/exams/${selectedExamId}/results`, { records });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results', selectedExamId] });
      toast.success('Academic results have been processed and grades generated successfully.');
    }
  });

  const handleSave = () => {
    const records = Object.entries(marks).map(([student_id, mark]) => ({
      student_id,
      marks: mark,
    }));
    saveResultsMutation.mutate(records);
  };

  if (loadingExams) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Syncing Assessment Terminal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examinations & Grading</h1>
          <p className="text-muted-foreground mt-1">Manage assessments, rubrics, and track student performance.</p>
        </div>
        <AddExamDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Exam List Sidebar */}
        <Card className="md:col-span-1 shadow-sm h-fit overflow-hidden border-none bg-white">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Recent Exams
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {exams?.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground italic">No exams scheduled.</div>
              ) : exams?.map((exam: any) => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExamId(exam.id);
                    setMarks({});
                  }}
                  className={cn(
                    "w-full text-left p-4 hover:bg-slate-50 transition-all duration-300 flex flex-col gap-1.5 group",
                    selectedExamId === exam.id && "bg-primary/5 border-l-4 border-primary shadow-inner"
                  )}
                >
                  <div className="font-black text-sm text-slate-900 group-hover:text-primary transition-colors truncate">{exam.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exam.subject.name}</span>
                    <Badge variant="secondary" className="text-[9px] font-black px-2 h-4 bg-white border border-slate-100">
                      {new Date(exam.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mark Entry / Results Area */}
        <Card className="md:col-span-3 shadow-xl border-none bg-white overflow-hidden">
          {selectedExamId ? (
            <>
              <CardHeader className="border-b bg-slate-50/50 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black text-slate-900">{exams?.find((e: any) => e.id === selectedExamId)?.name}</CardTitle>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Search className="h-3 w-3" /> {exams?.find((e: any) => e.id === selectedExamId)?.subject.name}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Max: {exams?.find((e: any) => e.id === selectedExamId)?.max_marks}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSave} 
                    disabled={saveResultsMutation.isPending} 
                    className="shadow-2xl shadow-primary/30 h-12 px-8 rounded-xl font-black uppercase tracking-widest"
                  >
                    {saveResultsMutation.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    Publish Results
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80 border-b-slate-100">
                      <TableHead className="pl-6 font-black uppercase tracking-widest text-[10px]">Student Record</TableHead>
                      <TableHead className="w-[180px] font-black uppercase tracking-widest text-[10px]">Marks Obtained</TableHead>
                      <TableHead className="w-[100px] text-center font-black uppercase tracking-widest text-[10px]">Grade</TableHead>
                      <TableHead className="pr-6 font-black uppercase tracking-widest text-[10px]">Institutional Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students?.items.map((student: any) => {
                      const existingResult = results?.find((r: any) => r.student_id === student.id);
                      return (
                        <TableRow key={student.id} className="hover:bg-slate-50/50 border-b-slate-50 transition-colors">
                          <TableCell className="pl-6 py-4">
                            <div className="font-bold text-slate-900">{student.user.first_name} {student.user.last_name}</div>
                            <div className="text-[10px] font-black text-primary uppercase tracking-widest">{student.admission_no}</div>
                          </TableCell>
                          <TableCell>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    className="h-10 text-sm font-black rounded-xl border-2 focus:ring-primary/20 bg-slate-50/50"
                                    placeholder={existingResult?.marks_obtained?.toString() || "0"} 
                                    onChange={(e) => setMarks(prev => ({ ...prev, [student.id]: parseFloat(e.target.value) }))}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">/ {exams?.find((e: any) => e.id === selectedExamId)?.max_marks}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {existingResult?.grade ? (
                              <Badge 
                                className={cn(
                                  "font-black px-3 py-1 rounded-lg text-xs shadow-sm",
                                  existingResult.grade === 'A' && "bg-emerald-50 text-emerald-600 border-emerald-100",
                                  existingResult.grade === 'E' && "bg-rose-50 text-rose-600 border-rose-100",
                                  !['A','E'].includes(existingResult.grade) && "bg-blue-50 text-blue-600 border-blue-100"
                                )}
                                variant="secondary"
                              >
                                {existingResult.grade}
                              </Badge>
                            ) : (
                              <div className="h-8 w-8 rounded-lg bg-slate-50 border border-dashed border-slate-200 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="pr-6">
                            <Input 
                              placeholder="e.g. Exceptional Performance" 
                              className="h-10 text-xs font-medium rounded-xl border-slate-100 bg-slate-50/30 italic" 
                              defaultValue={existingResult?.remarks || ""}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12">
              <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                <Trophy className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Academic Result Terminal</h3>
              <p className="text-sm font-bold text-slate-400 max-w-xs uppercase tracking-widest leading-relaxed">
                Select an assessment from the left sidebar to begin result processing and automated grading.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

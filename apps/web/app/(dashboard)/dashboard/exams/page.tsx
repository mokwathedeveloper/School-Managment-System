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
  Save,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AddExamDialog } from '@/components/dashboard/add-exam-dialog';
import { PremiumLoader } from '@/components/ui/premium-loader';

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
      toast.success('Academic results have been processed and grades generated.');
    }
  });

  const handleSave = () => {
    const records = Object.entries(marks).map(([student_id, mark]) => ({
      student_id,
      marks: mark,
    }));
    saveResultsMutation.mutate(records);
  };

  if (loadingExams) return <PremiumLoader message="Syncing Assessment Terminal" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-blue-600" />
            Examinations & Grading
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Institutional Assessment & Performance Metrics</p>
        </div>
        <AddExamDialog />
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Exam List Sidebar */}
        <Card className="md:col-span-1 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden h-fit">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Registry</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {exams?.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-300 font-black uppercase tracking-widest italic">Registry Empty</div>
              ) : exams?.map((exam: any) => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExamId(exam.id);
                    setMarks({});
                  }}
                  className={cn(
                    "w-full text-left p-5 transition-all duration-300 group",
                    selectedExamId === exam.id ? "bg-blue-50 border-l-4 border-blue-600 shadow-inner" : "hover:bg-slate-50 border-l-4 border-transparent"
                  )}
                >
                  <div className={cn(
                    "font-black text-sm tracking-tight mb-1 transition-colors",
                    selectedExamId === exam.id ? "text-blue-600" : "text-slate-900 group-hover:text-blue-600"
                  )}>{exam.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{exam.subject.name}</span>
                    <Badge variant="secondary" className="text-[9px] font-black px-2 h-4 bg-white border border-slate-100 text-slate-400">
                      {new Date(exam.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mark Entry / Results Area */}
        <Card className="md:col-span-3 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          {selectedExamId ? (
            <>
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">{exams?.find((e: any) => e.id === selectedExamId)?.name}</CardTitle>
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">
                        <span className="flex items-center gap-1.5"><Search className="h-3 w-3 text-blue-600" /> {exams?.find((e: any) => e.id === selectedExamId)?.subject.name}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="flex items-center gap-1.5"><TrendingUp className="h-3 w-3 text-emerald-600" /> Max: {exams?.find((e: any) => e.id === selectedExamId)?.max_marks} pts</span>
                    </div>
                  </div>
                  <Button 
                    variant="premium"
                    onClick={handleSave} 
                    disabled={saveResultsMutation.isPending} 
                    className="h-12 px-8 shadow-xl"
                  >
                    {saveResultsMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Publish Results
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Student Identity</TableHead>
                      <TableHead className="w-[180px] font-black uppercase tracking-widest text-[10px] text-slate-400">Marks Obtained</TableHead>
                      <TableHead className="w-[120px] text-center font-black uppercase tracking-widest text-[10px] text-slate-400">Grade</TableHead>
                      <TableHead className="pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students?.items.map((student: any) => {
                      const existingResult = results?.find((r: any) => r.student_id === student.id);
                      return (
                        <TableRow key={student.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                          <TableCell className="pl-8 py-5">
                            <div className="font-black text-slate-900 text-sm">{student.user.first_name} {student.user.last_name}</div>
                            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">{student.admission_no}</div>
                          </TableCell>
                          <TableCell>
                            <div className="relative group">
                                <Input 
                                    type="number" 
                                    className="h-11 text-sm font-black rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 bg-slate-50/30 focus:bg-white transition-all text-center"
                                    placeholder={existingResult?.marks_obtained?.toString() || "0"} 
                                    onChange={(e) => setMarks(prev => ({ ...prev, [student.id]: parseFloat(e.target.value) }))}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">/ {exams?.find((e: any) => e.id === selectedExamId)?.max_marks}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {existingResult?.grade ? (
                              <Badge 
                                className={cn(
                                  "font-black px-3 py-1 rounded-lg text-[10px] shadow-sm uppercase tracking-widest border-none",
                                  existingResult.grade === 'A' && "bg-emerald-50 text-emerald-600",
                                  existingResult.grade === 'E' && "bg-rose-50 text-rose-600",
                                  !['A','E'].includes(existingResult.grade) && "bg-blue-50 text-blue-600"
                                )}
                              >
                                {existingResult.grade}
                              </Badge>
                            ) : (
                              <div className="h-8 w-8 rounded-xl bg-slate-50 border border-dashed border-slate-200 mx-auto group-hover:border-blue-200 transition-colors" />
                            )}
                          </TableCell>
                          <TableCell className="pr-8">
                            <Input 
                              placeholder="Institutional remarks..." 
                              className="h-11 text-xs font-bold rounded-xl border-none bg-slate-50/30 focus:bg-white transition-all italic text-slate-500" 
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
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase tracking-tighter">Result Terminal</h3>
              <p className="text-sm font-bold text-slate-400 max-w-xs uppercase tracking-widest leading-relaxed">
                Select an assessment from the left registry to initialize results entry.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

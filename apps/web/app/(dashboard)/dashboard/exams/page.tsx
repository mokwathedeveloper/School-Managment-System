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

export default function ExamsPage() {
  const queryClient = useQueryClient();
  const [selectedExamId, setSelectedExamId] = useState('');
  const [isAddingExam, setIsAddingExam] = useState(false);
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

  // For simplicity, let's assume we fetch students for the subject's class
  // In a real app, you'd fetch based on the exam's target group
  const { data: students } = useQuery({
    queryKey: ['students-for-exam', selectedExamId],
    queryFn: async () => {
      // Logic to get students associated with this exam's subject/class
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
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <Button onClick={() => setIsAddingExam(true)} className="shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Exam
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Exam List Sidebar */}
        <Card className="md:col-span-1 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Recent Exams</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {exams?.map((exam: any) => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExamId(exam.id);
                    // Reset marks state when switching exams
                    setMarks({});
                  }}
                  className={cn(
                    "w-full text-left p-4 hover:bg-muted/50 transition-colors flex flex-col gap-1",
                    selectedExamId === exam.id && "bg-primary/5 border-l-4 border-primary"
                  )}
                >
                  <div className="font-bold text-sm truncate">{exam.name}</div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">{exam.subject.name}</span>
                    <Badge variant="secondary" className="text-[9px] px-1.5 h-4">
                      {new Date(exam.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mark Entry / Results Area */}
        <Card className="md:col-span-3 shadow-sm overflow-hidden">
          {selectedExamId ? (
            <>
              <CardHeader className="border-b bg-muted/10">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{exams?.find((e: any) => e.id === selectedExamId)?.name}</CardTitle>
                    <CardDescription>
                      Subject: {exams?.find((e: any) => e.id === selectedExamId)?.subject.name} | 
                      Max Marks: {exams?.find((e: any) => e.id === selectedExamId)?.max_marks}
                    </CardDescription>
                  </div>
                  <Button onClick={handleSave} disabled={saveResultsMutation.isPending} className="shadow-sm">
                    {saveResultsMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save & Auto-Grade
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Student</TableHead>
                      <TableHead className="w-[150px]">Marks Obtained</TableHead>
                      <TableHead className="w-[100px] text-center">Grade</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students?.items.map((student: any) => {
                      const existingResult = results?.find((r: any) => r.student_id === student.id);
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="font-medium text-sm">{student.user.first_name} {student.user.last_name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">{student.admission_no}</div>
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              className="h-8 text-sm"
                              placeholder={existingResult?.marks_obtained?.toString() || "0"} 
                              onChange={(e) => setMarks(prev => ({ ...prev, [student.id]: parseFloat(e.target.value) }))}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {existingResult?.grade ? (
                              <Badge 
                                className={cn(
                                  "font-bold",
                                  existingResult.grade === 'A' && "bg-green-100 text-green-700",
                                  existingResult.grade === 'E' && "bg-red-100 text-red-700"
                                )}
                                variant="secondary"
                              >
                                {existingResult.grade}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs italic">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Input 
                              placeholder="e.g. Good improvement" 
                              className="h-8 text-xs" 
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
            <div className="h-96 flex flex-col items-center justify-center text-muted-foreground">
              <Trophy className="h-12 w-12 opacity-10 mb-4" />
              <p>Select an exam to enter or view results.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useParams } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Printer, 
  Download, 
  FileText, 
  Calendar, 
  CreditCard,
  User,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function StudentDetailPage() {
  const { id } = useParams();
  const [selectedTermId, setSelectedTermId] = useState('');

  const { data: terms } = useQuery({
    queryKey: ['terms'],
    queryFn: async () => {
      const res = await api.get('/finance/terms');
      if (res.data.length > 0 && !selectedTermId) {
        setSelectedTermId(res.data[0].id);
      }
      return res.data;
    },
  });

  const { data: report, isLoading } = useQuery({
    queryKey: ['student-report', id, selectedTermId],
    queryFn: async () => {
      if (!selectedTermId) return null;
      const res = await api.get(`/academic/report/${id}?termId=${selectedTermId}`);
      return res.data;
    },
    enabled: !!selectedTermId,
  });

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
      {/* Action Header */}
      <div className="flex items-center justify-between border-b pb-6 print:hidden">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border-4 border-white shadow-sm">
            {report?.studentInfo.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{report?.studentInfo.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant="outline" className="font-mono">{report?.studentInfo.admissionNo}</Badge>
              <span className="text-muted-foreground">•</span>
              <span className="font-medium text-foreground">{report?.studentInfo.class}</span>
              <span className="text-muted-foreground">•</span>
              <select 
                className="bg-transparent text-sm font-bold text-primary focus:outline-none cursor-pointer"
                value={selectedTermId}
                onChange={(e) => setSelectedTermId(e.target.value)}
              >
                {terms?.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="shadow-sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
          <Button className="shadow-md">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Printable Report Card Content */}
      <div className="print:block print:p-0 space-y-8">
        {/* School Header (Print Only) */}
        <div className="hidden print:flex items-center justify-between mb-10 border-b-2 border-primary pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary rounded-xl flex items-center justify-center text-white font-black text-2xl">S</div>
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-tighter">Official Academic Report</h2>
              <p className="text-sm font-medium text-muted-foreground">Institutional Multi-Tenant SaaS Platform • 2024 Academic Year</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">{report?.termName}</p>
            <p className="text-xs text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Academics Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-sm border-muted/50">
            <CardHeader className="bg-muted/10 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {report?.academics.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 opacity-10 mb-2" />
                  <p>No examination results recorded for this term.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-bold">Subject</TableHead>
                      <TableHead className="text-center font-bold">Raw Score</TableHead>
                      <TableHead className="text-center font-bold">Percentage</TableHead>
                      <TableHead className="text-right font-bold">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report?.academics.map((subj: any) => {
                      const percentage = (subj.totalMarks / subj.maxPossible) * 100;
                      return (
                        <TableRow key={subj.subject} className="hover:bg-muted/10 transition-colors">
                          <TableCell className="font-semibold">{subj.subject}</TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {subj.totalMarks} <span className="text-[10px]">/ {subj.maxPossible}</span>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {percentage.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "font-bold px-3 py-1",
                                percentage >= 80 ? "bg-green-100 text-green-700" :
                                percentage >= 60 ? "bg-blue-100 text-blue-700" :
                                "bg-orange-100 text-orange-700"
                              )}
                            >
                              {subj.exams[0]?.grade || '-'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Side Metrics */}
          <div className="space-y-6">
            {/* Attendance */}
            <Card className="shadow-sm border-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-4">
                  <div className="text-3xl font-bold">{((report?.attendance.PRESENT / report?.attendance.total) * 100).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground pb-1">Term attendance</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-50 text-green-700 p-2 rounded-lg text-center">
                    <p className="font-bold">{report?.attendance.PRESENT}</p>
                    <p className="opacity-70">Present</p>
                  </div>
                  <div className="bg-red-50 text-red-700 p-2 rounded-lg text-center">
                    <p className="font-bold">{report?.attendance.ABSENT}</p>
                    <p className="opacity-70">Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Finance Status */}
            <Card className={cn(
                "shadow-sm border-muted/50",
                report?.finance.balance > 0 ? "border-l-4 border-l-destructive" : "border-l-4 border-l-green-500"
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Fee Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground italic">Balance Due</span>
                      <span className={cn("font-bold", report?.finance.balance > 0 ? "text-destructive" : "text-green-600")}>
                        KES {report?.finance.balance.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000" 
                        style={{ width: `${report?.finance.totalInvoiced > 0 ? (report?.finance.totalPaid / report?.finance.totalInvoiced) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  {report?.finance.balance > 0 ? (
                    <div className="bg-destructive/10 text-destructive text-[10px] p-2 rounded-md flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3" />
                      Outstanding balance requires immediate attention.
                    </div>
                  ) : (
                    <div className="bg-green-50 text-green-700 text-[10px] p-2 rounded-md flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3" />
                      All fees for this term are cleared.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Remarks Section */}
        <Card className="shadow-sm border-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Class Teacher&apos;s Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic min-h-[80px] border-l-2 pl-4 border-primary/20">
              &quot;Student performance records synchronized with institutional database. Academic trajectory remains consistent with termly objectives.&quot;
            </p>
            <div className="mt-8 flex justify-between items-end">
              <div className="text-center">
                <div className="w-40 border-b border-muted-foreground/30 mb-1"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest">Class Teacher</p>
              </div>
              <div className="text-center">
                <div className="w-40 border-b border-muted-foreground/30 mb-1"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest">Principal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronRight,
  MapPin,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { FormSelect } from '@/components/ui/form-select';
import { toast } from 'react-hot-toast';

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

  if (isLoading || !report) return <PremiumLoader message="Synthesizing Academic Transcript" />;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('academic-report-content');
    if (!element) return;
    
    try {
        const html2pdf = (await import('html2pdf.js')).default;
        
        const opt = {
          margin:       0.5,
          filename:     `Academic_Report_${report?.studentInfo.name.replace(/\s+/g, '_')}_${report?.termName.replace(/\s+/g, '_')}.pdf`,
          image:        { type: 'jpeg' as const, quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' as const }
        };
        
        toast.loading('Synthesizing Institutional PDF...', { id: 'pdf-gen' });
        html2pdf().from(element).set(opt).save().then(() => {
            toast.success('Transcript successfully generated.', { id: 'pdf-gen' });
        });
    } catch (error) {
        toast.error('Failed to export PDF.', { id: 'pdf-gen' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto pb-24">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8 print:hidden">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-[2rem] bg-blue-600 text-white shadow-2xl shadow-blue-600/20 flex items-center justify-center font-black text-3xl transition-premium hover:scale-110 hover:rotate-3">
            {report?.studentInfo.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">{report?.studentInfo.name}</h1>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="font-black text-[10px] px-3 py-1 bg-blue-50 text-blue-600 border-none rounded-lg shadow-sm">
                {report?.studentInfo.admissionNo}
              </Badge>
              <div className="h-1 w-1 rounded-full bg-slate-200" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{report?.studentInfo.class}</span>
              <div className="h-1 w-1 rounded-full bg-slate-200" />
              <FormSelect 
                className="h-8 border-none bg-transparent font-black text-[10px] uppercase tracking-widest text-blue-600 min-w-[120px]"
                value={selectedTermId}
                onChange={(e) => setSelectedTermId(e.target.value)}
              >
                {terms?.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </FormSelect>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="h-12 px-6 rounded-xl border-slate-100 font-black uppercase tracking-widest text-[10px]">
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
          <Button variant="premium" onClick={handleExportPDF} className="h-12 px-8 rounded-xl shadow-xl shadow-blue-600/20">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Printable Report Card Content */}
      <div id="academic-report-content" className="print:block print:p-0 space-y-8">
        {/* School Header (Print Only) */}
        <div className="hidden print:flex items-center justify-between mb-12 border-b-4 border-slate-900 pb-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl">S</div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Institutional Academic Transcript</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Enterprise Multi-Tenant Node v1.4 • Nairobi</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="font-black text-slate-900 uppercase tracking-widest">{report?.termName}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Released: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Academics Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-all group-hover:scale-110">
                    <FileText className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Academic Trajectory</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Summative assessment and grading summary</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {report?.academics.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-12">
                  <TrendingUp className="h-12 w-12 text-slate-100 mb-4" />
                  <p className="font-black text-slate-300 uppercase tracking-widest text-[10px] italic">No results recorded for this terminal sequence.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Subject Discipline</TableHead>
                      <TableHead className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400">Raw Performance</TableHead>
                      <TableHead className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400">Efficiency</TableHead>
                      <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report?.academics.map((subj: any) => {
                      const percentage = (subj.totalMarks / subj.maxPossible) * 100;
                      return (
                        <TableRow key={subj.subject} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                          <TableCell className="pl-8 py-5 font-black text-slate-900 text-sm tracking-tight">{subj.subject}</TableCell>
                          <TableCell className="text-center">
                            <span className="font-black text-slate-900">{subj.totalMarks}</span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase ml-1">/ {subj.maxPossible}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={cn(
                                "font-black text-xs px-2 py-1 rounded-lg",
                                percentage >= 80 ? "text-emerald-600 bg-emerald-50" : "text-blue-600 bg-blue-50"
                            )}>
                                {percentage.toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <Badge 
                              className={cn(
                                "font-black px-4 py-1.5 rounded-xl text-[10px] shadow-sm uppercase tracking-widest border-none transition-all group-hover:scale-110",
                                percentage >= 80 ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                                percentage >= 60 ? "bg-blue-600 text-white shadow-blue-600/20" :
                                "bg-amber-500 text-white shadow-amber-500/20"
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
          <div className="space-y-8">
            {/* Attendance */}
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden group">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Attendance</CardTitle>
                <Calendar className="h-4 w-4 text-slate-300" />
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-baseline justify-between mb-6">
                  <div className="text-4xl font-black text-slate-900 tracking-tighter">{((report?.attendance.PRESENT / report?.attendance.total) * 100).toFixed(1)}%</div>
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Target Met</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center transition-premium hover:bg-white hover:shadow-md group/stat">
                    <p className="text-xl font-black text-emerald-600 group-hover/stat:scale-110 transition-transform">{report?.attendance.PRESENT}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Present</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center transition-premium hover:bg-white hover:shadow-md group/stat">
                    <p className="text-xl font-black text-rose-600 group-hover/stat:scale-110 transition-transform">{report?.attendance.ABSENT}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Absent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Finance Status */}
            <Card className={cn(
                "border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden group",
                report?.finance.balance > 0 ? "ring-2 ring-rose-500/10" : "ring-2 ring-emerald-500/10"
            )}>
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financial Clearance</CardTitle>
                <CreditCard className="h-4 w-4 text-slate-300" />
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance Remaining</span>
                      <span className={cn("text-2xl font-black tracking-tighter", report?.finance.balance > 0 ? "text-rose-600" : "text-emerald-600")}>
                        KES {report?.finance.balance.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                      <div 
                        className={cn(
                            "h-full transition-all duration-[2000ms] ease-out",
                            report?.finance.balance > 0 ? "bg-rose-500" : "bg-emerald-500"
                        )} 
                        style={{ width: `${report?.finance.totalInvoiced > 0 ? (report?.finance.totalPaid / report?.finance.totalInvoiced) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  {report?.finance.balance > 0 ? (
                    <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-rose-600 mt-0.5" />
                      <p className="text-[10px] font-bold text-rose-700/70 uppercase leading-relaxed tracking-tighter">
                        Arrears identified. Please initialize settlement protocol to maintain registry active status.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                      <p className="text-[10px] font-bold text-emerald-700/70 uppercase leading-relaxed tracking-tighter">
                        Institutional accounts synchronized. No outstanding terminal liability identified.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Remarks Section */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Institutional Observations</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="min-h-[120px] border-l-4 border-blue-600 bg-slate-50/50 p-6 rounded-r-3xl italic text-slate-600 font-medium leading-relaxed text-sm">
              &quot;Student performance records successfully synchronized with the primary institutional database. Academic trajectory remains consistent with termly objectives and curriculum benchmarks.&quot;
            </div>
            <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8 px-4">
              <div className="text-center group/sign cursor-default">
                <div className="w-48 h-0.5 bg-slate-200 mb-2 transition-all group-hover/sign:bg-blue-600 group-hover/sign:w-56" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Class Instructor</p>
              </div>
              <div className="text-center group/sign cursor-default">
                <div className="w-48 h-0.5 bg-slate-200 mb-2 transition-all group-hover/sign:bg-blue-600 group-hover/sign:w-56" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Principal Commandant</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

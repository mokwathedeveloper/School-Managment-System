'use client';

import React, { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useParams, useSearchParams } from 'next/navigation';
import { 
  Printer, 
  Download, 
  FileText, 
  Award, 
  TrendingUp, 
  Activity, 
  Calendar,
  GraduationCap,
  ChevronLeft,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function StudentReportPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const termId = searchParams.get('termId');
  const reportRef = useRef<HTMLDivElement>(null);

  const { data: report, isLoading } = useQuery({
    queryKey: ['student-report', id, termId],
    queryFn: async () => {
      const res = await api.get(`/academic/report/${id}?termId=${termId}`);
      return res.data;
    },
    enabled: !!termId,
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <PremiumLoader message="Synthesizing Academic Performance Data" />;
  if (!termId) return (
    <DashboardShell>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-xl font-black text-slate-900">Term Specification Required</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Please select an academic term to generate the report.</p>
            <Link href={`/dashboard/students/${id}`} className="mt-8">
                <Button variant="outline" className="rounded-xl font-black uppercase tracking-widest text-[10px]">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Back to Registry
                </Button>
            </Link>
        </div>
    </DashboardShell>
  );

  return (
    <DashboardShell className="animate-in fade-in slide-in-from-bottom-4 duration-1000 print:p-0 print:bg-white">
      <DashboardHeader 
        heading="Academic Transcript"
        text="Official Institutional Performance Record"
        className="print:hidden"
      >
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px]" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print Registry Copy
          </Button>
          <Button variant="premium" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20">
            <Download className="h-4 w-4 mr-2" />
            Export Digital PDF
          </Button>
        </div>
      </DashboardHeader>

      <div className="grid gap-8" ref={reportRef}>
        {/* Report Header - Institutional Identity */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white shadow-2xl">
                            <Building2 className="h-10 w-10" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{report?.student?.school?.name || 'SchoolOS Academy'}</h2>
                            <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Institutional Academic Registry</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Verification: {id?.toString().substring(0,12)}</p>
                        </div>
                    </div>
                    <div className="text-right space-y-4">
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-xl">Official Release</Badge>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Session</p>
                            <p className="font-black text-slate-900 text-lg">{report?.termName}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-100 pt-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scholar Identity</p>
                        <p className="font-black text-slate-900 text-xl tracking-tight">{report?.student?.user?.first_name} {report?.student?.user?.last_name}</p>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter">Reg No: {report?.student?.admission_no}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Placement</p>
                        <p className="font-black text-slate-900 text-xl tracking-tight">{report?.student?.class?.name}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Level: Grade {report?.student?.class?.grade?.level}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vitality Index</p>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <p className="font-black text-emerald-600 text-xl tracking-tight">{report?.attendance?.rate}% Presence</p>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Days: {report?.attendance?.present}/{report?.attendance?.total}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Core Results Table */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                        <Award className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black text-slate-900">Performance Matrix</CardTitle>
                        <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Discipline-specific evaluation results</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/30">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Academic Discipline</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400 text-center">Score Index</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400 text-center">Grade</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Registrar Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {report?.academics?.results?.map((res: any, i: number) => (
                            <TableRow key={i} className="group hover:bg-slate-50/50 transition-colors border-b-slate-50">
                                <TableCell className="pl-8 py-6 font-black text-slate-900 text-sm tracking-tight uppercase">
                                    {res.subject}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="font-black text-lg text-slate-900 tracking-tighter">{res.marks}%</span>
                                        <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    res.marks >= 80 ? "bg-emerald-500" : res.marks >= 60 ? "bg-blue-500" : "bg-rose-500"
                                                )} 
                                                style={{ width: `${res.marks}%` }} 
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge className={cn(
                                        "h-10 w-10 rounded-xl border-none shadow-sm font-black text-base flex items-center justify-center p-0",
                                        res.grade === 'A' ? "bg-emerald-50 text-emerald-600" : 
                                        res.grade === 'B' ? "bg-blue-50 text-blue-600" :
                                        res.grade === 'C' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                    )}>
                                        {res.grade}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-500 font-bold text-xs italic tracking-tight italic pr-8">
                                    "{res.remarks || 'Exceptional progress maintained throughout the session.'}"
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        {/* Institutional Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-slate-900 text-white rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-10 flex flex-col justify-between h-full min-h-[250px]">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Consolidated GPA Index</p>
                        <h3 className="text-6xl font-black tracking-tighter">3.82</h3>
                    </div>
                    <div className="flex items-center gap-4 border-t border-white/10 pt-8">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl">
                            <TrendingUp className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Percentile</p>
                            <p className="font-black text-emerald-400 tracking-tight text-lg">Top 5% of Registry</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 pb-0">
                    <CardTitle className="text-xl font-black text-slate-900">Registrar's Assessment</CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                    <p className="text-slate-600 font-bold leading-relaxed text-sm">
                        The scholar has demonstrated consistent commitment to institutional academic standards. Participation in extracurricular forums and discipline registry indicates high leadership potential. Recommended for advanced level sequence in the forthcoming academic cycle.
                    </p>
                    <div className="mt-12 flex items-center justify-between">
                        <div className="space-y-4">
                            <div className="h-px w-48 bg-slate-200" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Office of the Registrar</p>
                        </div>
                        <div className="h-20 w-20 rounded-full border-4 border-double border-blue-600/20 flex items-center justify-center rotate-12">
                            <p className="text-[8px] font-black text-blue-600/40 uppercase tracking-tighter text-center">OFFICIAL<br/>SEAL</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

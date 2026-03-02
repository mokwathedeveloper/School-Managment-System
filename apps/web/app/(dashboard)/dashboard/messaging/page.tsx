'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Users, 
  MessageSquare, 
  Smartphone, 
  Mail, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Zap,
  Filter,
  History
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { FormSelect } from '@/components/ui/form-select';
import { AddAnnouncementDialog } from '@/components/dashboard/add-announcement-dialog';

export default function MessagingHub() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: 'PARENT',
    gradeId: '',
  });
  const [sentCount, setSentCount] = useState<number | null>(null);

  const { data: grades, isLoading: loadingGrades } = useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      const res = await api.get('/grade-levels');
      return res.data;
    },
  });

  const { data: announcements, isLoading: loadingHistory } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await api.get('/messaging/announcements');
      return res.data;
    },
  });

  const broadcastMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/messaging/announcements', data);
      return res.data;
    },
    onSuccess: (data) => {
      setSentCount(data.sent);
      setFormData({ ...formData, title: '', message: '' });
    }
  });

  if (loadingGrades) return <PremiumLoader message="Syncing Communication Hub" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            Messaging Terminal
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Broadcast Announcements & Automated Alerts</p>
        </div>
        <AddAnnouncementDialog />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Composer */}
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-premium group-hover:scale-110 shadow-sm border border-blue-100">
                    <Zap className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Express Composer</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Quick mass institutional notifications</CardDescription>
                </div>
            </div>
            <div className="flex bg-white/50 p-1 rounded-xl border border-slate-100">
                <Button variant="ghost" size="sm" className="bg-white shadow-sm rounded-lg px-4 h-8 text-[9px] font-black uppercase tracking-widest">Draft</Button>
                <Button variant="ghost" size="sm" className="text-slate-400 rounded-lg px-4 h-8 text-[9px] font-black uppercase tracking-widest">Templates</Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Announcement Title</Label>
                <div className="relative group">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                        id="title" 
                        placeholder="e.g. Term 1 Resumption Date" 
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message Body</Label>
                <Textarea 
                  id="message"
                  placeholder="Type your mass announcement here..."
                  className="min-h-[160px] p-4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <div className="flex justify-between px-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Standard SMS Unit: 160 chars</p>
                  <p className={cn(
                    "text-[9px] font-black uppercase tracking-tighter",
                    formData.message.length > 160 ? "text-amber-600" : "text-slate-400"
                  )}>{formData.message.length} characters used</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-50">
              <Button 
                variant="premium"
                onClick={() => broadcastMutation.mutate(formData)}
                disabled={broadcastMutation.isPending || !formData.message}
                className="h-14 px-10 shadow-2xl shadow-blue-600/20"
              >
                {broadcastMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                Dispatch Packet
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Targeting & Status */}
        <div className="space-y-6">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Audience Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient Role</Label>
                <FormSelect 
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  icon={<Filter className="h-4 w-4" />}
                >
                  <option value="PARENT">All Guardians/Parents</option>
                  <option value="TEACHER">All Faculty & Staff</option>
                  <option value="STUDENT">All Enrolled Students</option>
                </FormSelect>
              </div>
              
              {formData.targetRole === 'PARENT' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Level</Label>
                  <FormSelect 
                    value={formData.gradeId}
                    onChange={(e) => setFormData({ ...formData, gradeId: e.target.value })}
                    icon={<GraduationCap className="h-4 w-4" />}
                  >
                    <option value="">Consolidated Institution</option>
                    {grades?.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </FormSelect>
                </div>
              )}
            </CardContent>
          </Card>

          {sentCount !== null && (
            <Card className="border-none shadow-xl bg-emerald-600 text-white rounded-[2rem] overflow-hidden animate-in zoom-in-95 duration-500">
              <CardContent className="p-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-[1.5rem] bg-white/20 flex items-center justify-center mx-auto backdrop-blur-md">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h4 className="text-xl font-black tracking-tight">Broadcast Success</h4>
                    <p className="text-xs font-bold text-emerald-100/80 uppercase tracking-widest mt-1">Dispatched {sentCount} packets</p>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/10 hover:bg-white/20 text-white border-none h-10 text-[10px] font-black uppercase tracking-widest"
                  onClick={() => setSentCount(null)}
                >
                  Dismiss Status
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-none shadow-sm bg-blue-50/50 border border-blue-100 rounded-[2rem]">
            <CardContent className="p-6">
               <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 flex-shrink-0">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway Credits</h4>
                    <p className="text-sm font-black text-slate-900 tracking-tighter">KES 4,250.00</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest pt-1 italic">~2,125 Units Available</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Broadcast History */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center transition-premium group-hover:scale-110 shadow-sm">
                    <History className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Transmission Logs</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Historical institutional broadcasts</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
            {loadingHistory ? (
                <div className="py-24 flex items-center justify-center opacity-20"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : announcements?.length === 0 ? (
                <div className="py-24 text-center space-y-2 opacity-20">
                    <History className="h-12 w-12 mx-auto text-slate-300" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Registry Clean</p>
                </div>
            ) : (
                <Table>
                    <TableHeader className="bg-slate-50/30">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Packet Identifier</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Message Content</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Target Segment</TableHead>
                            <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements?.map((ann: any) => (
                            <TableRow key={ann.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                                <TableCell className="pl-8 py-5">
                                    <p className="font-black text-slate-900 text-sm">{ann.title}</p>
                                    <p className="text-[10px] font-mono font-black text-blue-600 uppercase tracking-tighter mt-0.5">ID: {ann.id.substring(0,8)}</p>
                                </TableCell>
                                <TableCell>
                                    <p className="text-xs font-medium text-slate-500 italic line-clamp-1 max-w-md">{ann.message}</p>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg">
                                        {ann.targetRole}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-8 font-mono text-[10px] font-black text-slate-400">
                                    {new Date(ann.created_at).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

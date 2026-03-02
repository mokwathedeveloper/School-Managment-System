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
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { FormSelect } from '@/components/ui/form-select';

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
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            Messaging Terminal
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Broadcast Announcements & Automated Alerts</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Composer */}
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-premium group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-blue-100">
                    <Zap className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Broadcast Composer</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Draft mass institutional notifications</CardDescription>
                </div>
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
                Dispatch Broadcast
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
                Target Audience
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
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Grade (Optional)</Label>
                  <FormSelect 
                    value={formData.gradeId}
                    onChange={(e) => setFormData({ ...formData, gradeId: e.target.value })}
                    icon={<GraduationCap className="h-4 w-4" />}
                  >
                    <option value="">Consolidated School</option>
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
                  Clear Terminal
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
    </div>
  );
}

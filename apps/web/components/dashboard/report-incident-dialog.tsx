'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2, Gavel, User, FileWarning, ShieldAlert } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function ReportIncidentDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    severity: 'MEDIUM',
    description: '',
  });

  const { data: students } = useQuery({
    queryKey: ['students-list-simple'],
    queryFn: async () => {
      const res = await api.get('/students');
      return res.data.items;
    }
  });

  const reportMutation = useMutation({
    mutationFn: async (data: any) => api.post('/discipline', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discipline-records'] });
      toast.success('Incident has been officially recorded.');
      setOpen(false);
      setFormData({ student_id: '', title: '', severity: 'MEDIUM', description: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record incident');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportMutation.mutate({
      ...formData,
      incident_date: new Date().toISOString(),
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="danger" className="h-12 px-8 shadow-rose-500/20">
        <AlertTriangle className="mr-2 h-4 w-4" />
        Report Incident
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Record Incident"
        description="Behavioral Analytics & Compliance Tracking"
        icon={Gavel}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="i_student_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Student</Label>
            <FormSelect 
                id="i_student_id" 
                icon={<User className="h-4 w-4" />}
                value={formData.student_id}
                onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                required
            >
                <option value="">Select Student</option>
                {students?.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.user.first_name} {s.user.last_name} ({s.admission_no})</option>
                ))}
            </FormSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="i_title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Incident Title</Label>
            <div className="relative group">
                <FileWarning className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="i_title" 
                    required 
                    placeholder="e.g. Chronic Tardiness"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="i_severity" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Severity Classification</Label>
            <FormSelect 
                id="i_severity" 
                icon={<ShieldAlert className="h-4 w-4" />}
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value})}
                required
            >
                <option value="LOW">Low - Warning Issued</option>
                <option value="MEDIUM">Medium - Parent Notified</option>
                <option value="HIGH">High - Suspension Risk</option>
                <option value="CRITICAL">Critical - Institutional Review</option>
            </FormSelect>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-rose-600/20" variant="danger" disabled={reportMutation.isPending}>
            {reportMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Gavel className="mr-2 h-4 w-4" />}
            Confirm Record
          </Button>
        </form>
      </DialogShell>
    </>
  );
}

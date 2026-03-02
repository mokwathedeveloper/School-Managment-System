'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, HeartPulse, User, Activity, Stethoscope } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function RecordHealthVisitDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    student_id: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
  });

  const { data: students } = useQuery({
    queryKey: ['students-list-health'],
    queryFn: async () => {
      const res = await api.get('/students');
      return res.data.items;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/health/visits', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-visits'] });
      toast.success('Health encounter has been officially logged.');
      setOpen(false);
      setFormData({ student_id: '', symptoms: '', diagnosis: '', treatment: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to log health visit');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="h-12 px-8 rounded-xl shadow-lg shadow-rose-500/10" variant="danger">
        <Plus className="mr-2 h-4 w-4" />
        Record Health Visit
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Health Encounter"
        description="Institutional clinic visit and diagnostic record"
        icon={HeartPulse}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="h_student_id" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Student Patient</Label>
            <FormSelect 
                id="h_student_id" 
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
            <Label htmlFor="h_symptoms" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Presenting Symptoms</Label>
            <div className="relative group">
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="h_symptoms" 
                    required 
                    placeholder="e.g. Fever, Headache"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="h_diagnosis" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Clinical Diagnosis</Label>
            <div className="relative group">
                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="h_diagnosis" 
                    required 
                    placeholder="e.g. Common Cold"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                />
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-rose-600/20" variant="danger" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HeartPulse className="mr-2 h-4 w-4" />}
            Confirm Record
          </Button>
        </form>
      </DialogShell>
    </>
  );
}

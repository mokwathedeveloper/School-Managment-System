'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, CreditCard, Receipt, Trash2, Layers, Calendar, Wallet } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function CreateFeeStructureDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    grade_id: '',
    term_id: '',
    items: [{ name: '', amount: '' }]
  });

  const { data: grades } = useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      const res = await api.get('/grade-levels');
      return res.data;
    }
  });

  const { data: terms } = useQuery({
    queryKey: ['terms'],
    queryFn: async () => {
      const res = await api.get('/finance/terms');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/finance/fee-structures', {
        ...data,
        items: data.items.map((i: any) => ({ ...i, amount: parseFloat(i.amount) }))
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-structures'] });
      toast.success('Institutional fee template has been established.');
      setOpen(false);
      setFormData({ grade_id: '', term_id: '', items: [{ name: '', amount: '' }] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to establish structure');
    }
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', amount: '' }]
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const items = [...formData.items];
    (items[index] as any)[field] = value;
    setFormData({ ...formData, items });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.grade_id || !formData.term_id) {
        toast.error('Grade and Term selection required.');
        return;
    }
    createMutation.mutate(formData);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="premium" className="h-12 px-8 shadow-xl">
        <Plus className="mr-2 h-4 w-4" />
        Define Structure
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Fee Configuration"
        description="Establish a termly billing template for an academic level"
        icon={CreditCard}
        className="sm:max-w-[600px]"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Target Grade</Label>
              <FormSelect 
                icon={<Layers className="h-4 w-4" />}
                value={formData.grade_id}
                onChange={(e) => setFormData({ ...formData, grade_id: e.target.value })}
                required
              >
                <option value="">Select Grade</option>
                {grades?.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </FormSelect>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Term</Label>
              <FormSelect 
                icon={<Calendar className="h-4 w-4" />}
                value={formData.term_id}
                onChange={(e) => setFormData({ ...formData, term_id: e.target.value })}
                required
              >
                <option value="">Select Term</option>
                {terms?.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </FormSelect>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Receipt className="h-3.5 w-3.5" />
                Line Item Definitions
              </h3>
              <Button variant="outline" size="sm" type="button" onClick={addItem} className="h-8 rounded-lg text-[9px]">
                <Plus className="h-3 w-3 mr-1" /> Add Entry
              </Button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 scrollbar-none">
                {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-4 items-end group animate-in slide-in-from-left-2 duration-300">
                        <div className="flex-1 space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-tighter text-slate-400 ml-1">Label</Label>
                            <Input 
                                placeholder="e.g. Tuition" 
                                className="h-11 rounded-xl border-2 border-slate-50 font-bold"
                                value={item.name}
                                onChange={(e) => updateItem(index, 'name', e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-32 space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-tighter text-slate-400 ml-1">Amount</Label>
                            <div className="relative group/input">
                                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within/input:text-blue-600 transition-colors" />
                                <Input 
                                    type="number" 
                                    placeholder="0" 
                                    className="h-11 pl-9 rounded-xl border-2 border-slate-50 font-black"
                                    value={item.amount}
                                    onChange={(e) => updateItem(index, 'amount', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            type="button"
                            className="h-11 w-11 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                            onClick={() => removeItem(index)}
                            disabled={formData.items.length === 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
            Authorize Template
          </Button>
        </form>
      </DialogShell>
    </>
  );
}

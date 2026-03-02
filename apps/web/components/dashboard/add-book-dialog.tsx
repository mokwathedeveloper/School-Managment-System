'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2, Book, User, Layers, Hash } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';
import { FormSelect } from '@/components/ui/form-select';

export function AddBookDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'GENERAL',
    isbn: '',
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => api.post('/library/catalog', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-catalog'] });
      toast.success('New book title has been successfully integrated into the repository.');
      setOpen(false);
      setFormData({ title: '', author: '', category: 'GENERAL', isbn: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add book title');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="premium" className="h-12 px-8">
        <Plus className="mr-2 h-4 w-4" />
        Add New Title
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Catalog Registry"
        description="Register a new book title in the institutional repository"
        icon={Book}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="b_title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Book Title</Label>
            <div className="relative group">
                <Book className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="b_title" 
                    required 
                    placeholder="e.g. Advanced Physics Vol 1"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="b_author" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Author</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="b_author" 
                    required 
                    placeholder="e.g. Stephen Hawking"
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="b_isbn" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ISBN (Optional)</Label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    id="b_isbn" 
                    placeholder="978-3-16..."
                    className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-mono text-xs font-bold"
                    value={formData.isbn}
                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="b_category" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Classification</Label>
            <FormSelect 
                id="b_category" 
                icon={<Layers className="h-4 w-4" />}
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
            >
                <option value="GENERAL">General Reference</option>
                <option value="SCIENCE">Sciences</option>
                <option value="MATHEMATICS">Mathematics</option>
                <option value="HUMANITIES">Humanities</option>
                <option value="LANGUAGE">Languages</option>
                <option value="LITERATURE">Literature</option>
            </FormSelect>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl shadow-2xl shadow-blue-600/20" variant="premium" disabled={createMutation.isPending}>
            {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Confirm Registry
          </Button>
        </form>
      </DialogShell>
    </>
  );
}

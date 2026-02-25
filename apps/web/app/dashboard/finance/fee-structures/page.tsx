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
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Loader2, 
  CreditCard, 
  FileText, 
  Receipt, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FeeStructuresPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [newStructure, setNewStructure] = useState({
    grade_id: '',
    term_id: '',
    items: [{ name: '', amount: '' }]
  });

  const { data: structures, isLoading } = useQuery({
    queryKey: ['fee-structures'],
    queryFn: async () => {
      const res = await api.get('/finance/fee-structures');
      return res.data;
    },
  });

  const { data: grades } = useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      const res = await api.get('/grade-levels');
      return res.data;
    },
  });

  // Simplified for this context: usually you'd have a terms query too
  const terms = [{ id: 'term-1', name: 'Term 1 2024' }]; 

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/finance/fee-structures', {
        ...data,
        items: data.items.map((i: any) => ({ ...i, amount: parseFloat(i.amount) }))
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-structures'] });
      setIsAdding(false);
    },
  });

  const generateInvoicesMutation = useMutation({
    mutationFn: async ({ gradeId, termId }: { gradeId: string, termId: string }) => {
      return api.post('/finance/generate-bulk-invoices', { grade_id: gradeId, term_id: termId });
    },
    onSuccess: (res) => {
      alert(`Successfully created ${res.data.created} invoices. ${res.data.skipped} were skipped (already exist).`);
    }
  });

  const addItem = () => {
    setNewStructure({
      ...newStructure,
      items: [...newStructure.items, { name: '', amount: '' }]
    });
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Fee Structures</h1>
          <p className="text-muted-foreground mt-1">Define termly fee templates and automate student billing.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Create Fee Structure
        </Button>
      </div>

      {isAdding && (
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle>New Fee Structure</CardTitle>
            <CardDescription>Select a grade and term to define the standard fee items.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Grade Level</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newStructure.grade_id}
                  onChange={(e) => setNewStructure({ ...newStructure, grade_id: e.target.value })}
                >
                  <option value="">Select Grade</option>
                  {grades?.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Academic Term</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newStructure.term_id}
                  onChange={(e) => setNewStructure({ ...newStructure, term_id: e.target.value })}
                >
                  <option value="">Select Term</option>
                  {terms.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Line Items
                </h3>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-3 w-3 mr-1" /> Add Item
                </Button>
              </div>
              
              {newStructure.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-end animate-in slide-in-from-left-2 duration-200">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs">Item Name</Label>
                    <Input 
                      placeholder="e.g. Tuition Fee" 
                      value={item.name}
                      onChange={(e) => {
                        const items = [...newStructure.items];
                        items[index].name = e.target.value;
                        setNewStructure({ ...newStructure, items });
                      }}
                    />
                  </div>
                  <div className="w-32 space-y-1.5">
                    <Label className="text-xs">Amount (KES)</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={item.amount}
                      onChange={(e) => {
                        const items = [...newStructure.items];
                        items[index].amount = e.target.value;
                        setNewStructure({ ...newStructure, items });
                      }}
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      const items = newStructure.items.filter((_, i) => i !== index);
                      setNewStructure({ ...newStructure, items });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button 
                onClick={() => createMutation.mutate(newStructure)}
                disabled={createMutation.isPending || !newStructure.grade_id || !newStructure.term_id}
              >
                Save Structure
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {structures?.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 bg-muted/20 border-dashed">
            <CreditCard className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No fee structures defined yet.</p>
            <Button variant="link" onClick={() => setIsAdding(true)}>Create your first template</Button>
          </Card>
        ) : (
          structures?.map((structure: any) => (
            <Card key={structure.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl font-bold">{structure.grade.name}</CardTitle>
                      <Badge variant="outline">{structure.term.name}</Badge>
                    </div>
                    <CardDescription>Defined on {new Date(structure.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">KES {parseFloat(structure.total_amount).toLocaleString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-tight">
                      Breakdown
                    </h4>
                    <div className="space-y-2">
                      {structure.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm items-center py-1 border-b border-muted last:border-0">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-medium">KES {parseFloat(item.amount).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center bg-primary/5 rounded-xl p-6 text-center space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-bold">Billing Automation</h4>
                      <p className="text-sm text-muted-foreground">Apply this structure to all students in {structure.grade.name} for {structure.term.name}.</p>
                    </div>
                    <Button 
                      className="w-full shadow-lg"
                      onClick={() => generateInvoicesMutation.mutate({ gradeId: structure.grade_id, termId: structure.term_id })}
                      disabled={generateInvoicesMutation.isPending}
                    >
                      {generateInvoicesMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Receipt className="h-4 w-4 mr-2" />
                      )}
                      Generate Bulk Invoices
                    </Button>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <AlertCircle className="h-3 w-3" />
                      Existing invoices for this term will not be duplicated.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

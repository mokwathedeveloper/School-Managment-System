'use client';

import React from 'react';
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
import { 
  Loader2, 
  CreditCard, 
  Receipt, 
  AlertCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { CreateFeeStructureDialog } from '@/components/dashboard/create-fee-structure-dialog';
import { cn } from '@/lib/utils';

export default function FinanceFeeStructuresPage() {
  const queryClient = useQueryClient();

  const { data: structures, isLoading } = useQuery({
    queryKey: ['fee-structures'],
    queryFn: async () => {
      const res = await api.get('/finance/fee-structures');
      return res.data;
    },
  });

  const generateInvoicesMutation = useMutation({
    mutationFn: async ({ gradeId, termId }: { gradeId: string, termId: string }) => {
      return api.post('/finance/generate-bulk-invoices', { grade_id: gradeId, term_id: termId });
    },
    onSuccess: (res) => {
      toast.success(`Institutional billing initialized. ${res.data.created} invoices were generated.`);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });

  if (isLoading) return <PremiumLoader message="Syncing Billing Configurations" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <Receipt className="h-8 w-8 text-blue-600" />
            Fee Templates
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Institutional Billing Rules & Automations</p>
        </div>
        <CreateFeeStructureDialog />
      </div>

      <div className="grid gap-8">
        {structures?.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-2 border-dashed border-slate-100">
            <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                <CreditCard className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">No Templates Defined</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-xs leading-relaxed">
                Establish your first institutional fee structure to initialize automated billing.
            </p>
          </div>
        ) : (
          structures?.map((structure: any) => (
            <Card key={structure.id} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-premium">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-[1.5rem] bg-blue-600 text-white shadow-xl shadow-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-premium">
                    <TrendingUp className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">{structure.grade.name}</CardTitle>
                      <Badge className="bg-white text-slate-600 border-slate-200 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">
                        {structure.term.name}
                      </Badge>
                    </div>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Authorized on {new Date(structure.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-1">Terminal Assessment</p>
                    <p className="text-3xl font-black text-blue-600 tracking-tighter">KES {parseFloat(structure.total_amount).toLocaleString()}</p>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                      <Receipt className="h-3.5 w-3.5" />
                      Template Breakdown
                    </h4>
                    <div className="space-y-3">
                      {structure.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 group/item">
                          <span className="text-sm font-bold text-slate-600 group-hover/item:text-slate-900 transition-colors">{item.name}</span>
                          <span className="font-black text-slate-900">KES {parseFloat(item.amount).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center bg-blue-50/30 border border-blue-50 rounded-[2rem] p-8 text-center space-y-6 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                        <Receipt className="h-32 w-32" />
                    </div>
                    <div className="space-y-2 relative z-10">
                      <h4 className="font-black text-slate-900 uppercase tracking-tighter">Billing Automation</h4>
                      <p className="text-xs font-medium text-slate-500 italic max-w-[240px]">Initialize mass invoicing for all scholars in {structure.grade.name} for the current terminal sequence.</p>
                    </div>
                    <Button 
                      variant="premium"
                      className="w-full h-14 rounded-2xl shadow-xl shadow-blue-600/20 relative z-10"
                      onClick={() => generateInvoicesMutation.mutate({ gradeId: structure.grade_id, termId: structure.term_id })}
                      disabled={generateInvoicesMutation.isPending}
                    >
                      {generateInvoicesMutation.isPending ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-5 w-5" />
                      )}
                      Generate Bulk Invoices
                    </Button>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter relative z-10">
                      <AlertCircle className="h-3 w-3 text-blue-400" />
                      Registry checks will prevent duplicate entries
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

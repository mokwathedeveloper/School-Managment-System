'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/components/auth-provider';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Plus, 
  ArrowUpRight, 
  History, 
  Phone, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { AddInvoiceDialog } from '@/components/dashboard/add-invoice-dialog';
import { BulkBillDialog } from '@/components/dashboard/bulk-bill-dialog';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { InsightCard } from '@/components/dashboard/insight-card';
import { cn } from '@/lib/utils';

export default function FinancePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch invoices for the school
  const { data: invoices, isLoading, refetch } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await apiClient.get('/finance');
      return response.data;
    }
  });

  const totalOutstanding = invoices?.filter((i: any) => i.status === 'UNPAID').reduce((sum: number, i: any) => sum + Number(i.amount), 0) || 0;
  const totalCollected = invoices?.filter((i: any) => i.status === 'PAID').reduce((sum: number, i: any) => sum + Number(i.amount), 0) || 0;
  const mpesaVolume = invoices?.filter((i: any) => i.status === 'PAID' && i.payment_method === 'MPESA').reduce((sum: number, i: any) => sum + Number(i.amount), 0) || 0;
  const totalStudentsWithDebt = new Set(invoices?.filter((i: any) => i.status === 'UNPAID').map((i: any) => i.student_id)).size;

  const mpesaMutation = useMutation({
    mutationFn: async (data: { invoice_id: string, phone_number: string }) => {
      return apiClient.post('/finance/mpesa/stkpush', data);
    },
    onSuccess: () => {
      setPaymentSuccess(true);
      setIsPaying(false);
      refetch();
    },
    onError: () => {
      setIsPaying(false);
      toast.error('STK Push failed. Please check your phone number and try again.');
    }
  });

  const handlePay = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPaymentSuccess(false);
  };

  const initiatePayment = () => {
    if (!phoneNumber || !selectedInvoice) return;
    setIsPaying(true);
    mpesaMutation.mutate({
      invoice_id: selectedInvoice.id,
      phone_number: phoneNumber
    });
  };

  if (isLoading) return <PremiumLoader message="Syncing Financial Terminal" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-blue-600" />
            Fee Management
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Institutional Invoicing & Automated Payments</p>
        </div>
        <div className="flex items-center gap-3">
          <BulkBillDialog />
          <AddInvoiceDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <InsightCard 
          title="Total Outstanding" 
          value={`KES ${totalOutstanding.toLocaleString()}`} 
          subValue={`Across ${totalStudentsWithDebt} students`} 
          icon={AlertCircle} 
          color="rose"
          trend="+4.2%"
          trendType="down"
        />
        <InsightCard 
          title="Total Collected" 
          value={`KES ${totalCollected.toLocaleString()}`} 
          subValue="Consolidated revenue" 
          icon={CheckCircle2} 
          color="emerald"
          trend="+14%"
          trendType="up"
        />
        <InsightCard 
          title="M-Pesa Volume" 
          value={`KES ${mpesaVolume.toLocaleString()}`} 
          subValue="Automated collection" 
          icon={Phone} 
          color="blue"
          trend="+22%"
          trendType="up"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Invoice Table */}
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black text-slate-900">Recent Invoices</CardTitle>
              <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Institutional Billing Registry</CardDescription>
            </div>
            <Link href="/dashboard/finance/expenses">
                <Button variant="outline" size="sm" className="h-10 px-4">
                    <History className="mr-2 h-4 w-4" />
                    Audit Logs
                </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Student Identity</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Title</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Amount</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Status</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center text-slate-300 font-bold uppercase tracking-widest text-xs italic">No Registry Entries</TableCell>
                    </TableRow>
                ) : (
                  invoices.map((inv: any) => (
                    <TableRow key={inv.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                      <TableCell className="pl-8 py-5">
                        <div className="font-black text-slate-900 text-sm">
                          {inv.student?.user ? `${inv.student.user.first_name} ${inv.student.user.last_name}` : 'Unknown'}
                        </div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter mt-0.5">#{inv.id.substring(0,8)}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-700 text-sm">{inv.title}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Due: {new Date(inv.due_date).toLocaleDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-slate-900">KES {Number(inv.amount).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border-none shadow-sm",
                          inv.status === 'PAID' ? "bg-emerald-50 text-emerald-600" : inv.status === 'UNPAID' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        {inv.status !== 'PAID' ? (
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-9 px-4 rounded-xl"
                            onClick={() => handlePay(inv)}
                          >
                            Pay Now
                          </Button>
                        ) : (
                          <div className="flex items-center justify-end text-emerald-600 gap-1.5 font-black text-[10px] uppercase tracking-widest">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Settled
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payment Flow */}
        <div className="space-y-6">
          <Card className={cn(
            "transition-all duration-700 border-none rounded-[2.5rem] overflow-hidden bg-white shadow-2xl",
            selectedInvoice ? "scale-100 opacity-100 ring-4 ring-blue-600/5 translate-y-0" : "scale-95 opacity-50 grayscale pointer-events-none translate-y-4"
          )}>
            <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Wallet className="h-24 w-24" />
                </div>
                <div className="relative z-10 space-y-1">
                    <CardTitle className="text-2xl font-black tracking-tight">Checkout</CardTitle>
                    <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Instant M-Pesa Transfer</CardDescription>
                </div>
            </div>
            
            <CardContent className="p-8 space-y-8">
              {paymentSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-50 duration-700">
                  <div className="h-20 w-20 rounded-[2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm border border-emerald-100 animate-bounce">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Request Sent!</h3>
                  <p className="text-xs font-bold text-slate-400 mt-2 px-4 leading-relaxed uppercase tracking-widest">
                    Authorize KES {selectedInvoice?.amount?.toLocaleString()} on your mobile device.
                  </p>
                  <Button variant="outline" className="mt-10 w-full h-14 rounded-2xl" onClick={() => setSelectedInvoice(null)}>Dismiss Terminal</Button>
                </div>
              ) : (
                <>
                  <div className="rounded-[2rem] bg-slate-50 p-6 space-y-4 shadow-inner border border-slate-100">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Invoice Target</span>
                      <span className="text-slate-900 truncate max-w-[150px]">{selectedInvoice?.title}</span>
                    </div>
                    <div className="h-px bg-slate-200/50" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount Payable</span>
                      <span className="text-3xl font-black text-blue-600 tracking-tighter">KES {selectedInvoice?.amount?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-500 ml-1">
                      <Phone className="h-3 w-3 text-blue-600" /> M-Pesa Phone Number
                    </Label>
                    <Input 
                      id="phone" 
                      placeholder="07XX XXX XXX" 
                      className="h-16 text-2xl font-black tracking-[0.2em] text-center rounded-2xl border-2 focus:ring-blue-600/10 transition-all bg-slate-50/50 focus:bg-white"
                      value={phoneNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                    />
                    <p className="text-[9px] font-bold text-slate-400 leading-tight text-center uppercase tracking-widest pt-2">
                      Secure Encrypted Channel (Daraja Gateway)
                    </p>
                  </div>

                  <Button 
                    className="w-full h-16 shadow-2xl shadow-blue-600/20 active:scale-[0.98] transition-all rounded-2xl h-16 text-base" 
                    variant="premium"
                    disabled={isPaying || !phoneNumber}
                    onClick={initiatePayment}
                  >
                    {isPaying ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <CreditCard className="mr-3 h-6 w-6" />}
                    Initialize Payment
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

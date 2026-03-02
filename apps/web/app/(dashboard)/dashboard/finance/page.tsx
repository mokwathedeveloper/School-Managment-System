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
  AlertCircle
} from 'lucide-react';
import { AddInvoiceDialog } from '@/components/dashboard/add-invoice-dialog';
import { BulkBillDialog } from '@/components/dashboard/bulk-bill-dialog';

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Syncing Financial Terminal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
          <p className="text-muted-foreground mt-1">Track fee collection, invoices, and M-Pesa payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <BulkBillDialog />
          <AddInvoiceDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <FinanceStatCard 
          title="Total Outstanding" 
          value={`KES ${totalOutstanding.toLocaleString()}`} 
          description={`Across ${totalStudentsWithDebt} students`} 
          icon={<AlertCircle className="h-5 w-5 text-destructive" />} 
        />
        <StatCard 
          title="Total Collected" 
          value={`KES ${totalCollected.toLocaleString()}`} 
          description="Consolidated revenue" 
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />} 
          trend="+14%"
          trendType="up"
        />
        <StatCard 
          title="M-Pesa Volume" 
          value={`KES ${mpesaVolume.toLocaleString()}`} 
          description="Automated collection" 
          icon={<Phone className="h-5 w-5 text-primary" />} 
          trend="+22%"
          trendType="up"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Invoice Table */}
        <Card className="lg:col-span-2 shadow-sm border-none bg-card/50 backdrop-blur overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/10">
            <CardTitle className="text-xl">Recent Institutional Invoices</CardTitle>
            <Link href="/dashboard/finance/expenses">
                <Button variant="outline" size="sm" className="font-bold">
                    <History className="mr-2 h-4 w-4" />
                    Audit Logs
                </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No invoices found.</TableCell>
                    </TableRow>
                ) : (
                  invoices.map((inv: any) => (
                    <TableRow key={inv.id} className="hover:bg-muted/20 transition-colors border-b-muted/20">
                      <TableCell className="font-medium text-primary uppercase tracking-tighter text-[10px]">#{inv.id.substring(0,8)}</TableCell>
                      <TableCell className="font-bold text-sm">
                        {inv.student?.user ? `${inv.student.user.first_name} ${inv.student.user.last_name}` : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-sm">{inv.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Due: {new Date(inv.due_date).toLocaleDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-slate-900">KES {Number(inv.amount).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={inv.status === 'PAID' ? 'success' : inv.status === 'UNPAID' ? 'destructive' : 'warning'}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {inv.status !== 'PAID' ? (
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold px-4 rounded-lg"
                            onClick={() => handlePay(inv)}
                          >
                            Pay Now
                          </Button>
                        ) : (
                          <div className="flex items-center justify-end text-green-600 gap-1 font-bold text-xs">
                              <CheckCircle2 className="h-3 w-3" />
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
            "transition-all duration-500 shadow-xl border-2 border-primary/20",
            selectedInvoice ? "scale-100 opacity-100 ring-2 ring-primary ring-offset-4" : "scale-95 opacity-50 grayscale pointer-events-none"
          )}>
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">M-Pesa Checkout</CardTitle>
                  <CardDescription>Instant STK Push Transfer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {paymentSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-50 duration-500">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4 ring-8 ring-green-50">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-black text-green-700">Request Sent!</h3>
                  <p className="text-sm text-muted-foreground mt-2 px-4 leading-relaxed font-medium">
                    Authorize KES {selectedInvoice?.amount?.toLocaleString()} on your mobile device now.
                  </p>
                  <Button variant="outline" className="mt-8 w-full font-bold h-12 rounded-xl" onClick={() => setSelectedInvoice(null)}>Dismiss Terminal</Button>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                      <span>Invoice Target</span>
                      <span className="text-slate-900">{selectedInvoice?.title}</span>
                    </div>
                    <div className="h-px bg-slate-200/50" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Payable Amount</span>
                      <span className="text-2xl font-black text-primary">KES {selectedInvoice?.amount?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-500">
                      <Phone className="h-3 w-3 text-primary" /> M-Pesa Phone Number
                    </Label>
                    <Input 
                      id="phone" 
                      placeholder="07XX XXX XXX" 
                      className="h-14 text-xl font-black tracking-[0.2em] text-center rounded-2xl border-2 focus:ring-primary/20"
                      value={phoneNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                    />
                    <p className="text-[10px] font-bold text-slate-400 leading-tight text-center uppercase tracking-tighter">
                      Secure encrypted channel. Encrypted end-to-end.
                    </p>
                  </div>

                  <Button 
                    className="w-full h-16 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all rounded-2xl" 
                    disabled={isPaying || !phoneNumber}
                    onClick={initiatePayment}
                  >
                    {isPaying ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <CreditCard className="mr-3 h-6 w-6" />}
                    Initiate Pay
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

function FinanceStatCard({ title, value, description, icon }: any) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow border-none bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-black tracking-tighter mb-1 text-slate-900">{value}</div>
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <p className="text-xs font-bold text-slate-400 mt-2 italic">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatCard({ title, value, icon, trend, trendType, description }: any) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all group border-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</CardTitle>
        <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary transition-transform group-hover:scale-110 duration-300 border border-primary/10">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tracking-tighter text-slate-900">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-[10px] font-black flex items-center px-2 py-0.5 rounded-lg uppercase tracking-tighter",
            trendType === 'up' ? "bg-emerald-50 text-emerald-600" : 
            trendType === 'down' ? "bg-rose-50 text-red-600" : 
            "bg-muted text-muted-foreground"
          )}>
            {trendType === 'up' && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
            {trend}
          </span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

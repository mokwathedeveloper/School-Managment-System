'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    },
    // Mock data for demo if backend isn't ready
    initialData: []
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: any) => apiClient.post('/finance', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      alert('Invoice created successfully!');
    },
    onError: (error: any) => {
      alert(`Failed to create invoice: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleCreateInvoice = async () => {
    const student_id = window.prompt('Enter student UUID:');
    if (!student_id) return;
    const title = window.prompt('Enter invoice title (e.g. Term 1 Tuition):');
    if (!title) return;
    const amountStr = window.prompt('Enter amount (KES):');
    if (!amountStr) return;
    
    createInvoiceMutation.mutate({
      student_id,
      title,
      amount: parseFloat(amountStr),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

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
      alert('STK Push failed. Please check your phone number and try again.');
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
          <p className="text-muted-foreground mt-1">Track fee collection, invoices, and M-Pesa payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/finance/expenses">
            <Button variant="outline" size="sm">
              <History className="mr-2 h-4 w-4" />
              Transaction Logs
            </Button>
          </Link>
          <Button size="sm" className="shadow-md" onClick={handleCreateInvoice} disabled={createInvoiceMutation.isPending}>
            {createInvoiceMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <FinanceStatCard 
          title="Total Outstanding" 
          value="KES 1.4M" 
          description="Across 124 students" 
          icon={<AlertCircle className="h-5 w-5 text-destructive" />} 
        />
        <StatCard 
          title="Total Collected" 
          value="KES 8.2M" 
          description="This term (92%)" 
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />} 
          trend="+14%"
          trendType="up"
        />
        <StatCard 
          title="M-Pesa Volume" 
          value="KES 5.8M" 
          description="Automated collection" 
          icon={<Phone className="h-5 w-5 text-primary" />} 
          trend="+22%"
          trendType="up"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Invoice Table */}
        <Card className="lg:col-span-2 shadow-sm border-none bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Recent Invoices</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" onClick={() => window.scrollTo(0,0)}>View All</Button>
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
                    <TableRow key={inv.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium text-primary uppercase tracking-tighter text-xs">#{inv.id.substring(0,8)}...</TableCell>
                      <TableCell className="font-medium text-sm">
                        {inv.student?.user ? `${inv.student.user.first_name} ${inv.student.user.last_name}` : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold">{inv.title}</p>
                          <p className="text-xs text-muted-foreground">Due: {new Date(inv.due_date).toLocaleDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-lg">KES {Number(inv.amount).toLocaleString()}</TableCell>
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
                            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold px-4"
                            onClick={() => handlePay(inv)}
                          >
                            Pay Now
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" className="text-muted-foreground opacity-50">Receipt</Button>
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
            <CardHeader className="bg-primary/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Complete Payment</CardTitle>
                  <CardDescription>M-Pesa STK Push Transfer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {paymentSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-50 duration-500">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4 ring-8 ring-green-50">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700">Payment Request Sent!</h3>
                  <p className="text-sm text-muted-foreground mt-2 px-4 leading-relaxed">
                    Please enter your M-Pesa PIN on your phone (07XX XXX XXX) to authorize KES {selectedInvoice?.amount?.toLocaleString()}.
                  </p>
                  <Button variant="outline" className="mt-8 w-full font-bold" onClick={() => setSelectedInvoice(null)}>Close</Button>
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Invoice:</span>
                      <span className="font-bold">{selectedInvoice?.title}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-muted-foreground">Amount:</span>
                      <span className="font-extrabold text-primary">KES {selectedInvoice?.amount?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-bold flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" /> M-Pesa Phone Number
                    </Label>
                    <Input 
                      id="phone" 
                      placeholder="e.g. 0712345678" 
                      className="h-12 text-lg font-bold tracking-widest text-center"
                      value={phoneNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground leading-tight text-center opacity-70">
                      Standard M-Pesa transaction fees may apply. By clicking Pay Now, you initiate an STK Push to your device.
                    </p>
                  </div>

                  <Button 
                    className="w-full h-14 text-lg font-extrabold shadow-lg shadow-primary/30 active:scale-95 transition-transform" 
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
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}

// Reuse from dashboard home with local definitions for self-containment if needed or import
function StatCard({ title, value, icon, trend, trendType, description }: any) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110 duration-300">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-xs font-bold flex items-center px-1.5 py-0.5 rounded-full",
            trendType === 'up' ? "bg-green-100 text-green-700" : 
            trendType === 'down' ? "bg-red-100 text-red-700" : 
            "bg-muted text-muted-foreground"
          )}>
            {trendType === 'up' && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
            {trend}
          </span>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

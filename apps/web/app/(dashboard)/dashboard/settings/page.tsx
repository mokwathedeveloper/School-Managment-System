'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Building2, 
  Save, 
  Loader2, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Wallet,
  Smartphone,
  Video,
  Layout
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>(null);

  const { data: school, isLoading } = useQuery({
    queryKey: ['my-school'],
    queryFn: async () => {
      const res = await api.get('/schools/my-school');
      setFormData(res.data);
      return res.data;
    },
  });

  const { data: integrations } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      // For now, let's just fetch if google is connected
      const res = await api.get('/integrations/google').catch(() => ({ data: {} }));
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => api.patch('/schools/my-school', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-school'] });
      toast.success('Institutional configuration updated successfully.');
    }
  });

  const connectGoogle = async () => {
    try {
        const res = await api.get('/integrations/google');
        if (res.data.url) {
            window.location.href = res.data.url;
        }
    } catch (err) {
        toast.error('Failed to initialize Google Auth');
    }
  };

  if (isLoading || !formData) return <PremiumLoader message="Fetching Institutional Config" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <DashboardShell className="animate-in fade-in duration-700 max-w-5xl mx-auto pb-24">
      <DashboardHeader 
        heading="Institutional Terminal"
        text="Global Configuration & Multi-Tenancy"
      >
        <Button 
            onClick={handleSubmit} 
            disabled={updateMutation.isPending}
            className="h-12 px-8 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20"
        >
          {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Configuration
        </Button>
      </DashboardHeader>

      <div className="grid gap-8">
        {/* Core Identity */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-[1.5rem] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                    <Building2 className="h-8 w-8" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Institutional Identity</CardTitle>
                    <CardDescription className="font-bold text-slate-400 uppercase tracking-tighter text-xs">Public profile and branding assets</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official School Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">System URL Slug</Label>
                <div className="relative">
                    <Input 
                        value={formData.slug} 
                        disabled
                        className="h-12 rounded-xl border-2 border-slate-50 bg-slate-50 font-mono text-xs font-bold text-slate-400"
                    />
                    <Shield className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Email</Label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                        <Input 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Phone</Label>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                        <Input 
                            value={formData.phone} 
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Institutional Website</Label>
                    <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                        <Input 
                            value={formData.website} 
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                            className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                        />
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Integrations */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                    <Layout className="h-8 w-8" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Digital Ecosystem</CardTitle>
                    <CardDescription className="font-bold text-slate-400 uppercase tracking-tighter text-xs">LMS Extensions & Virtual Learning</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
             <div className="grid md:grid-cols-2 gap-8">
                {/* Google Classroom */}
                <div className="border border-slate-100 rounded-[2rem] p-8 flex flex-col justify-between transition-premium hover:shadow-xl hover:shadow-blue-600/5 group">
                    <div>
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <Globe className="h-6 w-6" />
                        </div>
                        <h4 className="font-black text-slate-900 text-lg tracking-tight">Google Classroom</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">LMS Synchronization</p>
                        <p className="text-sm font-medium text-slate-500 mt-4 leading-relaxed">
                            Synchronize your institutional courseware, announcements, and student assignments directly from Google Classroom nodes.
                        </p>
                    </div>
                    <Button 
                        onClick={connectGoogle}
                        className="mt-8 w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-white border-2 border-slate-100 text-slate-900 hover:bg-slate-50"
                    >
                        Initialize Synchronization
                    </Button>
                </div>

                {/* Zoom Meetings */}
                <div className="border border-slate-100 rounded-[2rem] p-8 flex flex-col justify-between transition-premium hover:shadow-xl hover:shadow-indigo-600/5 group">
                    <div>
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                            <Video className="h-6 w-6" />
                        </div>
                        <h4 className="font-black text-slate-900 text-lg tracking-tight">Zoom Video</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Virtual Classroom Node</p>
                        <p className="text-sm font-medium text-slate-500 mt-4 leading-relaxed">
                            Automate the creation of secure virtual meeting rooms for hybrid learning sessions directly from the SchoolOS timetable.
                        </p>
                    </div>
                    <Button className="mt-8 w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20">
                        Connect Virtual Hub
                    </Button>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Financial Gateway */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-[1.5rem] bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-600/20">
                    <Wallet className="h-8 w-8" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black text-slate-900">Financial Gateway</CardTitle>
                    <CardDescription className="font-bold text-slate-400 uppercase tracking-tighter text-xs">M-Pesa API & Automated Collection</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
             <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl flex items-start gap-4">
                <Smartphone className="h-6 w-6 text-emerald-600 mt-1" />
                <div>
                    <h4 className="font-black text-emerald-900 text-sm">Automated Fee Collection Enabled</h4>
                    <p className="text-xs font-bold text-emerald-700/70 mt-1 leading-relaxed">
                        Your terminal is currently configured to receive real-time STK Push notifications via the Safaricom Daraja API. 
                        Funds are settled directly to your Paybill account.
                    </p>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">M-Pesa Business Shortcode</Label>
                    <Input 
                        value={formData.mpesa_paybill || ''} 
                        onChange={(e) => setFormData({...formData, mpesa_paybill: e.target.value})}
                        placeholder="e.g. 400222"
                        className="h-12 rounded-xl border-2 border-slate-50 font-black tracking-[0.2em] text-center"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Settlement Status</Label>
                    <div className="h-12 flex items-center px-4 bg-slate-50 rounded-xl border-2 border-slate-100">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-3" />
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Active & Operational</span>
                    </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

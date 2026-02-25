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
  Building2, 
  Smartphone, 
  Globe, 
  Mail, 
  CreditCard, 
  Image as ImageIcon,
  Save,
  Loader2,
  Settings as SettingsIcon,
  ShieldCheck
} from 'lucide-react';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>(null);

  const { data: school, isLoading } = useQuery({
    queryKey: ['school-settings'],
    queryFn: async () => {
      const res = await api.get('/schools/my-school'); // Need to implement this endpoint
      setFormData(res.data);
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.patch(`/schools/${school.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-settings'] });
      alert('Settings updated successfully!');
    }
  });

  if (isLoading || !formData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            School Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your institution&apos;s identity and system configuration.</p>
        </div>
        <Button 
          onClick={() => updateMutation.mutate(formData)}
          disabled={updateMutation.isPending}
          className="shadow-lg"
        >
          {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Basic Information */}
        <Card className="shadow-sm border-muted/50 overflow-hidden">
          <CardHeader className="bg-muted/10">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Institutional Identity
            </CardTitle>
            <CardDescription>Public information used on report cards and invoices.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b">
               <div className="h-24 w-24 rounded-2xl bg-muted flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed relative group overflow-hidden">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 mb-1 opacity-20" />
                      <span className="text-[10px] font-bold">UPLOAD LOGO</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-[10px] font-bold">CHANGE</span>
                  </div>
               </div>
               <div className="flex-1 space-y-1">
                 <h4 className="font-bold">School Brand Logo</h4>
                 <p className="text-xs text-muted-foreground">Recommend 512x512px SVG or PNG with transparent background.</p>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">School Name</Label>
                <Input id="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">System Slug (URL)</Label>
                <Input id="slug" value={formData.slug} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Official Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" className="pl-10" value={formData.email || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Phone</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" className="pl-10" value={formData.phone || ''} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="website" className="pl-10" value={formData.website || ''} onChange={handleChange} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Configuration */}
        <Card className="shadow-sm border-muted/50 border-l-4 border-l-emerald-500 overflow-hidden">
          <CardHeader className="bg-emerald-50/50">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              Payment Integration (M-Pesa)
            </CardTitle>
            <CardDescription>Configure your Safaricom Daraja Paybill for automated reconciliation.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mpesa_paybill">Business Shortcode (Paybill/Till)</Label>
                  <Input id="mpesa_paybill" placeholder="e.g. 714777" value={formData.mpesa_paybill || ''} onChange={handleChange} />
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 flex items-start gap-3">
                   <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
                   <div className="space-y-1">
                      <h4 className="text-sm font-bold text-emerald-900">Verified Secure</h4>
                      <p className="text-[10px] text-emerald-700 leading-relaxed">
                        M-Pesa credentials are encrypted and used only for STK Push and callback validation.
                      </p>
                   </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

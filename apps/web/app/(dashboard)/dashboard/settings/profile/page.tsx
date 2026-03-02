'use client';

import React, { useState, useEffect } from 'react';
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
  User, 
  Mail, 
  Lock, 
  Phone,
  Save,
  Loader2,
  UserCircle,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function UserProfilePage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: ''
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await api.get('/users/profile');
      setFormData(prev => ({
        ...prev,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        email: res.data.email,
        phone: res.data.phone || ''
      }));
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const { confirm_password, ...payload } = data;
      if (!payload.password) delete payload.password;
      return api.patch('/users/profile', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Your personal profile has been successfully updated.');
      setFormData(prev => ({ ...prev, password: '', confirm_password: '' }));
    }
  });

  if (isLoading || !user) return <PremiumLoader message="Syncing User Identity" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match.');
      return;
    }
    updateMutation.mutate(formData);
  };

  return (
    <DashboardShell className="animate-in fade-in duration-700 max-w-2xl mx-auto pb-12">
      <DashboardHeader 
        heading="Personal Terminal"
        text="Identity & Security Configuration"
      >
        <Button 
            onClick={handleSubmit} 
            disabled={updateMutation.isPending} 
            variant="premium"
            className="h-12 px-8 shadow-xl"
        >
          {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Update Profile
        </Button>
      </DashboardHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Identity Card */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-black text-slate-900">Institutional Identity</CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Primary contact and registry details</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                        id="first_name" 
                        className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                        value={formData.first_name} 
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                    />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
                <Input 
                  id="last_name" 
                  className="h-12 rounded-xl border-2 border-slate-50 font-bold"
                  value={formData.last_name} 
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                        <Input 
                            id="email" 
                            value={formData.email} 
                            disabled 
                            className="h-12 pl-12 rounded-xl border-2 border-slate-50 bg-slate-50 font-bold text-slate-400 cursor-not-allowed" 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Phone</Label>
                    <div className="relative group">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                        <Input 
                            id="phone" 
                            className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                            value={formData.phone} 
                            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                        />
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-black text-slate-900">Cryptographic Security</CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Update authentication credentials</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</Label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                        <Input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••"
                            className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm_password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Sequence</Label>
                    <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                        <Input 
                            id="confirm_password" 
                            type="password" 
                            placeholder="••••••••"
                            className="h-12 pl-12 rounded-xl border-2 border-slate-50 font-bold"
                            value={formData.confirm_password} 
                            onChange={(e) => setFormData({...formData, confirm_password: e.target.value})} 
                        />
                    </div>
                </div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 leading-relaxed">
                    Leave fields blank to maintain current secure credentials.
                </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </DashboardShell>
  );
}

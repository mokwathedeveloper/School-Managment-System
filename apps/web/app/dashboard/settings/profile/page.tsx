
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
  UserCircle
} from 'lucide-react';

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
      alert('Your personal profile has been successfully updated.');
      setFormData(prev => ({ ...prev, password: '', confirm_password: '' }));
    }
  });

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirm_password) {
      alert('Passwords do not match.');
      return;
    }
    updateMutation.mutate(formData);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <UserCircle className="h-8 w-8 text-primary" />
          My Profile
        </h1>
        <p className="text-muted-foreground mt-1">Manage your personal account details and security settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-sm border-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Basic details about your account identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input 
                  id="first_name" 
                  value={formData.first_name} 
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input 
                  id="last_name" 
                  value={formData.last_name} 
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" value={formData.email} disabled className="pl-10 bg-muted" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  className="pl-10"
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted/50 border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg">Security</CardTitle>
            <CardDescription>Update your account password. Leave blank to keep current.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="confirm_password" 
                  type="password" 
                  className="pl-10"
                  value={formData.confirm_password} 
                  onChange={(e) => setFormData({...formData, confirm_password: e.target.value})} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={updateMutation.isPending} className="shadow-lg min-w-[150px]">
            {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}

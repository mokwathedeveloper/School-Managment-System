'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Send, 
  Users, 
  MessageSquare, 
  Smartphone, 
  Mail, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function MessagingHub() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: 'PARENT',
    gradeId: '',
  });
  const [sentCount, setSentCount] = useState<number | null>(null);

  const { data: grades } = useQuery({
    queryKey: ['grade-levels'],
    queryFn: async () => {
      const res = await api.get('/grade-levels');
      return res.data;
    },
  });

  const broadcastMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/messaging/announcements', data);
      return res.data;
    },
    onSuccess: (data) => {
      setSentCount(data.sent);
      setFormData({ ...formData, title: '', message: '' });
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          Institutional Messaging
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">Broadcast announcements and personalized alerts via SMS/Email.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Composer */}
        <Card className="lg:col-span-2 shadow-lg border-muted/50 overflow-hidden">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle>Broadcast Composer</CardTitle>
            <CardDescription>Draft your message and select your target audience.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Broadcast Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Term 1 Resumption Date" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message Body</Label>
                <textarea 
                  id="message"
                  rows={5}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Type your announcement here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <p className="text-[10px] text-muted-foreground flex justify-between">
                  <span>Standard SMS characters: 160</span>
                  <span>{formData.message.length} characters</span>
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button 
                onClick={() => broadcastMutation.mutate(formData)}
                disabled={broadcastMutation.isPending || !formData.message}
                className="h-12 px-8 font-bold shadow-md"
              >
                {broadcastMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                Broadcast Announcement
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Targeting & Status */}
        <div className="space-y-6">
          <Card className="shadow-sm border-muted/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Role</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                >
                  <option value="PARENT">All Parents</option>
                  <option value="TEACHER">All Staff</option>
                  <option value="STUDENT">All Students</option>
                </select>
              </div>
              
              {formData.targetRole === 'PARENT' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label className="text-xs">Specific Grade (Optional)</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.gradeId}
                    onChange={(e) => setFormData({ ...formData, gradeId: e.target.value })}
                  >
                    <option value="">Whole School</option>
                    {grades?.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              )}
            </CardContent>
          </Card>

          {sentCount !== null && (
            <Card className="shadow-lg border-emerald-500 bg-emerald-50/50 animate-in zoom-in-95 duration-300">
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-lg font-black text-emerald-900">Broadcast Success!</h4>
                <p className="text-xs text-emerald-700 font-medium">Successfully dispatched {sentCount} messages.</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-emerald-800 font-bold mt-2"
                  onClick={() => setSentCount(null)}
                >
                  Clear Status
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-sm bg-blue-50/30 border-blue-100">
            <CardContent className="pt-6">
               <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-blue-900">SMS Credits</h4>
                    <p className="text-xs text-blue-700 leading-relaxed italic">
                      Institutional account balance: <span className="font-bold">KES 4,250.00</span> (~2,125 SMS).
                    </p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

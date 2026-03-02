'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useParams } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  School,
  Sparkles,
  Smartphone,
  Layers,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { FormSelect } from '@/components/ui/form-select';
import { cn } from '@/lib/utils';

export default function PublicApplicationPage() {
  const { slug } = useParams();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    applied_grade_id: '',
    parent_name: '',
    notes: ''
  });

  // 1. Fetch School Details (Public)
  const { data: school, isLoading: loadingSchool } = useQuery({
    queryKey: ['public-school', slug],
    queryFn: async () => {
      const res = await api.get(`/schools/slug/${slug}`);
      return res.data;
    },
    enabled: !!slug
  });

  const grades = school?.grades || [];

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/admissions/apply', {
        ...data,
        school_id: school.id
      });
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast.success('Your application has been successfully submitted.');
    },
    onError: (error: any) => {
      toast.error('Failed to submit application. Please check your details and try again.');
    }
  });

  if (loadingSchool) return <PremiumLoader fullScreen message="Initializing Admissions Portal" />;

  if (!school) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] organic-grain p-4">
        <Card className="max-w-md w-full text-center p-12 border-none shadow-2xl rounded-[2.5rem] bg-white">
          <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto mb-6 border border-slate-100">
            <School className="h-10 w-10 text-slate-200" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Portal Not Found</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">
            The institutional admissions terminal you are attempting to reach is currently inactive.
          </p>
          <Button variant="outline" className="mt-8 w-full rounded-xl" onClick={() => window.location.href = '/'}>Return Home</Button>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] organic-grain p-4">
        <Card className="max-w-xl w-full border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden animate-in zoom-in-95 duration-700">
          <div className="bg-slate-900 p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="h-32 w-32" />
            </div>
            <div className="h-24 w-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-600/40 mb-6 relative z-10 animate-bounce">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight relative z-10">Application Received</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 relative z-10">Institutional Processing Sequence Initialized</p>
          </div>
          <CardContent className="p-12 text-center space-y-6">
            <p className="text-slate-600 font-medium leading-relaxed italic text-lg">
              &quot;Thank you for choosing <strong>{school.name}</strong>. Our academic board will review your credentials and communicate the evaluation status to <strong>{formData.email}</strong> shortly.&quot;
            </p>
            <div className="pt-6 border-t border-slate-50">
                <Button variant="premium" className="h-14 px-10 rounded-2xl shadow-xl shadow-blue-600/20" onClick={() => window.location.reload()}>
                  New Application Terminal
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] organic-grain flex flex-col pb-12">
      {/* School Header */}
      <div className="bg-white border-b border-slate-100 py-10 px-4 text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="max-w-md mx-auto flex flex-col items-center gap-4 relative z-10">
          <div className="h-20 w-20 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-600/20 transition-premium hover:scale-110">
            {school.logo ? <img src={school.logo} alt="Logo" className="h-full w-full object-cover rounded-[2rem]" /> : <Building2 className="h-10 w-10" />}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{school.name}</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Official Admissions Node</span>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="flex-1 flex items-center justify-center p-4 pt-12">
        <Card className="max-w-xl w-full border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden group">
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileText className="h-24 w-24" />
            </div>
            <div className="relative z-10 flex justify-between items-center mb-4">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Student Application</CardTitle>
                <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Academic Registry Enrollment</CardDescription>
              </div>
              <Badge className="bg-white/10 text-white border-none font-black text-[10px] h-6 px-3 rounded-lg backdrop-blur-md">
                Phase {step} of 2
              </Badge>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden shadow-inner relative z-10">
              <div 
                className="h-full bg-blue-600 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]" 
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
          </div>

          <CardContent className="p-10 space-y-8">
            {step === 1 ? (
              <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Student First Name</Label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                        <Input 
                            id="first_name" 
                            placeholder="e.g. John" 
                            className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                            value={formData.first_name}
                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
                    <Input 
                      id="last_name" 
                      placeholder="Doe" 
                      className="h-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Applying For Grade</Label>
                  <FormSelect 
                    id="grade"
                    icon={<Layers className="h-4 w-4" />}
                    value={formData.applied_grade_id}
                    onChange={(e) => setFormData({...formData, applied_grade_id: e.target.value})}
                    required
                  >
                    <option value="">Select Target Level...</option>
                    {grades.map((g: any) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </FormSelect>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Additional Context (Optional)</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Previous school performance, medical notes, or special interests..."
                    className="min-h-[120px] p-4"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                <div className="space-y-2">
                  <Label htmlFor="parent_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Guardian Full Identity</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      id="parent_name" 
                      className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold" 
                      placeholder="e.g. Samuel Doe" 
                      value={formData.parent_name}
                      onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Contact Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      id="email" 
                      type="email"
                      className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-bold" 
                      placeholder="guardian@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Active Mobile Number</Label>
                  <div className="relative group">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      id="phone" 
                      type="tel"
                      className="h-12 pl-12 rounded-xl border-2 border-slate-50 focus:ring-blue-600/10 font-black tracking-widest" 
                      placeholder="+254..." 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 leading-relaxed">
                        Authorized contact details are required for institutional scheduling.
                    </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-8 border-t border-slate-50 flex justify-between bg-slate-50/30">
            {step === 2 ? (
              <>
                <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px]" onClick={() => setStep(1)}>Back</Button>
                <Button 
                  variant="premium"
                  onClick={() => submitMutation.mutate(formData)} 
                  disabled={submitMutation.isPending || !formData.email || !formData.phone}
                  className="h-12 px-8 rounded-xl shadow-xl shadow-blue-600/20"
                >
                  {submitMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  Submit Application
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setStep(2)} 
                disabled={!formData.first_name || !formData.last_name || !formData.applied_grade_id}
                className="ml-auto h-12 px-8 rounded-xl bg-slate-900 text-white hover:bg-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-900/10 group/btn"
              >
                Next Sequence <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-premium" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      <div className="text-center pb-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
        Secured by <strong>SchoolOS</strong> • Enterprise Node v1.4
      </div>
    </div>
  );
}

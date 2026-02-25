'use client';

import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  ShieldCheck, 
  Zap, 
  Users, 
  BarChart3, 
  CreditCard,
  ChevronRight,
  ArrowRight,
  Sparkles,
  BookOpen,
  PieChart,
  Building2,
  ChevronDown,
  HelpCircle,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const faqs = [
    {
      question: "Is my school's data secure?",
      answer: "Yes. We employ bank-grade encryption, regular security audits, and strict multi-tenant isolation. Your school's data is private, protected, and accessible only by authorized personnel."
    },
    {
      question: "How does the M-Pesa integration work?",
      answer: "We connect directly to your Safaricom Paybill via the Daraja API. When a parent pays via your Paybill number, our system receives a real-time callback and automatically reconciles the student's invoice."
    },
    {
      question: "Can we migrate our existing data?",
      answer: "Absolutely. Our smart bulk-onboarding engine allows you to upload CSV files for students, staff, and historical records. Our team also provides assisted migration services for complex datasets."
    },
    {
      question: "Does it support multiple curriculums?",
      answer: "SchoolOS is flexible. Whether you follow CBC, 8-4-4, British Curriculum (IGCSE), or any other system, our grading rubrics and report card templates can be customized to fit your academic standards."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-primary selection:text-white">
      {/* Floating Glass Navbar */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-2xl border border-slate-200/50 px-4 md:px-6 py-3 rounded-2xl shadow-2xl shadow-slate-900/5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg md:text-xl shadow-lg shadow-blue-600/20">
              <Building2 className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">SchoolOS</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors font-bold">Features</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors font-bold">Pricing</Link>
            <Link href="#faq" className="hover:text-blue-600 transition-colors font-bold">FAQ</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors px-2">Login</Link>
            <Link href="/login">
              <Button size="sm" className="rounded-xl px-4 md:px-5 font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white border-none text-xs md:text-sm">Get Started</Button>
            </Link>
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-6 text-base font-bold text-slate-600">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 flex items-center justify-between">
                Features <ChevronRight className="h-4 w-4" />
              </Link>
              <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 flex items-center justify-between">
                Pricing <ChevronRight className="h-4 w-4" />
              </Link>
              <Link href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 flex items-center justify-between">
                FAQ <ChevronRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="text-blue-600 pt-4 border-t flex items-center justify-between">
                Login to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Immersive Hero Section */}
      <header className="relative min-h-[100vh] flex items-center justify-center overflow-hidden py-24 lg:py-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/90 via-slate-900/60 to-slate-900/20 lg:to-transparent z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-100 animate-slow-zoom" 
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1523050335392-9bef867a0578?q=80&w=2070&auto=format&fit=crop")' 
            }} 
          />
        </div>

        <div className="container relative z-20 px-4 md:px-6 text-center text-white space-y-6 md:space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="mx-auto h-16 w-16 md:h-20 md:w-20 rounded-2xl md:rounded-3xl bg-blue-600/20 backdrop-blur-xl border border-white/30 flex items-center justify-center mb-2 md:mb-4 shadow-2xl">
             <Building2 className="h-8 w-8 md:h-10 md:w-10 text-white animate-pulse" />
          </div>
          <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 py-1 px-3 md:py-1.5 md:px-4 rounded-full mx-auto inline-flex items-center gap-2">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-yellow-400" />
            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-center">The Future of School Management</span>
          </Badge>
          
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.2] lg:leading-[1.1]">
            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Institutions</span> to Focus on Learning.
          </h1>
          
          <p className="text-base md:text-xl lg:text-2xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed px-4">
            A category-defining SMS for the modern era. Automate fees, sync grades, and engage parents—all in one unified operating system.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-4 px-6 sm:px-0">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-12 md:h-14 px-8 text-base md:text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform bg-blue-600 text-white border-none rounded-xl md:rounded-2xl">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 md:h-14 px-8 text-base md:text-lg font-bold backdrop-blur-md bg-white/10 text-white border-white/20 hover:bg-white hover:text-black transition-all rounded-xl md:rounded-2xl">
              Book a Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section id="features" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden px-4 md:px-6">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="container relative z-10 mx-auto">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">Everything your school needs.</h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto italic">Engineered for precision, designed for simplicity.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard 
              icon={<CreditCard className="h-6 w-6" />}
              title="Automated Finance"
              description="Real-time M-Pesa reconciliation and bulk invoicing. Stop revenue leakage forever."
              gradient="from-blue-500/20 to-blue-600/5"
              iconBg="bg-blue-600"
            />
            <FeatureCard 
              icon={<BarChart3 className="h-6 w-6" />}
              title="Academic Insights"
              description="Auto-grading rubrics and instant report card generation. Data-driven student tracking."
              gradient="from-emerald-500/20 to-emerald-600/5"
              iconBg="bg-emerald-600"
            />
            <FeatureCard 
              icon={<Users className="h-6 w-6" />}
              title="Parent Engagement"
              description="Dedicated portal for parents to track progress and pay fees with one click."
              gradient="from-purple-500/20 to-purple-600/5"
              iconBg="bg-purple-600"
            />
            <FeatureCard 
              icon={<Zap className="h-6 w-6" />}
              title="Real-time Attendance"
              description="Daily digital registers with instant SMS alerts to parents for absences."
              gradient="from-amber-500/20 to-amber-600/5"
              iconBg="bg-amber-600"
            />
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6" />}
              title="Smart Timetabling"
              description="Clash-free scheduling for classes, teachers, and rooms with AI optimization."
              gradient="from-rose-500/20 to-rose-600/5"
              iconBg="bg-rose-600"
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Enterprise Security"
              description="Bank-grade encryption and multi-tenant isolation. Your data is your fortress."
              gradient="from-indigo-500/20 to-indigo-600/5"
              iconBg="bg-indigo-600"
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section className="py-16 border-y bg-white px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            <StatItem label="Schools" value="500+" />
            <StatItem label="Students" value="1.2M" />
            <StatItem label="Volume" value="KES 4B" />
            <StatItem label="Satisfaction" value="99.9%" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-white relative overflow-hidden px-4 md:px-6">
        <div className="container relative z-10 mx-auto">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">Simple, transparent pricing.</h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">Plans tailored for every institution size.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              name="Starter"
              price="15,000"
              description="Perfect for small private schools."
              features={["Up to 200 Students", "Basic Finance", "Attendance", "Parent Portal"]}
            />
            <PricingCard 
              name="Professional"
              price="45,000"
              description="Our most popular plan for growing schools."
              features={["Up to 1000 Students", "Full M-Pesa Sync", "Exam Grading", "SMS Notifications"]}
              highlighted={true}
            />
            <PricingCard 
              name="Enterprise"
              price="Custom"
              description="For large multi-campus institutions."
              features={["Unlimited Students", "Custom Branding", "API Access", "Priority Support"]}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden px-4 md:px-6">
        <div className="container relative z-10 mx-auto">
          <div className="max-w-3xl mx-auto space-y-8 md:space-y-12">
            <div className="text-center space-y-4">
              <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/20 py-1 px-3 rounded-full mx-auto inline-flex items-center gap-2">
                <HelpCircle className="h-3 w-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Common Questions</span>
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Got Questions? We&apos;ve got answers.</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 shadow-sm"
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                  >
                    <span className="font-bold text-slate-900 text-sm md:text-base">{faq.question}</span>
                    <ChevronDown className={cn(
                      "h-5 w-5 text-slate-400 transition-transform duration-300 flex-shrink-0",
                      openFaq === index && "rotate-180"
                    )} />
                  </button>
                  <div className={cn(
                    "px-5 pb-5 md:px-6 md:pb-6 text-slate-600 text-sm md:text-base leading-relaxed transition-all duration-300",
                    openFaq === index ? "block animate-in fade-in slide-in-from-top-2" : "hidden"
                  )}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-600/20">
              <Building2 className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">SchoolOS</span>
          </div>
          <p className="text-slate-400 text-sm italic text-center md:text-left">© 2024 SchoolOS. Redefining educational management.</p>
          <div className="flex gap-6 text-sm font-bold text-slate-300">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({ name, price, description, features, highlighted }: any) {
  return (
    <div className={cn(
      "p-6 md:p-8 rounded-[2rem] border transition-all duration-300 flex flex-col relative",
      highlighted 
        ? "bg-slate-900 text-white border-slate-900 shadow-2xl lg:scale-105 z-10" 
        : "bg-white text-slate-900 border-slate-200 hover:border-blue-600/50"
    )}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl md:text-4xl font-black">KES {price}</span>
        {price !== "Custom" && <span className={cn("text-sm", highlighted ? "text-slate-400" : "text-slate-500")}>/term</span>}
      </div>
      <p className={cn("text-sm mb-8 md:h-10", highlighted ? "text-slate-400" : "text-slate-500")}>{description}</p>
      
      <div className="space-y-4 mb-10 flex-1">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
            {f}
          </div>
        ))}
      </div>

      <Button className={cn(
        "w-full h-12 rounded-xl font-bold transition-transform hover:scale-[1.02]",
        highlighted ? "bg-blue-600 hover:bg-blue-700 text-white border-none" : "border-slate-200"
      )} variant={highlighted ? "default" : "outline"}>
        Get Started
      </Button>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient, iconBg }: any) {
  return (
    <div className={cn(
      "relative group p-6 md:p-8 rounded-[2rem] border border-slate-200 bg-white transition-all duration-300 hover:shadow-2xl md:hover:-translate-y-2 overflow-hidden",
    )}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", gradient)} />
      
      <div className="relative z-10">
        <div className={cn("h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300", iconBg)}>
          {icon}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">{description}</p>
        
        <div className="mt-6 flex items-center text-blue-600 font-bold opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
          Learn More <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: any) {
  return (
    <div className="space-y-1">
      <p className="text-2xl md:text-4xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function Badge({ children, className }: any) {
  return (
    <div className={cn("border rounded-md px-2.5 py-0.5 text-xs font-semibold", className)}>
      {children}
    </div>
  );
}

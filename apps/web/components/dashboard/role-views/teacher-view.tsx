'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InsightCard } from '../insight-card';
import { 
  GraduationCap, 
  Activity, 
  Clock, 
  BookOpen,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TeacherView({ stats }: { stats: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InsightCard 
              title="Class Performance" 
              value="B+" 
              subValue="Current Subject Avg"
              icon={GraduationCap}
              trend="+0.4"
              trendType="up"
              color="blue"
          />
          <InsightCard 
              title="Subject Presence" 
              value={`${stats?.attendanceRate || 0}%`} 
              subValue="Compliance Index"
              icon={Activity}
              trend="Stable"
              trendType="neutral"
              color="indigo"
          />
          <InsightCard 
              title="Grading Queue" 
              value="12" 
              subValue="Pending Submissions"
              icon={Clock}
              trend="Priority High"
              trendType="down"
              color="orange"
          />
          <InsightCard 
              title="Active Lessons" 
              value="4" 
              subValue="Daily Sequence"
              icon={BookOpen}
              trend="On Schedule"
              trendType="up"
              color="emerald"
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">Active Lesson Stream</CardTitle>
                  <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Real-time classroom terminal</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-premium">
                          <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                          <h4 className="font-black text-lg leading-tight">Physics Unit 4: Thermodynamics</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grade 11-A • 10:30 HRS</p>
                      </div>
                  </div>
                  <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px]">
                      Initialize Session
                  </Button>
              </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-blue-600 text-white rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">Academic Momentum</CardTitle>
                  <CardDescription className="text-blue-100 font-bold uppercase tracking-widest text-[10px]">Summary of subject performance</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-premium">
                          <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                          <h4 className="font-black text-lg leading-tight">Subject GPA: 3.42</h4>
                          <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Global Curriculum Benchmark</p>
                      </div>
                  </div>
                  <Button className="w-full h-12 bg-black/20 hover:bg-black/30 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px]">
                      Analytical Brief
                  </Button>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

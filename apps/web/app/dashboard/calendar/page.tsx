'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Coffee,
  Trophy,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function InstitutionalCalendar() {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar-events', currentMonth.getMonth(), currentMonth.getFullYear()],
    queryFn: async () => {
      const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
      const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString();
      const res = await api.get(`/calendar?start=${start}&end=${end}`);
      return res.data;
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: async (data: any) => api.post('/calendar', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      toast.success('Event has been successfully scheduled and published to the institutional calendar.');
    }
  });

  const handleSchedule = () => {
    const title = window.prompt('Enter event title:');
    if (!title) return;
    const category = window.prompt('Enter category (ACADEMIC, HOLIDAY, SPORTS, EXAM, OTHER):');
    if (!category) return;
    const start_date = window.prompt('Enter start date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (!start_date) return;

    scheduleMutation.mutate({
      title,
      category: category.toUpperCase(),
      start_date: new Date(start_date).toISOString(),
      end_date: new Date(start_date).toISOString(),
      description: 'Institutional event',
    });
  };

  const categoryColors: any = {
    ACADEMIC: "bg-blue-100 text-blue-700 border-blue-200",
    HOLIDAY: "bg-emerald-100 text-emerald-700 border-emerald-200",
    SPORTS: "bg-orange-100 text-orange-700 border-orange-200",
    EXAM: "bg-rose-100 text-rose-700 border-rose-200",
    OTHER: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const categoryIcons: any = {
    ACADEMIC: <BookOpen className="h-4 w-4" />,
    HOLIDAY: <Coffee className="h-4 w-4" />,
    SPORTS: <Trophy className="h-4 w-4" />,
    EXAM: <Sparkles className="h-4 w-4" />,
    OTHER: <Bell className="h-4 w-4" />,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            School Calendar
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Central schedule for term dates, holidays, and events.</p>
        </div>
        <Button onClick={handleSchedule} disabled={scheduleMutation.isPending} className="shadow-md">
          {scheduleMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Schedule Event
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Monthly Summary sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm border-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-black">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase text-muted-foreground tracking-widest border-b pb-2">
                    <span>Quick Stats</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Academic</p>
                      <p className="text-xl font-black text-blue-900">{events?.filter((e: any) => e.category === 'ACADEMIC').length || 0}</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Holidays</p>
                      <p className="text-xl font-black text-emerald-900">{events?.filter((e: any) => e.category === 'HOLIDAY').length || 0}</p>
                    </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-muted/50 bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Stakeholder Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                All events scheduled here are automatically visible on Parent and Student portals. Term dates sync with automated fee invoicing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Event List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : events?.length === 0 ? (
            <Card className="h-64 flex flex-col items-center justify-center border-dashed text-muted-foreground">
              <Calendar className="h-12 w-12 opacity-10 mb-4" />
              <p>No events scheduled for this month.</p>
            </Card>
          ) : (
            events?.map((event: any) => (
              <Card key={event.id} className="shadow-sm hover:shadow-md transition-shadow group overflow-hidden border-muted/50">
                <div className="flex h-full">
                  <div className={cn("w-2", categoryColors[event.category].split(' ')[0].replace('bg-', 'bg-'))} />
                  <CardContent className="p-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-[10px] font-bold shadow-sm", categoryColors[event.category])}>
                          {categoryIcons[event.category]}
                          <span className="ml-1.5">{event.category}</span>
                        </Badge>
                        <span className="text-xs font-bold text-muted-foreground">{new Date(event.start_date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 italic">{event.description}</p>
                    </div>
                    <div className="flex flex-col md:items-end gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {event.is_all_day ? 'All Day' : `${new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

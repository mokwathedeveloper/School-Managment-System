'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Home, 
  Plus, 
  Bed, 
  Users, 
  Loader2,
  ChevronRight,
  ShieldAlert,
  Building,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { AddHostelDialog } from '@/components/dashboard/add-hostel-dialog';
import { AddRoomDialog } from '@/components/dashboard/add-room-dialog';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function HostelsPage() {
  const queryClient = useQueryClient();
  const [selectedHostelId, setSelectedHostelId] = useState('');

  const { data: hostels, isLoading: loadingHostels } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      const res = await api.get('/hostels');
      return res.data;
    },
  });

  const { data: rooms, isLoading: loadingRooms } = useQuery({
    queryKey: ['hostel-rooms', selectedHostelId],
    queryFn: async () => {
      if (!selectedHostelId) return null;
      const res = await api.get(`/hostels/${selectedHostelId}/rooms`);
      return res.data;
    },
    enabled: !!selectedHostelId,
  });

  if (loadingHostels) return <PremiumLoader message="Syncing Boarding Registry" />;

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Hostel & Boarding"
        text="Institutional Residency & Room Management"
      >
        <AddHostelDialog />
      </DashboardHeader>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Hostel List */}
        <Card className="md:col-span-1 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2rem] overflow-hidden h-fit">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Building Registry</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {hostels?.length === 0 ? (
                <div className="py-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-300 italic">No dormitories defined</div>
            ) : (
              hostels?.map((hostel: any) => (
                <button
                  key={hostel.id}
                  onClick={() => setSelectedHostelId(hostel.id)}
                  className={cn(
                    "w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 group",
                    selectedHostelId === hostel.id 
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]" 
                      : "bg-white border-slate-50 hover:border-blue-100 hover:bg-slate-50"
                  )}
                >
                  <div className="font-black text-sm tracking-tight flex items-center justify-between">
                    {hostel.name}
                    <Badge variant={selectedHostelId === hostel.id ? "secondary" : "outline"} className={cn(
                        "font-black text-[9px] uppercase border-none",
                        selectedHostelId === hostel.id ? "bg-white/20 text-white" : "text-slate-400 bg-slate-50"
                    )}>
                      {hostel.type}
                    </Badge>
                  </div>
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mt-1",
                    selectedHostelId === hostel.id ? "text-blue-100" : "text-slate-400"
                  )}>
                    {hostel._count.rooms} Units Logged
                  </p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Room Allocations Area */}
        <div className="md:col-span-3">
          {!selectedHostelId ? (
            <div className="h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-2 border-dashed border-slate-100">
                <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                    <Building className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase tracking-tighter">Manifest Inactive</h3>
                <p className="text-sm font-bold text-slate-400 max-w-xs uppercase tracking-widest leading-relaxed">
                    Select a target building from the left sidebar to initialize the residency terminal.
                </p>
            </div>
          ) : (
            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900">Room Residency Matrix</CardTitle>
                  <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Occupancy and scholar allocation for {hostels?.find((h: any) => h.id === selectedHostelId)?.name}</CardDescription>
                </div>
                <AddRoomDialog hostelId={selectedHostelId} />
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Room Identity</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Current Occupancy</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Scholar Manifest</TableHead>
                      <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingRooms ? (
                      <TableRow><TableCell colSpan={4} className="text-center h-64"><PremiumLoader message="Syncing manifest" /></TableCell></TableRow>
                    ) : rooms?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-64 text-center">
                                <div className="flex flex-col items-center gap-2 text-slate-300">
                                    <Bed className="h-12 w-12 opacity-20" />
                                    <p className="font-black uppercase tracking-widest text-xs">No Units Registered</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                      rooms?.map((room: any) => {
                        const occupancyRate = (room._count.students / room.capacity) * 100;
                        return (
                          <TableRow key={room.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                            <TableCell className="pl-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                                        {room.room_number[0]}
                                    </div>
                                    <span className="font-black text-slate-900 text-sm tracking-tight">{room.room_number}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2 w-32">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                  <span className="text-slate-400">{room._count.students} / {room.capacity}</span>
                                  <span className={cn(occupancyRate >= 90 ? "text-rose-600" : "text-emerald-600")}>{Math.round(occupancyRate)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                  <div 
                                    className={cn(
                                      "h-full transition-all duration-700",
                                      occupancyRate >= 90 ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                    )} 
                                    style={{ width: `${occupancyRate}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex -space-x-3 overflow-hidden group-hover:space-x-1 transition-all duration-500">
                                {room.students.map((student: any) => (
                                  <div key={student.id} className="inline-block h-9 w-9 rounded-xl ring-2 ring-white bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 shadow-sm transition-transform hover:scale-110 hover:z-10 cursor-pointer" title={`${student.user.first_name} ${student.user.last_name}`}>
                                    {student.user.first_name[0]}{student.user.last_name[0]}
                                  </div>
                                ))}
                                {room.students.length === 0 && <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Station Vacant</span>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-blue-600 transition-premium">
                                <ChevronRight className="h-5 w-5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

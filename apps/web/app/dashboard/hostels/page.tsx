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
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function HostelsPage() {
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Home className="h-8 w-8 text-primary" />
            Hostel & Boarding
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage dormitory buildings, room allocations, and student safety.</p>
        </div>
        <Button className="shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add New Hostel
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Hostel List */}
        <Card className="md:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Dormitories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loadingHostels ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /> : (
              hostels?.map((hostel: any) => (
                <button
                  key={hostel.id}
                  onClick={() => setSelectedHostelId(hostel.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border transition-all flex flex-col gap-1",
                    selectedHostelId === hostel.id 
                      ? "bg-primary border-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="font-bold flex items-center justify-between">
                    {hostel.name}
                    <Badge variant={selectedHostelId === hostel.id ? "secondary" : "outline"} className="text-[10px]">
                      {hostel.type}
                    </Badge>
                  </div>
                  <p className={cn("text-[10px] uppercase font-bold tracking-widest", selectedHostelId === hostel.id ? "text-white/70" : "text-muted-foreground")}>
                    {hostel._count.rooms} Rooms Total
                  </p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Room Allocations Area */}
        <div className="md:col-span-3">
          {!selectedHostelId ? (
            <Card className="h-[400px] flex flex-col items-center justify-center text-center text-muted-foreground border-dashed">
              <Building className="h-12 w-12 opacity-10 mb-4" />
              <p>Select a dormitory to view room availability and student manifests.</p>
            </Card>
          ) : (
            <Card className="shadow-sm border-muted/50 overflow-hidden">
              <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Room Inventory</CardTitle>
                  <CardDescription>Capacity and student allocation for {hostels?.find((h: any) => h.id === selectedHostelId)?.name}.</CardDescription>
                </div>
                <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" /> Add Room</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>Room No.</TableHead>
                      <TableHead>Occupancy</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingRooms ? (
                      <TableRow><TableCell colSpan={4} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
                    ) : (
                      rooms?.map((room: any) => {
                        const occupancyRate = (room._count.students / room.capacity) * 100;
                        return (
                          <TableRow key={room.id} className="hover:bg-muted/5">
                            <TableCell className="font-bold">{room.room_number}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1 w-24">
                                <div className="flex justify-between text-[10px] font-bold">
                                  <span>{room._count.students} / {room.capacity}</span>
                                  <span>{occupancyRate}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full transition-all duration-500",
                                      occupancyRate >= 90 ? "bg-rose-500" : "bg-emerald-500"
                                    )} 
                                    style={{ width: `${occupancyRate}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex -space-x-2 overflow-hidden">
                                {room.students.map((student: any) => (
                                  <div key={student.id} className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold" title={student.user.first_name}>
                                    {student.user.first_name[0]}
                                  </div>
                                ))}
                                {room.students.length === 0 && <span className="text-xs text-muted-foreground italic">Empty Room</span>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="hover:text-primary"><ChevronRight className="h-4 w-4" /></Button>
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
    </div>
  );
}

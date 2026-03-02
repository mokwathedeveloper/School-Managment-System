'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Bus, 
  Map, 
  Users, 
  Plus, 
  User, 
  Loader2,
  Navigation,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { AddTransportRouteDialog } from '@/components/dashboard/add-transport-route-dialog';
import { AddVehicleDialog } from '@/components/dashboard/add-vehicle-dialog';

export default function TransportPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'routes' | 'vehicles'>('routes');

  const { data: routes, isLoading: loadingRoutes } = useQuery({
    queryKey: ['transport-routes'],
    queryFn: async () => {
      const res = await api.get('/transport/routes');
      return res.data;
    },
  });

  const { data: vehicles, isLoading: loadingVehicles } = useQuery({
    queryKey: ['transport-vehicles'],
    queryFn: async () => {
      const res = await api.get('/transport/vehicles');
      return res.data;
    },
  });

  if (loadingRoutes || loadingVehicles) return <PremiumLoader message="Syncing Fleet Intelligence" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <Bus className="h-8 w-8 text-blue-600" />
            Transport Logistics
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Fleet Management & Zone Optimization</p>
        </div>
        <div className="flex items-center gap-3">
            {view === 'routes' ? <AddTransportRouteDialog /> : <AddVehicleDialog />}
        </div>
      </div>

      <div className="flex p-1 bg-white border shadow-sm rounded-2xl w-fit">
        <button 
          onClick={() => setView('routes')}
          className={cn(
            "px-8 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
            view === 'routes' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          Routes & Zones
        </button>
        <button 
          onClick={() => setView('vehicles')}
          className={cn(
            "px-8 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
            view === 'vehicles' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          Vehicle Fleet
        </button>
      </div>

      {view === 'routes' ? (
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Route Identity</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Operational Cost</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Coverage Stops</TableHead>
                  <TableHead className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400">Enrollment</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                            <Map className="h-12 w-12 opacity-20" />
                            <p className="font-black uppercase tracking-widest text-xs">No Routes Defined</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  routes?.map((route: any) => (
                    <TableRow key={route.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-all group-hover:scale-110">
                            <Navigation className="h-6 w-6" />
                          </div>
                          <span className="font-black text-slate-900 text-sm tracking-tight">{route.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-black text-slate-900">
                        <span className="text-[10px] text-slate-400 mr-1">KES</span>
                        {parseFloat(route.cost).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed max-w-[200px] truncate">{route.stops || 'Direct Route'}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-black text-[10px] bg-slate-50 text-slate-600 px-3 py-1 rounded-lg">
                            {route._count.students} Students
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-blue-600">
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Vehicle Unit</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Assigned Zone</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Personnel</TableHead>
                  <TableHead className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400">Capacity</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                            <Bus className="h-12 w-12 opacity-20" />
                            <p className="font-black uppercase tracking-widest text-xs">Fleet Empty</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicles?.map((vehicle: any) => (
                    <TableRow key={vehicle.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                                <Bus className="h-6 w-6" />
                            </div>
                            <span className="font-black text-slate-900 font-mono tracking-widest">{vehicle.reg_number}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-sm text-slate-700">
                        {vehicle.route?.name || <Badge variant="outline" className="text-[9px] uppercase border-dashed opacity-50">Unassigned</Badge>}
                      </TableCell>
                      <TableCell>
                        {vehicle.driver ? (
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <div className="h-2 w-2 rounded-full bg-blue-600" />
                            {vehicle.driver.user.first_name} {vehicle.driver.user.last_name}
                          </div>
                        ) : <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Awaiting Pilot</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                            <span className="font-black text-slate-900">{vehicle.capacity}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Seats</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-100 font-black uppercase tracking-widest text-[9px]">Edit Node</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

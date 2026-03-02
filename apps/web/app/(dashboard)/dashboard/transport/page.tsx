'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Bus, 
  MapPin, 
  Users, 
  Search, 
  Plus, 
  Navigation, 
  Clock, 
  ShieldCheck,
  Loader2,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AddTransportRouteDialog } from '@/components/dashboard/add-transport-route-dialog';
import { AddVehicleDialog } from '@/components/dashboard/add-vehicle-dialog';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { DashboardShell, DashboardHeader } from '@/components/dashboard/shell';

export default function TransportPage() {
  const [activeTab, setActiveTab] = useState<'routes' | 'vehicles'>('routes');

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

  if (loadingRoutes || loadingVehicles) return <PremiumLoader message="Syncing Transport Terminal" />;

  return (
    <DashboardShell className="animate-in fade-in duration-700">
      <DashboardHeader 
        heading="Fleet & Logistics"
        text="Route Optimization & Vehicle Monitoring"
      >
        <div className="flex gap-3">
            {activeTab === 'routes' ? <AddTransportRouteDialog /> : <AddVehicleDialog />}
        </div>
      </DashboardHeader>

      {/* Tab Selector */}
      <div className="flex p-1 bg-white border shadow-sm rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('routes')}
          className={cn(
            "px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2",
            activeTab === 'routes' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          <Navigation className="h-3.5 w-3.5" />
          Active Routes
        </button>
        <button 
          onClick={() => setActiveTab('vehicles')}
          className={cn(
            "px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2",
            activeTab === 'vehicles' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          <Bus className="h-3.5 w-3.5" />
          Institutional Fleet
        </button>
      </div>

      {activeTab === 'routes' ? (
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-black text-slate-900">Route Manifest</CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Managed transit corridors and pricing</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Route Identifier</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Assigned Fleet</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Subscription Fee</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Enrollment</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-64 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">No Routes Logged</TableCell></TableRow>
                ) : (
                  routes?.map((route: any) => (
                    <TableRow key={route.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-premium group-hover:scale-110">
                            <Navigation className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm">{route.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{route.description || 'Institutional Corridor'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {route.vehicle ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700 text-sm">{route.vehicle.plate_number}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{route.vehicle.model}</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-[9px] uppercase font-bold text-slate-300 border-dashed">Unassigned</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-black text-slate-900">
                            <span className="text-[10px] text-slate-400 font-bold">KES</span>
                            {Number(route.fee).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-600" />
                          <span className="font-black text-slate-900">{route._count?.students || 0}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Subscribers</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-blue-600 transition-premium">
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
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <CardTitle className="text-xl font-black text-slate-900">Vehicle Registry</CardTitle>
            <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Fleet configuration and operational status</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Fleet Asset</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Registration</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Capacity</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400 text-center">Status</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-64 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">Fleet Registry Clean</TableCell></TableRow>
                ) : (
                  vehicles?.map((vehicle: any) => (
                    <TableRow key={vehicle.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg transition-premium group-hover:scale-110">
                            <Bus className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm">{vehicle.model}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{vehicle.driver_name || 'Driver Unassigned'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 uppercase">
                          {vehicle.plate_number}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-slate-300" />
                          <span className="font-black text-slate-700">{vehicle.capacity}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Seats</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg">
                          OPERATIONAL
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-blue-600 transition-premium">
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
      )}
    </DashboardShell>
  );
}

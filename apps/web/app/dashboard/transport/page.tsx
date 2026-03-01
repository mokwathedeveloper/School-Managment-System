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
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

  const createRouteMutation = useMutation({
    mutationFn: async (data: any) => api.post('/transport/routes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-routes'] });
      alert('Transport route created successfully.');
    }
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (data: any) => api.post('/transport/vehicles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport-vehicles'] });
      alert('Vehicle added to fleet successfully.');
    }
  });

  const handleAdd = () => {
    if (view === 'routes') {
      const name = window.prompt('Enter route name:');
      if (!name) return;
      const cost = window.prompt('Enter cost per term (KES):');
      if (!cost) return;
      const stops = window.prompt('Enter stops (comma separated):');

      createRouteMutation.mutate({ name, cost: parseFloat(cost), stops });
    } else {
      const reg_number = window.prompt('Enter vehicle registration number:');
      if (!reg_number) return;
      const capacity = window.prompt('Enter passenger capacity:');
      if (!capacity) return;

      createVehicleMutation.mutate({ reg_number, capacity: parseInt(capacity) });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bus className="h-8 w-8 text-primary" />
            Transport & Logistics
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage bus routes, fleet assignments, and student transport.</p>
        </div>
        <Button onClick={handleAdd} disabled={createRouteMutation.isPending || createVehicleMutation.isPending} className="shadow-md">
          {createRouteMutation.isPending || createVehicleMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          {view === 'routes' ? 'Create Route' : 'Add Vehicle'}
        </Button>
      </div>

      <div className="flex p-1 bg-muted/50 rounded-xl w-fit border shadow-inner">
        <button 
          onClick={() => setView('routes')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
            view === 'routes' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Map className="h-4 w-4" />
          Routes & Zones
        </button>
        <button 
          onClick={() => setView('vehicles')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
            view === 'vehicles' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Bus className="h-4 w-4" />
          Vehicle Fleet
        </button>
      </div>

      {view === 'routes' ? (
        <Card className="shadow-sm border-muted/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Route Name</TableHead>
                <TableHead>Cost (Termly)</TableHead>
                <TableHead>Stops</TableHead>
                <TableHead className="text-center">Assigned Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingRoutes ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
              ) : routes?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-48">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Map className="h-12 w-12 opacity-20 mb-4" />
                      <p className="font-bold text-lg text-slate-900">No transport routes defined.</p>
                      <p className="text-sm max-w-sm mx-auto mb-4">Create routes to manage student zones and automate transport fee billing.</p>
                      <Button variant="outline">Create First Route</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                routes?.map((route: any) => (
                  <TableRow key={route.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Navigation className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-sm">{route.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">KES {parseFloat(route.cost).toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{route.stops || 'Direct Route'}</TableCell>
                    <TableCell className="text-center font-black">{route._count.students}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="font-bold">Edit Route</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="shadow-sm border-muted/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Registration No.</TableHead>
                <TableHead>Assigned Route</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead className="text-center">Capacity</TableHead>
                <TableHead className="text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingVehicles ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
              ) : vehicles?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-48">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Bus className="h-12 w-12 opacity-20 mb-4" />
                      <p className="font-bold text-lg text-slate-900">Fleet is empty.</p>
                      <p className="text-sm max-w-sm mx-auto mb-4">Register school buses and vans to track capacity and driver assignments.</p>
                      <Button variant="outline">Add Vehicle</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                vehicles?.map((vehicle: any) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs bg-slate-50">{vehicle.reg_number}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {vehicle.route?.name || <span className="text-muted-foreground italic">Unassigned</span>}
                    </TableCell>
                    <TableCell>
                      {vehicle.driver ? (
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 opacity-50" />
                          <span className="text-sm">{vehicle.driver.user.first_name} {vehicle.driver.user.last_name}</span>
                        </div>
                      ) : <span className="text-xs text-rose-500 font-bold">No Driver</span>}
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-700">{vehicle.capacity} Seats</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

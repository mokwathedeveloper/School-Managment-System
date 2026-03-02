'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Package, 
  Box, 
  Search, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  AlertTriangle,
  Loader2,
  Monitor,
  Layout,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { AddAssetDialog } from '@/components/dashboard/add-asset-dialog';
import { AddStockItemDialog } from '@/components/dashboard/add-stock-item-dialog';

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'assets' | 'stock'>('assets');

  const { data: assets, isLoading: loadingAssets } = useQuery({
    queryKey: ['inventory-assets'],
    queryFn: async () => {
      const res = await api.get('/inventory/assets');
      return res.data;
    },
  });

  const { data: stock, isLoading: loadingStock } = useQuery({
    queryKey: ['inventory-stock'],
    queryFn: async () => {
      const res = await api.get('/inventory/stock');
      return res.data;
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, change }: { id: string, change: number }) => {
      return api.patch(`/inventory/stock/${id}/quantity`, { change });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-stock'] });
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            Inventory & Assets
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Track school property and manage consumable supplies.</p>
        </div>
        <div className="flex gap-2">
            {activeTab === 'assets' ? <AddAssetDialog /> : <AddStockItemDialog />}
        </div>
      </div>

      {/* Custom Tab Switcher */}
      <div className="flex p-1 bg-white rounded-2xl w-fit border shadow-sm">
        <button 
          onClick={() => setActiveTab('assets')}
          className={cn(
            "px-8 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
            activeTab === 'assets' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          Institutional Assets
        </button>
        <button 
          onClick={() => setActiveTab('stock')}
          className={cn(
            "px-8 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
            activeTab === 'stock' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          Consumable Stock
        </button>
      </div>

      {activeTab === 'assets' ? (
        <Card className="shadow-xl border-none bg-white overflow-hidden rounded-[2rem]">
          <Table>
            <TableHeader className="bg-slate-50/50 border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-8 font-black uppercase tracking-widest text-[10px]">Asset Description</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Classification</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Current Location</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px]">Operational Status</TableHead>
                <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px]">Registry Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingAssets ? (
                <TableRow><TableCell colSpan={5} className="text-center h-64"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-20"/></TableCell></TableRow>
              ) : assets?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-64 text-slate-400 font-bold uppercase tracking-widest text-xs italic">Registry Empty</TableCell></TableRow>
              ) : (
                assets?.map((asset: any) => (
                  <TableRow key={asset.id} className="hover:bg-slate-50/50 transition-colors border-b-slate-50">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                          <Monitor className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{asset.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{asset.serial_no || 'Permanent Item'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-black text-[10px] px-2.5">
                            {asset.category}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        {asset.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-black text-[10px] border-none shadow-sm px-3 py-1 rounded-lg",
                        asset.status === 'OPERATIONAL' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-primary">Inspect</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid gap-8">
          {/* Stock Low Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {stock?.filter((s: any) => s.quantity <= s.min_quantity).map((s: any) => (
               <Card key={s.id} className="border-none shadow-lg shadow-rose-500/5 bg-rose-50/50 rounded-2xl overflow-hidden relative group">
                 <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
                 <CardContent className="p-5 flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Critical Level</p>
                       <h4 className="font-black text-slate-900">{s.name}</h4>
                       <p className="text-xs font-bold text-rose-500">{s.quantity} {s.unit} remaining</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-rose-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                 </CardContent>
               </Card>
             ))}
          </div>

          <Card className="shadow-xl border-none bg-white overflow-hidden rounded-[2rem]">
            <Table>
              <TableHeader className="bg-slate-50/50 border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 font-black uppercase tracking-widest text-[10px]">Supply Item</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px]">Classification</TableHead>
                  <TableHead className="text-center font-black uppercase tracking-widest text-[10px]">Available Balance</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px]">Inventory Controls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingStock ? (
                  <TableRow><TableCell colSpan={4} className="text-center h-64"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary opacity-20"/></TableCell></TableRow>
                ) : (
                  stock?.map((item: any) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-b-slate-50">
                      <TableCell className="pl-8 py-5 font-black text-slate-900">{item.name}</TableCell>
                      <TableCell>
                          <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter border-slate-200">
                              {item.category}
                          </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className={cn(
                            "text-2xl font-black tracking-tighter",
                            item.quantity <= item.min_quantity ? "text-rose-600" : "text-slate-900"
                          )}>
                            {item.quantity}
                          </span>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-3">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all active:scale-95"
                            onClick={() => updateStockMutation.mutate({ id: item.id, change: -1 })}
                          >
                            <ArrowDown className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all active:scale-95"
                            onClick={() => updateStockMutation.mutate({ id: item.id, change: 1 })}
                          >
                            <ArrowUp className="h-5 w-5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}

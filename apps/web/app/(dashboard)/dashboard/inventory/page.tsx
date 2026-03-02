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
  ClipboardList,
  Filter,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { AddAssetDialog } from '@/components/dashboard/add-asset-dialog';
import { AddStockItemDialog } from '@/components/dashboard/add-stock-item-dialog';
import { PremiumLoader } from '@/components/ui/premium-loader';

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

  if (loadingAssets || loadingStock) return <PremiumLoader message="Auditing Institutional Assets" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            Property & Assets
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Inventory Management & Supply Chain Registry</p>
        </div>
        <div className="flex gap-3">
            {activeTab === 'assets' ? <AddAssetDialog /> : <AddStockItemDialog />}
        </div>
      </div>

      {/* Custom Tab Switcher */}
      <div className="flex p-1 bg-white border shadow-sm rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('assets')}
          className={cn(
            "px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2",
            activeTab === 'assets' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          <Monitor className="h-3.5 w-3.5" />
          Fixed Assets
        </button>
        <button 
          onClick={() => setActiveTab('stock')}
          className={cn(
            "px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2",
            activeTab === 'stock' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          <Box className="h-3.5 w-3.5" />
          Consumable Stock
        </button>
      </div>

      {activeTab === 'assets' ? (
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
                <CardTitle className="text-xl font-black text-slate-900">Asset Registry</CardTitle>
                <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Managed institutional property and equipment</CardDescription>
            </div>
            <div className="relative w-full max-w-sm group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input 
                    placeholder="Search registry..." 
                    className="pl-12 h-11 rounded-xl border-2 border-slate-50 bg-white focus:ring-blue-600/10 font-bold"
                />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Asset Description</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Classification</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Location</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400 text-center">Status</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-64 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">Registry Empty</TableCell></TableRow>
                ) : (
                  assets?.map((asset: any) => (
                    <TableRow key={asset.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm transition-premium group-hover:scale-110">
                            <Monitor className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm">{asset.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{asset.serial_no || 'Permanent Item'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                          <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg">
                              {asset.category}
                          </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <MapPin className="h-3.5 w-3.5 text-blue-400" />
                          {asset.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "font-black text-[9px] uppercase tracking-widest border-none shadow-sm px-3 py-1 rounded-lg",
                          asset.status === 'OPERATIONAL' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                          {asset.status}
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
      ) : (
        <div className="space-y-8">
          {/* Stock Low Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {stock?.filter((s: any) => s.quantity <= s.min_quantity).map((s: any) => (
               <Card key={s.id} className="border-none shadow-xl shadow-rose-500/5 bg-rose-50/50 rounded-[2rem] overflow-hidden relative group">
                 <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
                 <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">Critical Balance</p>
                       <h4 className="font-black text-slate-900 tracking-tight">{s.name}</h4>
                       <p className="text-xs font-bold text-rose-500 italic">{s.quantity} {s.unit} remaining</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-rose-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                 </CardContent>
               </Card>
             ))}
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-black text-slate-900">Supply Inflow/Outflow</CardTitle>
                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Consumable resource tracking and unit balances</CardDescription>
                </div>
                <div className="relative w-full max-w-sm group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                        placeholder="Search stock items..." 
                        className="pl-12 h-11 rounded-xl border-2 border-slate-50 bg-white focus:ring-blue-600/10 font-bold"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Supply Identifier</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Category</TableHead>
                    <TableHead className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400">Available Balance</TableHead>
                    <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Inventory Control</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stock?.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="h-64 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">Inventory Registry Clean</TableCell></TableRow>
                  ) : (
                    stock?.map((item: any) => (
                      <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                        <TableCell className="pl-8 py-5">
                            <div className="font-black text-slate-900 text-sm tracking-tight">{item.name}</div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Unit: {item.unit}</p>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest border-slate-200 text-slate-500 rounded-lg">
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
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{item.unit}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex items-center justify-end gap-3">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl border-slate-100 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
                              onClick={() => updateStockMutation.mutate({ id: item.id, change: -1 })}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-90"
                              onClick={() => updateStockMutation.mutate({ id: item.id, change: 1 })}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

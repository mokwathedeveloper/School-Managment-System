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

  const addAssetMutation = useMutation({
    mutationFn: async (data: any) => api.post('/inventory/assets', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-assets'] });
      toast.success('Asset has been successfully registered in the institutional registry.');
    }
  });

  const addStockMutation = useMutation({
    mutationFn: async (data: any) => api.post('/inventory/stock', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-stock'] });
      toast.success('Stock item has been successfully added to the inventory.');
    }
  });

  const handleAdd = () => {
    if (activeTab === 'assets') {
      const name = window.prompt('Enter asset name:');
      if (!name) return;
      const category = window.prompt('Enter category (e.g. FURNITURE, IT, LAB):');
      if (!category) return;
      const location = window.prompt('Enter location:');
      if (!location) return;

      addAssetMutation.mutate({ name, category, location, status: 'OPERATIONAL' });
    } else {
      const name = window.prompt('Enter stock item name:');
      if (!name) return;
      const category = window.prompt('Enter category:');
      if (!category) return;
      const unit = window.prompt('Enter unit (e.g. PCS, KG):');
      if (!unit) return;
      const quantity = window.prompt('Enter initial quantity:');
      if (!quantity) return;

      addStockMutation.mutate({ 
        name, 
        category, 
        unit, 
        quantity: parseInt(quantity),
        min_quantity: 5 
      });
    }
  };

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
        <Button onClick={handleAdd} disabled={addAssetMutation.isPending || addStockMutation.isPending} className="shadow-md">
          {addAssetMutation.isPending || addStockMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          {activeTab === 'assets' ? 'Add New Asset' : 'Add Stock Item'}
        </Button>
      </div>

      {/* Custom Tab Switcher */}
      <div className="flex p-1 bg-muted/50 rounded-xl w-fit border shadow-inner">
        <button 
          onClick={() => setActiveTab('assets')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-lg transition-all",
            activeTab === 'assets' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Institutional Assets
        </button>
        <button 
          onClick={() => setActiveTab('stock')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-lg transition-all",
            activeTab === 'stock' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Consumable Stock
        </button>
      </div>

      {activeTab === 'assets' ? (
        <Card className="shadow-sm border-muted/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingAssets ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
              ) : assets?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32 text-muted-foreground italic">No assets registered yet.</TableCell></TableRow>
              ) : (
                assets?.map((asset: any) => (
                  <TableRow key={asset.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <Monitor className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{asset.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">{asset.serial_no || 'No Serial'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{asset.category}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {asset.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-bold text-[10px] border-none shadow-sm",
                        asset.status === 'OPERATIONAL' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                      )}>
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="font-bold">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Stock Low Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {stock?.filter((s: any) => s.quantity <= s.min_quantity).map((s: any) => (
               <Card key={s.id} className="border-l-4 border-l-rose-500 bg-rose-50/30">
                 <CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Low Stock Alert</p>
                       <h4 className="font-bold text-sm">{s.name}</h4>
                       <p className="text-xs text-rose-600 font-bold">Current: {s.quantity} {s.unit}</p>
                    </div>
                    <AlertTriangle className="h-6 w-6 text-rose-500 opacity-50" />
                 </CardContent>
               </Card>
             ))}
          </div>

          <Card className="shadow-sm border-muted/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Stock Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Balance</TableHead>
                  <TableHead className="text-right">Manage Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingStock ? (
                  <TableRow><TableCell colSpan={4} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
                ) : (
                  stock?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold">{item.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] uppercase font-bold">{item.category}</Badge></TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className={cn(
                            "text-lg font-black",
                            item.quantity <= item.min_quantity ? "text-rose-600" : "text-slate-900"
                          )}>
                            {item.quantity}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold">{item.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600"
                            onClick={() => updateStockMutation.mutate({ id: item.id, change: -1 })}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600"
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
          </Card>
        </div>
      )}
    </div>
  );
}

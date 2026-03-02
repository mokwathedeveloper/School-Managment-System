'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InsightCard } from '../insight-card';
import { 
  BookOpen, 
  History, 
  Search, 
  Plus,
  ArrowRightLeft,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LibrarianView({ stats }: { stats: any }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InsightCard 
              title="Total Catalog" 
              value={stats?.libraryAssets || "1,240"} 
              subValue="Indexed Resources"
              icon={BookOpen}
              trend="+12"
              trendType="up"
              color="blue"
          />
          <InsightCard 
              title="Active Borrows" 
              value={stats?.activeBorrows || "42"} 
              subValue="Current Circulations"
              icon={ArrowRightLeft}
              trend="Stable"
              trendType="neutral"
              color="indigo"
          />
          <InsightCard 
              title="Overdue Items" 
              value="8" 
              subValue="Registry Penalties"
              icon={AlertCircle}
              trend="High Priority"
              trendType="down"
              color="rose"
          />
          <InsightCard 
              title="Registry Sync" 
              value="99%" 
              subValue="Digital Compliance"
              icon={History}
              trend="Optimized"
              trendType="up"
              color="emerald"
          />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight">Circulation Terminal</CardTitle>
                  <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Real-time asset movement control</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-premium">
                          <Search className="h-6 w-6 text-white" />
                      </div>
                      <div>
                          <h4 className="font-black text-lg leading-tight">Asset Retrieval Node</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scan barcode to initialize checkout</p>
                      </div>
                  </div>
                  <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px]">
                      Open Scanner
                  </Button>
              </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white border border-slate-100 rounded-[2rem] overflow-hidden group">
              <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black tracking-tight text-slate-900">Registry Updates</CardTitle>
                  <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Recent catalog modifications</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-premium">
                          <Plus className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                          <h4 className="font-black text-lg leading-tight text-slate-900">Index New Resource</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digitalize institutional literature</p>
                      </div>
                  </div>
                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-600/20">
                      Catalog Entry
                  </Button>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

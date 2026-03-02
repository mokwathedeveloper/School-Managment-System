'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Book, 
  Search, 
  Plus, 
  Library, 
  User, 
  Clock, 
  CheckCircle2, 
  Loader2,
  Bookmark,
  History,
  RotateCcw,
  Filter,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { PremiumLoader } from '@/components/ui/premium-loader';
import { AddBookDialog } from '@/components/dashboard/add-book-dialog';
import { BorrowBookDialog } from '@/components/dashboard/borrow-book-dialog';

export default function LibraryPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'catalog' | 'borrows'>('catalog');

  const { data: books, isLoading: loadingCatalog } = useQuery({
    queryKey: ['library-catalog'],
    queryFn: async () => {
      const res = await api.get('/library/catalog');
      return res.data;
    },
  });

  const { data: borrows, isLoading: loadingBorrows } = useQuery({
    queryKey: ['library-borrows'],
    queryFn: async () => {
      const res = await api.get('/library/borrows/active');
      return res.data;
    },
  });

  const returnMutation = useMutation({
    mutationFn: async (copyId: string) => {
      return api.patch(`/library/return/${copyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-borrows'] });
      queryClient.invalidateQueries({ queryKey: ['library-catalog'] });
      toast.success('Book copy has been successfully returned to the repository.');
    }
  });

  if (loadingCatalog || loadingBorrows) return <PremiumLoader message="Syncing Resource Repository" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-3">
            <Library className="h-8 w-8 text-blue-600" />
            Library Terminal
          </h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Resource Repository & Circulation Management</p>
        </div>
        <div className="flex items-center gap-3">
            {view === 'catalog' ? <AddBookDialog /> : <BorrowBookDialog />}
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex p-1 bg-white border shadow-sm rounded-2xl w-fit">
        <button 
          onClick={() => setView('catalog')}
          className={cn(
            "px-8 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2",
            view === 'catalog' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          <Book className="h-4 w-4" />
          Collection Catalog
        </button>
        <button 
          onClick={() => setView('borrows')}
          className={cn(
            "px-8 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2",
            view === 'borrows' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          )}
        >
          <History className="h-4 w-4" />
          Active Circulation
        </button>
      </div>

      {view === 'catalog' ? (
        <div className="grid gap-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-none">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <Input 
                placeholder="Search catalog by title, author, or ISBN..." 
                className="pl-12 h-12 rounded-2xl border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-blue-600/10 font-bold"
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-slate-100">
                <Filter className="h-4 w-4 text-slate-400" />
            </Button>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Book Identification</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Primary Author</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Classification</TableHead>
                    <TableHead className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400">Inventory</TableHead>
                    <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                            <Book className="h-12 w-12 opacity-20" />
                            <p className="font-black uppercase tracking-widest text-xs">Catalog Empty</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    books?.map((book: any) => (
                      <TableRow key={book.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                        <TableCell className="pl-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-all">
                              <Bookmark className="h-5 w-5 opacity-40" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-sm leading-tight">{book.title}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{book.isbn || 'No ISBN Registry'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-slate-700 text-sm">{book.author}</TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="font-black text-[9px] uppercase tracking-widest bg-slate-50 text-slate-500 border-none px-2 py-0.5 rounded-lg">
                                {book.category}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                                <span className="font-black text-slate-900">{book._count.copies}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Copies</span>
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
        </div>
      ) : (
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Scholar Borrower</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Borrowed Asset</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Return Deadline</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-slate-400">Circulation Status</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Registry Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrows?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                            <History className="h-12 w-12 opacity-20" />
                            <p className="font-black uppercase tracking-widest text-xs">No Active Circulation</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  borrows?.map((record: any) => {
                    const isOverdue = new Date(record.due_date) < new Date();
                    return (
                      <TableRow key={record.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b-slate-50">
                        <TableCell className="pl-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                              {record.student.user.first_name[0]}{record.student.user.last_name[0]}
                            </div>
                            <span className="font-black text-slate-900 text-sm">{record.student.user.first_name} {record.student.user.last_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-slate-700 text-sm">{record.copy.book.title}</div>
                          <div className="text-[10px] font-bold text-blue-600 font-mono tracking-tighter uppercase mt-0.5">BC: {record.copy.barcode}</div>
                        </TableCell>
                        <TableCell>
                          <div className={cn(
                            "flex items-center gap-2 text-xs font-black uppercase tracking-tighter",
                            isOverdue ? "text-rose-600" : "text-slate-500"
                          )}>
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(record.due_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "font-black text-[9px] uppercase tracking-widest border-none shadow-sm px-3 py-1 rounded-lg",
                            isOverdue ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                          )}>
                            {isOverdue ? 'OVERDUE' : 'BORROWED'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-4 rounded-xl border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 font-black uppercase tracking-widest text-[9px]"
                            onClick={() => returnMutation.mutate(record.copy_id)}
                            disabled={returnMutation.isPending}
                          >
                            <RotateCcw className="h-3 w-3 mr-2" /> Mark Returned
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
  );
}

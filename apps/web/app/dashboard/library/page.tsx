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
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

  const addTitleMutation = useMutation({
    mutationFn: async (data: any) => api.post('/library/catalog', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-catalog'] });
      alert('New book title has been successfully added to the catalog.');
    }
  });

  const borrowMutation = useMutation({
    mutationFn: async (data: any) => api.post('/library/borrows', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-borrows'] });
      alert('Borrowing transaction has been successfully recorded.');
    }
  });

  const handleAdd = () => {
    if (view === 'catalog') {
      const title = window.prompt('Enter book title:');
      if (!title) return;
      const author = window.prompt('Enter author:');
      if (!author) return;
      const category = window.prompt('Enter category:');
      if (!category) return;

      addTitleMutation.mutate({ title, author, category });
    } else {
      const student_id = window.prompt('Enter student UUID:');
      if (!student_id) return;
      const barcode = window.prompt('Enter book copy barcode:');
      if (!barcode) return;

      borrowMutation.mutate({ 
        student_id, 
        barcode,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
  };

  const returnMutation = useMutation({
    mutationFn: async (copyId: string) => {
      return api.patch(`/library/return/${copyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-borrows'] });
      queryClient.invalidateQueries({ queryKey: ['library-catalog'] });
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Library className="h-8 w-8 text-primary" />
            Library Resource Hub
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage book collections, individual copies, and track student borrowing.</p>
        </div>
        <Button onClick={handleAdd} disabled={addTitleMutation.isPending || borrowMutation.isPending} className="shadow-md">
          {addTitleMutation.isPending || borrowMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          {view === 'catalog' ? 'Add New Title' : 'New Borrowing'}
        </Button>
      </div>

      {/* Tab Selector */}
      <div className="flex p-1 bg-muted/50 rounded-xl w-fit border shadow-inner">
        <button 
          onClick={() => setView('catalog')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
            view === 'catalog' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Book className="h-4 w-4" />
          Book Catalog
        </button>
        <button 
          onClick={() => setView('borrows')}
          className={cn(
            "px-6 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
            view === 'borrows' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <History className="h-4 w-4" />
          Active Borrows
        </button>
      </div>

      {view === 'catalog' ? (
        <div className="grid gap-6">
          <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search catalog by title, author, or ISBN..." className="pl-10" />
            </div>
          </div>

          <Card className="shadow-sm border-muted/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Total Copies</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingCatalog ? (
                  <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
                ) : (
                  books?.map((book: any) => (
                    <TableRow key={book.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-8 rounded bg-primary/5 flex items-center justify-center border-l-4 border-l-primary shadow-sm">
                            <Bookmark className="h-4 w-4 text-primary opacity-40" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{book.title}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{book.isbn || 'No ISBN'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{book.author}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{book.category}</Badge></TableCell>
                      <TableCell className="text-center font-black">{book._count.copies}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="font-bold">Manage Copies</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      ) : (
        <Card className="shadow-sm border-muted/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Book Borrowed</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Return</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingBorrows ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/></TableCell></TableRow>
              ) : borrows?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center h-32 text-muted-foreground italic">No books are currently borrowed.</TableCell></TableRow>
              ) : (
                borrows?.map((record: any) => {
                  const isOverdue = new Date(record.due_date) < new Date();
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                            {record.student.user.first_name[0]}{record.student.user.last_name[0]}
                          </div>
                          <span className="font-bold text-sm">{record.student.user.first_name} {record.student.user.last_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{record.copy.book.title}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{record.copy.barcode}</div>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "flex items-center gap-2 text-sm font-bold",
                          isOverdue ? "text-rose-600" : "text-slate-700"
                        )}>
                          <Clock className="h-3 w-3" />
                          {new Date(record.due_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-bold text-[10px] border-none shadow-sm",
                          isOverdue ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {isOverdue ? 'OVERDUE' : 'BORROWED'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="hover:bg-emerald-50 hover:text-emerald-600 font-bold"
                          onClick={() => returnMutation.mutate(record.copy_id)}
                          disabled={returnMutation.isPending}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" /> Mark Returned
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

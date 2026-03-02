'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUp, Loader2, CheckCircle2, AlertCircle, Download, Database } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { DialogShell } from '@/components/ui/dialog-shell';

export function BulkImportDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Mocking parsed data for demo
      setData([
        { first_name: 'John', last_name: 'Doe', email: 'john@example.com', admission_no: 'S001' },
        { first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', admission_no: 'S002' },
      ]);
    }
  };

  const importMutation = useMutation({
    mutationFn: async (students: any[]) => {
      const res = await apiClient.post('/students/bulk-import', { students });
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setResult(res);
      toast.success('Bulk synchronization sequence complete.');
    }
  });

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] border-slate-200"
      >
        <FileUp className="mr-2 h-4 w-4" />
        Bulk Registry Sync
      </Button>

      <DialogShell
        open={open}
        onOpenChange={setOpen}
        title="Bulk Data Ingestion"
        description="Synchronize institutional student records via CSV"
        icon={Database}
      >
        {!result ? (
          <div className="space-y-8 bg-white">
            <div className="border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center hover:border-blue-200 transition-all group cursor-pointer bg-slate-50/30">
              <input 
                type="file" 
                id="bulk-file" 
                className="hidden" 
                accept=".csv"
                onChange={handleFileChange}
              />
              <label htmlFor="bulk-file" className="cursor-pointer flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors border border-slate-100">
                    <FileUp className="h-8 w-8" />
                </div>
                <div>
                    <p className="font-black text-slate-900">Select Registry Source</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Accepts UTF-8 Encoded .CSV files</p>
                </div>
              </label>
              {file && (
                <div className="mt-6 p-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-tighter inline-flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" />
                    {file.name} (Buffered)
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-14 rounded-2xl gap-2 font-black uppercase tracking-widest text-[10px]">
                    <Download className="h-4 w-4" />
                    Template.csv
                </Button>
                <Button 
                    className="h-14 rounded-2xl shadow-xl shadow-blue-600/20" 
                    variant="premium"
                    disabled={!file || importMutation.isPending}
                    onClick={() => importMutation.mutate(data)}
                >
                    {importMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
                    Execute Sync
                </Button>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white space-y-6">
            <div className="h-20 w-20 rounded-[2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
                <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sync Sequence Complete</h3>
                <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Imported</p>
                        <p className="text-xl font-black text-emerald-600">{result.imported}</p>
                    </div>
                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duplicates</p>
                        <p className="text-xl font-black text-slate-400">{result.skipped}</p>
                    </div>
                </div>
            </div>
            <Button className="w-full h-14 rounded-2xl mt-4" onClick={() => {
              setResult(null);
              setFile(null);
              setData([]);
            }}>
              Dismiss Terminal
            </Button>
          </div>
        )}
      </DialogShell>
    </>
  );
}

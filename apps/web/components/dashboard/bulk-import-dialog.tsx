'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Download } from 'lucide-react';
import Papa from 'papaparse';
import { api } from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';

export function BulkImportDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: any[] } | null>(null);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setData(results.data);
        },
      });
    }
  };

  const startImport = async () => {
    setIsImporting(true);
    try {
      const res = await api.post('/students/bulk-import', { students: data });
      setResult(res.data);
      queryClient.invalidateQueries({ queryKey: ['students'] });
    } catch (error) {
      console.error('Import failed', error);
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csv = Papa.unparse([{
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      admission_no: 'ADM001',
      gender: 'MALE',
      dob: '2010-05-15',
      class_id: 'Get ID from Classes page'
    }]);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    a.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="shadow-sm">
          <Upload className="mr-2 h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Student Onboarding</DialogTitle>
          <DialogDescription>
            Upload a CSV file with student details. Use our template for best results.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-6 pt-4">
            <div 
              className="border-2 border-dashed border-muted rounded-2xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative"
              onClick={() => document.getElementById('csv-upload')?.click()}
            >
              <input 
                id="csv-upload" 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
              <p className="text-sm font-medium text-muted-foreground">
                {file ? file.name : 'Drag and drop or click to upload CSV'}
              </p>
              {data.length > 0 && (
                <p className="text-xs text-primary font-bold mt-2 animate-bounce">
                  {data.length} records detected
                </p>
              )}
            </div>

            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Download className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">Need a template?</span>
              </div>
              <Button variant="link" size="sm" onClick={downloadTemplate}>Download Template</Button>
            </div>

            <Button 
              className="w-full h-12 text-lg font-bold shadow-lg" 
              disabled={!file || isImporting}
              onClick={startImport}
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Start Import'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 pt-4 text-center animate-in zoom-in-95 duration-300">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black">{result.imported} Students Imported</h3>
              <p className="text-muted-foreground text-sm">Onboarding process completed successfully.</p>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded-xl text-left">
                <h4 className="text-xs font-bold text-red-700 flex items-center gap-2 mb-2">
                  <AlertCircle className="h-3 w-3" />
                  {result.errors.length} Errors Occurred
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-[10px] text-red-600 font-mono">
                      Line {err.admission_no}: {err.error}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <Button className="w-full" onClick={() => {
              setResult(null);
              setFile(null);
              setData([]);
            }}>
              Import More
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

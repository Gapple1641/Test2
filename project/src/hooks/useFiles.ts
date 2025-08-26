import { useState, useEffect } from 'react';
import { supabase, STORAGE_BUCKET } from '../lib/supabase';
import { PDFFile, Subject, SortOption } from '../types';

export const useFiles = () => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list('', {
        limit: 1000,
        offset: 0,
      });

      if (error) throw error;

      const pdfFiles: PDFFile[] = data
        .filter(file => file.name.toLowerCase().endsWith('.pdf'))
        .map(file => ({
          id: file.id || file.name,
          name: file.metadata?.customMetadata?.display_name || file.name.replace('.pdf', ''),
          original_name: file.name,
          subject: (file.metadata?.customMetadata?.subject as Subject) || 'Unsorted',
          size: file.metadata?.size || 0,
          created_at: file.created_at || new Date().toISOString(),
          updated_at: file.updated_at || new Date().toISOString(),
          file_path: file.name,
        }));

      setFiles(pdfFiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, displayName: string, subject: Subject) => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          metadata: {
            customMetadata: {
              display_name: displayName,
              subject: subject,
            }
          }
        });

      if (uploadError) throw uploadError;

      await fetchFiles();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      return false;
    }
  };

  const renameFile = async (filePath: string, newName: string, newSubject: Subject) => {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .update(filePath, new Blob(), {
          metadata: {
            customMetadata: {
              display_name: newName,
              subject: newSubject,
            }
          }
        });

      if (error) throw error;

      await fetchFiles();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename file');
      return false;
    }
  };

  const deleteFile = async (filePath: string) => {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

      if (error) throw error;

      await fetchFiles();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
      return false;
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download file');
    }
  };

  const sortFiles = (files: PDFFile[], sortBy: SortOption) => {
    return [...files].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'size':
          return b.size - a.size;
        case 'subject':
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });
  };

  const filterFiles = (files: PDFFile[], subject: Subject | 'All', searchTerm: string) => {
    let filtered = files;
    
    if (subject !== 'All') {
      filtered = filtered.filter(file => file.subject === subject);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return {
    files,
    loading,
    error,
    fetchFiles,
    uploadFile,
    renameFile,
    deleteFile,
    downloadFile,
    sortFiles,
    filterFiles,
  };
};
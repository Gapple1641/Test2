export interface PDFFile {
  id: string;
  name: string;
  original_name: string;
  subject: string;
  size: number;
  created_at: string;
  updated_at: string;
  file_path: string;
}

export interface UploadedFile {
  file: File;
  preview?: string;
}

export type Subject = 'English' | 'Social Science' | 'Science' | 'Maths' | 'Computer' | 'Hindi' | 'Sanskrit' | 'Spanish' | 'Unsorted';

export type SortOption = 'name' | 'date' | 'size' | 'subject';
export type ViewMode = 'grid' | 'list';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vehiycgfgcempnawwhim.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlaGl5Y2dmZ2NlbXBuYXd3aGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTU0NDYsImV4cCI6MjA2NzU3MTQ0Nn0.B9As-maoYmBGa_Ck9vdwx2igyHuuDzUVOCdMH9CMvj4';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const STORAGE_BUCKET = 'pdfs';
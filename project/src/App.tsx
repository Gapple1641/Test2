import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { FileGrid } from './components/FileGrid';
import { SubjectTabs } from './components/SubjectTabs';
import { About } from './components/About';
import { useFiles } from './hooks/useFiles';
import { Subject } from './types';

function App() {
  const {
    files,
    loading,
    error,
    uploadFile,
    renameFile,
    deleteFile,
    downloadFile,
    filterFiles,
  } = useFiles();

  const [activeSubject, setActiveSubject] = useState<Subject | 'All'>('All');

  const subjects: Subject[] = [
    'English',
    'Social Science', 
    'Science',
    'Maths',
    'Computer',
    'Hindi',
    'Sanskrit',
    'Spanish',
    'Unsorted',
  ];

  const filteredFiles = useMemo(() => {
    return filterFiles(files, activeSubject, '');
  }, [files, activeSubject, filterFiles]);

  const fileCounts = useMemo(() => {
    const counts: Record<Subject | 'All', number> = { All: files.length };
    
    subjects.forEach(subject => {
      counts[subject] = files.filter(file => file.subject === subject).length;
    });
    
    return counts;
  }, [files, subjects]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your files...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <UploadSection onUpload={uploadFile} />

        {/* Subject Tabs */}
        <SubjectTabs
          subjects={subjects}
          activeSubject={activeSubject}
          onSubjectChange={setActiveSubject}
          fileCounts={fileCounts}
        />

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Files Grid - Takes up 3 columns */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
            )}
            
            <FileGrid
              files={filteredFiles}
              onRename={renameFile}
              onDelete={deleteFile}
              onDownload={downloadFile}
            />
          </div>

          {/* About Section - Takes up 1 column */}
          <div className="lg:col-span-1">
            <About />
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default App;
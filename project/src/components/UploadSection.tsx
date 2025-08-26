import React, { useRef, useState } from 'react';
import { Upload, File } from 'lucide-react';
import { Subject } from '../types';

interface UploadSectionProps {
  onUpload: (file: File, displayName: string, subject: Subject) => Promise<boolean>;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Unsorted');
  const [uploading, setUploading] = useState(false);

  const subjects: Subject[] = ['English', 'Social Science', 'Science', 'Maths', 'Computer', 'Hindi', 'Sanskrit', 'Spanish', 'Unsorted'];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');

    if (pdfFile) {
      setSelectedFile(pdfFile);
      setDisplayName(pdfFile.name.replace('.pdf', ''));
      setShowModal(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setDisplayName(file.name.replace('.pdf', ''));
      setShowModal(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !displayName.trim()) return;

    setUploading(true);
    const success = await onUpload(selectedFile, displayName.trim(), selectedSubject);
    
    if (success) {
      setShowModal(false);
      setSelectedFile(null);
      setDisplayName('');
      setSelectedSubject('Unsorted');
    }
    setUploading(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedFile(null);
    setDisplayName('');
    setSelectedSubject('Unsorted');
  };

  return (
    <>
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-white mb-2 text-center">Upload Your PDFs</h2>
        <p className="text-gray-400 text-center mb-8">Drag and drop or click to select PDF files</p>
        
        <div
          className={`
            relative mx-auto max-w-md h-64 rounded-full border-4 border-dashed 
            transition-all duration-300 cursor-pointer group hover:scale-105
            ${isDragging 
              ? 'border-red-500 bg-red-500/10' 
              : 'border-gray-600 hover:border-red-500 hover:bg-red-500/5'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Upload className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'}`} />
            <p className={`text-lg font-medium transition-colors ${isDragging ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'}`}>
              {isDragging ? 'Drop PDF here' : 'Click or Drop PDF'}
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <File className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold text-white">File Details</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter display name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject Category
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !displayName.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
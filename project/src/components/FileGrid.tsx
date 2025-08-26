import React, { useState } from 'react';
import { Search, Grid, List, Download, Edit, Trash2, Calendar, FileText } from 'lucide-react';
import { PDFFile, Subject, SortOption, ViewMode } from '../types';
import { formatFileSize, formatDate } from '../utils/format';

interface FileGridProps {
  files: PDFFile[];
  onRename: (filePath: string, newName: string, newSubject: Subject) => Promise<boolean>;
  onDelete: (filePath: string) => Promise<boolean>;
  onDownload: (filePath: string, fileName: string) => Promise<void>;
}

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  onRename,
  onDelete,
  onDownload,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null);
  const [newName, setNewName] = useState('');
  const [newSubject, setNewSubject] = useState<Subject>('Unsorted');
  const [loading, setLoading] = useState(false);

  const subjects: Subject[] = ['English', 'Social Science', 'Science', 'Maths', 'Computer', 'Hindi', 'Sanskrit', 'Spanish', 'Unsorted'];

  const filteredFiles = files
    .filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
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

  const handleRename = async () => {
    if (!selectedFile || !newName.trim()) return;

    setLoading(true);
    const success = await onRename(selectedFile.file_path, newName.trim(), newSubject);
    
    if (success) {
      setShowRenameModal(false);
      setSelectedFile(null);
      setNewName('');
      setNewSubject('Unsorted');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const success = await onDelete(selectedFile.file_path);
    
    if (success) {
      setShowDeleteModal(false);
      setSelectedFile(null);
    }
    setLoading(false);
  };

  const openRenameModal = (file: PDFFile) => {
    setSelectedFile(file);
    setNewName(file.name);
    setNewSubject(file.subject);
    setShowRenameModal(true);
  };

  const openDeleteModal = (file: PDFFile) => {
    setSelectedFile(file);
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="subject">Sort by Subject</option>
          </select>

          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Files Display */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No files found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-8 h-8 text-red-500" />
                <span className={`px-2 py-1 text-xs rounded-full ${
                  file.subject === 'Unsorted' 
                    ? 'bg-gray-600 text-gray-300'
                    : 'bg-red-600/20 text-red-400 border border-red-600/30'
                }`}>
                  {file.subject}
                </span>
              </div>
              
              <h3 className="text-white font-medium mb-2 line-clamp-2">{file.name}</h3>
              
              <div className="text-xs text-gray-400 mb-3 space-y-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(file.created_at)}</span>
                </div>
                <div>{formatFileSize(file.size)}</div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onDownload(file.file_path, file.name)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => openRenameModal(file)}
                  className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-lg transition-colors"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => openDeleteModal(file)}
                  className="bg-red-700 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="text-white font-medium">{file.name}</h3>
                    <div className="text-sm text-gray-400">
                      {file.subject} • {formatFileSize(file.size)} • {formatDate(file.created_at)}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => onDownload(file.file_path, file.name)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => openRenameModal(file)}
                    className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(file)}
                    className="bg-red-700 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && selectedFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Rename File</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter display name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject Category
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as Subject)}
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
                onClick={() => {
                  setShowRenameModal(false);
                  setSelectedFile(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                disabled={loading || !newName.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Delete File</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{selectedFile.name}"? This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedFile(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
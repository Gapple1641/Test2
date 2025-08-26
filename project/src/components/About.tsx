import React from 'react';
import { Shield, Zap, Globe } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-4">About RPS Vault</h3>
      <p className="text-gray-300 mb-6 leading-relaxed">
        A premium PDF management system designed for students. Upload, organize, and access your study materials with a beautiful, intuitive interface powered by Supabase storage.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600/20 p-2 rounded-lg">
            <Shield className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-gray-300 text-sm">Secure cloud storage</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-red-600/20 p-2 rounded-lg">
            <Zap className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-gray-300 text-sm">Lightning-fast uploads</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-red-600/20 p-2 rounded-lg">
            <Globe className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-gray-300 text-sm">Access from anywhere</span>
        </div>
      </div>
    </div>
  );
};
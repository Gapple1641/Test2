import React from 'react';
import { Subject } from '../types';

interface SubjectTabsProps {
  subjects: Subject[];
  activeSubject: Subject | 'All';
  onSubjectChange: (subject: Subject | 'All') => void;
  fileCounts: Record<Subject | 'All', number>;
}

export const SubjectTabs: React.FC<SubjectTabsProps> = ({
  subjects,
  activeSubject,
  onSubjectChange,
  fileCounts,
}) => {
  const allSubjects = ['All', ...subjects] as (Subject | 'All')[];

  return (
    <div className="border-b border-gray-700 mb-8">
      <div className="flex flex-wrap gap-2 -mb-px">
        {allSubjects.map((subject) => (
          <button
            key={subject}
            onClick={() => onSubjectChange(subject)}
            className={`
              px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200
              ${activeSubject === subject
                ? 'border-red-500 text-red-400 bg-red-500/10'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }
            `}
          >
            {subject}
            {fileCounts[subject] > 0 && (
              <span className={`
                ml-2 px-2 py-1 text-xs rounded-full
                ${activeSubject === subject
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-600 text-gray-300'
                }
              `}>
                {fileCounts[subject]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
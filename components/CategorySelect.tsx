import React from 'react';
import { ExamCategory } from '../types';
import { GraduationCap, School } from 'lucide-react';

interface CategorySelectProps {
  selected: ExamCategory;
  onSelect: (category: ExamCategory) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-md mx-auto">
      <button
        onClick={() => onSelect(ExamCategory.HENAN_ZHUANSHENGBEN)}
        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
          ${selected === ExamCategory.HENAN_ZHUANSHENGBEN 
            ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
            : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'}`}
      >
        <GraduationCap className="w-6 h-6 mb-2" />
        <span className="font-semibold text-sm">河南专升本</span>
      </button>

      <button
        onClick={() => onSelect(ExamCategory.GAOKAO)}
        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
          ${selected === ExamCategory.GAOKAO
            ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
            : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'}`}
      >
        <School className="w-6 h-6 mb-2" />
        <span className="font-semibold text-sm">高考英语</span>
      </button>
    </div>
  );
};

export default CategorySelect;
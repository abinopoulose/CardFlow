import React from 'react';
import type { FieldConfig } from '../../../context/AppContext';

interface CodePropertiesProps {
  selectedField: FieldConfig;
  updateField: (id: string, updates: Partial<FieldConfig>) => void;
}

export const CodeProperties: React.FC<CodePropertiesProps> = ({ selectedField, updateField }) => {
  return (
    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2 group bg-gray-50/50 p-1.5 pl-3 rounded-lg border border-gray-100 transition-colors shadow-inner">
        <span className="text-[9px] text-gray-400 font-bold tracking-widest group-hover:text-indigo-400 transition-colors uppercase">Color</span>
        <div className="relative w-6 h-6 rounded-md overflow-hidden shadow-sm border border-gray-200 hover:scale-110 transition-transform cursor-pointer">
          <input 
            type="color" 
            value={selectedField.color || '#000000'} 
            onChange={(e) => updateField(selectedField.id, { color: e.target.value })}
            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

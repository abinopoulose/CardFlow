import React from 'react';
import type { FieldConfig } from '../../../context/AppContext';

interface DrawingPropertiesProps {
  selectedField: FieldConfig;
  updateField: (id: string, updates: Partial<FieldConfig>) => void;
  handleDrawingColorChange: (id: string, color: string, originalImage?: string) => void;
}

export const DrawingProperties: React.FC<DrawingPropertiesProps> = ({ selectedField, updateField, handleDrawingColorChange }) => {
  return (
    <div className="flex items-center gap-4 border-l border-gray-100 pl-4 animate-in fade-in slide-in-from-right-4 duration-300 ml-auto">
      <div className="flex items-center gap-2 group bg-gray-50/50 p-1 pl-2 rounded-lg border border-gray-100 transition-colors shadow-inner">
        <span className="text-[9px] text-gray-400 font-bold tracking-widest group-hover:text-indigo-400 transition-colors uppercase">Color</span>
        <div className="relative w-6 h-6 rounded-md overflow-hidden shadow-sm border border-gray-200 hover:scale-110 transition-transform cursor-pointer">
          <input 
            type="color" 
            value={selectedField.color || '#000000'}
            onChange={(e) => handleDrawingColorChange(selectedField.id, e.target.value, selectedField.originalImage || selectedField.staticImage)}
            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 group">
        <span className="text-[9px] text-gray-400 font-bold tracking-widest group-hover:text-indigo-400 transition-colors uppercase">Opacity</span>
        <input 
          type="range"
          min="0" max="1" step="0.05"
          value={selectedField.opacity ?? 1}
          onChange={(e) => updateField(selectedField.id, { opacity: parseFloat(e.target.value) })}
          className="w-24 accent-indigo-500 hover:accent-indigo-600 transition-all"
        />
      </div>
    </div>
  );
};

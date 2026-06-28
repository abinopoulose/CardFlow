import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { FieldConfig } from '../../../context/AppContext';

interface GradientEditorProps {
  selectedField: FieldConfig;
  updateField: (id: string, updates: Partial<FieldConfig>) => void;
  setShowGradientDropdown: (show: boolean) => void;
}

export const GradientEditor: React.FC<GradientEditorProps> = ({ selectedField, updateField, setShowGradientDropdown }) => {
  if (!selectedField.gradient) return null;

  return (
    <div className="absolute top-full left-0 mt-3 w-64 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-gray-800 tracking-wide">Gradient Editor</span>
        <button 
          onClick={() => {
            updateField(selectedField.id, { gradient: undefined });
            setShowGradientDropdown(false);
          }}
          className="text-[10px] bg-red-50 hover:bg-red-500 text-red-600 hover:text-white px-2 py-1 rounded-md font-bold transition-all shadow-sm"
        >
          Remove
        </button>
      </div>
      
      <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
        {selectedField.gradient.colors.map((color, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-gray-50/50 p-1.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="relative w-7 h-7 rounded-md overflow-hidden shadow-sm border border-gray-200 flex-shrink-0 cursor-pointer">
              <input 
                type="color" 
                value={color}
                onChange={(e) => {
                  const newColors = [...selectedField.gradient!.colors];
                  newColors[idx] = e.target.value;
                  updateField(selectedField.id, { gradient: { ...selectedField.gradient!, colors: newColors } });
                }}
                className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
              />
            </div>
            <span className="text-xs font-medium text-gray-600 flex-1">{color.toUpperCase()}</span>
            {selectedField.gradient!.colors.length > 2 && (
              <button 
                onClick={() => {
                  const newColors = selectedField.gradient!.colors.filter((_, i) => i !== idx);
                  updateField(selectedField.id, { gradient: { ...selectedField.gradient!, colors: newColors } });
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedField.gradient.colors.length < 10 && (
        <button 
          onClick={() => {
            const newColors = [...selectedField.gradient!.colors, '#ffffff'];
            updateField(selectedField.id, { gradient: { ...selectedField.gradient!, colors: newColors } });
          }}
          className="mt-3 w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 py-2 rounded-lg transition-all border border-indigo-100 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Add Stop
        </button>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-2">Direction / Angle</span>
        <select 
          value={selectedField.gradient.direction.endsWith('deg') ? 'angle' : selectedField.gradient.direction}
          onChange={(e) => {
            if (e.target.value === 'angle') {
              updateField(selectedField.id, { gradient: { ...selectedField.gradient!, direction: '90deg' } });
            } else {
              updateField(selectedField.id, { gradient: { ...selectedField.gradient!, direction: e.target.value } });
            }
          }}
          className="w-full text-xs font-medium p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all mb-3 text-gray-700"
        >
          <option value="to right">Linear To Right (→)</option>
          <option value="to left">Linear To Left (←)</option>
          <option value="to bottom">Linear To Bottom (↓)</option>
          <option value="to top">Linear To Top (↑)</option>
          <option value="to bottom right">Linear To Bottom Right (↘)</option>
          <option value="to top left">Linear To Top Left (↖)</option>
          <option value="angle">Custom Rotation Angle...</option>
        </select>
        
        {selectedField.gradient.direction.endsWith('deg') && (
          <div className="flex items-center gap-3 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
            <input 
              type="range" 
              min="0" max="360" 
              value={parseInt(selectedField.gradient.direction, 10) || 0}
              onChange={(e) => updateField(selectedField.id, { gradient: { ...selectedField.gradient!, direction: `${e.target.value}deg` } })}
              className="flex-1 accent-indigo-500 hover:accent-indigo-600 transition-all"
            />
            <span className="text-[11px] font-bold text-indigo-600 w-10 text-right bg-indigo-50 px-2 py-1 rounded-md">{parseInt(selectedField.gradient.direction, 10) || 0}°</span>
          </div>
        )}
      </div>
    </div>
  );
};

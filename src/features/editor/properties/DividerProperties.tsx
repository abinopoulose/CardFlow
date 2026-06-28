import React, { useState } from 'react';
import type { FieldConfig } from '../../../context/AppContext';
import { GradientEditor } from './GradientEditor';

interface DividerPropertiesProps {
  selectedField: FieldConfig;
  updateField: (id: string, updates: Partial<FieldConfig>) => void;
}

export const DividerProperties: React.FC<DividerPropertiesProps> = ({ selectedField, updateField }) => {
  const [showGradientDropdown, setShowGradientDropdown] = useState(false);

  return (
    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="relative group border-r border-gray-100 pr-3">
        <select
          value={selectedField.lineStyle || 'solid'}
          onChange={(e) => {
            const style = e.target.value as any;
            const currentWidth = selectedField.borderWidth || 2;
            let newWidth = currentWidth;
            if (['double'].includes(style) && currentWidth < 4) {
              newWidth = 4;
            }
            updateField(selectedField.id, { lineStyle: style, borderWidth: newWidth });
          }}
          className="appearance-none w-28 text-[11px] font-medium p-1.5 pl-3 pr-6 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer bg-white/50 hover:bg-white transition-all shadow-sm text-gray-700"
        >
          <option value="solid">Solid Line</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
          <option value="double">Double</option>
          <option value="wavy">Wavy</option>
          <option value="zigzag">Zigzag</option>
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-indigo-400 transition-colors text-[8px]">▼</div>
      </div>
      
      <div className="flex items-center gap-1.5 bg-gray-50/50 hover:bg-gray-50 p-1 pl-2 rounded-lg border border-gray-100 transition-colors shadow-inner relative">
        <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">Color</span>
        
        <div className="relative w-5 h-5 rounded-md overflow-hidden shadow-sm border border-gray-200 hover:scale-110 transition-transform cursor-pointer">
          <input 
            type="color" 
            value={selectedField.gradient ? selectedField.gradient.colors[0] : (selectedField.borderColor || '#d1d5db')} 
            onChange={(e) => {
              if (selectedField.gradient) {
                const newColors = [...selectedField.gradient.colors];
                newColors[0] = e.target.value;
                updateField(selectedField.id, { gradient: { ...selectedField.gradient, colors: newColors } });
              } else {
                updateField(selectedField.id, { borderColor: e.target.value });
              }
            }}
            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
          />
        </div>
        
        <button 
          onClick={() => {
            if (selectedField.gradient) {
              setShowGradientDropdown(!showGradientDropdown);
            } else {
              updateField(selectedField.id, { gradient: { colors: [selectedField.borderColor || '#4f46e5', '#ec4899'], direction: 'to right' }, lineStyle: 'solid' });
              setShowGradientDropdown(true);
            }
          }}
          className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ml-1 ${selectedField.gradient ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-400 hover:bg-gray-200/50 hover:text-gray-600'}`}
          title="Toggle Gradient Mode"
        >
          GRADIENT
        </button>

        {showGradientDropdown && (
          <GradientEditor 
            selectedField={selectedField} 
            updateField={updateField} 
            setShowGradientDropdown={setShowGradientDropdown} 
          />
        )}
      </div>

      <div className="flex items-center gap-1.5 group border-l border-gray-100 pl-3">
        <span className="text-[9px] text-gray-400 font-bold tracking-widest group-hover:text-indigo-400 transition-colors uppercase">Thickness</span>
        <input 
          type="number" 
          min="1"
          value={selectedField.borderWidth !== undefined ? selectedField.borderWidth : 2} 
          onChange={(e) => updateField(selectedField.id, { borderWidth: Number(e.target.value) })}
          className="w-12 text-[11px] font-semibold p-1 border border-gray-200 rounded-md outline-none text-center bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
        />
      </div>

      <div className="flex items-center gap-2 group border-l border-gray-100 pl-3">
        <span className="text-[9px] text-gray-400 font-bold tracking-widest group-hover:text-indigo-400 transition-colors uppercase">Opacity</span>
        <input 
          type="range"
          min="0" max="1" step="0.05"
          value={selectedField.opacity ?? 1}
          onChange={(e) => updateField(selectedField.id, { opacity: parseFloat(e.target.value) })}
          className="w-20 accent-indigo-500 hover:accent-indigo-600 transition-all"
        />
      </div>
    </div>
  );
};

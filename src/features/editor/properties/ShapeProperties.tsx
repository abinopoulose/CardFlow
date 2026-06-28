import React, { useState } from 'react';
import type { FieldConfig } from '../../../context/AppContext';
import { CUSTOM_SHAPES } from '../../panels/FieldsPanel';
import ShapeRenderer from '../../canvas/ShapeRenderer';

interface ShapePropertiesProps {
  selectedField: FieldConfig;
  updateField: (id: string, updates: Partial<FieldConfig>) => void;
}

export const ShapeProperties: React.FC<ShapePropertiesProps> = ({ selectedField, updateField }) => {
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [shapeSearch, setShapeSearch] = useState('');

  return (
    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="relative">
        <button 
          onClick={() => setShowShapeDropdown(!showShapeDropdown)}
          className="flex items-center justify-between w-32 text-[11px] font-medium p-1.5 px-3 border border-gray-200 rounded-lg bg-white/50 hover:bg-white hover:shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/50 outline-none text-gray-700"
        >
          <span className="truncate">{CUSTOM_SHAPES.find(s => s.value === selectedField.shapeType)?.label || 'Shape'}</span>
          <span className="text-gray-400 text-[9px] transition-transform duration-200" style={{ transform: showShapeDropdown ? 'rotate(180deg)' : 'none' }}>▼</span>
        </button>
        {showShapeDropdown && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <input 
              type="text" 
              placeholder="Search shapes..." 
              value={shapeSearch}
              onChange={(e) => setShapeSearch(e.target.value)}
              className="w-full text-xs p-2 mb-2 border border-gray-100 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-400"
            />
            <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {CUSTOM_SHAPES.filter(s => s.label.toLowerCase().includes(shapeSearch.toLowerCase())).map((st) => (
                <button
                  key={st.value}
                  onClick={() => {
                    updateField(selectedField.id, { 
                      shapeType: st.value as any,
                      borderRadius: st.value === 'circle' ? 9999 : 0
                    });
                    setShowShapeDropdown(false);
                  }}
                  className="flex flex-col items-center justify-center py-2 rounded-lg hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all group border border-transparent hover:border-indigo-100"
                  title={st.label}
                >
                  <ShapeRenderer field={{ ...selectedField, shapeType: st.value as any, backgroundColor: '#818cf8', borderColor: '#4f46e5', fillTransparent: false, borderTransparent: false, borderWidth: 1 }} previewMode={true} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedField.shapeType !== 'line' && (
        <div className="flex items-center gap-1.5 bg-gray-50/50 hover:bg-gray-50 p-1 pl-2 rounded-lg border border-gray-100 transition-colors shadow-inner">
          <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">Fill</span>
          <div className="relative w-5 h-5 rounded-md overflow-hidden shadow-sm border border-gray-200 group-hover:scale-110 transition-transform cursor-pointer">
            <input 
              type="color" 
              value={selectedField.backgroundColor || '#e0e7ff'} 
              onChange={(e) => updateField(selectedField.id, { backgroundColor: e.target.value, fillTransparent: false })}
              className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
            />
          </div>
          <button 
            onClick={() => updateField(selectedField.id, { fillTransparent: !selectedField.fillTransparent })}
            className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${selectedField.fillTransparent ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-400 hover:bg-gray-200/50 hover:text-gray-600'}`}
          >
            NONE
          </button>
        </div>
      )}

      <div className="flex items-center gap-1.5 bg-gray-50/50 hover:bg-gray-50 p-1 pl-2 rounded-lg border border-gray-100 transition-colors shadow-inner">
        <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">{selectedField.shapeType === 'line' ? 'Line' : 'Border'}</span>
        <div className="relative w-5 h-5 rounded-md overflow-hidden shadow-sm border border-gray-200 hover:scale-110 transition-transform cursor-pointer">
          <input 
            type="color" 
            value={selectedField.borderColor || '#4f46e5'} 
            onChange={(e) => updateField(selectedField.id, { borderColor: e.target.value, borderTransparent: false })}
            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
          />
        </div>
        {selectedField.shapeType !== 'line' && (
          <button 
            onClick={() => updateField(selectedField.id, { borderTransparent: !selectedField.borderTransparent })}
            className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${selectedField.borderTransparent ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-400 hover:bg-gray-200/50 hover:text-gray-600'}`}
          >
            NONE
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 group border-l border-gray-100 pl-3">
        <span className="text-[9px] text-gray-400 font-bold tracking-widest group-hover:text-indigo-400 transition-colors uppercase">{selectedField.shapeType === 'line' ? 'Thickness' : 'Width'}</span>
        <input 
          type="number" 
          min="0"
          value={selectedField.borderWidth !== undefined ? selectedField.borderWidth : 2} 
          onChange={(e) => updateField(selectedField.id, { borderWidth: Number(e.target.value) })}
          className="w-12 text-[11px] font-semibold p-1 border border-gray-200 rounded-md outline-none text-center bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
        />
      </div>

      {selectedField.shapeType === 'rectangle' && (
        <div className="flex items-center gap-1.5 group border-l border-gray-100 pl-3">
          <span className="text-[9px] text-gray-400 font-bold tracking-widest group-hover:text-indigo-400 transition-colors uppercase">Radius</span>
          <input 
            type="number" 
            min="0"
            value={selectedField.borderRadius || 0} 
            onChange={(e) => updateField(selectedField.id, { borderRadius: Number(e.target.value) })}
            className="w-12 text-[11px] font-semibold p-1 border border-gray-200 rounded-md outline-none text-center bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
          />
        </div>
      )}

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

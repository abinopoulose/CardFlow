import React from 'react';
import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import type { FieldConfig } from '../../../context/AppContext';
import { fontFamilies } from '../../panels/FieldsPanel';

interface TextPropertiesProps {
  selectedField: FieldConfig;
  updateField: (id: string, updates: Partial<FieldConfig>) => void;
}

export const TextProperties: React.FC<TextPropertiesProps> = ({ selectedField, updateField }) => {
  return (
    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="relative group">
        <select 
          value={selectedField.fontFamily || 'sans-serif'}
          onChange={(e) => updateField(selectedField.id, { fontFamily: e.target.value })}
          className="appearance-none w-32 text-[11px] font-medium p-1.5 pl-2 pr-6 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer bg-white/50 hover:bg-white transition-all shadow-sm text-gray-700"
        >
          {fontFamilies.map(font => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-indigo-400 transition-colors text-[8px]">▼</div>
      </div>

      <div className="flex items-center gap-1 border-l border-gray-100 pl-3">
        <button
          onClick={() => updateField(selectedField.id, { fontWeight: selectedField.fontWeight === 'bold' || selectedField.fontWeight === '900' ? 'normal' : 'bold' })}
          className={`p-1.5 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 ${selectedField.fontWeight === 'bold' || selectedField.fontWeight === '900' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => updateField(selectedField.id, { fontStyle: selectedField.fontStyle === 'italic' ? 'normal' : 'italic' })}
          className={`p-1.5 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 ${selectedField.fontStyle === 'italic' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            let dec = selectedField.textDecoration || 'none';
            if (dec.includes('underline')) dec = dec.replace('underline', '').trim();
            else dec = (dec === 'none' ? 'underline' : (dec + ' underline').trim());
            if (dec === '') dec = 'none';
            updateField(selectedField.id, { textDecoration: dec });
          }}
          className={`p-1.5 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 ${(selectedField.textDecoration || '').includes('underline') ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            let dec = selectedField.textDecoration || 'none';
            if (dec.includes('line-through')) dec = dec.replace('line-through', '').trim();
            else dec = (dec === 'none' ? 'line-through' : (dec + ' line-through').trim());
            if (dec === '') dec = 'none';
            updateField(selectedField.id, { textDecoration: dec });
          }}
          className={`p-1.5 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 ${(selectedField.textDecoration || '').includes('line-through') ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1 border-l border-gray-100 pl-3">
        {[
          { id: 'left', icon: AlignLeft },
          { id: 'center', icon: AlignCenter },
          { id: 'right', icon: AlignRight },
          { id: 'justify', icon: AlignJustify }
        ].map(align => (
          <button
            key={align.id}
            onClick={() => updateField(selectedField.id, { textAlign: align.id as any })}
            className={`p-1.5 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 ${(selectedField.textAlign || 'left') === align.id ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
            title={`Align ${align.id}`}
          >
            <align.icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 border-l border-gray-100 pl-3">
        <select
          value={selectedField.textTransform || 'none'}
          onChange={(e) => updateField(selectedField.id, { textTransform: e.target.value })}
          className="w-24 text-[11px] p-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer bg-white/50 hover:bg-white transition-all shadow-sm text-gray-600"
        >
          <option value="none">Normal</option>
          <option value="uppercase">UPPER</option>
          <option value="lowercase">lower</option>
          <option value="capitalize">Capitalize</option>
          <option value="sentence">Sentence</option>
        </select>
      </div>

      <div className="flex items-center gap-1.5 group border-l border-gray-100 pl-3">
        <span className="text-[9px] text-gray-400 font-bold tracking-widest group-hover:text-indigo-400 transition-colors">SIZE</span>
        <input 
          type="number" 
          value={selectedField.fontSize} 
          onChange={(e) => updateField(selectedField.id, { fontSize: Number(e.target.value) })}
          className="w-12 text-[11px] font-semibold p-1 border border-gray-200 rounded-md outline-none text-center bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
        />
      </div>

      <div className="flex items-center gap-1.5 group border-l border-gray-100 pl-3">
        <span className="text-[9px] text-gray-400 font-bold tracking-widest group-hover:text-indigo-400 transition-colors">COLOR</span>
        <div className="relative w-6 h-6 rounded-md overflow-hidden shadow-sm border border-gray-200 group-hover:scale-110 transition-transform cursor-pointer">
          <input 
            type="color" 
            value={selectedField.color} 
            onChange={(e) => updateField(selectedField.id, { color: e.target.value })}
            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

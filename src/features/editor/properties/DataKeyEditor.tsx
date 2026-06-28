import React, { useState, useEffect } from 'react';
import type { FieldConfig } from '../../../context/AppContext';

interface DataKeyEditorProps {
  selectedField: FieldConfig;
  fields: FieldConfig[];
  headers: string[];
  updateField: (id: string, updates: Partial<FieldConfig>) => void;
  updateCurrentProject: (updates: any) => void;
}

export const DataKeyEditor: React.FC<DataKeyEditorProps> = ({ selectedField, fields, headers, updateField, updateCurrentProject }) => {
  const [draftKey, setDraftKey] = useState(selectedField.headerKey);

  useEffect(() => {
    setDraftKey(selectedField.headerKey);
  }, [selectedField.headerKey]);

  if (selectedField.isStatic) {
    if (selectedField.type === 'text') return <span className="text-[10px] text-gray-400 italic px-2 tracking-wider">Double-click on the text field to edit</span>;
    if (selectedField.type === 'drawing') return <span className="text-[10px] text-gray-400 italic px-2 tracking-wider">Custom Drawing</span>;
    if (selectedField.type === 'image') return (
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image</span>
        <input type="text" value="Static Image" disabled className="w-28 px-2 py-1 text-[11px] font-medium border border-gray-100 rounded-lg outline-none bg-gray-50/50 text-gray-400 shadow-inner" />
      </div>
    );
    if (selectedField.type === 'qrcode' || selectedField.type === 'barcode') return (
      <div className="flex items-center gap-2 group">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Value:</span>
        <input 
          type="text" 
          value={selectedField.staticText || ''} 
          onChange={(e) => updateField(selectedField.id, { staticText: e.target.value })}
          className="w-40 px-2 py-1 text-[11px] font-medium border border-gray-200 rounded-lg outline-none bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all shadow-sm placeholder-gray-300"
          placeholder="Enter data here..."
        />
      </div>
    );
    return null;
  }

  const handleSave = () => {
    const val = draftKey.trim();
    if (!val) {
      setDraftKey(selectedField.headerKey);
      return;
    }
    const isDuplicate = fields.some(f => !f.isStatic && f.id !== selectedField.id && f.headerKey.toLowerCase() === val.toLowerCase());
    if (isDuplicate) {
      window.alert(`The key "${val}" is already in use by another dynamic field.`);
      setDraftKey(selectedField.headerKey);
      return;
    }
    if (val !== selectedField.headerKey) {
      updateField(selectedField.id, { headerKey: val });
      if (!headers.includes(val)) {
        updateCurrentProject({ headers: [...headers, val] });
      }
    }
  };

  return (
    <div className="flex items-center gap-2 group">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Data Key:</span>
      <div className="flex items-center gap-1.5 relative">
        <input 
          type="text" 
          value={draftKey} 
          onChange={(e) => setDraftKey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
              handleSave();
            }
          }}
          className="w-32 px-2 py-1 text-[11px] font-semibold border border-gray-200 rounded-lg outline-none bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all shadow-sm text-gray-700"
        />
        {draftKey !== selectedField.headerKey && (
          <button
            onClick={handleSave}
            className="absolute -right-12 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-md hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-md shadow-indigo-500/20"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

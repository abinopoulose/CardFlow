import React from 'react';
import { Trash2 } from 'lucide-react';
import { useAppContext, type FieldConfig } from '../../context/AppContext';
import { DataKeyEditor } from './properties/DataKeyEditor';
import { TextProperties } from './properties/TextProperties';
import { ShapeProperties } from './properties/ShapeProperties';
import { DividerProperties } from './properties/DividerProperties';
import { DrawingProperties } from './properties/DrawingProperties';
import { CodeProperties } from './properties/CodeProperties';

interface PropertiesBarProps {
  selectedFieldIds: string[];
}

const PropertiesBar: React.FC<PropertiesBarProps> = ({ selectedFieldIds }) => {
  const { currentProject, updateCurrentProject } = useAppContext();

  const fields = currentProject?.fields || [];
  const selectedField = fields.find((f) => f.id === selectedFieldIds[0]);

  if (!currentProject) return null;
  const { headers } = currentProject;

  const updateField = (id: string, updates: Partial<FieldConfig>) => {
    updateCurrentProject({
      fields: fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    });
  };

  const removeFields = (ids: string[]) => {
    updateCurrentProject({
      fields: fields.filter((f) => !ids.includes(f.id)),
    });
  };

  const handleDrawingColorChange = (id: string, color: string, originalImage?: string) => {
    updateField(id, { color });
    if (!originalImage) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        updateField(id, { staticImage: canvas.toDataURL('image/png') });
      }
    };
    img.src = originalImage;
  };

  if (selectedFieldIds.length > 1) {
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-xl shadow-2xl border border-gray-100 rounded-2xl px-5 py-3 flex items-center gap-5 text-sm whitespace-nowrap animate-in slide-in-from-top-4 fade-in duration-300">
        <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 tracking-wide">
          {selectedFieldIds.length} Elements Selected
        </span>
        <div className="w-px h-5 bg-gray-200/80"></div>
        <button 
          onClick={() => removeFields(selectedFieldIds)}
          className="p-1.5 px-3 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all flex items-center gap-1.5 text-[11px] font-bold shadow-sm"
          title="Delete Selected Fields"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete All
        </button>
      </div>
    );
  }

  if (!selectedField) return null;
  
  if (selectedField.type === 'image' && selectedField.isStatic) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-xl shadow-2xl border border-white/50 rounded-2xl px-5 py-2.5 flex items-center gap-5 text-sm whitespace-nowrap animate-in slide-in-from-top-4 fade-in duration-300">
      
      {/* Type / Data Key / Value */}
      {selectedField.type !== 'shape' && selectedField.type !== 'divider' && (
        <div className="flex items-center gap-2 border-r border-gray-100 pr-5">
          <DataKeyEditor 
            selectedField={selectedField} 
            fields={fields} 
            headers={headers} 
            updateField={updateField} 
            updateCurrentProject={updateCurrentProject} 
          />
        </div>
      )}

      {selectedField.type === 'text' && <TextProperties selectedField={selectedField} updateField={updateField} />}
      {selectedField.type === 'shape' && <ShapeProperties selectedField={selectedField} updateField={updateField} />}
      {selectedField.type === 'divider' && <DividerProperties selectedField={selectedField} updateField={updateField} />}
      {(selectedField.type === 'qrcode' || selectedField.type === 'barcode') && <CodeProperties selectedField={selectedField} updateField={updateField} />}
      {selectedField.type === 'drawing' && <DrawingProperties selectedField={selectedField} updateField={updateField} handleDrawingColorChange={handleDrawingColorChange} />}

      <div className="flex items-center pl-2 ml-auto">
        <button 
          onClick={() => removeFields([selectedField.id])}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-95"
          title="Delete Field"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default PropertiesBar;

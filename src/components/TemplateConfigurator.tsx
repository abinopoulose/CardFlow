import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Settings, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { useAppContext, type FieldConfig } from '../context/AppContext';

const TemplateConfigurator: React.FC = () => {
  const { templateImage, headers, fields, setFields } = useAppContext();
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  if (!templateImage) {
    return (
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-gray-100 mt-6 flex items-center justify-center h-64 text-gray-400">
        <p>Please upload a template image first to start configuring.</p>
      </div>
    );
  }

  const handleAddField = (headerKey: string, type: 'text' | 'image' = 'text') => {
    const newField: FieldConfig = {
      id: Math.random().toString(36).substr(2, 9),
      headerKey,
      x: 50,
      y: 50,
      fontSize: 16,
      color: '#000000',
      fontWeight: 'normal',
      type,
      width: type === 'image' ? 100 : undefined,
      height: type === 'image' ? 100 : undefined,
    };
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FieldConfig>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-500" />
          Configure Template Fields
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Canvas */}
        <div className="flex-1 overflow-auto border border-gray-200 bg-gray-50/50 rounded-xl flex items-start justify-center p-4 min-h-[400px]">
          <div 
            className="relative bg-white shadow-md overflow-hidden"
            style={{ width: '400px', minHeight: '250px' }}
          >
            <img 
              src={templateImage} 
              alt="Background" 
              className="w-full h-auto block select-none pointer-events-none"
            />
            {fields.map((field) => (
              <Rnd
                key={field.id}
                position={{ x: field.x, y: field.y }}
                size={field.type === 'image' ? { width: field.width || 100, height: field.height || 100 } : undefined}
                onDragStop={(_e, d) => {
                  updateField(field.id, { x: d.x, y: d.y });
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                  if (field.type === 'image') {
                    updateField(field.id, {
                      width: parseInt(ref.style.width, 10),
                      height: parseInt(ref.style.height, 10),
                      ...position,
                    });
                  }
                }}
                enableResizing={field.type === 'image'}
                bounds="parent"
                className={`cursor-move ${selectedFieldId === field.id ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-indigo-300'}`}
                onClick={() => setSelectedFieldId(field.id)}
              >
                {field.type === 'image' ? (
                  <div className="w-full h-full border-2 border-dashed border-indigo-400 bg-indigo-100/50 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-indigo-400" />
                  </div>
                ) : (
                  <div 
                    style={{
                      fontSize: `${field.fontSize}px`,
                      color: field.color,
                      fontWeight: field.fontWeight,
                      whiteSpace: 'nowrap'
                    }}
                    className="px-1"
                  >
                    [{field.headerKey}]
                  </div>
                )}
              </Rnd>
            ))}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          
          {/* Add Data Fields */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Add Fields</h3>
            {headers.length === 0 ? (
              <p className="text-xs text-gray-500 mb-3">Upload data to see text fields.</p>
            ) : (
              <div className="flex flex-wrap gap-2 mb-3">
                {headers.map((header) => (
                  <button
                    key={header}
                    onClick={() => handleAddField(header, 'text')}
                    className="flex items-center gap-1 bg-white border border-gray-300 text-gray-700 text-xs px-2 py-1.5 rounded hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-3 h-3" />
                    {header}
                  </button>
                ))}
              </div>
            )}
            
            <button
              onClick={() => handleAddField('Photo', 'image')}
              className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 text-sm px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
            >
              <ImageIcon className="w-4 h-4" />
              Add Photo Area
            </button>
          </div>

          {/* Edit Selected Field */}
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex-1 shadow-sm">
            <h3 className="text-sm font-bold text-indigo-900 mb-3">Field Properties</h3>
            {selectedField ? (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-indigo-800 mb-1">Data Key</label>
                  <input 
                    type="text" 
                    value={selectedField.headerKey} 
                    disabled 
                    className="w-full text-sm p-2 bg-indigo-100/50 border border-indigo-200 rounded-lg text-indigo-900 cursor-not-allowed font-medium"
                  />
                </div>
                
                {selectedField.type !== 'image' && (
                  <>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-indigo-800 mb-1">Font Size (px)</label>
                        <input 
                          type="number" 
                          value={selectedField.fontSize} 
                          onChange={(e) => updateField(selectedField.id, { fontSize: Number(e.target.value) })}
                          className="w-full text-sm p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-indigo-800 mb-1">Color</label>
                        <input 
                          type="color" 
                          value={selectedField.color} 
                          onChange={(e) => updateField(selectedField.id, { color: e.target.value })}
                          className="w-full h-9 p-0.5 border border-indigo-200 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-indigo-800 mb-1">Font Weight</label>
                      <select 
                        value={selectedField.fontWeight}
                        onChange={(e) => updateField(selectedField.id, { fontWeight: e.target.value })}
                        className="w-full text-sm p-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="100">Light</option>
                        <option value="900">Black</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedField.type === 'image' && (
                  <p className="text-xs text-indigo-600 mb-2">
                    Resize the box on the canvas to set the photo dimensions.
                  </p>
                )}

                <div className="mt-2 pt-4 border-t border-indigo-200/50">
                  <button 
                    onClick={() => removeField(selectedField.id)}
                    className="flex items-center justify-center w-full gap-2 text-sm text-red-600 bg-white hover:bg-red-50 border border-red-200 py-2 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Field
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-center">
                <p className="text-xs text-indigo-600/70 font-medium">
                  Click on a field in the canvas to edit its properties.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TemplateConfigurator;

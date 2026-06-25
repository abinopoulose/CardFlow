import React, { useRef, useState } from 'react';
import { Type, ImagePlus, Image as ImageIcon, Trash2, Square } from 'lucide-react';
import { useAppContext, type FieldConfig } from '../context/AppContext';
import CropModal from './CropModal';

interface FieldsPanelProps {
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
}

const ShapePreview = ({ type }: { type: string }) => {
  const common = "stroke-current text-gray-400 fill-gray-100 group-hover:text-indigo-500 group-hover:fill-indigo-50 transition-colors w-6 h-6 mx-auto mb-1";
  switch (type) {
    case 'circle': return <svg className={common} viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" strokeWidth="6" /></svg>;
    case 'rectangle': return <svg className={common} viewBox="0 0 100 100"><rect x="10" y="20" width="80" height="60" rx="4" strokeWidth="6" /></svg>;
    case 'triangle': return <svg className={common} viewBox="0 0 100 100"><polygon points="50,15 90,85 10,85" strokeWidth="6" strokeLinejoin="round" /></svg>;
    case 'star': return <svg className={common} viewBox="0 0 100 100"><polygon points="50,10 61,40 98,40 68,60 79,90 50,70 21,90 32,60 2,40 39,40" strokeWidth="4" strokeLinejoin="round" /></svg>;
    case 'hexagon': return <svg className={common} viewBox="0 0 100 100"><polygon points="50,5 95,27 95,73 50,95 5,73 5,27" strokeWidth="6" strokeLinejoin="round" /></svg>;
    case 'pentagon': return <svg className={common} viewBox="0 0 100 100"><polygon points="50,5 95,38 78,95 22,95 5,38" strokeWidth="6" strokeLinejoin="round" /></svg>;
    case 'diamond': return <svg className={common} viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" strokeWidth="6" strokeLinejoin="round" /></svg>;
    case 'line': return <svg className={common} viewBox="0 0 100 100"><line x1="10" y1="50" x2="90" y2="50" strokeWidth="8" strokeLinecap="round" /></svg>;
    default: return null;
  }
};

const fontFamilies = [
  { name: 'Default Sans', value: 'sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'Abel', value: '"Abel", sans-serif' },
  { name: 'Anton', value: '"Anton", sans-serif' },
  { name: 'Archivo', value: '"Archivo", sans-serif' },
  { name: 'Arimo', value: '"Arimo", sans-serif' },
  { name: 'Asap', value: '"Asap", sans-serif' },
  { name: 'Barlow', value: '"Barlow", sans-serif' },
  { name: 'Bebas Neue', value: '"Bebas Neue", sans-serif' },
  { name: 'Bitter', value: '"Bitter", serif' },
  { name: 'Cabin', value: '"Cabin", sans-serif' },
  { name: 'Cairo', value: '"Cairo", sans-serif' },
  { name: 'Caveat', value: '"Caveat", cursive' },
  { name: 'Comfortaa', value: '"Comfortaa", cursive' },
  { name: 'Cormorant Garamond', value: '"Cormorant Garamond", serif' },
  { name: 'Crimson Text', value: '"Crimson Text", serif' },
  { name: 'Dancing Script', value: '"Dancing Script", cursive' },
  { name: 'Dosis', value: '"Dosis", sans-serif' },
  { name: 'EB Garamond', value: '"EB Garamond", serif' },
  { name: 'Exo 2', value: '"Exo 2", sans-serif' },
  { name: 'Fira Sans', value: '"Fira Sans", sans-serif' },
  { name: 'Heebo', value: '"Heebo", sans-serif' },
  { name: 'Hind', value: '"Hind", sans-serif' },
  { name: 'Inconsolata', value: '"Inconsolata", monospace' },
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Josefin Sans', value: '"Josefin Sans", sans-serif' },
  { name: 'Kanit', value: '"Kanit", sans-serif' },
  { name: 'Karla', value: '"Karla", sans-serif' },
  { name: 'Lato', value: '"Lato", sans-serif' },
  { name: 'Libre Baskerville', value: '"Libre Baskerville", serif' },
  { name: 'Lobster', value: '"Lobster", cursive' },
  { name: 'Lora', value: '"Lora", serif' },
  { name: 'Manrope', value: '"Manrope", sans-serif' },
  { name: 'Merriweather', value: '"Merriweather", serif' },
  { name: 'Montserrat', value: '"Montserrat", sans-serif' },
  { name: 'Mukta', value: '"Mukta", sans-serif' },
  { name: 'Mulish', value: '"Mulish", sans-serif' },
  { name: 'Noto Sans', value: '"Noto Sans", sans-serif' },
  { name: 'Nunito', value: '"Nunito", sans-serif' },
  { name: 'Nunito Sans', value: '"Nunito Sans", sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Oswald', value: '"Oswald", sans-serif' },
  { name: 'Outfit', value: '"Outfit", sans-serif' },
  { name: 'Oxygen', value: '"Oxygen", sans-serif' },
  { name: 'PT Sans', value: '"PT Sans", sans-serif' },
  { name: 'PT Serif', value: '"PT Serif", serif' },
  { name: 'Pacifico', value: '"Pacifico", cursive' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Poppins', value: '"Poppins", sans-serif' },
  { name: 'Quicksand', value: '"Quicksand", sans-serif' },
  { name: 'Raleway', value: '"Raleway", sans-serif' },
  { name: 'Roboto', value: '"Roboto", sans-serif' },
  { name: 'Roboto Condensed', value: '"Roboto Condensed", sans-serif' },
  { name: 'Roboto Mono', value: '"Roboto Mono", monospace' },
  { name: 'Roboto Slab', value: '"Roboto Slab", serif' },
  { name: 'Rubik', value: '"Rubik", sans-serif' },
  { name: 'Signika', value: '"Signika", sans-serif' },
  { name: 'Source Sans 3', value: '"Source Sans 3", sans-serif' },
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { name: 'Tajawal', value: '"Tajawal", sans-serif' },
  { name: 'Teko', value: '"Teko", sans-serif' },
  { name: 'Titillium Web', value: '"Titillium Web", sans-serif' },
  { name: 'Ubuntu', value: '"Ubuntu", sans-serif' },
  { name: 'Varela Round', value: '"Varela Round", sans-serif' },
  { name: 'Work Sans', value: '"Work Sans", sans-serif' },
  { name: 'Yanone Kaffeesatz', value: '"Yanone Kaffeesatz", sans-serif' },
  { name: 'Zilla Slab', value: '"Zilla Slab", serif' },
];

const FieldsPanel: React.FC<FieldsPanelProps> = ({ selectedFieldId, onSelectField }) => {
  const { currentProject, updateCurrentProject } = useAppContext();
  const commonPhotoInputRef = useRef<HTMLInputElement>(null);
  
  const [cropTarget, setCropTarget] = useState<{ src: string; type: 'common' | 'update'; fieldId?: string } | null>(null);

  if (!currentProject) return null;

  const { headers, fields } = currentProject;

  const setFields = (newFields: FieldConfig[] | ((prev: FieldConfig[]) => FieldConfig[])) => {
    if (typeof newFields === 'function') {
      updateCurrentProject({ fields: newFields(fields) });
    } else {
      updateCurrentProject({ fields: newFields });
    }
  };

  const setHeaders = (newHeaders: string[]) => {
    updateCurrentProject({ headers: newHeaders });
  };

  const handleAddField = (headerKey: string, type: 'text' | 'image' | 'shape' = 'text', isStatic = false, extras?: Partial<FieldConfig>) => {
    const newField: FieldConfig = {
      id: Math.random().toString(36).substr(2, 9),
      headerKey,
      x: 50,
      y: 50,
      fontSize: 16,
      color: '#000000',
      fontWeight: 'normal',
      fontFamily: 'sans-serif',
      type,
      width: type === 'image' || type === 'shape' ? 100 : undefined,
      height: type === 'image' || type === 'shape' ? 100 : undefined,
      isStatic,
      ...extras
    };
    setFields((prev) => [...prev, newField]);
    onSelectField(newField.id);
  };

  const handleAddDynamicPhoto = () => {
    const name = window.prompt('Enter Data Key for this photo:', 'Photo');
    if (!name) return;
    if (!headers.includes(name)) {
      setHeaders([...headers, name]);
    }
    handleAddField(name, 'image', false);
  };

  const handleAddDynamicText = () => {
    const name = window.prompt('Enter Data Key for this text field:', 'Name');
    if (!name) return;
    if (!headers.includes(name)) {
      setHeaders([...headers, name]);
    }
    handleAddField(name, 'text', false);
  };

  const handleAddShape = () => {
    handleAddField(`Shape_${Math.floor(Math.random()*1000)}`, 'shape', true, {
      shapeType: 'rectangle',
      backgroundColor: '#e0e7ff',
      borderColor: '#4f46e5',
      borderWidth: 2,
      borderRadius: 0,
      fillTransparent: false,
      borderTransparent: false,
    });
  };

  const handleAddCommonPhotoClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (typeof result === 'string') {
        setCropTarget({ src: result, type: 'common' });
      }
    };
    reader.readAsDataURL(file);
    if (commonPhotoInputRef.current) commonPhotoInputRef.current.value = '';
  };

  const handleUpdateStaticImageClick = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (typeof result === 'string') {
        setCropTarget({ src: result, type: 'update', fieldId: id });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedBase64: string) => {
    if (!cropTarget) return;

    if (cropTarget.type === 'common') {
      handleAddField(`StaticImage_${Math.floor(Math.random()*1000)}`, 'image', true, { staticImage: croppedBase64 });
    } else if (cropTarget.type === 'update' && cropTarget.fieldId) {
      updateField(cropTarget.fieldId, { staticImage: croppedBase64 });
    }
    setCropTarget(null);
  };

  const updateField = (id: string, updates: Partial<FieldConfig>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) onSelectField(null);
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  return (
    <div className="flex flex-col gap-4 h-full">
      {cropTarget && (
        <CropModal 
          imageSrc={cropTarget.src}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropTarget(null)}
        />
      )}

      {/* Add Data Fields */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm shrink-0">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Add Fields</h3>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={handleAddDynamicText}
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-2 py-2 rounded-lg hover:bg-indigo-100 transition-colors font-semibold"
          >
            <Type className="w-3.5 h-3.5" />
            Data Text (Variable)
          </button>
          
          <button
            onClick={handleAddDynamicPhoto}
            className="w-full flex items-center justify-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-2 py-2 rounded-lg hover:bg-indigo-100 transition-colors font-semibold"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Data Image (Variable)
          </button>

          <button
            onClick={() => handleAddField(`StaticText_${Math.floor(Math.random()*1000)}`, 'text', true, { staticText: 'Double click to edit' })}
            className="w-full flex items-center justify-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2 py-2 rounded-lg hover:bg-amber-100 transition-colors font-semibold mt-1"
          >
            <Type className="w-3.5 h-3.5" />
            Static Text Box
          </button>
          
          <button
            onClick={() => commonPhotoInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-2 rounded-lg hover:bg-emerald-100 transition-colors font-semibold mt-1"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            Static Image / Logo
          </button>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={commonPhotoInputRef}
            onChange={handleAddCommonPhotoClick}
          />
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-gray-100">
          <button
            onClick={handleAddShape}
            className="w-full flex items-center justify-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2 py-2 rounded-lg hover:bg-purple-100 transition-colors font-semibold"
          >
            <Square className="w-3.5 h-3.5" />
            Add Shape
          </button>
        </div>
      </div>

      {/* Edit Selected Field */}
      {selectedField && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-1 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Field Properties</h3>
          <div className="flex flex-col gap-4">
            
            {/* Context Header */}
            {selectedField.type !== 'shape' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {selectedField.isStatic ? (selectedField.type === 'text' ? 'Text Content' : 'Field Type') : 'Data Key'}
                </label>
                {selectedField.isStatic && selectedField.type === 'text' ? (
                  <textarea 
                    rows={3}
                    value={selectedField.staticText || ''} 
                    onChange={(e) => updateField(selectedField.id, { staticText: e.target.value })}
                    className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-gray-800 bg-white resize-y"
                  />
                ) : (
                  <input 
                    type="text" 
                    value={selectedField.isStatic ? 'Static Image' : selectedField.headerKey} 
                    disabled={selectedField.isStatic}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateField(selectedField.id, { headerKey: val });
                      if (!headers.includes(val)) {
                        setHeaders([...headers, val]);
                      }
                    }}
                    className={`w-full text-sm p-2 border border-gray-200 rounded-lg font-medium outline-none ${selectedField.isStatic ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white focus:ring-2 focus:ring-indigo-500 text-gray-800'}`}
                  />
                )}
              </div>
            )}
            
            {/* TEXT PROPERTIES */}
            {selectedField.type === 'text' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Font Family</label>
                  <select 
                    value={selectedField.fontFamily || 'sans-serif'}
                    onChange={(e) => updateField(selectedField.id, { fontFamily: e.target.value })}
                    className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {fontFamilies.map(font => (
                      <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Font Size (px)</label>
                    <input 
                      type="number" 
                      value={selectedField.fontSize} 
                      onChange={(e) => updateField(selectedField.id, { fontSize: Number(e.target.value) })}
                      className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Text Color</label>
                    <input 
                      type="color" 
                      value={selectedField.color} 
                      onChange={(e) => updateField(selectedField.id, { color: e.target.value })}
                      className="w-full h-9 p-0.5 border border-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Font Weight</label>
                  <select 
                    value={selectedField.fontWeight}
                    onChange={(e) => updateField(selectedField.id, { fontWeight: e.target.value })}
                    className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="100">Light</option>
                    <option value="900">Black</option>
                  </select>
                </div>
              </>
            )}

            {/* IMAGE PROPERTIES */}
            {selectedField.type === 'image' && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-3">
                  Resize the box on the canvas to set dimensions.
                </p>
                {selectedField.isStatic && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Change Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleUpdateStaticImageClick(selectedField.id, e)}
                      className="w-full text-xs file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                )}
              </div>
            )}

            {/* SHAPE PROPERTIES */}
            {selectedField.type === 'shape' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Shape Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'rectangle', label: 'Rectangle' },
                      { value: 'circle', label: 'Circle' },
                      { value: 'triangle', label: 'Triangle' },
                      { value: 'star', label: 'Star' },
                      { value: 'hexagon', label: 'Hexagon' },
                      { value: 'pentagon', label: 'Pentagon' },
                      { value: 'diamond', label: 'Diamond' },
                      { value: 'line', label: 'Line' },
                    ].map((st) => (
                      <button
                        key={st.value}
                        onClick={() => updateField(selectedField.id, { 
                          shapeType: st.value as any,
                          borderRadius: st.value === 'circle' ? 9999 : 0
                        })}
                        className={`group flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all ${
                          (selectedField.shapeType || 'rectangle') === st.value 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                        title={st.label}
                      >
                        <ShapePreview type={st.value} />
                        <span className="text-[10px] font-semibold text-center leading-tight mt-1">{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedField.shapeType !== 'line' && (
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Fill Color</label>
                      <input 
                        type="color" 
                        value={selectedField.backgroundColor || '#e0e7ff'} 
                        onChange={(e) => updateField(selectedField.id, { backgroundColor: e.target.value })}
                        disabled={selectedField.fillTransparent}
                        className="w-full h-9 p-0.5 border border-gray-200 rounded-lg cursor-pointer disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 h-9">
                      <input 
                        type="checkbox" 
                        id="fill-trans"
                        checked={!!selectedField.fillTransparent}
                        onChange={(e) => updateField(selectedField.id, { fillTransparent: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="fill-trans" className="text-xs text-gray-600 font-medium">None</label>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{selectedField.shapeType === 'line' ? 'Line Color' : 'Border Color'}</label>
                    <input 
                      type="color" 
                      value={selectedField.borderColor || '#4f46e5'} 
                      onChange={(e) => updateField(selectedField.id, { borderColor: e.target.value })}
                      disabled={selectedField.borderTransparent}
                      className="w-full h-9 p-0.5 border border-gray-200 rounded-lg cursor-pointer disabled:opacity-50"
                    />
                  </div>
                  {selectedField.shapeType !== 'line' && (
                    <div className="flex items-center gap-1.5 h-9">
                      <input 
                        type="checkbox" 
                        id="border-trans"
                        checked={!!selectedField.borderTransparent}
                        onChange={(e) => updateField(selectedField.id, { borderTransparent: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="border-trans" className="text-xs text-gray-600 font-medium">None</label>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{selectedField.shapeType === 'line' ? 'Thickness' : 'Border Width'}</label>
                    <input 
                      type="number" 
                      min="0"
                      value={selectedField.borderWidth !== undefined ? selectedField.borderWidth : 2} 
                      onChange={(e) => updateField(selectedField.id, { borderWidth: Number(e.target.value) })}
                      className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  {selectedField.shapeType === 'rectangle' && (
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Corner Radius</label>
                      <input 
                        type="number" 
                        min="0"
                        value={selectedField.borderRadius || 0} 
                        onChange={(e) => updateField(selectedField.id, { borderRadius: Number(e.target.value) })}
                        className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="mt-2 pt-4 border-t border-gray-100">
              <button 
                onClick={() => removeField(selectedField.id)}
                className="flex items-center justify-center w-full gap-2 text-sm text-red-600 bg-white hover:bg-red-50 border border-red-200 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Remove Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldsPanel;

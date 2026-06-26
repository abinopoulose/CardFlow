import React, { useState, useEffect } from 'react';
import { Trash2, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, Plus } from 'lucide-react';
import { useAppContext, type FieldConfig } from '../context/AppContext';
import ShapeRenderer from './ShapeRenderer';
import { CUSTOM_SHAPES, fontFamilies } from './FieldsPanel';

interface PropertiesBarProps {
  selectedFieldIds: string[];
}

const PropertiesBar: React.FC<PropertiesBarProps> = ({ selectedFieldIds }) => {
  const { currentProject, updateCurrentProject } = useAppContext();
  const [shapeSearch, setShapeSearch] = useState('');
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [showGradientDropdown, setShowGradientDropdown] = useState(false);
  const [draftKey, setDraftKey] = useState('');

  const fields = currentProject?.fields || [];
  const selectedField = fields.find((f) => f.id === selectedFieldIds[0]);

  useEffect(() => {
    if (selectedField) {
      setDraftKey(selectedField.headerKey);
    }
  }, [selectedField?.id, selectedField?.headerKey]);

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
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md shadow-xl border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-4 text-sm whitespace-nowrap">
        <span className="text-xs font-bold text-gray-700">{selectedFieldIds.length} elements selected</span>
        <div className="w-px h-4 bg-gray-200"></div>

        <button 
          onClick={() => removeFields(selectedFieldIds)}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Delete Selected Fields"
        >
          <Trash2 className="w-4 h-4" /> Delete All
        </button>
      </div>
    );
  }

  if (!selectedField) return null;
  
  // Hide PropertiesBar for static images as requested
  if (selectedField.type === 'image' && selectedField.isStatic) return null;

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md shadow-xl border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-4 text-sm whitespace-nowrap">
      
      {/* Type / Data Key / Value */}
      {selectedField.type !== 'shape' && selectedField.type !== 'divider' && (
        <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
          {selectedField.isStatic ? (
            selectedField.type === 'text' ? (
              <span className="text-[10px] text-gray-400 italic px-2">Double-click on the text field to edit</span>
            ) : selectedField.type === 'drawing' ? (
              <span className="text-[10px] text-gray-400 italic px-2">Custom Drawing</span>
            ) : selectedField.type === 'image' ? (
              <>
                <span className="text-xs font-semibold text-gray-500">Image</span>
                <input type="text" value="Static Image" disabled className="w-28 px-2 py-1 text-xs border border-gray-200 rounded outline-none bg-gray-100 text-gray-500" />
              </>
            ) : (selectedField.type === 'qrcode' || selectedField.type === 'barcode') ? (
              <>
                <span className="text-xs font-semibold text-gray-500">Value:</span>
                <input 
                  type="text" 
                  value={selectedField.staticText || ''} 
                  onChange={(e) => updateField(selectedField.id, { staticText: e.target.value })}
                  className="w-40 px-2 py-1 text-xs border border-gray-200 rounded outline-none bg-white focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter data here..."
                />
              </>
            ) : null
          ) : (
            <>
              <span className="text-xs font-semibold text-gray-500">Data Key:</span>
              <div className="flex items-center gap-1">
                <input 
                  key={selectedField.id}
                  type="text" 
                  value={draftKey} 
                  onChange={(e) => setDraftKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
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
                    }
                  }}
                  className="w-28 px-2 py-1 text-xs border border-gray-200 rounded outline-none bg-white focus:ring-1 focus:ring-indigo-500"
                />
                {draftKey !== selectedField.headerKey && (
                  <button
                    onClick={() => {
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
                      updateField(selectedField.id, { headerKey: val });
                      if (!headers.includes(val)) {
                        updateCurrentProject({ headers: [...headers, val] });
                      }
                    }}
                    className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-indigo-600 transition-colors shadow-sm"
                  >
                    Save
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* TEXT OPTIONS */}
      {selectedField.type === 'text' && (
        <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
          <select 
            value={selectedField.fontFamily || 'sans-serif'}
            onChange={(e) => updateField(selectedField.id, { fontFamily: e.target.value })}
            className="w-32 text-xs p-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            {fontFamilies.map(font => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-0.5 border-l border-gray-200 pl-2">
            <button
              onClick={() => updateField(selectedField.id, { fontWeight: selectedField.fontWeight === 'bold' || selectedField.fontWeight === '900' ? 'normal' : 'bold' })}
              className={`p-1.5 rounded ${selectedField.fontWeight === 'bold' || selectedField.fontWeight === '900' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => updateField(selectedField.id, { fontStyle: selectedField.fontStyle === 'italic' ? 'normal' : 'italic' })}
              className={`p-1.5 rounded ${selectedField.fontStyle === 'italic' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                let dec = selectedField.textDecoration || 'none';
                if (dec.includes('underline')) dec = dec.replace('underline', '').trim();
                else dec = (dec === 'none' ? 'underline' : (dec + ' underline').trim());
                if (dec === '') dec = 'none';
                updateField(selectedField.id, { textDecoration: dec });
              }}
              className={`p-1.5 rounded ${(selectedField.textDecoration || '').includes('underline') ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                let dec = selectedField.textDecoration || 'none';
                if (dec.includes('line-through')) dec = dec.replace('line-through', '').trim();
                else dec = (dec === 'none' ? 'line-through' : (dec + ' line-through').trim());
                if (dec === '') dec = 'none';
                updateField(selectedField.id, { textDecoration: dec });
              }}
              className={`p-1.5 rounded ${(selectedField.textDecoration || '').includes('line-through') ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-0.5 border-l border-gray-200 pl-2">
            {[
              { id: 'left', icon: AlignLeft },
              { id: 'center', icon: AlignCenter },
              { id: 'right', icon: AlignRight },
              { id: 'justify', icon: AlignJustify }
            ].map(align => (
              <button
                key={align.id}
                onClick={() => updateField(selectedField.id, { textAlign: align.id as any })}
                className={`p-1.5 rounded ${(selectedField.textAlign || 'left') === align.id ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                title={`Align ${align.id}`}
              >
                <align.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
            <select
              value={selectedField.textTransform || 'none'}
              onChange={(e) => updateField(selectedField.id, { textTransform: e.target.value })}
              className="w-24 text-xs p-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer bg-white"
            >
              <option value="none">Normal</option>
              <option value="uppercase">UPPERCASE</option>
              <option value="lowercase">lowercase</option>
              <option value="capitalize">Capitalize Words</option>
              <option value="sentence">Sentence case</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-semibold">SIZE</span>
            <input 
              type="number" 
              value={selectedField.fontSize} 
              onChange={(e) => updateField(selectedField.id, { fontSize: Number(e.target.value) })}
              className="w-14 text-xs p-1 border border-gray-200 rounded outline-none text-center"
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-semibold">COLOR</span>
            <input 
              type="color" 
              value={selectedField.color} 
              onChange={(e) => updateField(selectedField.id, { color: e.target.value })}
              className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* QR / BARCODE OPTIONS */}
      {(selectedField.type === 'qrcode' || selectedField.type === 'barcode') && (
        <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-semibold">COLOR</span>
            <input 
              type="color" 
              value={selectedField.color || '#000000'} 
              onChange={(e) => updateField(selectedField.id, { color: e.target.value })}
              className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* SHAPE OPTIONS */}
      {selectedField.type === 'shape' && (
        <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
          <div className="relative">
            <button 
              onClick={() => setShowShapeDropdown(!showShapeDropdown)}
              className="flex items-center justify-between w-28 text-xs p-1.5 border border-gray-200 rounded bg-white hover:bg-gray-50"
            >
              <span className="truncate">{CUSTOM_SHAPES.find(s => s.value === selectedField.shapeType)?.label || 'Shape'}</span>
              <span className="text-gray-400 text-[10px]">▼</span>
            </button>
            {showShapeDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 shadow-xl rounded-lg p-2 z-50">
                <input 
                  type="text" 
                  placeholder="Search shapes..." 
                  value={shapeSearch}
                  onChange={(e) => setShapeSearch(e.target.value)}
                  className="w-full text-xs p-1.5 mb-2 border border-gray-200 rounded outline-none"
                />
                <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto custom-scrollbar">
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
                      className="flex flex-col items-center justify-center py-1.5 rounded hover:bg-indigo-50 group"
                      title={st.label}
                    >
                      <ShapeRenderer field={{ ...selectedField, shapeType: st.value as any }} previewMode={true} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selectedField.shapeType !== 'line' && (
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded border border-gray-200">
              <span className="text-[10px] text-gray-500 font-semibold px-1">FILL</span>
              <input 
                type="color" 
                value={selectedField.backgroundColor || '#e0e7ff'} 
                onChange={(e) => updateField(selectedField.id, { backgroundColor: e.target.value, fillTransparent: false })}
                className="w-5 h-5 p-0 border-0 cursor-pointer"
              />
              <button 
                onClick={() => updateField(selectedField.id, { fillTransparent: !selectedField.fillTransparent })}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedField.fillTransparent ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-200'}`}
              >
                NONE
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded border border-gray-200">
            <span className="text-[10px] text-gray-500 font-semibold px-1">{selectedField.shapeType === 'line' ? 'LINE' : 'BORDER'}</span>
            <input 
              type="color" 
              value={selectedField.borderColor || '#4f46e5'} 
              onChange={(e) => updateField(selectedField.id, { borderColor: e.target.value, borderTransparent: false })}
              className="w-5 h-5 p-0 border-0 cursor-pointer"
            />
            {selectedField.shapeType !== 'line' && (
              <button 
                onClick={() => updateField(selectedField.id, { borderTransparent: !selectedField.borderTransparent })}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedField.borderTransparent ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-200'}`}
              >
                NONE
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-semibold">{selectedField.shapeType === 'line' ? 'THICKNESS' : 'WIDTH'}</span>
            <input 
              type="number" 
              min="0"
              value={selectedField.borderWidth !== undefined ? selectedField.borderWidth : 2} 
              onChange={(e) => updateField(selectedField.id, { borderWidth: Number(e.target.value) })}
              className="w-12 text-xs p-1 border border-gray-200 rounded outline-none text-center"
            />
          </div>

          {selectedField.shapeType === 'rectangle' && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-500 font-semibold">RADIUS</span>
              <input 
                type="number" 
                min="0"
                value={selectedField.borderRadius || 0} 
                onChange={(e) => updateField(selectedField.id, { borderRadius: Number(e.target.value) })}
                className="w-12 text-xs p-1 border border-gray-200 rounded outline-none text-center"
              />
            </div>
          )}

          <div className="flex items-center gap-1 ml-2">
            <span className="text-[10px] text-gray-500 font-semibold">OPACITY</span>
            <input 
              type="range"
              min="0" max="1" step="0.05"
              value={selectedField.opacity ?? 1}
              onChange={(e) => updateField(selectedField.id, { opacity: parseFloat(e.target.value) })}
              className="w-20"
            />
          </div>
        </div>
      )}

      {/* DIVIDER OPTIONS */}
      {selectedField.type === 'divider' && (
        <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
          <div className="flex items-center gap-1">
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
              className="w-20 text-xs p-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer bg-white"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
              <option value="wavy">Wavy</option>
              <option value="zigzag">Zigzag</option>
            </select>
          </div>
          
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded border border-gray-200 relative">
            <span className="text-[10px] text-gray-500 font-semibold px-1">COLOR</span>
            
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
              className="w-5 h-5 p-0 border-0 cursor-pointer"
            />
            
            <button 
              onClick={() => {
                if (selectedField.gradient) {
                  setShowGradientDropdown(!showGradientDropdown);
                } else {
                  updateField(selectedField.id, { gradient: { colors: [selectedField.borderColor || '#4f46e5', '#ec4899'], direction: 'to right' }, lineStyle: 'solid' });
                  setShowGradientDropdown(true);
                }
              }}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedField.gradient ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:bg-gray-200'}`}
              title="Toggle/Edit Gradient"
            >
              GRADIENT
            </button>

            {showGradientDropdown && selectedField.gradient && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-lg p-3 z-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-700">Gradient Colors</span>
                  <button 
                    onClick={() => {
                      updateField(selectedField.id, { gradient: undefined });
                      setShowGradientDropdown(false);
                    }}
                    className="text-[10px] bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded font-bold transition-colors"
                  >
                    Remove Gradient
                  </button>
                </div>
                
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                  {selectedField.gradient.colors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={color}
                        onChange={(e) => {
                          const newColors = [...selectedField.gradient!.colors];
                          newColors[idx] = e.target.value;
                          updateField(selectedField.id, { gradient: { ...selectedField.gradient!, colors: newColors } });
                        }}
                        className="w-6 h-6 p-0 border-0 cursor-pointer rounded"
                      />
                      <span className="text-xs text-gray-500 flex-1">{color.toUpperCase()}</span>
                      {selectedField.gradient!.colors.length > 2 && (
                        <button 
                          onClick={() => {
                            const newColors = selectedField.gradient!.colors.filter((_, i) => i !== idx);
                            updateField(selectedField.id, { gradient: { ...selectedField.gradient!, colors: newColors } });
                          }}
                          className="text-gray-400 hover:text-red-500"
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
                    className="mt-2 w-full flex items-center justify-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-1.5 rounded transition-colors"
                  >
                    <Plus className="w-3 h-3" /> ADD COLOR
                  </button>
                )}

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-500 block mb-1">DIRECTION / ANGLE</span>
                  <select 
                    value={selectedField.gradient.direction.endsWith('deg') ? 'angle' : selectedField.gradient.direction}
                    onChange={(e) => {
                      if (e.target.value === 'angle') {
                        updateField(selectedField.id, { gradient: { ...selectedField.gradient!, direction: '90deg' } });
                      } else {
                        updateField(selectedField.id, { gradient: { ...selectedField.gradient!, direction: e.target.value } });
                      }
                    }}
                    className="w-full text-xs p-1.5 border border-gray-200 rounded outline-none mb-2"
                  >
                    <option value="to right">To Right (→)</option>
                    <option value="to left">To Left (←)</option>
                    <option value="to bottom">To Bottom (↓)</option>
                    <option value="to top">To Top (↑)</option>
                    <option value="to bottom right">To Bottom Right (↘)</option>
                    <option value="to top left">To Top Left (↖)</option>
                    <option value="to bottom left">To Bottom Left (↙)</option>
                    <option value="to top right">To Top Right (↗)</option>
                    <option value="angle">Custom Angle...</option>
                  </select>
                  
                  {selectedField.gradient.direction.endsWith('deg') && (
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="0" max="360" 
                        value={parseInt(selectedField.gradient.direction, 10) || 0}
                        onChange={(e) => updateField(selectedField.id, { gradient: { ...selectedField.gradient!, direction: `${e.target.value}deg` } })}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500 w-8 text-right">{parseInt(selectedField.gradient.direction, 10) || 0}°</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-semibold">THICKNESS</span>
            <input 
              type="number" 
              min="1"
              value={selectedField.borderWidth !== undefined ? selectedField.borderWidth : 2} 
              onChange={(e) => updateField(selectedField.id, { borderWidth: Number(e.target.value) })}
              className="w-12 text-xs p-1 border border-gray-200 rounded outline-none text-center"
            />
          </div>

          <div className="flex items-center gap-1 ml-2">
            <span className="text-[10px] text-gray-500 font-semibold">OPACITY</span>
            <input 
              type="range"
              min="0" max="1" step="0.05"
              value={selectedField.opacity ?? 1}
              onChange={(e) => updateField(selectedField.id, { opacity: parseFloat(e.target.value) })}
              className="w-20"
            />
          </div>
        </div>
      )}

      {/* Drawing Specific Properties */}
      {selectedField.type === 'drawing' && (
        <div className="flex items-center gap-4 border-l border-gray-200 pl-4 ml-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-semibold">COLOR</span>
            <input 
              type="color" 
              value={selectedField.color || '#000000'}
              onChange={(e) => handleDrawingColorChange(selectedField.id, e.target.value, selectedField.originalImage || selectedField.staticImage)}
              className="w-6 h-6 p-0 border-0 rounded cursor-pointer overflow-hidden"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-semibold">OPACITY</span>
            <input 
              type="range"
              min="0" max="1" step="0.05"
              value={selectedField.opacity ?? 1}
              onChange={(e) => updateField(selectedField.id, { opacity: parseFloat(e.target.value) })}
              className="w-20"
            />
          </div>
        </div>
      )}

      {/* Delete */}
      <button 
        onClick={() => removeFields([selectedField.id])}
        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete Field"
      >
        <Trash2 className="w-4 h-4" />
      </button>

    </div>
  );
};

export default PropertiesBar;

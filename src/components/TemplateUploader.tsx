import React, { useRef, useState } from 'react';
import { ImagePlus, Trash2, Crop } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import CropModal from './CropModal';

const TemplateUploader: React.FC = () => {
  const { currentProject, updateCurrentProject } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropTarget, setCropTarget] = useState<string | null>(null);

  if (!currentProject) return null;

  const { templateImage, originalTemplateImage, backgroundType = 'image', backgroundColor = '#ffffff', backgroundGradient = { colors: ['#ffffff', '#f3f4f6'], direction: 'to right' }, width, height } = currentProject;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (typeof result === 'string') {
        updateCurrentProject({ originalTemplateImage: result });
        setCropTarget(result);
      }
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      {cropTarget && (
        <CropModal 
          imageSrc={cropTarget}
          aspect={width / height}
          onCropComplete={(croppedBase64) => {
            updateCurrentProject({ templateImage: croppedBase64 });
            setCropTarget(null);
          }}
          onCancel={() => setCropTarget(null)}
        />
      )}

      {/* Canvas Dimensions Section */}
      <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Canvas Dimensions</h2>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col gap-3">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Width</label>
            <input 
              type="number" 
              value={width || 400}
              onChange={(e) => updateCurrentProject({ width: Math.max(100, parseInt(e.target.value) || 100) })}
              className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Height</label>
            <input 
              type="number" 
              value={height || 600}
              onChange={(e) => updateCurrentProject({ height: Math.max(100, parseInt(e.target.value) || 100) })}
              className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>
      </div>

      {/* Background Design Section */}
      <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Background Design</h2>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-gray-100/80 p-1.5 rounded-xl mb-6 shadow-inner w-full">
        {['image', 'color', 'gradient', 'transparent'].map(type => (
          <button
            key={type}
            onClick={() => updateCurrentProject({ backgroundType: type as any })}
            className={`py-2 px-3 text-sm font-semibold rounded-lg capitalize transition-all ${backgroundType === type ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'}`}
          >
            {type}
          </button>
        ))}
      </div>
      
      {backgroundType === 'image' && (
        !templateImage ? (
          <div 
            className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/60 hover:border-indigo-300 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="w-10 h-10 text-indigo-400 mb-3" />
            <p className="text-sm font-medium text-indigo-900 mb-1">Click or drag image to this area</p>
            <p className="text-xs text-indigo-500">Supports .png, .jpg</p>
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg" 
              className="hidden" 
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="w-full flex justify-center border rounded-xl overflow-hidden max-h-48 bg-gray-100 relative group shadow-inner">
              <img src={templateImage} alt="Template Preview" className="object-contain h-full" />
              <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px]">
                {originalTemplateImage && (
                  <button 
                    onClick={() => setCropTarget(originalTemplateImage)}
                    className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-lg"
                  >
                    <Crop className="w-4 h-4" />
                    Recrop
                  </button>
                )}
                <button 
                  onClick={() => updateCurrentProject({ templateImage: null, originalTemplateImage: null })}
                  className="flex items-center gap-1.5 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-lg transition-colors shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {backgroundType === 'color' && (
        <div className="flex items-center gap-4 bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
          <label className="text-sm font-medium text-gray-700">Solid Color:</label>
          <div className="relative">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => updateCurrentProject({ backgroundColor: e.target.value })}
              className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
            />
          </div>
          <input 
            type="text" 
            value={backgroundColor}
            onChange={(e) => updateCurrentProject({ backgroundColor: e.target.value })}
            className="text-sm font-mono text-gray-700 border border-gray-200 rounded-lg px-3 py-2 w-28 uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      )}

      {backgroundType === 'gradient' && (
        <div className="flex flex-col gap-5 bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
              <span>Gradient Colors (2 to 10)</span>
              {backgroundGradient.colors.length < 10 && (
                <button 
                  onClick={() => updateCurrentProject({ backgroundGradient: { ...backgroundGradient, colors: [...backgroundGradient.colors, '#ffffff'] } })}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold bg-indigo-50 px-2 py-1 rounded transition-colors"
                >
                  + Add Color
                </button>
              )}
            </label>
            <div className="flex flex-col gap-2">
              {backgroundGradient.colors.map((color, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="text-xs text-gray-400 font-mono w-4">{idx + 1}.</span>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...backgroundGradient.colors];
                      newColors[idx] = e.target.value;
                      updateCurrentProject({ backgroundGradient: { ...backgroundGradient, colors: newColors } });
                    }}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0 shadow-sm"
                  />
                  <input 
                    type="text" 
                    value={color}
                    onChange={(e) => {
                      const newColors = [...backgroundGradient.colors];
                      newColors[idx] = e.target.value;
                      updateCurrentProject({ backgroundGradient: { ...backgroundGradient, colors: newColors } });
                    }}
                    className="text-sm font-mono text-gray-700 border border-gray-200 rounded-md px-2 py-1.5 w-24 uppercase focus:ring-2 focus:ring-indigo-500 outline-none flex-1"
                  />
                  {backgroundGradient.colors.length > 2 && (
                    <button 
                      onClick={() => {
                        const newColors = backgroundGradient.colors.filter((_, i) => i !== idx);
                        updateCurrentProject({ backgroundGradient: { ...backgroundGradient, colors: newColors } });
                      }}
                      className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                      title="Remove color"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Direction / Angle:</label>
            <div className="flex items-center gap-3">
              <select
                value={backgroundGradient.direction.endsWith('deg') ? 'angle' : backgroundGradient.direction}
                onChange={(e) => {
                  if (e.target.value === 'angle') {
                    updateCurrentProject({ backgroundGradient: { ...backgroundGradient, direction: '90deg' } });
                  } else {
                    updateCurrentProject({ backgroundGradient: { ...backgroundGradient, direction: e.target.value } });
                  }
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm flex-1"
              >
                <option value="to right">To Right</option>
                <option value="to left">To Left</option>
                <option value="to bottom">To Bottom</option>
                <option value="to top">To Top</option>
                <option value="to bottom right">To Bottom Right</option>
                <option value="to bottom left">To Bottom Left</option>
                <option value="to top right">To Top Right</option>
                <option value="to top left">To Top Left</option>
                <option value="angle">Angle...</option>
              </select>
              
              {backgroundGradient.direction.endsWith('deg') && (
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={parseInt(backgroundGradient.direction, 10) || 0}
                    onChange={(e) => updateCurrentProject({ backgroundGradient: { ...backgroundGradient, direction: `${e.target.value}deg` } })}
                    className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-center"
                  />
                  <span className="text-sm text-gray-500 font-medium">deg</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {backgroundType === 'transparent' && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg mb-3" style={{ backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%)', backgroundSize: '16px 16px' }}></div>
          <p className="text-sm font-medium text-gray-600">Transparent Background</p>
          <p className="text-xs text-gray-400 mt-1">Background will be completely transparent.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default TemplateUploader;

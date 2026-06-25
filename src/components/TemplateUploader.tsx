import React, { useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import CropModal from './CropModal';

const TemplateUploader: React.FC = () => {
  const { currentProject, updateCurrentProject } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropTarget, setCropTarget] = useState<string | null>(null);

  if (!currentProject) return null;

  const { templateImage, width, height } = currentProject;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (typeof result === 'string') {
        setCropTarget(result);
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
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

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">2. Background Image</h2>
        {templateImage && (
          <button 
            onClick={() => updateCurrentProject({ templateImage: null })}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        )}
      </div>
      
      {!templateImage ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="w-10 h-10 text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 mb-1">Click or drag image to this area</p>
          <p className="text-xs text-gray-400">Supports .png, .jpg</p>
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
          <div className="w-full flex justify-center border rounded overflow-hidden max-h-48 bg-gray-100">
            <img src={templateImage} alt="Template Preview" className="object-contain h-full" />
          </div>
          <p className="text-xs text-center text-gray-500 mt-1">Template background is set. Remove to change it.</p>
        </div>
      )}
    </div>
  );
};

export default TemplateUploader;

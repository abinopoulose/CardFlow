import React, { useRef } from 'react';
import { ImagePlus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const TemplateUploader: React.FC = () => {
  const { setTemplateImage, templateImage } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result;
      if (typeof result === 'string') {
        setTemplateImage(result);
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
      <h2 className="text-lg font-semibold mb-4 text-gray-800">2. Upload Template Image</h2>
      
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

      {templateImage && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between bg-green-50 text-green-700 px-4 py-3 rounded-md">
            <span className="text-sm font-medium">Template image loaded.</span>
          </div>
          <div className="w-full flex justify-center border rounded overflow-hidden max-h-48 bg-gray-100">
            <img src={templateImage} alt="Template Preview" className="object-contain h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateUploader;

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Previewer: React.FC = () => {
  const { templateImage, data, fields, isSingleMode, singleData, photosMap } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const dataset = isSingleMode ? [singleData] : data;

  if (!templateImage || dataset.length === 0 || fields.length === 0) {
    return null;
  }

  const currentData = dataset[currentIndex] || {};

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < dataset.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-500" />
          4. Live Preview
        </h2>
        {!isSingleMode && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              Previewing {currentIndex + 1} of {dataset.length}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNext} 
                disabled={currentIndex === dataset.length - 1}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center border bg-gray-100/50 rounded-xl p-8">
        <div 
          className="relative bg-white shadow-xl overflow-hidden pointer-events-none rounded-sm"
          style={{ width: '400px' }} 
        >
          <img 
            src={templateImage} 
            alt="Template Background" 
            className="w-full h-auto block"
          />
          {fields.map((field) => {
            const rawVal = currentData[field.headerKey];
            const isImage = field.type === 'image';
            const val = isImage && rawVal && photosMap[String(rawVal)] ? photosMap[String(rawVal)] : rawVal;

            return (
              <div
                key={field.id}
                style={{
                  position: 'absolute',
                  left: `${field.x}px`,
                  top: `${field.y}px`,
                  ...(isImage ? {
                    width: `${field.width}px`,
                    height: `${field.height}px`,
                  } : {
                    fontSize: `${field.fontSize}px`,
                    color: field.color,
                    fontWeight: field.fontWeight,
                    whiteSpace: 'nowrap',
                  })
                }}
              >
                {isImage && val ? (
                  <img src={String(val)} alt={field.headerKey} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  val !== undefined && val !== null ? String(val) : ''
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Previewer;

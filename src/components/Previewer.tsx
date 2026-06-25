import React from 'react';
import { useAppContext, type FieldConfig } from '../context/AppContext';

const renderShape = (field: FieldConfig) => {
  const fill = field.fillTransparent ? 'transparent' : (field.backgroundColor || '#e0e7ff');
  const stroke = field.borderTransparent ? 'transparent' : (field.borderColor || '#4f46e5');
  const strokeWidth = field.borderWidth !== undefined ? field.borderWidth : 2;

  switch (field.shapeType) {
    case 'circle':
      return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <ellipse 
            cx="50%" cy="50%" 
            rx={`calc(50% - ${strokeWidth/2}px)`} 
            ry={`calc(50% - ${strokeWidth/2}px)`} 
            fill={fill} 
            stroke={stroke} 
            strokeWidth={strokeWidth} 
          />
        </svg>
      );
    case 'triangle':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon 
            points="50,2 98,98 2,98" 
            fill={fill} 
            stroke={stroke} 
            strokeWidth={strokeWidth} 
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );
    case 'star':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon 
            points="50,5 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" 
            fill={fill} 
            stroke={stroke} 
            strokeWidth={strokeWidth} 
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );
    case 'hexagon':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon 
            points="50,5 95,27 95,73 50,95 5,73 5,27" 
            fill={fill} 
            stroke={stroke} 
            strokeWidth={strokeWidth} 
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );
    case 'pentagon':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon 
            points="50,5 95,38 78,95 22,95 5,38" 
            fill={fill} 
            stroke={stroke} 
            strokeWidth={strokeWidth} 
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );
    case 'diamond':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon 
            points="50,5 95,50 50,95 5,50" 
            fill={fill} 
            stroke={stroke} 
            strokeWidth={strokeWidth} 
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );
    case 'line':
      return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line 
            x1="0" y1="50%" x2="100%" y2="50%" 
            stroke={stroke} 
            strokeWidth={strokeWidth} 
          />
        </svg>
      );
    case 'rectangle':
    default:
      return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect 
            x={strokeWidth/2} 
            y={strokeWidth/2} 
            width={`calc(100% - ${strokeWidth}px)`} 
            height={`calc(100% - ${strokeWidth}px)`} 
            rx={field.borderRadius || 0} 
            fill={fill} 
            stroke={stroke} 
            strokeWidth={strokeWidth} 
          />
        </svg>
      );
  }
};

const Previewer: React.FC = () => {
  const { currentProject } = useAppContext();

  if (!currentProject) return null;

  const { templateImage, data, fields, isSingleMode, singleData, photosMap, width, height } = currentProject;

  const dataset = isSingleMode ? [singleData] : data;

  if (dataset.length === 0 && fields.length === 0) {
    return (
      <div className="text-center p-4 text-gray-400 text-sm">
        Add fields or data to see preview.
      </div>
    );
  }

  // Cap dataset for preview so it doesn't crash the browser if they upload 10,000 rows.
  // We'll show up to 100 in the live preview.
  const previewDataset = dataset.slice(0, 100);

  return (
    <div className="flex flex-col items-center w-full gap-6 overflow-y-auto max-h-[800px] p-2">
      {dataset.length > 100 && (
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-xs font-semibold w-full text-center shadow-sm">
          Previewing first 100 cards out of {dataset.length}
        </div>
      )}
      
      {previewDataset.map((currentData, index) => (
        <div key={index} className="flex flex-col items-center shrink-0">
          {!isSingleMode && dataset.length > 1 && (
            <span className="text-xs font-bold text-gray-500 mb-2">Card {index + 1}</span>
          )}
          <div 
            className="relative shadow-xl overflow-hidden pointer-events-none rounded-sm border border-gray-200 shrink-0"
            style={{ width: `${width}px`, height: `${height}px`, backgroundColor: '#ffffff' }} 
          >
            {templateImage && (
              <img 
                src={templateImage} 
                alt="Template Background" 
                className="w-full h-full object-cover block absolute inset-0"
              />
            )}
            {fields.map((field) => {
              const rawVal = currentData[field.headerKey];
              const isImage = field.type === 'image';
              let val: any = rawVal;
              
              if (isImage) {
                if (field.isStatic) {
                  val = field.staticImage;
                } else if (isSingleMode) {
                  val = singleData[field.headerKey];
                } else {
                  const idNumber = currentData['id_number'];
                  if (idNumber && photosMap[field.headerKey]?.[String(idNumber)]) {
                    val = photosMap[field.headerKey][String(idNumber)];
                  }
                }
              }

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
                  {field.type === 'shape' ? (
                    <div className="w-full h-full pointer-events-none">
                      {renderShape(field)}
                    </div>
                  ) : isImage ? (
                    val ? <img src={String(val)} alt={field.headerKey} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null
                  ) : (
                    <div
                      style={{
                        fontFamily: field.fontFamily || 'sans-serif',
                        fontSize: `${field.fontSize}px`,
                        color: field.color,
                        fontWeight: field.fontWeight,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {field.isStatic ? (field.staticText || '') : (currentData[field.headerKey] !== undefined && currentData[field.headerKey] !== null ? String(currentData[field.headerKey]) : '')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Previewer;

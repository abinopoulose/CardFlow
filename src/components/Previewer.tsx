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
          <ellipse cx="50%" cy="50%" rx={`calc(50% - ${strokeWidth/2}px)`} ry={`calc(50% - ${strokeWidth/2}px)`}  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,2 98,98 2,98"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'star':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'hexagon':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 95,27 95,73 50,95 5,73 5,27"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'pentagon':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 95,38 78,95 22,95 5,38"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'diamond':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 95,50 50,95 5,50"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'line':
      return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="50%" x2="100%" y2="50%"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'ellipse':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="50" rx="48" ry="30"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'cross':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 10 H60 V40 H90 V60 H60 V90 H40 V60 H10 V40 H40 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'heart':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 85 C50 85 10 55 10 30 C10 15 25 5 40 15 C50 25 50 25 50 25 C50 25 50 25 60 15 C75 5 90 15 90 30 C90 55 50 85 50 85 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20 40, 60 40, 60 20, 90 50, 60 80, 60 60, 20 60"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="80 40, 40 40, 40 20, 10 50, 40 80, 40 60, 80 60"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'arrow-up':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="40 80, 40 40, 20 40, 50 10, 80 40, 60 40, 60 80"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'arrow-down':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="40 20, 40 60, 20 60, 50 90, 80 60, 60 60, 60 20"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'shield':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20 L50 10 L90 20 V50 C90 75 50 90 50 90 C50 90 10 75 10 50 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'tag':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="10 30, 30 10, 90 10, 90 90, 30 90, 10 70"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'message':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20 H90 V70 H30 L10 90 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'moon':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 10 C30 10 10 30 10 60 C10 80 25 90 40 90 C25 75 25 45 60 30 C75 25 90 35 90 35 C85 15 75 10 60 10 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'parallelogram':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20 80, 40 20, 90 20, 70 80"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'trapezoid':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20 80, 30 20, 70 20, 80 80"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'octagon':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="30 10, 70 10, 90 30, 90 70, 70 90, 30 90, 10 70, 10 30"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'heptagon':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50 10, 85 25, 90 60, 65 90, 35 90, 10 60, 15 25"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'nonagon':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50 10, 75 20, 90 45, 80 75, 55 90, 30 85, 10 60, 15 30, 35 10"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'decagon':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50 10, 75 15, 90 35, 90 65, 75 85, 50 90, 25 85, 10 65, 10 35, 25 15"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'dodecagon':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50 10, 70 15, 85 30, 90 50, 85 70, 70 85, 50 90, 30 85, 15 70, 10 50, 15 30, 30 15"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'bookmark':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20 10, 80 10, 80 90, 50 70, 20 90"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'flag':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20 10, 90 10, 70 30, 90 50, 20 50"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'chevron-up':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 60 L50 20 L90 60"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 40 L50 80 L90 40"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'chevron-left':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 10 L20 50 L60 90"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 10 L80 50 L40 90"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'plus':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 50 H80 M50 20 V80"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'minus':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 50 H80"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'times':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 20 L80 80 M80 20 L20 80"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'divide':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 50 H80 M50 25 A 5 5 0 1 0 50 26 M50 75 A 5 5 0 1 0 50 76" strokeLinecap="round"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'equals':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 35 H80 M20 65 H80"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'home':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 50 L50 10 L90 50 V90 H10 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'mail':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 25 L50 55 L90 25 V75 H10 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'user':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 45 A 20 20 0 1 0 50 5 A 20 20 0 1 0 50 45 Z M10 95 C10 65 90 65 90 95"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'lock':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 40 V25 A 20 20 0 0 1 70 25 V40 H80 V90 H20 V40 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'unlock':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 40 V25 A 20 20 0 0 1 70 25 V25 M70 40 H80 V90 H20 V40 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'search':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 60 A 20 20 0 1 0 40 20 A 20 20 0 1 0 40 60 Z M55 55 L85 85"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'bell':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 70 C20 70 30 60 30 40 C30 20 70 20 70 40 C70 60 80 70 80 70 H20 Z M40 70 A 10 10 0 0 0 60 70"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'camera':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 30 L30 15 H70 L80 30 H90 V80 H10 V30 Z M50 70 A 15 15 0 1 0 50 40 A 15 15 0 1 0 50 70 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'cloud':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 60 A 15 15 0 0 1 25 30 C 25 15 55 15 60 25 A 20 20 0 0 1 80 55 A 15 15 0 0 1 70 80 H25 A 15 15 0 0 1 25 60 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'music':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 70 A 10 10 0 1 0 30 50 A 10 10 0 1 0 30 70 Z M70 60 A 10 10 0 1 0 70 40 A 10 10 0 1 0 70 60 Z M40 60 V10 L80 20 V50"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'sun':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <g><circle cx="50" cy="50" r="20"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" /><path d="M50 10 V20 M50 80 V90 M10 50 H20 M80 50 H90 M22 22 L29 29 M71 71 L78 78 M22 78 L29 71 M71 29 L78 22"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" /></g>
        </svg>
      );
    case 'zap':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="60 10, 20 50, 45 55, 40 90, 80 50, 55 45"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      );
    case 'leaf':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 C 90 10 90 50 90 50 C 90 90 50 90 50 90 C 10 90 10 50 10 50 C 10 10 50 10 50 10 Z"  fill={fill} stroke={stroke} strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
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

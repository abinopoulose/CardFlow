import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ShapeRenderer from '../canvas/ShapeRenderer';
import DividerRenderer from '../canvas/DividerRenderer';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';



const FullScreenViewer: React.FC<{
  data: any;
  onClose: () => void;
  singleData: any;
  photosMap: any;
  width: number;
  height: number;
  backgroundType: string;
  backgroundColor: string;
  backgroundGradient: any;
  templateImage: string | null;
  fields: any[];
  isSingleMode: boolean;
}> = ({
  data, onClose, singleData, photosMap, width, height, backgroundType, backgroundColor, backgroundGradient, templateImage, fields, isSingleMode
}) => {
  const initialScale = Math.min(1, (window.innerWidth - 100) / width, (window.innerHeight - 100) / height);
  const [scale, setScale] = useState(initialScale);

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-8">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[101]"
      >
        <X className="w-6 h-6" />
      </button>
      
      <TransformWrapper
        initialScale={initialScale}
        minScale={0.1}
        maxScale={5}
        centerOnInit
        wheel={{ disabled: true }}
        pinch={{ disabled: true }}
        onTransform={(ref) => setScale(ref.state.scale)}
        onInit={(ref) => setScale(ref.state.scale)}
      >
        {({ resetTransform, setTransform, state }) => {
          const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const zoomFactor = e.deltaY > 0 ? -0.1 : 0.1;
            const currentScale = state.scale;
            let newScale = currentScale + zoomFactor;
            newScale = Math.max(0.1, Math.min(5, newScale));

            const newPositionX = mouseX - ((mouseX - state.positionX) / currentScale) * newScale;
            const newPositionY = mouseY - ((mouseY - state.positionY) / currentScale) * newScale;

            setTransform(newPositionX, newPositionY, newScale);
          };

          return (
            <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing" onWheel={handleWheel}>
              <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                <div 
                  className="relative shadow-2xl overflow-hidden bg-white shrink-0 mx-auto"
                  style={{ 
                    width: `${width}px`, 
                    height: `${height}px`, 
                    backgroundColor: backgroundType === 'color' ? backgroundColor : (backgroundType === 'transparent' ? 'transparent' : '#ffffff'),
                    backgroundImage: backgroundType === 'gradient' ? `linear-gradient(${backgroundGradient.direction}, ${backgroundGradient.colors.join(', ')})` : 'none',
                  }} 
                >
          {backgroundType === 'image' && templateImage && (
            <img 
              src={templateImage} 
              alt="Template Background" 
              className="w-full h-full object-cover block absolute inset-0"
            />
          )}
          {fields.map((field: any) => {
            if (field.isHidden) return null;

            const rawVal = data[field.headerKey];
            const isImage = field.type === 'image';
            const isShape = field.type === 'shape';
            const isQrCode = field.type === 'qrcode';
            const isBarcode = field.type === 'barcode';
            const isDivider = field.type === 'divider';
            const isDrawing = field.type === 'drawing';
            const isSizable = isImage || isShape || isQrCode || isBarcode || isDivider || isDrawing;
            let val: any = rawVal;
            
            if (isImage) {
              if (field.isStatic) {
                val = field.staticImage;
              } else if (isSingleMode) {
                val = singleData[field.headerKey];
              } else {
                const idNumber = data['id_number'];
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
                  ...(isSizable ? {
                    width: `${field.width || 100}px`,
                    height: `${field.height || 100}px`,
                  } : {
                    fontSize: `${field.fontSize}px`,
                    color: field.color,
                    fontWeight: field.fontWeight,
                    fontStyle: field.fontStyle || 'normal',
                    textDecoration: field.textDecoration || 'none',
                    textAlign: field.textAlign || 'left',
                    textTransform: field.textTransform === 'sentence' ? 'none' : (field.textTransform || 'none') as any,
                    whiteSpace: 'pre-wrap',
                    width: '100%',
                  })
                }}
              >
                {field.type === 'shape' ? (
                  <div className="w-full h-full pointer-events-none" style={{ opacity: field.opacity ?? 1 }}>
                    <ShapeRenderer field={field} />
                  </div>
                ) : field.type === 'divider' ? (
                  <div className="w-full h-full pointer-events-none flex items-center justify-center" style={{ opacity: field.opacity ?? 1 }}>
                    <DividerRenderer field={field} />
                  </div>
                ) : field.type === 'drawing' ? (
                  <div className="w-full h-full pointer-events-none flex items-center justify-center">
                    <img src={field.staticImage} className="w-full h-full" style={{ opacity: field.opacity ?? 1, objectFit: 'fill' }} alt="Drawing" />
                  </div>
                ) : isImage ? (
                  val ? <img src={String(val)} alt={field.headerKey} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null
                ) : isQrCode ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <QRCodeSVG 
                      value={field.isStatic ? (field.staticText || 'https://example.com') : (val !== undefined && val !== null ? String(val) : 'https://example.com')} 
                      size={Math.min(field.width || 100, field.height || 100)} 
                      fgColor={field.color} 
                      bgColor="transparent" 
                    />
                  </div>
                ) : isBarcode ? (
                  <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    {(() => {
                       const barcodeVal = field.isStatic ? (field.staticText || '123456789') : (val !== undefined && val !== null && String(val).trim() !== '' ? String(val) : '123456789');
                       return barcodeVal ? (
                         <Barcode 
                           value={barcodeVal} 
                           width={2} 
                           height={Math.max(30, (field.height || 50) - 20)} 
                           displayValue={false} 
                           background="transparent" 
                           lineColor={field.color} 
                         />
                       ) : null;
                    })()}
                  </div>
                ) : (
                  <div
                    style={{
                      fontFamily: field.fontFamily || 'sans-serif',
                      fontSize: `${field.fontSize}px`,
                      color: field.color,
                      fontWeight: field.fontWeight,
                      fontStyle: field.fontStyle || 'normal',
                      textDecoration: field.textDecoration || 'none',
                      textAlign: field.textAlign || 'left',
                      textTransform: field.textTransform === 'sentence' ? 'none' : (field.textTransform || 'none') as any,
                      whiteSpace: 'pre-wrap',
                      width: '100%',
                    }}
                  >
                    {(() => {
                      let txt = field.isStatic ? (field.staticText || '') : (data[field.headerKey] !== undefined && data[field.headerKey] !== null ? String(data[field.headerKey]) : '');
                      if (field.textTransform === 'sentence' && txt) {
                        txt = txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
                      }
                      return txt;
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
              </TransformComponent>
              
              <div className="absolute bottom-6 right-6 z-[102] flex items-center gap-3 bg-white shadow-lg rounded-full border border-gray-200 px-4 py-2">
                <input 
                  type="range"
                  min="10"
                  max="500"
                  value={Math.round(scale * 100)}
                  onChange={(e) => {
                     const newScale = parseFloat(e.target.value) / 100;
                     setTransform(state.positionX, state.positionY, newScale);
                  }}
                  className="w-32 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-xs font-bold text-gray-700 w-10 text-right">
                  {Math.round(scale * 100)}%
                </span>
                <div className="w-px h-5 bg-gray-200 mx-1"></div>
                <button 
                  onClick={() => resetTransform()} 
                  className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
                  title="Fit to screen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        }}
      </TransformWrapper>
    </div>
  );
};

const Previewer: React.FC<{ previewScale?: number }> = ({ previewScale = 1 }) => {
  const { currentProject } = useAppContext();
  const [fullScreenData, setFullScreenData] = useState<any | null>(null);

  if (!currentProject) return null;

  const { templateImage, data, fields, isSingleMode, singleData, photosMap, width, height, backgroundType = 'image', backgroundColor = '#ffffff', backgroundGradient = { colors: ['#ffffff', '#f3f4f6'], direction: 'to right' } } = currentProject;

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
    <div className="flex flex-col items-center w-full gap-6 p-2">
      {dataset.length > 100 && (
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-xs font-semibold w-full text-center shadow-sm">
          Previewing first 100 cards out of {dataset.length}
        </div>
      )}
      
      {previewDataset.map((currentData, index) => (
        <div key={index} className="flex flex-col items-center shrink-0 group relative">
          {!isSingleMode && dataset.length > 1 && (
            <span className="text-xs font-bold text-gray-500 mb-2">Card {index + 1}</span>
          )}
          <button 
            onClick={() => setFullScreenData(currentData)}
            className="absolute top-8 right-2 z-10 p-3 bg-indigo-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-indigo-700 pointer-events-auto origin-top-right"
            style={{ transform: `scale(${1 / previewScale})` }}
            title="View Full Size"
          >
            <Maximize2 className="w-6 h-6" />
          </button>
          <div 
            className="relative shadow-xl overflow-hidden pointer-events-none rounded-sm border border-gray-200 shrink-0"
            style={{ 
              width: `${width}px`, 
              height: `${height}px`, 
              backgroundColor: backgroundType === 'color' ? backgroundColor : (backgroundType === 'transparent' ? 'transparent' : '#ffffff'),
              backgroundImage: backgroundType === 'gradient' ? `linear-gradient(${backgroundGradient.direction}, ${backgroundGradient.colors.join(', ')})` : 'none'
            }} 
          >
            {backgroundType === 'image' && templateImage && (
              <img 
                src={templateImage} 
                alt="Template Background" 
                className="w-full h-full object-cover block absolute inset-0"
              />
            )}
            {fields.map((field) => {
              if (field.isHidden) return null;

              const rawVal = currentData[field.headerKey];
              const isImage = field.type === 'image';
              const isShape = field.type === 'shape';
              const isQrCode = field.type === 'qrcode';
              const isBarcode = field.type === 'barcode';
              const isDivider = field.type === 'divider';
              const isDrawing = field.type === 'drawing';
              const isSizable = isImage || isShape || isQrCode || isBarcode || isDivider || isDrawing;
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
                    ...(isSizable ? {
                      width: `${field.width || 100}px`,
                      height: `${field.height || 100}px`,
                    } : {
                      fontSize: `${field.fontSize}px`,
                      color: field.color,
                      fontWeight: field.fontWeight,
                      whiteSpace: 'nowrap',
                    })
                  }}
                >
                  {field.type === 'shape' ? (
                    <div className="w-full h-full pointer-events-none" style={{ opacity: field.opacity ?? 1 }}>
                      <ShapeRenderer field={field} />
                    </div>
                  ) : field.type === 'divider' ? (
                    <div className="w-full h-full pointer-events-none flex items-center justify-center" style={{ opacity: field.opacity ?? 1 }}>
                      <DividerRenderer field={field} />
                    </div>
                  ) : field.type === 'drawing' ? (
                    <div className="w-full h-full pointer-events-none flex items-center justify-center">
                      <img src={field.staticImage} className="w-full h-full" style={{ opacity: field.opacity ?? 1, objectFit: 'fill' }} alt="Drawing" />
                    </div>
                  ) : isImage ? (
                    val ? <img src={String(val)} alt={field.headerKey} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null
                  ) : isQrCode ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <QRCodeSVG 
                        value={field.isStatic ? (field.staticText || 'https://example.com') : (val !== undefined && val !== null ? String(val) : 'https://example.com')} 
                        size={Math.min(field.width || 100, field.height || 100)} 
                        fgColor={field.color} 
                        bgColor="transparent" 
                      />
                    </div>
                  ) : isBarcode ? (
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                      {(() => {
                         const barcodeVal = field.isStatic ? (field.staticText || '123456789') : (val !== undefined && val !== null && String(val).trim() !== '' ? String(val) : '123456789');
                         return barcodeVal ? (
                           <Barcode 
                             value={barcodeVal} 
                             width={2} 
                             height={Math.max(30, (field.height || 50) - 20)} 
                             displayValue={false} 
                             background="transparent" 
                             lineColor={field.color} 
                           />
                         ) : null;
                      })()}
                    </div>
                  ) : (
                    <div
                      style={{
                        fontFamily: field.fontFamily || 'sans-serif',
                        fontSize: `${field.fontSize}px`,
                        color: field.color,
                        fontWeight: field.fontWeight,
                        fontStyle: field.fontStyle || 'normal',
                        textDecoration: field.textDecoration || 'none',
                        textAlign: field.textAlign || 'left',
                        textTransform: field.textTransform === 'sentence' ? 'none' : (field.textTransform || 'none') as any,
                        whiteSpace: 'pre-wrap',
                        width: '100%',
                      }}
                    >
                      {(() => {
                        let txt = field.isStatic ? (field.staticText || '') : (currentData[field.headerKey] !== undefined && currentData[field.headerKey] !== null ? String(currentData[field.headerKey]) : '');
                        if (field.textTransform === 'sentence' && txt) {
                          txt = txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
                        }
                        return txt;
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {fullScreenData && createPortal(
        <FullScreenViewer
          data={fullScreenData}
          onClose={() => setFullScreenData(null)}
          singleData={singleData}
          photosMap={photosMap}
          width={width}
          height={height}
          backgroundType={backgroundType}
          backgroundColor={backgroundColor}
          backgroundGradient={backgroundGradient}
          templateImage={templateImage}
          fields={fields}
          isSingleMode={isSingleMode}
        />,
        document.body
      )}
    </div>
  );
};

export default Previewer;

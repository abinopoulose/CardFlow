import React, { useEffect, useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { Image as ImageIcon, ZoomIn, ZoomOut, Maximize, Undo2, Redo2, QrCode, Barcode as BarcodeIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import { useAppContext, type FieldConfig } from '../context/AppContext';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ShapeRenderer from './ShapeRenderer';
import DividerRenderer from './DividerRenderer';
import PropertiesBar from './PropertiesBar';
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas';

interface TemplateConfiguratorProps {
  selectedFieldIds: string[];
  setSelectedFieldIds: React.Dispatch<React.SetStateAction<string[]>>;
  sketchRef?: React.RefObject<ReactSketchCanvasRef>;
  drawingModeType?: 'select' | 'pen' | 'eraser';
  strokeColor?: string;
  strokeWidth?: number;
  eraserWidth?: number;
}

const TemplateConfigurator: React.FC<TemplateConfiguratorProps> = ({ 
  selectedFieldIds, setSelectedFieldIds, 
  sketchRef, drawingModeType, strokeColor, strokeWidth, eraserWidth 
}) => {
  const { currentProject, updateCurrentProject, undo, redo, canUndo, canRedo, isDrawingMode, setIsDrawingMode } = useAppContext();
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; width: number; height: number } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const startPos = useRef<{ x: number, y: number } | null>(null);

  const fields = currentProject?.fields || [];

  const setFields = (newFields: FieldConfig[] | ((prev: FieldConfig[]) => FieldConfig[])) => {
    if (typeof newFields === 'function') {
      updateCurrentProject({ fields: newFields(fields) });
    } else {
      updateCurrentProject({ fields: newFields });
    }
  };

  const updateField = (id: string, updates: Partial<FieldConfig>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  useEffect(() => {
    if (sketchRef?.current) {
      sketchRef.current.eraseMode(drawingModeType === 'eraser');
    }
  }, [drawingModeType, isDrawingMode, sketchRef]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedFieldIds.length > 0) {
          const copiedFields = fields.filter(f => selectedFieldIds.includes(f.id));
          localStorage.setItem('idcardgen_clipboard', JSON.stringify(copiedFields));
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        const clipboard = localStorage.getItem('idcardgen_clipboard');
        if (clipboard) {
          try {
            const parsed = JSON.parse(clipboard);
            const copiedFields = Array.isArray(parsed) ? parsed : [parsed];
            const newIds: string[] = [];
            const newFields = copiedFields.map((field: FieldConfig) => {
              const newId = `copied_${Math.random().toString(36).substr(2, 9)}`;
              newIds.push(newId);
              return { 
                ...field, 
                id: newId, 
                x: field.x + 20, 
                y: field.y + 20 
              };
            });
            setFields(prev => [...prev, ...newFields]);
            setSelectedFieldIds(newIds);
          } catch (err) {
            console.error('Failed to paste field', err);
          }
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedFieldIds.length > 0) {
          setFields(prev => prev.filter(f => !selectedFieldIds.includes(f.id)));
          setSelectedFieldIds([]);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedFieldIds, fields, setSelectedFieldIds]);

  if (!currentProject) return null;

  const { templateImage, width, height, backgroundType = 'image', backgroundColor = '#ffffff', backgroundGradient = { colors: ['#ffffff', '#f3f4f6'], direction: 'to right' } } = currentProject;

  return (
    <div className="flex-1 w-full h-full overflow-hidden flex flex-col bg-gray-50/50 relative">
      {!isDrawingMode && selectedFieldIds.length > 0 && <PropertiesBar selectedFieldIds={selectedFieldIds} />}
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={5}
        centerOnInit
        panning={{ activationKeys: [' '] }} // Hold space to pan
        wheel={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform, state }) => {
          const currentScale = state?.scale || 1;
          return (
          <>
            <div className="absolute top-4 left-4 z-50 flex gap-2 bg-white/90 backdrop-blur shadow-sm border border-gray-200 p-1.5 rounded-xl">
              <button 
                onClick={undo}
                disabled={!canUndo}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors disabled:opacity-30"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-5 h-5" />
              </button>
              <button 
                onClick={redo}
                disabled={!canRedo}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors disabled:opacity-30"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-6 right-6 z-50 flex gap-2 bg-white/90 backdrop-blur shadow-lg border border-gray-200 p-2 rounded-xl">
              <button 
                onClick={() => zoomIn()} 
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button 
                onClick={() => zoomOut()} 
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <div className="w-px bg-gray-200 mx-1"></div>
              <button 
                onClick={() => resetTransform()} 
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
                title="Reset Zoom"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
            
            <div className="absolute bottom-6 left-6 z-50 pointer-events-none">
              <div className="bg-indigo-50/80 backdrop-blur text-indigo-700 text-xs px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm flex items-center gap-2">
                <span className="font-semibold">Tip:</span> Hold <kbd className="px-1.5 py-0.5 bg-white rounded border border-indigo-200 font-mono text-[10px]">Space</kbd> to pan around
              </div>
            </div>

            <div className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center">
              <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
                <div className="flex items-center justify-center w-full h-full p-12">
                  <div 
                    className="relative shadow-2xl overflow-hidden shrink-0 cursor-default select-none"
                    style={{ 
                      width: `${width}px`, 
                      height: `${height}px`,
                      backgroundColor: backgroundType === 'color' ? backgroundColor : (backgroundType === 'transparent' ? 'transparent' : '#ffffff'),
                      backgroundImage: backgroundType === 'gradient' ? `linear-gradient(${backgroundGradient.direction}, ${backgroundGradient.colors.join(', ')})` : 'none'
                    }}
                    onMouseDown={(e) => {
                      if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG') {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / currentScale;
                        const y = (e.clientY - rect.top) / currentScale;
                        startPos.current = { x, y };
                        setIsSelecting(true);
                        setSelectionBox({ startX: x, startY: y, width: 0, height: 0 });
                        setSelectedFieldIds([]); 
                      } else {
                        setSelectedFieldIds([]);
                      }
                    }}
                    onMouseMove={(e) => {
                      if (isSelecting && startPos.current) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const currentX = (e.clientX - rect.left) / currentScale;
                        const currentY = (e.clientY - rect.top) / currentScale;
                        
                        const startX = Math.min(startPos.current.x, currentX);
                        const startY = Math.min(startPos.current.y, currentY);
                        const boxWidth = Math.abs(currentX - startPos.current.x);
                        const boxHeight = Math.abs(currentY - startPos.current.y);
                        
                        setSelectionBox({ startX, startY, width: boxWidth, height: boxHeight });

                        const newSelection = fields.filter(f => {
                          const fw = f.width || 100;
                          const fh = f.height || 50;
                          return (
                            f.x < startX + boxWidth &&
                            f.x + fw > startX &&
                            f.y < startY + boxHeight &&
                            f.y + fh > startY
                          );
                        }).map(f => f.id);
                        setSelectedFieldIds(newSelection);
                      }
                    }}
                    onMouseUp={() => {
                      setIsSelecting(false);
                      setSelectionBox(null);
                      startPos.current = null;
                    }}
                    onMouseLeave={() => {
                      if (isSelecting) {
                        setIsSelecting(false);
                        setSelectionBox(null);
                        startPos.current = null;
                      }
                    }}
                  >
                    {selectionBox && (
                      <div
                        className="absolute border border-indigo-500 bg-indigo-500/20 z-50 pointer-events-none"
                        style={{
                          left: selectionBox.startX,
                          top: selectionBox.startY,
                          width: selectionBox.width,
                          height: selectionBox.height,
                        }}
                      />
                    )}
                    {backgroundType === 'image' && templateImage && (
                      <img 
                        src={templateImage} 
                        alt="Background" 
                        className="w-full h-full object-cover block select-none pointer-events-none absolute inset-0"
                      />
                    )}
                    {fields.map((field) => (
                      <Rnd
                        key={field.id}
                        scale={currentScale}
                        position={{ 
                          x: field.x + (selectedFieldIds.includes(field.id) && draggingId !== field.id ? dragDelta.x : 0), 
                          y: field.y + (selectedFieldIds.includes(field.id) && draggingId !== field.id ? dragDelta.y : 0) 
                        }}
                        size={field.type === 'image' || field.type === 'shape' || field.type === 'qrcode' || field.type === 'barcode' || field.type === 'divider' || field.type === 'drawing' ? { width: field.width || 100, height: field.height || 100 } : undefined}
                        onDrag={(_e, d) => {
                          if (selectedFieldIds.length > 1 && selectedFieldIds.includes(field.id)) {
                            setDragDelta({ x: d.x - field.x, y: d.y - field.y });
                            setDraggingId(field.id);
                          }
                        }}
                        onDragStop={(_e, d) => {
                          if (selectedFieldIds.length > 1 && selectedFieldIds.includes(field.id)) {
                            const dx = d.x - field.x;
                            const dy = d.y - field.y;
                            setFields(prev => prev.map(f => 
                              selectedFieldIds.includes(f.id) ? { ...f, x: f.x + dx, y: f.y + dy } : f
                            ));
                            setDragDelta({ x: 0, y: 0 });
                            setDraggingId(null);
                          } else {
                            updateField(field.id, { x: d.x, y: d.y });
                          }
                        }}
                        onResizeStop={(_e, _direction, ref, _delta, position) => {
                          if (field.type === 'image' || field.type === 'shape' || field.type === 'qrcode' || field.type === 'barcode' || field.type === 'divider') {
                            updateField(field.id, {
                              width: parseInt(ref.style.width, 10),
                              height: parseInt(ref.style.height, 10),
                              ...position,
                            });
                          }
                        }}
                        disableDragging={editingTextId === field.id}
                        enableResizing={editingTextId !== field.id && (field.type === 'image' || field.type === 'shape' || field.type === 'qrcode' || field.type === 'barcode' || field.type === 'divider')}
                        lockAspectRatio={field.type === 'qrcode' || field.type === 'barcode'}
                        className={`cursor-move absolute z-10 ${selectedFieldIds.includes(field.id) ? 'ring-2 ring-indigo-500' : 'hover:ring-1 hover:ring-indigo-300'}`}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          if (e.shiftKey) {
                            setSelectedFieldIds(prev => prev.includes(field.id) ? prev.filter(id => id !== field.id) : [...prev, field.id]);
                          } else {
                            if (!selectedFieldIds.includes(field.id)) {
                              setSelectedFieldIds([field.id]);
                            }
                          }
                        }}
                      >
                        {field.type === 'shape' ? (
                          <div className="w-full h-full pointer-events-none">
                            <ShapeRenderer field={field} />
                          </div>
                        ) : field.type === 'drawing' ? (
                          <div className="w-full h-full pointer-events-none flex items-center justify-center">
                            <img src={field.staticImage} className="w-full h-full" style={{ opacity: field.opacity ?? 1, objectFit: 'fill' }} alt="Drawing" />
                          </div>
                        ) : field.type === 'divider' ? (
                          <div className="w-full h-full pointer-events-none flex items-center justify-center">
                            <DividerRenderer field={field} />
                          </div>
                        ) : field.type === 'image' ? (
                          field.isStatic ? (
                            field.staticImage ? (
                              <img src={field.staticImage} className="w-full h-full object-cover pointer-events-none" alt="Common" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-xs text-gray-400 border-2 border-dashed border-gray-300">
                                <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                                Static Image
                              </div>
                            )
                          ) : (
                            <div className="w-full h-full border-2 border-dashed border-indigo-400 bg-indigo-100/50 flex flex-col items-center justify-center text-indigo-500">
                              <ImageIcon className="w-6 h-6 mb-1" />
                              <span className="text-[10px] font-semibold truncate px-1 max-w-full">
                                {field.headerKey}
                              </span>
                            </div>
                          )
                        ) : field.type === 'qrcode' ? (
                          field.isStatic ? (
                            <div className="w-full h-full pointer-events-none flex items-center justify-center">
                              <QRCodeSVG 
                                value={field.staticText || 'https://example.com'} 
                                size={Math.min(field.width || 100, field.height || 100)} 
                                fgColor={field.color} 
                                bgColor="transparent" 
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full border-2 border-dashed border-indigo-400 bg-indigo-100/50 flex flex-col items-center justify-center text-indigo-500 pointer-events-none">
                              <QrCode className="w-6 h-6 mb-1" />
                              <span className="text-[10px] font-semibold truncate px-1 max-w-full">
                                [{field.headerKey}]
                              </span>
                            </div>
                          )
                        ) : field.type === 'barcode' ? (
                          field.isStatic ? (
                            <div className="w-full h-full pointer-events-none flex items-center justify-center overflow-hidden">
                              <Barcode 
                                value={field.staticText || '123456789'} 
                                width={2} 
                                height={Math.max(30, (field.height || 50) - 20)} 
                                displayValue={false} 
                                background="transparent" 
                                lineColor={field.color} 
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full border-2 border-dashed border-indigo-400 bg-indigo-100/50 flex flex-col items-center justify-center text-indigo-500 pointer-events-none">
                              <BarcodeIcon className="w-6 h-6 mb-1" />
                              <span className="text-[10px] font-semibold truncate px-1 max-w-full">
                                [{field.headerKey}]
                              </span>
                            </div>
                          )
                        ) : (
                          <div
                            onDoubleClick={() => {
                              if (field.isStatic) {
                                setEditingTextId(field.id);
                                setSelectedFieldIds([field.id]);
                              }
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              fontFamily: field.fontFamily || 'sans-serif',
                              fontSize: `${field.fontSize}px`,
                              color: field.color,
                              fontWeight: field.fontWeight,
                              fontStyle: field.fontStyle || 'normal',
                              textDecoration: field.textDecoration || 'none',
                              textAlign: field.textAlign || 'left',
                              textTransform: field.textTransform === 'sentence' ? 'none' : (field.textTransform || 'none') as any,
                              lineHeight: 1.2,
                              whiteSpace: 'pre-wrap',
                              cursor: editingTextId === field.id ? 'text' : 'move',
                              backgroundColor: field.isStatic ? 'transparent' : 'rgba(234, 179, 8, 0.4)',
                            }}
                          >
                            {editingTextId === field.id && field.isStatic ? (
                              <textarea
                                autoFocus
                                value={field.staticText || ''}
                                onChange={(e) => updateField(field.id, { staticText: e.target.value })}
                                onBlur={() => setEditingTextId(null)}
                                onMouseDown={(e: any) => e.stopPropagation()}
                                onKeyDown={(e: any) => e.stopPropagation()}
                                className="w-full h-full bg-transparent border-none outline-none resize-none p-0 m-0 overflow-hidden"
                                style={{
                                  fontFamily: field.fontFamily || 'sans-serif',
                                  fontSize: `${field.fontSize}px`,
                                  color: field.color,
                                  fontWeight: field.fontWeight,
                                  fontStyle: field.fontStyle || 'normal',
                                  textDecoration: field.textDecoration || 'none',
                                  textAlign: field.textAlign || 'left',
                                  textTransform: field.textTransform === 'sentence' ? 'none' : (field.textTransform || 'none') as any,
                                  lineHeight: 1.2,
                                  whiteSpace: 'pre-wrap',
                                }}
                              />
                            ) : (
                              (() => {
                                let txt = field.isStatic ? (field.staticText || 'Text Box') : `[${field.headerKey}]`;
                                if (field.textTransform === 'sentence' && txt) {
                                  txt = txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
                                }
                                return txt;
                              })()
                            )}
                          </div>
                        )}
                      </Rnd>
                    ))}

                    {isDrawingMode && (
                      <div className={`absolute inset-0 z-50 ${drawingModeType === 'select' ? 'pointer-events-none' : 'cursor-crosshair'}`}>
                        <ReactSketchCanvas
                          ref={sketchRef}
                          width="100%"
                          height="100%"
                          strokeWidth={strokeWidth}
                          eraserWidth={eraserWidth}
                          strokeColor={strokeColor}
                          canvasColor="transparent"
                          className={`!border-none !bg-transparent ${drawingModeType === 'select' ? 'pointer-events-none' : 'pointer-events-auto'}`}
                          preserveBackgroundImageAspectRatio="none"
                          exportWithBackgroundImage={false}
                          style={{ touchAction: 'none' }}
                          withTimestamp={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TransformComponent>
            </div>
          </>
          );
        }}
      </TransformWrapper>
    </div>
  );
};

export default TemplateConfigurator;

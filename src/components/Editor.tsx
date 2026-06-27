import React, { useState } from 'react';
import { ArrowLeft, Edit3, Check, Download, Eye, ChevronLeft, ChevronRight, X, Layers, Database, LayoutTemplate, Frame, Undo2, Redo2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import DataUploader from './DataUploader';
import TemplateUploader from './TemplateUploader';
import TemplateConfigurator from './TemplateConfigurator';
import FieldsPanel from './FieldsPanel';
import Previewer from './Previewer';
import ExportManager from './ExportManager';
import DrawingPanel from './DrawingPanel';
import LayersPanel from './LayersPanel';
import type { ReactSketchCanvasRef } from 'react-sketch-canvas';
import html2canvas from 'html2canvas';

const Editor: React.FC = () => {
  const { currentProject, setCurrentProjectId, updateCurrentProject, updateProject, isDrawingMode, setIsDrawingMode, undo, redo, canUndo, canRedo } = useAppContext();
  const [activeTab, setActiveTab] = useState<'fields' | 'data' | 'background' | 'layers'>('fields');
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState(currentProject?.name || '');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);

  const [leftWidth, setLeftWidth] = useState(420);
  const [rightWidth, setRightWidth] = useState(320);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  const sprayCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const sketchRef = React.useRef<ReactSketchCanvasRef>(null);
  const [drawingModeType, setDrawingModeType] = useState<'select' | 'pen' | 'eraser' | 'spray'>('pen');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [eraserWidth, setEraserWidth] = useState(20);
  const [sprayDensity, setSprayDensity] = useState(25);

  if (!currentProject) return null;

  const handleSaveDrawing = async (exitMode = true) => {
    if (sketchRef.current && currentProject) {
      try {
        const paths = await sketchRef.current.exportPaths();
        
        let sprayHasContent = false;
        if (sprayCanvasRef.current) {
          const ctx = sprayCanvasRef.current.getContext('2d');
          if (ctx) {
            const data = ctx.getImageData(0,0, sprayCanvasRef.current.width, sprayCanvasRef.current.height).data;
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] > 0) { sprayHasContent = true; break; }
            }
          }
        }

        if (paths.length > 0 || sprayHasContent) {
          const svgStr = await sketchRef.current.exportSvg();
          
          const targetWidth = currentProject.width * 4;
          const targetHeight = currentProject.height * 4;
          
          let modifiedSvgStr = svgStr;
          if (!modifiedSvgStr.includes('viewBox=')) {
            modifiedSvgStr = modifiedSvgStr.replace('<svg ', `<svg viewBox="0 0 ${currentProject.width} ${currentProject.height}" `);
          }
          if (modifiedSvgStr.includes('width=')) {
            modifiedSvgStr = modifiedSvgStr.replace(/width="[^"]+"/, `width="${targetWidth}"`);
          } else {
            modifiedSvgStr = modifiedSvgStr.replace('<svg ', `<svg width="${targetWidth}" `);
          }
          if (modifiedSvgStr.includes('height=')) {
            modifiedSvgStr = modifiedSvgStr.replace(/height="[^"]+"/, `height="${targetHeight}"`);
          } else {
            modifiedSvgStr = modifiedSvgStr.replace('<svg ', `<svg height="${targetHeight}" `);
          }

          const blob = new Blob([modifiedSvgStr], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.src = url;
          await new Promise((resolve) => { img.onload = resolve; });
          URL.revokeObjectURL(url);
          
          const scale = img.width / currentProject.width;
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            
            if (sprayCanvasRef.current && sprayHasContent) {
              ctx.drawImage(sprayCanvasRef.current, 0, 0, canvas.width, canvas.height);
            }
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                const idx = (y * canvas.width + x) * 4;
                const alpha = data[idx + 3];
                if (alpha > 0) {
                  data[idx] = 255;
                  data[idx + 1] = 255;
                  data[idx + 2] = 255;
                  
                  if (x < minX) minX = x;
                  if (x > maxX) maxX = x;
                  if (y < minY) minY = y;
                  if (y > maxY) maxY = y;
                }
              }
            }
            ctx.putImageData(imageData, 0, 0);
            
            if (maxX >= minX && maxY >= minY) {
              const padding = 5 * scale;
              minX = Math.max(0, minX - padding);
              minY = Math.max(0, minY - padding);
              maxX = Math.min(canvas.width, maxX + padding);
              maxY = Math.min(canvas.height, maxY + padding);
              
              const cropWidth = maxX - minX;
              const cropHeight = maxY - minY;
              
              const cropCanvas = document.createElement('canvas');
              cropCanvas.width = cropWidth;
              cropCanvas.height = cropHeight;
              const cropCtx = cropCanvas.getContext('2d');
              
              if (cropCtx) {
                cropCtx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
                const whiteDataUrl = cropCanvas.toDataURL('image/png');
                
                cropCtx.globalCompositeOperation = 'source-in';
                cropCtx.fillStyle = strokeColor;
                cropCtx.fillRect(0, 0, cropWidth, cropHeight);
                const coloredDataUrl = cropCanvas.toDataURL('image/png');
                
                const newField = {
                  id: Math.random().toString(36).substr(2, 9),
                  headerKey: `Drawing_${Math.floor(Math.random()*1000)}`,
                  x: minX / scale,
                  y: minY / scale,
                  width: cropWidth / scale,
                  height: cropHeight / scale,
                  fontSize: 14,
                  color: strokeColor,
                  opacity: 1,
                  fontWeight: 'normal',
                  type: 'drawing',
                  isStatic: true,
                  originalImage: whiteDataUrl,
                  staticImage: coloredDataUrl
                };
                updateCurrentProject({ fields: [...currentProject.fields, newField as any] });
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      sketchRef.current.clearCanvas();
      if (sprayCanvasRef.current) {
        const ctx = sprayCanvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, sprayCanvasRef.current.width, sprayCanvasRef.current.height);
      }
      if (exitMode) {
        setIsDrawingMode(false);
      }
    }
  };

  const handleSaveName = () => {
    updateCurrentProject({ name: projectName });
    setIsEditingName(false);
  };

  const startLeftResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;
    
    const onMouseMove = (e: MouseEvent) => {
      setLeftWidth(Math.max(380, Math.min(800, startWidth + (e.clientX - startX))));
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const startRightResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightWidth;
    
    const onMouseMove = (e: MouseEvent) => {
      setRightWidth(Math.max(250, Math.min(800, startWidth - (e.clientX - startX))));
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-sans overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const el = document.getElementById('project-canvas-container');
              const projectId = currentProject?.id;
              if (el && projectId) {
                html2canvas(el, { 
                  scale: 0.5, 
                  useCORS: true, 
                  logging: false, 
                  backgroundColor: null 
                }).then(canvas => {
                  const previewImage = canvas.toDataURL('image/jpeg', 0.8);
                  updateProject(projectId, { previewImage });
                }).catch(console.error);
              }
              setCurrentProjectId(null);
            }}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 border-r border-gray-200 pr-4 mr-2">
            <button 
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button 
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors disabled:opacity-30"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="px-2 py-1 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                  autoFocus
                />
                <button onClick={handleSaveName} className="p-1 text-green-600 hover:bg-green-50 rounded">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                <h1 className="text-lg font-bold text-gray-800">{currentProject.name}</h1>
                <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}

          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          {showExportMenu && (
            <div className="absolute top-12 right-4 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                <h3 className="font-bold text-gray-800">Export Options</h3>
                <button 
                  onClick={() => setShowExportMenu(false)}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ExportManager />
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative z-0">
        
        {/* Left Sidebar */}
        <div 
          className={`bg-white flex shrink-0 z-10 shadow-[4px_0_15px_-10px_rgba(0,0,0,0.1)] relative transition-all duration-300 ease-in-out whitespace-nowrap ${isLeftCollapsed ? 'border-r-0' : 'border-r border-gray-200'}`}
          style={{ width: isLeftCollapsed ? '72px' : `${leftWidth}px` }}
        >
          {/* Navigation Rail */}
          <div className="w-[72px] shrink-0 bg-gray-900 text-white flex flex-col items-center py-4 gap-2 z-20 h-full">
            <button 
              onClick={() => { 
                if (activeTab === 'fields' && !isLeftCollapsed) setIsLeftCollapsed(true);
                else { setActiveTab('fields'); setIsLeftCollapsed(false); }
              }}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-xl transition-all ${activeTab === 'fields' && !isLeftCollapsed ? 'bg-gray-800 text-white shadow-inner' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
            >
              <LayoutTemplate className="w-5 h-5" />
              <span className="text-[10px] font-medium">Design</span>
            </button>
            <button 
              onClick={() => { 
                if (activeTab === 'data' && !isLeftCollapsed) setIsLeftCollapsed(true);
                else { setActiveTab('data'); setIsLeftCollapsed(false); }
              }}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-xl transition-all ${activeTab === 'data' && !isLeftCollapsed ? 'bg-gray-800 text-white shadow-inner' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
            >
              <Database className="w-5 h-5" />
              <span className="text-[10px] font-medium">Data</span>
            </button>
            <button 
              onClick={() => { 
                if (activeTab === 'background' && !isLeftCollapsed) setIsLeftCollapsed(true);
                else { setActiveTab('background'); setIsLeftCollapsed(false); }
              }}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-xl transition-all ${activeTab === 'background' && !isLeftCollapsed ? 'bg-gray-800 text-white shadow-inner' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
            >
              <Frame className="w-5 h-5" />
              <span className="text-[10px] font-medium">Canvas</span>
            </button>
            <button 
              onClick={() => { 
                if (activeTab === 'layers' && !isLeftCollapsed) setIsLeftCollapsed(true);
                else { setActiveTab('layers'); setIsLeftCollapsed(false); }
              }}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-xl transition-all ${activeTab === 'layers' && !isLeftCollapsed ? 'bg-gray-800 text-white shadow-inner' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
            >
              <Layers className="w-5 h-5" />
              <span className="text-[10px] font-medium">Layers</span>
            </button>
          </div>
          
          {/* Panel Content */}
          <div className={`flex-1 flex flex-col h-full bg-white relative overflow-hidden transition-opacity duration-300 ${isLeftCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/30 min-w-[308px]">
              {isDrawingMode ? (
                <DrawingPanel 
                  mode={drawingModeType}
                  setMode={(m) => {
                    if (m === 'select') {
                      handleSaveDrawing(false);
                      setDrawingModeType('select');
                    } else {
                      setDrawingModeType(m);
                    }
                  }}
                  strokeColor={strokeColor}
                  setStrokeColor={setStrokeColor}
                  strokeWidth={strokeWidth}
                  setStrokeWidth={setStrokeWidth}
                  eraserWidth={eraserWidth}
                  setEraserWidth={setEraserWidth}
                  sprayDensity={sprayDensity}
                  setSprayDensity={setSprayDensity}
                  onUndo={() => sketchRef.current?.undo()}
                  onRedo={() => sketchRef.current?.redo()}
                  onClear={() => {
                    sketchRef.current?.clearCanvas();
                    if (sprayCanvasRef.current) {
                      const ctx = sprayCanvasRef.current.getContext('2d');
                      if (ctx) ctx.clearRect(0, 0, sprayCanvasRef.current.width, sprayCanvasRef.current.height);
                    }
                  }}
                  onCancel={() => {
                    setIsDrawingMode(false);
                    sketchRef.current?.clearCanvas();
                    if (sprayCanvasRef.current) {
                      const ctx = sprayCanvasRef.current.getContext('2d');
                      if (ctx) ctx.clearRect(0, 0, sprayCanvasRef.current.width, sprayCanvasRef.current.height);
                    }
                  }}
                  onSave={() => {
                    handleSaveDrawing(true);
                  }}
                />
              ) : (
                <>
                  {activeTab === 'fields' && <FieldsPanel selectedFieldId={selectedFieldIds[0] || null} onSelectField={(id) => setSelectedFieldIds(id ? [id] : [])} />}
                  {activeTab === 'data' && <DataUploader />}
                  {activeTab === 'background' && <TemplateUploader />}
                  {activeTab === 'layers' && <LayersPanel />}
                </>
              )}
            </div>
          </div>

          {/* Left Resize Handle */}
          {!isLeftCollapsed && (
            <div 
              className="absolute top-0 right-[-4px] w-2 h-full cursor-col-resize z-50 group flex items-center justify-center"
              onMouseDown={startLeftResize}
            >
              <div className="w-1 h-12 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
          className="absolute z-40 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-r-lg p-1.5 hover:bg-gray-50 transition-all duration-300 ease-in-out cursor-pointer group"
          style={{ left: isLeftCollapsed ? '72px' : `${leftWidth}px` }}
          title={isLeftCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isLeftCollapsed ? <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />}
        </button>

        {/* Center Canvas Area */}
        <div className="flex-1 bg-gray-100/80 overflow-hidden flex flex-col relative z-0">
          <TemplateConfigurator 
            selectedFieldIds={selectedFieldIds} 
            setSelectedFieldIds={setSelectedFieldIds} 
            sketchRef={sketchRef}
            sprayCanvasRef={sprayCanvasRef}
            drawingModeType={drawingModeType}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            eraserWidth={eraserWidth}
            sprayDensity={sprayDensity}
          />
        </div>

        {/* Right Collapse Button */}
        <button
          onClick={() => setIsRightCollapsed(!isRightCollapsed)}
          className="absolute z-40 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-l-lg p-1.5 hover:bg-gray-50 transition-all duration-300 ease-in-out cursor-pointer group"
          style={{ right: isRightCollapsed ? 0 : `${rightWidth}px` }}
          title={isRightCollapsed ? "Expand preview" : "Collapse preview"}
        >
          {isRightCollapsed ? <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" /> : <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />}
        </button>

        {/* Right Sidebar - Exclusive for Live Preview */}
        <div 
          className={`bg-white flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_-10px_rgba(0,0,0,0.1)] relative transition-all duration-300 ease-in-out whitespace-nowrap ${isRightCollapsed ? 'overflow-hidden border-l-0 opacity-0' : 'border-l border-gray-200'}`}
          style={{ width: isRightCollapsed ? 0 : `${rightWidth}px` }}
        >
          {/* Right Resize Handle */}
          {!isRightCollapsed && (
            <div 
              className="absolute top-0 left-[-4px] w-2 h-full cursor-col-resize z-50 group flex items-center justify-center"
              onMouseDown={startRightResize}
            >
              <div className="w-1 h-12 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}

          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 min-w-[250px]">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              Live Preview
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-start justify-center custom-scrollbar min-w-[250px]">
            {/* Compute scale based on rightWidth (assume base width of preview is width of project, so scale down to fit container) */}
            <div className="w-full flex justify-center">
              <div 
                className="transition-all duration-75"
                style={{
                   zoom: Math.min(1, (rightWidth - 48) / (currentProject.width || 400))
                }}
              >
                <Previewer previewScale={Math.min(1, (rightWidth - 48) / (currentProject.width || 400))} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Editor;

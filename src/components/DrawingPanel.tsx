import React from 'react';
import { PenTool, Eraser, Undo2, Redo2, Trash2, Check, X, MousePointer2 } from 'lucide-react';

interface DrawingPanelProps {
  onCancel: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  mode: 'select' | 'pen' | 'eraser';
  setMode: (mode: 'select' | 'pen' | 'eraser') => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  eraserWidth: number;
  setEraserWidth: (width: number) => void;
}

const DrawingPanel: React.FC<DrawingPanelProps> = ({
  onCancel, onSave, onUndo, onRedo, onClear,
  mode, setMode, strokeColor, setStrokeColor,
  strokeWidth, setStrokeWidth, eraserWidth, setEraserWidth
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Draw Tools</h3>
          <button 
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => setMode('select')}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg transition-all ${mode === 'select' ? 'bg-indigo-100 text-indigo-700 font-bold shadow-inner' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            <MousePointer2 className="w-5 h-5" />
            <span className="text-xs">Select</span>
          </button>
          <button
            onClick={() => setMode('pen')}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg transition-all ${mode === 'pen' ? 'bg-indigo-100 text-indigo-700 font-bold shadow-inner' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            <PenTool className="w-5 h-5" />
            <span className="text-xs">Pen</span>
          </button>
          <button
            onClick={() => setMode('eraser')}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg transition-all ${mode === 'eraser' ? 'bg-pink-100 text-pink-700 font-bold shadow-inner' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            <Eraser className="w-5 h-5" />
            <span className="text-xs">Eraser</span>
          </button>
        </div>

        {mode === 'pen' && (
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-500">COLOR</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-full h-10 p-1 border border-gray-200 rounded cursor-pointer"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-500">THICKNESS ({strokeWidth}px)</span>
              </div>
              <input
                type="range"
                min="1" max="50"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}

        {mode === 'eraser' && (
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-500">ERASER SIZE ({eraserWidth}px)</span>
              </div>
              <input
                type="range"
                min="1" max="100"
                value={eraserWidth}
                onChange={(e) => setEraserWidth(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}

        <div className="h-px bg-gray-100 w-full mb-4"></div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <button onClick={onUndo} className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              <Undo2 className="w-4 h-4" /> Undo
            </button>
            <button onClick={onRedo} className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              <Redo2 className="w-4 h-4" /> Redo
            </button>
          </div>
          
          <button onClick={onClear} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">
            <Trash2 className="w-4 h-4" /> Clear Drawing
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={onSave}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
          >
            <Check className="w-4 h-4" /> Exit Drawing Mode
          </button>
          <p className="text-[10px] text-gray-400 mt-2 text-center leading-tight">
            Clicking Exit will finalize your drawing and return you to the fields panel. To move elements without exiting, switch to Select mode.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrawingPanel;

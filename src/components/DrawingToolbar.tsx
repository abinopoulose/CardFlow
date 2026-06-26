import React, { useState } from 'react';
import { PenTool, Eraser, Undo2, Redo2, Trash2, Check, X } from 'lucide-react';

interface DrawingToolbarProps {
  onCancel: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  mode: 'pen' | 'eraser';
  setMode: (mode: 'pen' | 'eraser') => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  eraserWidth: number;
  setEraserWidth: (width: number) => void;
}

const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  onCancel, onSave, onUndo, onRedo, onClear,
  mode, setMode, strokeColor, setStrokeColor,
  strokeWidth, setStrokeWidth, eraserWidth, setEraserWidth
}) => {
  return (
    <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm w-full">
      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-md border border-gray-100">
        <button
          onClick={() => setMode('pen')}
          className={`p-1.5 rounded flex items-center justify-center transition-colors ${mode === 'pen' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Pen"
        >
          <PenTool className="w-4 h-4" />
        </button>
        <button
          onClick={() => setMode('eraser')}
          className={`p-1.5 rounded flex items-center justify-center transition-colors ${mode === 'eraser' ? 'bg-pink-100 text-pink-700 font-bold' : 'text-gray-500 hover:bg-gray-200'}`}
          title="Eraser"
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200"></div>

      {mode === 'pen' ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500">COLOR</span>
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500">THICKNESS</span>
            <input
              type="range"
              min="1" max="50"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-gray-500 w-4 text-right">{strokeWidth}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-gray-500">ERASER SIZE</span>
          <input
            type="range"
            min="1" max="100"
            value={eraserWidth}
            onChange={(e) => setEraserWidth(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-xs text-gray-500 w-4 text-right">{eraserWidth}</span>
        </div>
      )}

      <div className="h-6 w-px bg-gray-200 ml-auto"></div>

      <div className="flex items-center gap-1">
        <button onClick={onUndo} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Undo">
          <Undo2 className="w-4 h-4" />
        </button>
        <button onClick={onRedo} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded" title="Redo">
          <Redo2 className="w-4 h-4" />
        </button>
        <button onClick={onClear} className="p-1.5 text-red-500 hover:bg-red-50 rounded ml-1" title="Clear Canvas">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200"></div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          <X className="w-3.5 h-3.5" /> CANCEL
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
        >
          <Check className="w-3.5 h-3.5" /> DONE
        </button>
      </div>
    </div>
  );
};

export default DrawingToolbar;

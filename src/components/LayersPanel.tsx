import React from 'react';
import { useAppContext } from '../context/AppContext';
import { GripVertical, Image as ImageIcon, Type, QrCode, PenTool, Barcode, Eye, EyeOff, Search, Database } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ShapeRenderer from './ShapeRenderer';
import DividerRenderer from './DividerRenderer';

const LayersPanel: React.FC = () => {
  const { currentProject, updateCurrentProject } = useAppContext();

  if (!currentProject) return null;

  const { fields } = currentProject;

  // We want to display the layers from top to bottom.
  // In the DOM, the last item in the array is rendered on top.
  // So the visually "top" layer is the last element in the array.
  // To make it intuitive (like Photoshop/Canva), we display the array reversed.
  const displayFields = [...fields].reverse();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Convert indices back to the original array (because displayFields is reversed)
    const originalSourceIndex = fields.length - 1 - sourceIndex;
    const originalDestinationIndex = fields.length - 1 - destinationIndex;

    const _fields = [...fields];
    const [draggedItem] = _fields.splice(originalSourceIndex, 1);
    _fields.splice(originalDestinationIndex, 0, draggedItem);
    updateCurrentProject({ fields: _fields });
  };

  const getFieldIcon = (field: any) => {
    if (field.isStatic) {
      if (field.type === 'image' && field.staticImage) {
        return <img src={field.staticImage} className="w-5 h-5 object-cover rounded-sm shadow-sm" alt="Layer" />;
      }
      switch (field.type) {
        case 'text': return <Type className="w-4 h-4 text-gray-500" />;
        case 'image': return <ImageIcon className="w-4 h-4 text-gray-500" />;
        case 'shape': return <div className="w-4 h-4 shrink-0"><ShapeRenderer field={field} /></div>;
        case 'qrcode': return <QrCode className="w-4 h-4 text-gray-500" />;
        case 'barcode': return <Barcode className="w-4 h-4 text-gray-500" />;
        case 'divider': return <div className="w-4 h-4 flex items-center justify-center shrink-0"><DividerRenderer field={field} /></div>;
        case 'drawing': return <PenTool className="w-4 h-4 text-gray-500" />;
        default: return <Type className="w-4 h-4 text-gray-500" />;
      }
    } else {
      switch (field.type) {
        case 'text': return <Type className="w-4 h-4 text-indigo-500" />;
        case 'image': return <ImageIcon className="w-4 h-4 text-indigo-500" />;
        case 'qrcode': return <QrCode className="w-4 h-4 text-indigo-500" />;
        case 'barcode': return <Barcode className="w-4 h-4 text-indigo-500" />;
        default: return <Database className="w-4 h-4 text-indigo-500" />;
      }
    }
  };

  const isLightColor = (color?: string) => {
    if (!color) return false;
    let hex = color.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (hex.length !== 6) return false;
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return (r * 299 + g * 587 + b * 114) / 1000 > 180;
  };

  const getFieldLabel = (field: any) => {
    if (field.isStatic) {
      if (field.type === 'text') return field.staticText || 'Static Text';
      if (field.type === 'image') return 'Static Image';
      if (field.type === 'shape') {
        if (field.shapeType) {
          // e.g. "cross" -> "Cross", "rectangle" -> "Rectangle"
          return field.shapeType.charAt(0).toUpperCase() + field.shapeType.slice(1);
        }
        return 'Shape';
      }
      if (field.type === 'divider') return 'Divider';
      if (field.type === 'drawing') return 'Drawing';
      if (field.type === 'qrcode') return 'Static QR';
      if (field.type === 'barcode') return 'Static Barcode';
    }
    return field.headerKey;
  };

  const toggleVisibility = (fieldId: string, isHidden: boolean | undefined) => {
    updateCurrentProject({
      fields: fields.map(f => f.id === fieldId ? { ...f, isHidden: !isHidden } : f)
    });
  };

  const handleHighlight = (fieldId: string) => {
    window.dispatchEvent(new CustomEvent('highlight-element', { detail: fieldId }));
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm shrink-0">
        <h3 className="text-base font-bold text-gray-900 mb-2">Layers</h3>
        <p className="text-xs text-gray-500 mb-4">Drag to reorder layers. Top elements appear in front.</p>
        
        {fields.length === 0 ? (
          <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-medium">
            No elements on the canvas
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="layers-list">
              {(provided) => (
                <div 
                  className="space-y-2"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {displayFields.map((field, index) => {
                    const isHidden = field.isHidden;
                    const needsDarkBg = field.type === 'text' && isLightColor(field.color);

                    return (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                              snapshot.isDragging 
                                ? `border-indigo-400 shadow-xl scale-[1.02] z-50 ring-2 ring-indigo-500/20 ${needsDarkBg ? 'bg-gray-800' : 'bg-white'}`
                                : needsDarkBg
                                  ? 'border-gray-700 bg-gray-800 hover:border-gray-600 shadow-sm'
                                  : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm'
                            }`}
                          >
                            <div 
                              {...provided.dragHandleProps}
                              className={`${needsDarkBg ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors focus:outline-none`}
                            >
                              <GripVertical className="w-4 h-4 shrink-0" />
                            </div>
                            
                            <div className={`p-1.5 rounded-md ${field.isStatic ? (needsDarkBg ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100') : (needsDarkBg ? 'bg-indigo-900/50 border-indigo-800' : 'bg-indigo-50 border-indigo-100')} border ${isHidden ? 'opacity-50' : ''}`}>
                              {getFieldIcon(field)}
                            </div>
                            
                            <div 
                              className={`flex-1 truncate text-sm font-medium ${field.type !== 'text' || !field.color ? (needsDarkBg ? 'text-gray-200' : 'text-gray-700') : ''} ${isHidden ? 'opacity-50' : ''}`}
                              style={field.type === 'text' && field.color ? { color: field.color } : {}}
                            >
                              {getFieldLabel(field)}
                            </div>

                            <button 
                              onClick={() => handleHighlight(field.id)}
                              className={`p-1.5 rounded-md transition-colors shrink-0 ${needsDarkBg ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                              title="Find element on canvas"
                            >
                              <Search className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={() => toggleVisibility(field.id, field.isHidden)}
                              className={`p-1.5 rounded-md transition-colors shrink-0 ${needsDarkBg ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                              title={isHidden ? "Show layer" : "Hide layer"}
                            >
                              {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;

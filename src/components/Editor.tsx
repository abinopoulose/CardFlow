import React, { useState } from 'react';
import { ArrowLeft, Edit3, Check, Download, Eye } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import DataUploader from './DataUploader';
import TemplateUploader from './TemplateUploader';
import TemplateConfigurator from './TemplateConfigurator';
import FieldsPanel from './FieldsPanel';
import Previewer from './Previewer';
import ExportManager from './ExportManager';

const Editor: React.FC = () => {
  const { currentProject, setCurrentProjectId, updateCurrentProject } = useAppContext();
  const [activeTab, setActiveTab] = useState<'fields' | 'data' | 'background'>('fields');
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectName, setProjectName] = useState(currentProject?.name || '');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const [leftWidth, setLeftWidth] = useState(360);
  const [rightWidth, setRightWidth] = useState(320);

  if (!currentProject) return null;

  const handleSaveName = () => {
    updateCurrentProject({ name: projectName });
    setIsEditingName(false);
  };

  const startLeftResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;
    
    const onMouseMove = (e: MouseEvent) => {
      setLeftWidth(Math.max(250, Math.min(600, startWidth + (e.clientX - startX))));
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
            onClick={() => setCurrentProjectId(null)}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
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
            <span className="text-xs text-gray-400 ml-4 hidden md:inline">
              Saved {new Date(currentProject.updatedAt).toLocaleTimeString()}
            </span>
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
            <div className="absolute top-12 right-4 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50">
              <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Export Options</h3>
              <ExportManager />
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative z-0">
        
        {/* Left Sidebar */}
        <div 
          className="bg-white flex flex-col shrink-0 z-10 shadow-[4px_0_15px_-10px_rgba(0,0,0,0.1)] relative"
          style={{ width: `${leftWidth}px` }}
        >
          <div className="flex p-2 gap-1 border-b border-gray-100 bg-gray-50/50">
            <button 
              onClick={() => setActiveTab('fields')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'fields' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              Fields
            </button>
            <button 
              onClick={() => setActiveTab('data')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'data' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              Data
            </button>
            <button 
              onClick={() => setActiveTab('background')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'background' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              Background
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50/30">
            {activeTab === 'fields' && <FieldsPanel selectedFieldId={selectedFieldId} onSelectField={setSelectedFieldId} />}
            {activeTab === 'data' && <DataUploader />}
            {activeTab === 'background' && <TemplateUploader />}
          </div>

          {/* Left Resize Handle */}
          <div 
            className="absolute top-0 right-[-4px] w-2 h-full cursor-col-resize z-50 group flex items-center justify-center"
            onMouseDown={startLeftResize}
          >
            <div className="w-1 h-12 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 bg-gray-100/80 overflow-hidden flex flex-col relative z-0">
          <TemplateConfigurator selectedFieldId={selectedFieldId} onSelectField={setSelectedFieldId} />
        </div>

        {/* Right Sidebar - Exclusive for Live Preview */}
        <div 
          className="bg-white flex flex-col shrink-0 z-10 shadow-[-4px_0_15px_-10px_rgba(0,0,0,0.1)] relative"
          style={{ width: `${rightWidth}px` }}
        >
          {/* Right Resize Handle */}
          <div 
            className="absolute top-0 left-[-4px] w-2 h-full cursor-col-resize z-50 group flex items-center justify-center"
            onMouseDown={startRightResize}
          >
            <div className="w-1 h-12 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              Live Preview
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-start justify-center custom-scrollbar">
            {/* Compute scale based on rightWidth (assume base width of preview is width of project, so scale down to fit container) */}
            <div className="w-full flex justify-center">
              <div 
                className="transform origin-top transition-transform duration-75"
                style={{
                   transform: `scale(${Math.min(1, (rightWidth - 48) / (currentProject.width || 400))})`
                }}
              >
                <Previewer />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Editor;

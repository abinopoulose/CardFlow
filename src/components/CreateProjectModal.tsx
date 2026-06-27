import React, { useState } from 'react';
import { LayoutTemplate, Square, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { prebuiltThemes } from './ThemeSelector';

interface CreateProjectModalProps {
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const { createProject } = useAppContext();
  const [newProjectName, setNewProjectName] = useState('');
  const [creationMode, setCreationMode] = useState<'theme' | 'scratch' | null>(null);
  const [customWidth, setCustomWidth] = useState(500);
  const [customHeight, setCustomHeight] = useState(500);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDesign, setSelectedDesign] = useState<{type: 'scratch', width: number, height: number} | {type: 'theme', theme: typeof prebuiltThemes[0]} | null>(null);

  const startScratch = (width: number, height: number) => {
    if (!newProjectName) return;
    createProject({
      name: newProjectName,
      width,
      height,
      data: [],
      headers: [],
      templateImage: null,
      fields: [],
      isSingleMode: true,
      singleData: {},
      photosMap: {}
    });
    onClose();
  };

  const startTheme = (theme: typeof prebuiltThemes[0]) => {
    if (!newProjectName) return;
    createProject({
      name: newProjectName,
      width: theme.width || 400,
      height: theme.height || 600,
      data: [],
      headers: theme.fields.map(f => f.headerKey),
      templateImage: theme.bg,
      fields: theme.fields as any,
      isSingleMode: true,
      singleData: {},
      photosMap: {}
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-2xl font-extrabold text-slate-900">Create New Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div className="p-8">
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-3">Project Name</label>
            <input 
              type="text" 
              autoFocus
              value={newProjectName} 
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="e.g. Corporate Badges 2026"
              className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-lg font-medium transition-all"
            />
          </div>

          {!creationMode ? (
            <div className="grid grid-cols-2 gap-6">
              <div 
                onClick={() => setCreationMode('theme')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${newProjectName ? 'border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 hover:shadow-lg hover:-translate-y-1' : 'border-slate-100 opacity-50 cursor-not-allowed'}`}
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <LayoutTemplate className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Pre-built Theme</h3>
                <p className="text-sm text-slate-500 font-medium">Start quickly with a professional, ready-to-use template.</p>
              </div>
              <div 
                onClick={() => setCreationMode('scratch')}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${newProjectName ? 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 hover:shadow-lg hover:-translate-y-1' : 'border-slate-100 opacity-50 cursor-not-allowed'}`}
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Square className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Start from Scratch</h3>
                <p className="text-sm text-slate-500 font-medium">Choose custom dimensions and build your own design.</p>
              </div>
            </div>
          ) : creationMode === 'scratch' ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3 text-lg">
                <button onClick={() => { setCreationMode(null); setSelectedDesign(null); setErrorMsg(''); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                Select Dimensions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                  onClick={() => setSelectedDesign({type: 'scratch', width: 400, height: 600})} 
                  className={`p-6 border-2 rounded-2xl text-center transition-all group ${selectedDesign?.type === 'scratch' && selectedDesign.width === 400 && selectedDesign.height === 600 ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 hover:-translate-y-1'}`}
                >
                  <div className="w-16 h-24 border-4 border-indigo-200 group-hover:border-indigo-400 mx-auto mb-4 rounded-lg transition-colors"></div>
                  <h4 className="font-bold text-slate-900 text-lg">Portrait</h4>
                  <p className="text-sm text-slate-500 font-medium">400 × 600 px</p>
                </button>
                <button 
                  onClick={() => setSelectedDesign({type: 'scratch', width: 600, height: 400})} 
                  className={`p-6 border-2 rounded-2xl text-center flex flex-col justify-end transition-all group ${selectedDesign?.type === 'scratch' && selectedDesign.width === 600 && selectedDesign.height === 400 ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 hover:-translate-y-1'}`}
                >
                  <div className="w-24 h-16 border-4 border-indigo-200 group-hover:border-indigo-400 mx-auto mb-4 rounded-lg transition-colors"></div>
                  <h4 className="font-bold text-slate-900 text-lg">Landscape</h4>
                  <p className="text-sm text-slate-500 font-medium">600 × 400 px</p>
                </button>
                <div className={`p-5 border-2 rounded-2xl transition-all flex flex-col justify-between group ${selectedDesign?.type === 'scratch' && selectedDesign.width === customWidth && selectedDesign.height === customHeight ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 hover:-translate-y-1'}`}>
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-500 w-4">W</label>
                      <input 
                        type="number" 
                        value={customWidth} 
                        onChange={e => {
                          setCustomWidth(Number(e.target.value));
                          setSelectedDesign({type: 'scratch', width: Number(e.target.value), height: customHeight});
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-500 w-4">H</label>
                      <input 
                        type="number" 
                        value={customHeight} 
                        onChange={e => {
                          setCustomHeight(Number(e.target.value));
                          setSelectedDesign({type: 'scratch', width: customWidth, height: Number(e.target.value)});
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDesign({type: 'scratch', width: customWidth, height: customHeight})}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm ${selectedDesign?.type === 'scratch' && selectedDesign.width === customWidth && selectedDesign.height === customHeight ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                  >
                    {selectedDesign?.type === 'scratch' && selectedDesign.width === customWidth && selectedDesign.height === customHeight ? 'Selected' : 'Select Custom'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-3 text-lg">
                <button onClick={() => { setCreationMode(null); setSelectedDesign(null); setErrorMsg(''); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </button>
                Select Theme
              </h3>
              <div className="grid grid-cols-3 gap-5 max-h-[400px] overflow-y-auto p-1">
                {prebuiltThemes.map(theme => (
                  <button 
                    key={theme.name} 
                    onClick={() => setSelectedDesign({type: 'theme', theme})} 
                    className="group text-left focus:outline-none"
                  >
                    <div className={`h-40 rounded-2xl overflow-hidden mb-3 border-4 transition-all ${selectedDesign?.type === 'theme' && selectedDesign.theme.name === theme.name ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-500/30' : 'border-slate-200 group-hover:border-indigo-400 group-hover:-translate-y-1'}`}>
                      <img src={theme.bg} alt={theme.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className={`font-bold text-sm transition-colors ${selectedDesign?.type === 'theme' && selectedDesign.theme.name === theme.name ? 'text-indigo-600' : 'text-slate-800 group-hover:text-indigo-600'}`}>{theme.name}</h4>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Start Building Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-6 gap-4">
            <div className="text-rose-500 text-sm font-bold">{errorMsg}</div>
            <button 
              onClick={() => {
                setErrorMsg('');
                if (!newProjectName.trim()) {
                  setErrorMsg('Please enter a project name.');
                  return;
                }
                if (!creationMode) {
                  setErrorMsg('Please choose to start from scratch or use a theme.');
                  return;
                }
                if (!selectedDesign) {
                  setErrorMsg('Please select a design (dimensions or theme).');
                  return;
                }
                if (selectedDesign.type === 'scratch') {
                  startScratch(selectedDesign.width, selectedDesign.height);
                } else {
                  startTheme(selectedDesign.theme);
                }
              }}
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-indigo-500/25"
            >
              Start Building
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;

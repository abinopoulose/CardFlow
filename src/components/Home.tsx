import React, { useState } from 'react';
import { Plus, LayoutTemplate, Square, Trash2, ArrowRight, Layers, FileDown, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { prebuiltThemes } from './ThemeSelector';

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shadow-lg rounded-xl">
    <rect width="40" height="40" rx="12" fill="url(#logo_gradient)" />
    <path d="M11 13C11 11.8954 11.8954 11 13 11H27C28.1046 11 29 11.8954 29 13V27C29 28.1046 28.1046 29 27 29H13C11.8954 29 11 28.1046 11 27V13Z" fill="white" fillOpacity="0.2" />
    <rect x="14" y="14" width="12" height="12" rx="3" fill="white" />
    <circle cx="20" cy="18" r="2.5" fill="url(#logo_gradient)" />
    <rect x="17" y="22" width="6" height="1.5" rx="0.75" fill="url(#logo_gradient)" />
    <path d="M28 20C30 18 33 21 35 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 20C10 22 7 19 5 21" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="logo_gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="1" stopColor="#0EA5E9" />
      </linearGradient>
    </defs>
  </svg>
);

const Home: React.FC = () => {
  const { projects, setCurrentProjectId, createProject, deleteProject } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [creationMode, setCreationMode] = useState<'theme' | 'scratch' | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [customWidth, setCustomWidth] = useState(500);
  const [customHeight, setCustomHeight] = useState(500);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDesign, setSelectedDesign] = useState<{type: 'scratch', width: number, height: number} | {type: 'theme', theme: typeof prebuiltThemes[0]} | null>(null);

  const handleOpenModal = () => {
    setCreationMode(null);
    setNewProjectName('');
    setSelectedDesign(null);
    setErrorMsg('');
    setShowModal(true);
  };

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
      isSingleMode: false,
      singleData: {},
      photosMap: {}
    });
    setShowModal(false);
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
      isSingleMode: false,
      singleData: {},
      photosMap: {}
    });
    setShowModal(false);
  };

  const openProject = (id: string) => {
    setCurrentProjectId(id);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white p-6 md:p-12 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <Logo />
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              CardFlow
            </h1>
          </div>
          {projects.length > 0 && (
            <button 
              onClick={handleOpenModal}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          )}
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 mt-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            The Ultimate Bulk ID Card Generator
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 tracking-tight mb-6 leading-[1.1]">
            Create Professional <br />ID Cards at Scale
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            CardFlow streamlines your workflow. Design stunning badges, sync your employee spreadsheet, and export hundreds of print-ready cards in minutes.
          </p>
          <button 
            onClick={handleOpenModal}
            className="group inline-flex items-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-indigo-600/30 hover:-translate-y-1"
          >
            <Plus className="w-6 h-6" />
            Start Your First Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* How it Works / Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative z-10">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300 group">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100 group-hover:bg-indigo-600 transition-colors">
              <Layers className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">1. Design Templates</h3>
            <p className="text-slate-600 leading-relaxed font-medium">Create pixel-perfect layouts from scratch or instantly apply our professionally crafted themes.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300 delay-75 group">
            <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 border border-cyan-100 group-hover:bg-cyan-500 transition-colors">
              <ImageIcon className="w-7 h-7 text-cyan-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">2. Map Your Data</h3>
            <p className="text-slate-600 leading-relaxed font-medium">Upload CSV/Excel sheets. CardFlow automatically maps fields and dynamically binds employee photos.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300 delay-150 group">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-emerald-500 transition-colors">
              <FileDown className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">3. Bulk Generate</h3>
            <p className="text-slate-600 leading-relaxed font-medium">Export hundreds of high-resolution, print-ready PDF ID cards in a single click with perfect fidelity.</p>
          </div>
        </div>

        {/* Projects Section */}
        <div className="border-t border-slate-200/60 pt-16 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Recent Projects</h2>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 border-dashed">
              <LayoutTemplate className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No projects yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">Your creative journey starts here. Click above to design your first batch of cards.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map(p => (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-100 transition-all group cursor-pointer flex flex-col" onClick={() => openProject(p.id)}>
                  <div className="h-40 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                    {p.templateImage ? (
                      <img src={p.templateImage} alt="bg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <Square className="w-12 h-12 text-slate-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg truncate group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                      <p className="text-sm text-slate-400 font-medium mt-1">Edited {new Date(p.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-4 flex gap-2 justify-end">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(p.id); }}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Project?</h3>
            <p className="text-slate-500 mb-6 font-medium">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-rose-500/25"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-extrabold text-slate-900">Create New Project</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
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
      )}
    </div>
  );
};

export default Home;

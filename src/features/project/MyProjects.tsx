import React, { useState } from 'react';
import { ArrowLeft, Trash2, LayoutTemplate, Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import CreateProjectModal from './CreateProjectModal';

interface MyProjectsProps {
  onBack: () => void;
}

const MyProjects: React.FC<MyProjectsProps> = ({ onBack }) => {
  const { projects, setCurrentProjectId, deleteProject, deleteAllProjects } = useAppContext();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openProject = (id: string) => {
    setCurrentProjectId(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30 relative z-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-[100%] blur-3xl -z-10 mix-blend-multiply pointer-events-none"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700 tracking-tight">
            My Projects
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-semibold transition-all shadow-md hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
            {projects.length > 0 && (
              <button 
                onClick={() => setShowDeleteAllConfirm(true)}
                className="flex items-center gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl font-semibold transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Delete All
              </button>
            )}
          </div>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-32 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-24 h-24 bg-slate-100/50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-200/50">
              <LayoutTemplate className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">No projects yet</h3>
            <p className="text-lg text-slate-500 max-w-md mx-auto font-medium mb-8">
              Your creative journey starts here. Start a new project to design your first batch of cards.
            </p>
            <button 
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1"
            >
              <Plus className="w-6 h-6" />
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {projects.map(p => (
              <div key={p.id} className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] shadow-sm border border-slate-200/60 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group cursor-pointer flex flex-col hover:-translate-y-1" onClick={() => openProject(p.id)}>
                <div 
                  className="h-56 relative flex items-center justify-center overflow-hidden p-4"
                  style={{
                    backgroundColor: p.backgroundType === 'color' ? p.backgroundColor : (p.backgroundType === 'transparent' ? '#f8fafc' : '#ffffff'),
                    backgroundImage: p.backgroundType === 'gradient' && p.backgroundGradient ? `linear-gradient(${p.backgroundGradient.direction}, ${p.backgroundGradient.colors.join(', ')})` : 'none'
                  }}
                >
                  {p.previewImage || p.templateImage ? (
                    <img src={p.previewImage || p.templateImage || ''} alt="bg" className="w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <div 
                      className="w-full h-full shadow-sm border border-slate-200/50"
                      style={{
                         aspectRatio: `${p.width} / ${p.height}`,
                         backgroundColor: p.backgroundType === 'color' ? p.backgroundColor : '#ffffff',
                         backgroundImage: p.backgroundType === 'gradient' && p.backgroundGradient ? `linear-gradient(${p.backgroundGradient.direction}, ${p.backgroundGradient.colors.join(', ')})` : 'none'
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-indigo-600 transition-colors">{p.name}</h3>
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

      {/* Delete All Confirmation Modal */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete All Projects?</h3>
            <p className="text-slate-500 mb-6 font-medium">
              Are you sure you want to delete all projects and saved data? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteAllConfirm(false)}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteAllProjects();
                  setShowDeleteAllConfirm(false);
                }}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-rose-500/25"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <CreateProjectModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default MyProjects;

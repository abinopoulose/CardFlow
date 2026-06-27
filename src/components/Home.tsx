import React, { useState } from 'react';
import { Plus, Wand2, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import CreateProjectModal from './CreateProjectModal';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

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

interface HomeProps {
  onNavigate: (view: 'home' | 'how-it-works' | 'my-projects') => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white p-6 md:p-12 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-24 mt-8 px-6 bg-white/50 backdrop-blur-md rounded-3xl py-4 shadow-sm border border-white">
          <div className="flex items-center gap-4">
            <Logo />
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              CardFlow
            </h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <a 
              href="https://github.com/abinopoulose/CardFlow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 font-semibold"
            >
              <GithubIcon className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <div className="hidden sm:block w-px h-6 bg-slate-200"></div>
            <button 
              onClick={() => onNavigate('how-it-works')}
              className="text-slate-500 hover:text-indigo-600 font-semibold transition-colors hidden sm:block"
            >
              How it Works
            </button>
            <button 
              onClick={() => onNavigate('my-projects')}
              className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-sm hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              My Projects
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-[100%] blur-3xl -z-10 mix-blend-multiply"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-600 text-sm font-bold mb-8 shadow-sm hover:border-indigo-200 transition-colors cursor-default">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            The Ultimate Bulk ID Card Generator
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 tracking-tight mb-8 leading-[1.1]">
            Design beautifully.<br />Generate instantly.
          </h1>
          <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
            Stop manually copying and pasting employee data. Design your badge once, connect a spreadsheet, and export hundreds of print-ready cards in seconds.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={handleOpenModal}
              className="group inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1"
            >
              <Plus className="w-6 h-6" />
              Create Project
            </button>
            <button 
              onClick={() => onNavigate('how-it-works')}
              className="inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-sm border border-slate-200/60 hover:-translate-y-1"
            >
              <Wand2 className="w-5 h-5 text-slate-400" />
              Learn More
            </button>
          </div>
          <div className="mt-12 inline-flex items-center gap-3 text-slate-500 text-sm font-medium bg-slate-50 border border-slate-200/60 px-4 py-2.5 rounded-2xl shadow-sm">
            <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <span><strong>Privacy First:</strong> All your data is processed locally on your device. No data is ever sent to a server.</span>
          </div>
        </div>

      </div>

      {/* Create Project Modal */}
      {showModal && (
        <CreateProjectModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Home;

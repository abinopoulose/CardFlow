import React from 'react';
import { ArrowLeft, Layers, Image as ImageIcon, FileDown, Sparkles, ShieldCheck } from 'lucide-react';

interface HowItWorksProps {
  onBack: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/80 backdrop-blur border border-indigo-100 text-indigo-600 text-sm font-bold tracking-wide mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Workflow Guide
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700 tracking-tight mb-6 leading-tight">
            How CardFlow Works
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            A simple, powerful pipeline to design, map, and export hundreds of ID cards in minutes.
          </p>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150 relative">
          
          {/* Step 1 */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200/50 flex flex-col md:flex-row gap-8 md:gap-12 items-center hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-500 group">
            <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center border border-indigo-200/50 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Layers className="w-10 h-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-3">Step 1</div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">Design Your Template</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-lg">
                Start from scratch with custom dimensions or pick a professionally pre-built theme. Add text layers, shapes, barcodes, and dynamic placeholders to build your perfect badge.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200/50 flex flex-col md:flex-row gap-8 md:gap-12 items-center hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-500 group">
            <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-cyan-100 to-cyan-50 text-cyan-600 rounded-3xl flex items-center justify-center border border-cyan-200/50 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <ImageIcon className="w-10 h-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-cyan-600 font-bold text-sm tracking-widest uppercase mb-3">Step 2</div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">Connect Your Data</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-lg mb-6">
                Upload your employee list (CSV or Excel) and optionally drag-and-drop a folder of employee headshots to dynamically bind photos.
              </p>
              <div className="inline-flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200/60 px-5 py-3 rounded-2xl w-full md:w-auto text-left">
                <span className="bg-cyan-100 text-cyan-700 px-2.5 py-1 rounded-lg text-xs tracking-wide uppercase shrink-0">Rule</span>
                <span>Your spreadsheet must include an <strong>id_number</strong> column and headers that exactly match your design placeholders.</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200/50 flex flex-col md:flex-row gap-8 md:gap-12 items-center hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-500 group">
            <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center border border-emerald-200/50 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <FileDown className="w-10 h-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-3">Step 3</div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">Generate & Export</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-lg">
                Review the live preview, then hit Export to generate a high-resolution, print-ready PDF of all your cards or download them as a ZIP archive.
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-700/50 flex flex-col md:flex-row gap-8 md:gap-12 items-center group relative overflow-hidden mt-12">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="w-24 h-24 shrink-0 bg-slate-800/80 text-emerald-400 rounded-3xl flex items-center justify-center border border-slate-700 shadow-inner group-hover:scale-110 transition-transform duration-500 z-10">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="flex-1 text-center md:text-left z-10">
              <div className="text-emerald-400 font-bold text-sm tracking-widest uppercase mb-3">100% Secure</div>
              <h3 className="text-3xl font-black text-white mb-4">Privacy First. Always.</h3>
              <p className="text-slate-300 leading-relaxed font-medium text-lg">
                Your employee list, photos, and generated ID cards never leave your computer. <strong>All data processing happens locally in your browser.</strong> We don't store your data, and we don't send it to any servers.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

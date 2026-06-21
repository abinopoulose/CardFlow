
import { AppProvider } from './context/AppContext'
import ThemeSelector from './components/ThemeSelector'
import DataUploader from './components/DataUploader'
import TemplateUploader from './components/TemplateUploader'
import TemplateConfigurator from './components/TemplateConfigurator'
import Previewer from './components/Previewer'
import ExportManager from './components/ExportManager'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-indigo-50 via-white to-cyan-50 flex flex-col font-sans selection:bg-indigo-200">
        <header className="bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20 px-6 py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg shadow-md flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">ID</span>
              </div>
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-slate-800 tracking-tight">
                CardStudio Pro
              </h1>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              Local Mode
            </div>
          </div>
        </header>
        
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ThemeSelector />
              <DataUploader />
              <TemplateUploader />
            </div>
            
            <div className="lg:col-span-8 flex flex-col">
              <TemplateConfigurator />
              <Previewer />
              <ExportManager />
            </div>
          </div>
        </main>
      </div>
    </AppProvider>
  )
}

export default App

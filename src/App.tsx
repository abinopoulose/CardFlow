import React from 'react'
import { AppProvider, useAppContext } from './context/AppContext'
import Home from './features/home/Home'
import Editor from './features/editor/Editor'
import HowItWorks from './features/home/HowItWorks'
import MyProjects from './features/project/MyProjects'

const Main: React.FC = () => {
  const { currentProjectId } = useAppContext();
  const [view, setView] = React.useState<'home' | 'how-it-works' | 'my-projects'>('home');
  
  if (currentProjectId) {
    return <Editor />;
  }
  
  if (view === 'how-it-works') {
    return <HowItWorks onBack={() => setView('home')} />;
  }

  if (view === 'my-projects') {
    return <MyProjects onBack={() => setView('home')} />;
  }

  return <Home onNavigate={(v) => setView(v)} />;
};

function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  )
}

export default App

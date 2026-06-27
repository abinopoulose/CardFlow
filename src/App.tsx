import React from 'react'
import { AppProvider, useAppContext } from './context/AppContext'
import Home from './components/Home'
import Editor from './components/Editor'
import HowItWorks from './components/HowItWorks'
import MyProjects from './components/MyProjects'

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

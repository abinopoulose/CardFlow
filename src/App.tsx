import React from 'react'
import { AppProvider, useAppContext } from './context/AppContext'
import Home from './components/Home'
import Editor from './components/Editor'

const Main: React.FC = () => {
  const { currentProjectId } = useAppContext();
  
  if (currentProjectId) {
    return <Editor />;
  }
  return <Home />;
};

function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  )
}

export default App

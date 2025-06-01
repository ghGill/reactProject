import { useEffect, useState } from 'react'

import './App.css'
import Pages from './Pages.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { MediaResolutionProvider } from './contexts/MediaResolution.jsx'
import { DB } from './utils/DB.jsx'

function App() {
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    DB.connect()
      .then(result => {
        setDbConnected(true);
      })
  }, [])

  return (
    <>
    {
      dbConnected ? 
      (
        <MediaResolutionProvider>
          <AuthContextProvider>
            <Pages />
          </AuthContextProvider>
        </MediaResolutionProvider>
      ) : 
      (
        <></>
      )
    }
    </>
  )
}

export default App

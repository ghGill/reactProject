import { useEffect, useState } from 'react'

import './App.css'
import Pages from './Pages.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { MediaResolutionProvider } from './contexts/MediaResolution.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { DB } from './utils/DB';

function App() {
  const [dbErrMsg] = useState('Database is not available.');
  const [errMsg, setErrMsg] = useState('');
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
      DB.verifyDbConnection()
        .then(result => {
          if (!result.status)
            setErrMsg(dbErrMsg);

          setDbConnected(result.status);
        })
        .catch(e => {
          setDbConnected(false);
          setErrMsg(dbErrMsg);
        })
  }, [])

  return (
    <>
    {
      (dbConnected === true)? 
      (
        <Provider store = { store }>
          <MediaResolutionProvider>
            <AuthContextProvider>
              <Pages />
            </AuthContextProvider>
          </MediaResolutionProvider>
        </Provider>
      ) : 
      (
        <>
          <h1>
            {errMsg}
          </h1>
        </>
      )
    }
    </>
  )
}

export default App

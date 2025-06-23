import { useEffect, useState } from 'react'

import './App.css'
import Pages from './Pages.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { MediaResolutionProvider } from './contexts/MediaResolution.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { DB } from './utils/DB';

function App() {
  const [dbErrMsg] = useState('Server is not available.');
  const [errMsg, setErrMsg] = useState('Connecting to server...');
  const [dbConnected, setDbConnected] = useState(false);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    DB.verifyDbConnection()
      .then(result => {
        if (!result.status)
          retryConnect();
        else
          setDbConnected(result.status);
      })
      .catch(e => {
        retryConnect();
      })
  }, [retries])

  function retryConnect() {
    if (retries == 5) {
      setDbConnected(false);
      setErrMsg(dbErrMsg);
    }
    else {
      setTimeout(() => {
        setRetries(retries + 1);
        setErrMsg(`Retry connecting to server... (${retries + 1}/${5})`)
      }, 3000)
    }
  }

  return (
    <>
      {
        (dbConnected === true) ?
          (
            <Provider store={store}>
              <MediaResolutionProvider>
                <AuthContextProvider>
                  <Pages />
                </AuthContextProvider>
              </MediaResolutionProvider>
            </Provider>
          ) :
          (
            <>
              <h1 className='err-msg'>
                {errMsg}
              </h1>
            </>
          )
      }
    </>
  )
}

export default App

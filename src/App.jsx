import './App.css'
import Page from './pages/Page.jsx'
import { getCookie } from './utils/cookies.jsx'
import { useLocation } from 'wouter'
import { useEffect } from 'react'

function App() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const pagePath = window.location.pathname;
    const gotoPage = pagePath === '/signup' ? pagePath : getCookie("username") ? "/" : "/login";
    navigate(gotoPage);
  }, [navigate]);

  return (
    <>
      <Page />
    </>
  )
}

export default App

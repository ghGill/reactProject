import './App.css'
import Page from './pages/Page.jsx'
import { getCookie } from './utils/cookies.jsx'
import { getPageDataById, getDefaultPageData } from './pages/pagesInfo.jsx'

function App() {
  const satartPage = getCookie("username") ? getPageDataById("overview") : getDefaultPageData();

  return (
    <>
      <Page page={satartPage} />
    </>
  )
}

export default App

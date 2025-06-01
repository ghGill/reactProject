import './SidebarLayout.css'
import Sidebar from '../../components/Sidebar'
import { MediaResolution } from '../../contexts/MediaResolution'
import { useContext } from 'react'

function SidebarLayout({ children, route }) {
    const { isDesktop } = useContext(MediaResolution);

    return (
        <div className={`page ${isDesktop ? '' : 'portrait'}`}>
            <div className={`sidebar-area ${isDesktop ? '' : 'portrait'}`}>
                <Sidebar route={route} />
            </div>

            <div className="content-area">
                {children}
            </div>
        </div>
    )
}

export default SidebarLayout

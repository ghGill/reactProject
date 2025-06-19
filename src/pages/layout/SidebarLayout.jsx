import './SidebarLayout.css'
import Sidebar from '../../components/Sidebar'
import { MediaResolution } from '../../contexts/MediaResolution'
import { useContext } from 'react'

function SidebarLayout({ children, route, title }) {
    const { isDesktop, mediaType } = useContext(MediaResolution);

    return (
        <div className={`page ${isDesktop ? '' : 'portrait'}`}>
            <div className={`sidebar-area ${mediaType}`}>
                <Sidebar route={route} />
            </div>

            <div className="content-area">
                <div className='page-header'>
                    {title}
                </div>

                <div className=''>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SidebarLayout

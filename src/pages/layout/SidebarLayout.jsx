import './SidebarLayout.css'
import Sidebar from '../../components/Sidebar'
import { useMediaResolution } from '../../contexts/MediaResolution'

function SidebarLayout({ children, route, title }) {
    const { isDesktop, mediaType } = useMediaResolution();

    return (
        <div className={`page ${mediaType}`}>
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

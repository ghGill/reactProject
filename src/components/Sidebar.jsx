import './Sidebar.css'
import { useState, useEffect } from 'react'
import { pagesInfoData, getDefaultPageData } from '../pages/pagesInfo.jsx'

function Sidebar({ changePageHandler, pageId = null }) {
    const [activeMenu, setActiveMenu] = useState(pageId ? pageId : getDefaultPageData("id"));
    const [sidebarState, setSidebarState] = useState("open");

    function sidebarItemClick(pageId) {
        setActiveMenu(pageId);
        changePageHandler(pageId);
    }

    function toggleSidebar() {
        setSidebarState((sidebarState == "open") ? "close" : "open");
    }

    useEffect(() => {
        setActiveMenu(pageId);
    }, [pageId])

    return (
        <>
            <div className={'sidebar'}>
                <div className={`sidebar-content ${sidebarState}`}>
                    <div className={'sidebar-title'}>
                        {pagesInfoData.sidebar_title}
                    </div>

                    <div>
                        {
                            pagesInfoData.pages.map(item => {
                                return (item.type === "sidebar") ?
                                    (
                                        <SidebarItem
                                            itemData={item}
                                            key={item.title}
                                            activeMenu={activeMenu}
                                            onClick={sidebarItemClick}
                                        />

                                    ) : null
                            })
                        }
                    </div>
                    
                    <div className={`sidebar-item`} onClick={() => { sidebarItemClick('login') }}>
                        <div className="sidebar-item-icon">
                            <i className={`fa fa-sign-out`}></i>
                        </div>
                        <div className='sidebar-item-text'>
                            <p>Logout</p>
                        </div>
                    </div>
                </div>

                <div className="toggle-sidebar-btn">
                    <div onClick={toggleSidebar}>{(sidebarState == "open") ? "<<" : ">>"}</div>
                </div>
            </div>
        </>
    )
}

function SidebarItem({ itemData, activeMenu, onClick }) {
    return (
        <div className={`sidebar-item ${itemData.id === activeMenu ? 'active' : ''}`} onClick={() => { onClick(itemData.id) }}>
            <div className="sidebar-item-icon">
                <i className={`fa fa-${itemData.icon}`}></i>
            </div>
            <div className='sidebar-item-text'>
                <p>{itemData.title}</p>
            </div>
        </div>
    )
}

export default Sidebar

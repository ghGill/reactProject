import { useState, useContext } from 'react'
import { useLocation } from 'wouter'
import './Sidebar.css'
import { AuthContext } from '../contexts/AuthContext';
import { MediaResolution } from '../contexts/MediaResolution';

function Sidebar({ route }) {
    const [sidebarState, setSidebarState] = useState("open");
    const [, navigate] = useLocation();
    const context = useContext(AuthContext);
    const {isDesktop, isTablet, isMobile } = useContext(MediaResolution);

    const pagesInfo = {
        sidebar_title: "finance",
        pages: [
            {
                routes:["/overview", "/"],
                title:"Overview",
                icon:"home",
            },
            {
                routes:["/transactions"],
                title:"Transactions",
                icon:"exchange",
            },
            {
                routes:["/budgets"],
                title:"Budgets",
                icon:"pie-chart",
            },
            {
                routes:["/pots"],
                title:"Pots",
                icon:"money",
            },
            {
                routes:["/recurring-bills"],
                title:"Recurring Bills",
                icon:"file-text-o",
            },
            {
                routes:["/login"],
                title:"Logout",
                icon:"sign-out",
            },
        ],
    }

    function sidebarItemClick(route) {
        navigate(route);
    }

    function toggleSidebar() {
        setSidebarState((sidebarState == "open") ? "close" : "open");
    }

    function logout() {
        context.setUser(null);
        navigate('/login', { replace: true })
    }

    return (
        <>
            <div className={`sidebar ${sidebarState} ${!isDesktop ? 'portrait' : 'landscape'}`}>
                <div className={`sidebar-content ${sidebarState} ${!isDesktop ? 'portrait' : 'landscape'}`}>
                    <div className={`sidebar-title ${!isDesktop ? 'portrait' : ''}`}>
                        {pagesInfo.sidebar_title}
                    </div>

                    <div className={`sidebar-items-container ${!isDesktop ? 'portrait' : ''}`}>
                        {
                            pagesInfo.pages.map(item => {
                                return (
                                    <SidebarItem
                                        isDesktop={isDesktop}
                                        isMobile={isMobile}
                                        itemData={item}
                                        key={item.title}
                                        activeRoute={route}
                                        onClick={sidebarItemClick}
                                    />
                                )
                            })
                        }
                    </div>
                </div>

                {
                    isDesktop &&
                    <div className="toggle-sidebar-btn">
                        <div onClick={toggleSidebar}>{(sidebarState == "open") ? "<<" : ">>"}</div>
                    </div>
                }
            </div>
        </>
    )
}

function SidebarItem({ itemData, activeRoute, onClick, isDesktop, isMobile }) {
    const itemClass = `sidebar-item ${itemData.routes.includes(activeRoute) ? 'active' : ''} ${isDesktop ? 'landscape' : 'portrait'}`;

    return (
        <div className={`${itemClass}`} onClick={() => { onClick(itemData.routes[0]) }}>
            <div className={`sidebar-item-icon ${isDesktop ? 'landscape' : 'portrait'}`}>
                <i className={`fa fa-${itemData.icon}`}></i>
            </div>

            {
                !isMobile &&
                <div className={`sidebar-item-text ${isDesktop ? 'landscape' : 'portrait'}`}>
                    <div>{itemData.title}</div>
                </div>
            }
        </div>
    )
}

export default Sidebar

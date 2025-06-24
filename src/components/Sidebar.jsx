import { useState } from 'react'
import { useLocation } from 'wouter'
import './Sidebar.css'
import { useAuthContext } from '../contexts/AuthContext';
import { useMediaResolution } from '../contexts/MediaResolution';

function Sidebar({ route }) {
    const [sidebarState, setSidebarState] = useState("open");
    const [, navigate] = useLocation();
    const {isDesktop, mediaType } = useMediaResolution();
    const { logout } = useAuthContext();

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
                beforeNevigate: logout
            },
        ],
    }

    function sidebarItemClick(route) {
        navigate(route);
    }

    function toggleSidebar() {
        setSidebarState((sidebarState == "open") ? "close" : "open");
    }

    return (
        <>
            <div className={`sidebar ${sidebarState} ${mediaType}`}>
                <div className={`sidebar-content ${sidebarState} ${mediaType}`}>
                    <div className={`sidebar-title ${mediaType}`}>
                        {pagesInfo.sidebar_title}
                    </div>

                    <div className={`sidebar-items-container ${mediaType}`}>
                        {
                            pagesInfo.pages.map(item => {
                                return (
                                    <SidebarItem
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

function SidebarItem({ itemData, activeRoute, onClick }) {
    const { isMobile, mediaType } = useMediaResolution();

    const itemClass = `sidebar-item ${itemData.routes.includes(activeRoute) ? 'active' : ''} ${mediaType}`;

    function itemClick(route) {
        let nevigateParams = {};

        if (itemData.beforeNevigate) {
            nevigateParams = { replace : true };
            itemData.beforeNevigate();
        }

        onClick(route, nevigateParams);
    }

    return (
        <div className={`${itemClass}`} onClick={() => { itemClick(itemData.routes[0]) }}>
            <div className={`sidebar-item-icon ${mediaType}`}>
                <i className={`fa fa-${itemData.icon}`}></i>
            </div>

            {
                !isMobile &&
                <div className={`sidebar-item-text ${mediaType}`}>
                    <div>{itemData.title}</div>
                </div>
            }
        </div>
    )
}

export default Sidebar

import { useState, useEffect} from "react";
import './Page.css'
import { getDefaultPageData, getPageDataById } from "./pagesInfo";
import Logo from "../components/Logo";
import Sidebar from "../components/Sidebar";

function Page({ page = null }) {
    const [PageData, setPageData] = useState(page ? page : getDefaultPageData())
    const [height, setHeight] = useState(window.innerHeight);


    useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerHeight);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        // Clean up the event listener on unmount
        // return () => {
        //     window.removeEventListener("resize", handleResize);
        // };
    }, [height]);

    function pageContent() {
        const pagePath = window.location.pathname.slice(1);  // remove the '/' from the begining of the route
        const PageData = pagePath ? getPageDataById(pagePath) : getDefaultPageData();

        switch (PageData.type) {
            case "logo":
                return (
                    <div className="page">
                        <div className="logo-area">
                            <Logo />
                        </div>

                        <div className="logo-form-area">
                            <PageData.component />
                        </div>
                    </div>
                );

            case "sidebar":
                return (
                    <div className="page">
                        <Sidebar pageId={PageData.id} />

                        <div className="sidebar-page-area">
                            <PageData.component />
                        </div>
                    </div>
                );
        }
    }

    return (
        <div style={{ height: `${height}px` }}>
            {pageContent()}
        </div>
    );
}

export default Page

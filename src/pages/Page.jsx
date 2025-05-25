import { useState, useEffect } from "react";
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

    function changePage(pageId) {
        setPageData(getPageDataById(pageId));
    }

    function pageTemplate(type) {
        switch (type) {
            case "logo":
                return (
                    <div className="page">
                        <div className="logo-area">
                            <Logo />
                        </div>

                        <div className="logo-form-area">
                            <PageData.component changePageHandler={changePage} />
                        </div>
                    </div>
                );

            case "sidebar":
                return (
                    <div className="page">
                        <Sidebar pageId={PageData.id} changePageHandler={changePage} />

                        <div className="sidebar-page-area">
                            <PageData.component changePageHandler={changePage} />
                        </div>
                    </div>
                );
        }
    }

    return (
        <div  style={{ height: `${height}px` }}>
            {pageTemplate(PageData.type)}
        </div>
    );
}

export default Page

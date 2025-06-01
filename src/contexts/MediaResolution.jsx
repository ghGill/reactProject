import { createContext, useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';

export const MediaResolution = createContext(null);

export function MediaResolutionProvider({ children }) {
    const isMobile = useMediaQuery({ maxWidth:600 });
    const isTablet = useMediaQuery({ minWidth:601, maxWidth:1024});
    const isDesktop = useMediaQuery({ minWidth:1025 });

    const [resolutions, setResolutions] = useState({isDesktop, isTablet, isMobile});

    useEffect(() => {
        setResolutions({isDesktop, isTablet, isMobile});
    }, [isDesktop, isTablet, isMobile]);

    return (
        <MediaResolution.Provider value={resolutions} >
            {children}
        </MediaResolution.Provider>
    )
}

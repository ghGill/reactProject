import Logo from "../../components/Logo"
import './LogoLayout.css'
import { MediaResolution } from "../../contexts/MediaResolution"
import { useContext } from "react"

function LogoLayout({ children }) {
    const { isDesktop } = useContext(MediaResolution);
    
    return (
        <div className="page">
            {
                isDesktop &&
                <div className="logo-area">
                    <Logo />
                </div>
            }

            <div className="form-area">
                {children}
            </div>
        </div>
    )
}

export default LogoLayout

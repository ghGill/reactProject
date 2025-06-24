import Logo from "../../components/Logo"
import './LogoLayout.css'
import { useMediaResolution } from "../../contexts/MediaResolution";

function LogoLayout({ children }) {
    const { mediaType } = useMediaResolution();

    return (
        <div className="page">
            <div className={`logo-area ${mediaType}`}>
                <Logo />
            </div>

            <div className="form-area">
                {children}
            </div>
        </div>
    )
}

export default LogoLayout

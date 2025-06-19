import { useEffect } from 'react'
import under from '../assets/under.jpg'

function UnderConstructionLayout( { pageIsReady }) {
    useEffect(() => {
        pageIsReady();    
    })

    return (
        <div style={{display:"flex", justifyContent:"center"}}>
            <div>
                <img src={under} style={{width:"100%", mixBlendMode: "color-burn"}} />
            </div>
        </div>
    )
}

export default UnderConstructionLayout

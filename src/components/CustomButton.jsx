import { useState } from 'react';
import './CustomButton.css'

export function CustomButton( props ) {
    return (
        <div className={`custom-button-wrapper`}>
            {/* <i 
                class="fa fa-plus" 
            >

            </i> */}
            <button 
                name = { props.name }
                type= { props.type || "submit" }
                style = { props.style || null }
                onClick = { props.onClick || null }
            >
                {props.text}
            </button>
        </div>
    )
}

export function CustomIconButton( props ) {
    return (
        <div className={`custom-button-wrapper`}>
            <i 
                name = { props.name }
                className={props.icon} 
                style = { props.style || null }
                onClick = { props.onClick || null }
            >
            </i>
        </div>
    )
}

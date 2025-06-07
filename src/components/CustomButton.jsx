import { useState } from 'react';
import './CustomButton.css'

export function CustomButton( props ) {
    return (
        <div className={`custom-button-wrapper`}>
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
        <div className={`custom-button-wrapper icon`}>
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

import './CustomButton.css'

export function CustomButton( props ) {
    const { errMsg } = props;

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

            {
                errMsg &&
                <div className='error-msg'>{errMsg}</div>
            }
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

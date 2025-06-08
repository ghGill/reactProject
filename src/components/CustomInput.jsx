import { useState } from 'react';
import './CustomInput.css'

function CustomInput( props ) {
    const [value, setValue] = useState(props.value || '');

    const oneRowClass = props.onerow ? 'one-row' : '';

    function onChange(event) {
        setValue(event.target.value);

        const { updateCallback } = props;

        if ('params' in updateCallback)
            updateCallback.func(updateCallback.params, event.target.value);
        else
            updateCallback.func(event.target.value);
    }

    const iconClass = props.icon ? 'with-icon' : ''

    return (
        <div className={`custom-input-wrapper ${oneRowClass} ${iconClass}`}>
            {
                props.title &&
                <label 
                    htmlFor={props.name} 
                    className={`${oneRowClass}`}
                    style = { props.labelStyle || null }
                >
                    {props.title}
                </label>
            }
            
            <input 
                className={`${iconClass}`}
                name = { props.name }
                placeholder = { props.placeholder || null }
                type = { props.type || "text" }
                value = { value }
                minLength = { props.minlength || null }
                maxLength = { props.maxlength || null }
                pattern = { props.pattern || null }
                style = { props.style || null }

                required = {props.required}

                onChange = { onChange }
            />
            {
                props.icon &&
                <i className={`fa fa-${props.icon}`}></i>
            }        
            {
                props.instruction &&
                <div style={ props.instructionStyle || null }>{ props.instruction }</div>
            }        
        </div>
    )
}

export default CustomInput

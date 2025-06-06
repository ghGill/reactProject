import { useState } from 'react';
import './CustomInput.css'

function CustomInput( props ) {
    const [value, setValue] = useState(props.value || '');

    const oneRowClass = props.onerow ? 'one-row' : '';

    function onChange(event) {
        setValue(event.target.value);
        props.updateValue.func(props.updateValue.prop, event.target.value);
    }

    return (
        <div className={`custom-input-wrapper ${oneRowClass}`}>
            <label 
                htmlFor={props.name} 
                className={`${oneRowClass}`}
                style = { props.labelStyle || null }
            >
                {props.title}
            </label>
            
            <input 
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
        </div>
    )
}

export default CustomInput

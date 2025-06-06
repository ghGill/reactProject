import { useState } from 'react';
import './CustomSelect.css'

function CustomSelect( props ) {
    const [value, setValue] = useState(props.value || '');

    const oneRowClass = props.onerow ? 'one-row' : '';

    props.updateValue.func(props.updateValue.prop, value);

    function onChange(event) {
        setValue(event.target.value);
        
        props.updateValue.func(props.updateValue.prop, event.target.value);
    }

    return (
        <div className={`custom-select-wrapper ${oneRowClass}`}>
            <label 
                htmlFor={props.name} 
                className={`${oneRowClass}`}
                style = { props.labelStyle || null }
            >
                {props.title}
            </label>
            
            <select 
                name = { props.name }
                value = { value }
                style = { props.style || null }

                required = {props.required}

                onChange = { onChange }
            >
                {
                    props.options.map(option => (
                        <option value={option.value}>
                            {option.text}
                        </option>
                    ))
                }
            </select>
        </div>
    )
}

export default CustomSelect

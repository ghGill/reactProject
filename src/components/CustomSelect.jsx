import { useState } from 'react';
import './CustomSelect.css'

export function CustomSelect( props ) {
    const [value, setValue] = useState(props.value || '');

    const oneRowClass = props.onerow ? 'one-row' : '';

    // updateParent(value);
    
    function onChange(event) {
        setValue(event.target.value);
        
        updateParent(event.target.value);
    }

    function updateParent(val) {
        const { updateCallback } = props;

        if ('params' in updateCallback)
            updateCallback.func(updateCallback.params, val);
        else
            updateCallback.func(val);
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
                        <option key={option.text} value={option.value || option.text}>
                            {option.text}
                        </option>
                    ))
                }
            </select>
        </div>
    )
}

export function CustomIconSelect(props) {
    const [options, setOptions] = useState([]);

    function openOptions(event) {
        event.stopPropagation();

        if (options.length > 0)
            setOptions([]);
        else {
            setOptions(props.options);

            const clickHandle = () => {
                setOptions([]);
                window.removeEventListener('click', clickHandle);
            }

            window.addEventListener('click', clickHandle);
        }
    }

    function clickOption(event) {
        props.onChange(event);
        
        setOptions([]);
    }

    return (
        <div className='custom-icon-select-wrapper'>
            <i className={props.icon} onClick={ (e) => { openOptions(e); }}></i>
            <div className='dropdown-options'>
                {
                    props.options &&
                    options.map(option => (
                        <option 
                            key={option.text} 
                            value={option.value || option.text}
                            className={`custom-option ${(option.value === parseInt(props.selected) ? 'selected' : '')}`} 
                            onClick={(e) => { clickOption(e) }}
                        >
                            {option.text}
                        </option>
                    ))
                }
            </div>
        </div>
    )
}

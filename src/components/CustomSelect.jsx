import { useState, useEffect } from 'react';
import './CustomSelect.css'

export function CustomSelect( { selectData} ) {
    const [value, setValue] = useState(selectData.value || '');

    const oneRowClass = selectData.onerow ? 'one-row' : '';

    useEffect(() => {
        updateParent(value);
    }, [])

    function onChange(event) {
        setValue(event.target.value);
        
        updateParent(event.target.value);
    }

    function updateParent(val) {
        const { updateCallback } = selectData;

        if ('params' in updateCallback)
            updateCallback.func(updateCallback.params, val);
        else
            updateCallback.func(val);
    }

    return (
        <div className={`custom-select-wrapper ${oneRowClass}`}>
            <label 
                htmlFor={selectData.name} 
                className={`${oneRowClass}`}
                style = { selectData.labelStyle || null }
            >
                {selectData.title}
            </label>
            
            <select 
                name = { selectData.name }
                value = { value }
                style = { selectData.style || null }

                required = {selectData.required}

                onChange = { onChange }
            >
                {
                    selectData.options.map((option, index) => (
                        <option 
                            key={option.text} 
                            value={option.value || option.text}
                            style = { option.style }
                        >
                            {option.text}
                        </option>
                    ))
                }
            </select>
        </div>
    )
}

export function CustomIconSelect({ selectData }) {
    const [options, setOptions] = useState([]);

    function openOptions(event) {
       
        event.stopPropagation();

        if (options.length > 0)
            setOptions([]);
        else {
            setOptions(selectData.options);

            const clickHandle = () => {
                setOptions([]);
                window.removeEventListener('click', clickHandle);
            }

            window.addEventListener('click', clickHandle);
        }
    }

    function clickOption(event) {
        selectData.onChange(event);
        
        setOptions([]);
    }

    return (
        <div className='custom-icon-select-wrapper'>
            <i className={selectData.icon} onClick={ (e) => { openOptions(e); }}></i>
            <div className='dropdown-options' style={ selectData.style || null }>
                {
                    selectData.options &&
                    options.map((option, index) => (
                        <option 
                            key={option.text} 
                            value={option.value || option.text}
                            className={`custom-option ${(option.value === parseInt(selectData.selected) ? 'selected' : '')}`} 
                            onClick={(e) => { clickOption(e) }}
                            style = { option.style }
                        >
                            {option.text}
                        </option>
                    ))
                }
            </div>
        </div>
    )
}

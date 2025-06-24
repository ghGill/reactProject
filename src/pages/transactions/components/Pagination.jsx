import { useState } from 'react'
import './Pagination.css'
import { useMediaResolution } from '../../../contexts/MediaResolution';

function Pagination({ currentPage, totalPages, onClick }) {
    const { mediaType } = useMediaResolution();
    const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    function btnClick(n) {
        onClick(n);
    }

    return (
        <div className='pagination'>
            <div 
                className={`btn side ${ currentPage === 1 ? 'disable' : ''}`}
                onClick = { () => { btnClick(Math.max(currentPage - 1, 1)); } }
            >
                <i className={`fa fa-arrow-left`}></i>
                <div className={`${mediaType}`}>Prev</div>
            </div>
            <div className='numbers'>
                {
                    numbers.map(n => (
                        <div 
                            key={n}
                            className={`btn number ${n === currentPage ? 'selected' : ''} ${mediaType}`}
                            onClick = { () => { btnClick(n); } }
                        >
                            <div>{n}</div>
                        </div>)
                    )
                }
            </div>
            <div 
                className={`btn side ${ currentPage === totalPages ? 'disable' : ''}`}
                onClick = { () => { btnClick( Math.min(currentPage + 1, totalPages)); } }
            >
                <div className={`${mediaType}`}>Next</div>
                <i className={`fa fa-arrow-right`}></i>
            </div>
        </div>
    )
}

export default Pagination;

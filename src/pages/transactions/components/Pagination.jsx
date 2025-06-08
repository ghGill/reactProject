import { useState } from 'react'
import './Pagination.css'

function Pagination({ currentPage, totalPages, onClick, resolution }) {
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
                {
                    (resolution !== 'mobile') &&
                    <div>Prev</div>
                }
            </div>
            <div className='numbers'>
                {
                    numbers.map(n => (
                        <div 
                            key={n}
                            className={`btn number ${n === currentPage ? 'selected' : ''} ${resolution}`}
                            onClick = { () => { btnClick(n); } }
                        >
                            {n}
                        </div>)
                    )
                }
            </div>
            <div 
                className={`btn side ${ currentPage === totalPages ? 'disable' : ''}`}
                onClick = { () => { btnClick( Math.min(currentPage + 1, totalPages)); } }
            >
                {
                    (resolution !== 'mobile') &&
                    <div>Next</div>
                }
                <i className={`fa fa-arrow-right`}></i>
            </div>
        </div>
    )
}

export default Pagination;

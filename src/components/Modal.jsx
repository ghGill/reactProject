import './Modal.css'

function ModalTitle( { titleData }) {
    return (
        <div className='title' style={ titleData.style }>
            {titleData.text}
        </div>
    )
}

function ModalSubTitle( { subtitleData } ) {
    return (
        <div className='subtitle' style={ subtitleData.style }>
            {subtitleData.text}
        </div>
    )
}

export function Modal( { children, closeCallback } ) {
    function closeModal() {
        closeCallback();
    }

    return (
        <div className="modal">
            <div className='content'>
                <div className='close'>
                    <i className="fa fa-close" onClick={ closeModal }></i>
                </div>

                {children}
            </div>
        </div>
    )
}

Modal.Title = ModalTitle;
Modal.SubTitle = ModalSubTitle;

export default Modal;

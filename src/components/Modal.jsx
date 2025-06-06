import './Modal.css'

function Modal( props ) {
    function closeModal() {
        props.closeCallback();
    }

    return (
        <div className="modal">
            <div className='content'>
                <div className='header'>
                    <div className='title'>
                        {props.title}
                    </div>
                    <div className='close'>
                        <i className="fa fa-close" onClick={ closeModal }></i>
                    </div>
                </div>
                <div className='subtitle'>
                    {props.subtitle}
                </div>

                {props.children}
            </div>
        </div>
    )
}

export default Modal;

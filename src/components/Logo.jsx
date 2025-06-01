import './Logo.css'
import logoImg from '../assets/finance-logo.png'

function Logo() {
    return (
        <div className='logo-container'>
            <div className='image'>
                <img src={logoImg}></img>
            </div>

            <div className="title">
                finance
            </div>

            <div className="footer1">
                Keep track of your money<br/>
                and save for your future
            </div>

            <div className="footer2">
                Personal finance app puts you in control of your spending.<br/>
                Track transactions, set budgets, and add to savings pots easily
            </div>
        </div>
    )
}

export default Logo

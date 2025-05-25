import './Logo.css'
import logoImg from '../assets/finance-logo.png'

function Logo() {
    return (
        <>
            <div className="logo">
                <img src={logoImg}></img>
            </div>
            <div className="logo-title">
                finance
            </div>
            <div className="logo-footer1">
                Keep track of your money<br/>
                and save for your future
            </div>
            <div className="logo-footer2">
                Personal finance app puts you in control of your spending.<br/>
                Track transactions, set budgets, and add to savings pots easily
            </div>
        </>
    )
}

export default Logo

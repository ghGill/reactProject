import './Login.css'
import { pagesInfoData, getPageDataById } from './pagesInfo'
import { useLocation, Link } from 'wouter'

function Login({ changePageHandler }) {
    const [, navigate] = useLocation();

    return (
      <form className="form">
        <h1 className="title">Login</h1>

        <div className="content">
            <div className="element">
                <label htmlFor="email">Email</label>
                <input type="email" name="email"></input>
            </div>

            <div className="element">
                <label htmlFor="password">Password</label>
                <input type="password" name="password"></input>
            </div>

            <div className="element">
                <button onClick={() => navigate("/overview")} type="button">Login</button>
            </div>

            <div className="footer">
                <div>
                    Need to create an acount?
                </div>
                <div>
                    <b><Link href="/signup" >Sign Up</Link></b>
                </div>
            </div>
        </div>
      </form>
    )
}

export default Login

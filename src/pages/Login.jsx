import './Login.css'
import { pagesInfoData, getPageDataById } from './pagesInfo'

function Login({ changePageHandler }) {
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
                <button onClick={() => { changePageHandler("overview")}} type="button">Login</button>
            </div>

            <div className="footer">
                <div>
                    Need to create an acount?
                </div>
                <div>
                    <b><a onClick={() => {changePageHandler("signup")}} >Sign Up</a></b>
                </div>
            </div>
        </div>
      </form>
    )
}

export default Login

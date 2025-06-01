import { useContext, useState } from 'react';
import { useLocation, Link } from 'wouter'

import './Login.css'
import { DB } from '../utils/DB';
import { AuthContext } from '../contexts/AuthContext';

function Login({ changePageHandler }) {
    const emptyMsg = '\u00A0';

    const [, navigate] = useLocation();
    const [form, setForm] = useState({email:"", password:""});
    const [errMsg, setErrMsg] = useState(emptyMsg);
    const context = useContext(AuthContext)

    function inputOnChange(event) {
        setErrMsg(emptyMsg)

        const { name, value } = event.target;

        setForm({ ...form, [name]:value});
    }

    async function login() {
        event.preventDefault();

        const user = await DB.getUser(form.email, form.password);

        if (user === undefined)
            setErrMsg("Invalid email or password.")
        else {
            context.setUser(user);
            navigate("/");
        }
    }

    return (
      <form className="form">
        <h1 className="title">Login</h1>

        <div className="content">
            <div className="element">
                <label htmlFor="email">Email</label>
                <input onChange={inputOnChange} type="text" name="email" value={form.email} required></input>
            </div>

            <div className="element">
                <label htmlFor="password">Password</label>
                <input onChange={inputOnChange} type="password" name="password" value={form.password} required></input>
            </div>

            
            <div className="element">
                <button onClick={login} type="button">Login</button>
                <div className='error-msg'>{errMsg}</div>
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

import { useState } from 'react';
import { useLocation, Link } from 'wouter'

import './Login.css'
// import { createCookie } from '../utils/cookies.jsx'
import { DB } from '../utils/DB.jsx';

function Signup() {
    const emptyMsg = '\u00A0';

    const [form, setForm] = useState({name:"", email:"", password:""});
    const [, navigate] = useLocation();
    const [errMsg, setErrMsg] = useState(emptyMsg);

    function inputOnChange(event) {
        setErrMsg(emptyMsg);

        const { name, value } = event.target;

        setForm({ ...form, [name]:value});
    }

    async function signup(event) {
        event.preventDefault();

        // createCookie("username", form.username);
        const result = await DB.addUsere(form);
console.log(result);

        if (result === true)
            navigate("/login");
        else {
            setErrMsg(result);
        }
    }

    return (
      <form onSubmit={signup} className="form">
        <h1 className="title">Sign Up</h1>

        <div className="content">
            <div className="element">
                <label htmlFor="username">Name</label>
                <input onChange={inputOnChange} type="text" name="name" value={form.username} required></input>
            </div>

            <div className="element">
                <label htmlFor="email">Email</label>
                <input onChange={inputOnChange} type="email" name="email" value={form.email} required></input>
            </div>

            <div className="element">
                <label htmlFor="password">Create Password</label>
                <input onChange={inputOnChange} type="text" name="password" value={form.password} required pattern=".{8,}"></input>
                <label className="password-validation-msg"><b>Passwords must be at least 8 characters</b></label>
            </div>

            <div className="element">
                <button type="submit">Create Account</button>
                <div className='error-msg'>{errMsg}</div>
            </div>

            <div className="footer">
                <div>
                    Already have an account?
                </div>
                <div>
                    <b><Link href="/login" >Login</Link></b>
                </div>
            </div>
        </div>
      </form>
    )
}

export default Signup

import './Login.css'
import { pagesInfoData, getPageDataById } from './pagesInfo'
import { createCookie } from '../utils/cookies.jsx'
import { useState } from 'react';

function Signup({ changePageHandler }) {
    const [form, setForm] = useState({username:"", email:"", password:""});

    function inputOnChange(event) {
        const { name, value } = event.target;

        setForm({ ...form, [name]:value});
    }

    function signup(event) {
        event.preventDefault();

        createCookie("username", form.username);

        changePageHandler("login");
    }

    return (
      <form onSubmit={signup} className="form">
        <h1 className="title">Sign Up</h1>

        <div className="content">
            <div className="element">
                <label htmlFor="username">Name</label>
                <input onChange={inputOnChange} type="text" name="username" value={form.username} required></input>
            </div>

            <div className="element">
                <label htmlFor="email">Email</label>
                <input onChange={inputOnChange} type="email" name="email" value={form.email} required></input>
            </div>

            <div className="element">
                <label htmlFor="password">Create Password</label>
                <input onChange={inputOnChange} type="text" name="password" value={form.password} required></input>
                <label className="password-validation-msg">Passwords must be at least 8 characters</label>
            </div>

            <div className="element">
                <button type="submit">Create Account</button>
            </div>

            <div className="footer">
                <div>
                    Already have an account?
                </div>
                <div>
                    <b><a onClick={ () => {changePageHandler("login")} } >Login</a></b>
                </div>
            </div>
        </div>
      </form>
    )
}

export default Signup

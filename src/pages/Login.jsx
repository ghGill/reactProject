import { useContext, useState } from 'react';
import { useLocation, Link } from 'wouter'

import CustomInput from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import './Login.css'
import { DB } from '../utils/DB';
import { AuthContext } from '../contexts/AuthContext';
import { AUTH_COOKIE_NAME, createCookie } from '../utils/cookies.jsx'


function Login({ changePageHandler }) {
    const emptyMsg = '\u00A0';

    const [, navigate] = useLocation();
    const [form, setForm] = useState({email:"", password:""});
    const [errMsg, setErrMsg] = useState(emptyMsg);
    const context = useContext(AuthContext)

    function updateLoginData(prop, val) {
        setErrMsg(emptyMsg)

        setForm({ ...form, [prop]:val});
    }

    async function login() {
        event.preventDefault();

        const user = await DB.getUser({"email":form.email, "password":form.password});

        if (user === undefined) {
            setErrMsg("Invalid email or password.")
        }
        else {
            createCookie(AUTH_COOKIE_NAME, user.id);

            context.setUser(user);
            navigate("/");
        }
    }

    return (
      <form className="form" onSubmit={login}>
        <h1 className="title">Login</h1>

        <div className="content">
            <div className="element">
                <CustomInput 
                    inputData= {
                        {
                            name: "email" ,
                            type: "email",
                            title: "Email",
                            value: form.email,
                            updateCallback: {"params":'email', "func":updateLoginData},
                            required:true
                        }
                    }
                />
            </div>

            <div className="element">
                <CustomInput 
                    inputData= {
                        {
                            name: "password",
                            type: "password",
                            title: "Password",
                            value: form.password,
                            updateCallback: {"params":'password', "func":updateLoginData},
                            required: true
                        }
                    }
                />
            </div>

            
            <div className="element">
                <CustomButton 
                    btnData = {
                        {
                            name: "login" ,
                            text: "Login",
                            type: "submit" ,
                            errMsg: errMsg
                        }
                    }
                />
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

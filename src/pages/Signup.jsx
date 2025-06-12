import { useState } from 'react';
import { useLocation, Link } from 'wouter'

import CustomInput from '../components/CustomInput.jsx';
import { CustomButton } from '../components/CustomButton.jsx';
import './Login.css'
import { DB } from '../utils/DB.jsx';

function Signup() {
    const emptyMsg = '\u00A0';

    const [form, setForm] = useState({name:"", email:"", password:""});
    const [, navigate] = useLocation();
    const [errMsg, setErrMsg] = useState(emptyMsg);

    function updateSignupData(prop, val) {
        setErrMsg(emptyMsg)

        setForm({ ...form, [prop]:val});
    }

    async function signup(event) {
        event.preventDefault();

        const result = await DB.addUsere(form);

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
                <div className="element">
                    <CustomInput 
                        inputData= {
                            {
                                name: "username",
                                title: "Name",
                                value: form.username,
                                updateCallback: {"params":'username', "func":updateSignupData},
                                required: true
                            }
                        }                        
                    />
                </div>
            </div>

            <div className="element">
                <CustomInput 
                    inputData= {
                        {
                            name: "email",
                            type: "email",
                            title: "Email",
                            value: form.email,
                            updateCallback: {"params":'email', "func":updateSignupData},
                            required: true
                        }
                    }                        
                />
            </div>

            <div className="element">
                <CustomInput 
                    inputData= {
                        {
                            name: "password",
                            title: "Create Password",
                            value: form.password,
                            updateCallback: {"params":'password', "func":updateSignupData},
                            required: true,
                            pattern: ".{8,}",
                            instruction: "Passwords must be at least 8 characters",
                            instructionStyle: {textAlign: "right", fontSize: "12px"}
                        }
                    }                    
                />
            </div>

            <div className="element">
                <CustomButton 
                    btnData = {
                        {
                            name: "createaccount" ,
                            text: "Create Account", 
                            type: "submit",
                            errMsg: errMsg
                        }
                    }
                />
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

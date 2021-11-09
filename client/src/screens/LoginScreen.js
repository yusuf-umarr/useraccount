import React, { useState, useEffect } from 'react'
import axios from 'axios'
import car3 from './car3.jpg'
import { Link } from 'react-router-dom'

import './LoginScreen.css'
import { CircularProgress} from '@material-ui/core'


const LoginScreen = ({history}) => {
    const [emailPhone, setEmailPhone] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState()
    const [success, setSuccess] = useState()

    useEffect(() =>{
        if(localStorage.getItem("authToken")){
            history.push("/")
        }
    },[history ])

    const handleSubmit = async(e) =>{
        e.preventDefault()
        const config = {
            header:{
                "Content-Type": "application/json",
            }
        }

        if(password.length < 8 ){
            setPassword("")
            setTimeout(() =>{
                setError("")
            }, 5000);
            return setError("Password must be minimun of 8 characters")
        }

        try {
            const {data} = await axios.post("/api/auth/login", {
                emailPhone,  password
            },
             config );

             localStorage.setItem("authToken", data.token)

              history.push("/");  
        } catch (error) {
            setError(error.response.data.error);
            setPassword("")
            setEmailPhone("")

            setTimeout(()=>{
                setError("")
            }, 5000)
        }
    }
    return (
        <div className="loginContainer">
            <div className="loginLeft">
                <img src={car3}  />
            </div>
            <div className="loginRight">
              

                    <form  className="formDiv" onSubmit={handleSubmit}>
                        <i className="fas fa-lock  loginLogo "></i>
                        <p>Login</p>
                        {error && <p style={{color:'red'}}> {error}</p>}
                        {/* {success && <p style={{color:'green'}}> {success}  </p>} */}

                        <div className="loginInput__div">
                            <label htmlFor="emailPhone">Email/Phone</label>
                            <input  placeholder="sample@gmail.com/ +2347012345678"
                                name="emailPhone" 
                                value={emailPhone}
                                required
                                onChange={(e) =>setEmailPhone(e.target.value)}
                                className="loginInput" id="EmailPhone"  />


                            <label >Password</label>
                            <input  placeholder="Password" 
                                name="Password"
                                type="password"
                                value={password}
                                required
                                onChange={(e) =>setPassword(e.target.value)}
                                className="loginInput"  id="signPass" />
                        </div>
                        <input type="submit" value="Login" className="loginBtn" />

                    </form>
                    <span> Don't have an account? <Link to="/register">Register</Link></span>
                    <p>OR</p>
                    <span> Forgot Password? <Link to="/forgot-password">Forgot Password</Link></span>

                {/* </div> */}
            </div>
        </div>
    )
}

export default LoginScreen

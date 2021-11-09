import React, { useState } from 'react'
import axios from 'axios'
import car3 from './car3.jpg'

import './RegisterScreen.css'
import { Link } from 'react-router-dom'
import { CircularProgress} from '@material-ui/core'


const RegisterScreen = ({history}) => {
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [interest, setInterest] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    // const [userData, setUserData] = useState()

    const handleSubmit = async(e) =>{
        e.preventDefault()

        if(password !== confirmPassword){
            setPassword("")
            setConfirmPassword("")
            setTimeout(() =>{
                setError("")
            }, 5000);
            return setError("Passwords do not match")

        }
        if(password.length < 8 ){
            setPassword("")
            setConfirmPassword("")
            setTimeout(() =>{
                setError("")
            }, 5000);
            return setError("Password must be minimun of 8 characters")
            

        }

        try {
            const {data} = await axios.post("/api/auth/register", {
                username, email, phone, password, interest
            })
            // setUserData(res.data)
            localStorage.setItem("userId", data._id)
            setSuccess("Sccessful! ");

            history.push("/verify")



            setUsername("")
            setPassword("")
            setConfirmPassword("")
            setPhone("")
            setEmail("")

            
        } catch (error) {
            setError(error.response.data.error);
            setPassword("")
            setConfirmPassword("")

            setTimeout(()=>{
                setError("")
            }, 5000)
        }
    }

    // console.log({userData:userData})
    return (
        <div className="regContainer">
            <div className="loginLeft">
                <img src={car3}  />
            </div>
            <div className="loginRight">
                    <form  className=" regFormDIv  " onSubmit={handleSubmit}>
                        <i className="fas fa-lock  loginLogo "></i>
                        <p>Register</p>
                        {error && <p style={{color:'red'}}> {error}</p>}
                        {success && <p style={{color:'green'}}> {success} <Link to="/verify">Verify </Link> your account </p>}

                        <div className="loginInput__div">
                            <label >Username</label>
                            <input  placeholder="Username"
                                name="username" 
                                value={username}
                                required
                                onChange={(e) =>setUsername(e.target.value)}
                                className="regInput" id="signPass"  />

                            <label >Email</label>
                            <input  placeholder="sample@gmail.com"
                                name="email" 
                                value={email}
                                required
                                onChange={(e) =>setEmail(e.target.value)}
                                className="regInput" id="signPass"  />

                            <label htmlFor="Phone">Phone</label>
                            <input  placeholder=" +2347012345678"
                                name="phone" 
                                value={phone}
                                required
                                onChange={(e) =>setPhone(e.target.value)}
                                className="regInput" id="signPass"  />

                            <label htmlFor="Phone">Interest</label>
                            <input  placeholder="football, basketball, etc"
                                name="interest" 
                                value={interest}
                                required
                                onChange={(e) =>setInterest(e.target.value)}
                                className="regInput" id="signPass"  />


                            <label >Password</label>
                            <input  placeholder="Password" type="password"
                                name="Password"
                                value={password}
                                required
                                onChange={(e) =>setPassword(e.target.value)}
                                className="regInput"  id="signPass" />

                            <label >Confirm Password</label>
                            <input  placeholder="Confirm Password" type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                required
                                onChange={(e) =>setConfirmPassword(e.target.value)}
                                className="regInput"  id="signPass" />
                        </div>
                        <input type="submit" value="Register" className="loginBtn" />

                    </form>
                    <span>Already have an account? <Link to="/login">Login</Link></span>
                {/* </div> */}
            </div>
        </div>
    )
}

export default RegisterScreen

import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'


const VerifyScreen = ({history}) => {
    const [otp, setOtp] =useState()
    const [error, setError]  =useState()

    const [success, setSuccess] = useState()

    

    const handleSubmit = async(e) =>{
        e.preventDefault()

        try {
            const userId = localStorage.getItem("userId")
            const res = await axios.post(`/api/auth/verify?userId=${userId}`, { otp });

            setSuccess("Account Successfully verified")
            
            localStorage.removeItem("userId")

        } catch (error) {
            setError(error);
            setOtp("")

            setTimeout(()=>{
                setError("")
            }, 5000)
        }
    }
   

    return (
        <div className="updateContainer">
            <div className="password__container">
                <p>Thanks for the Registration. <br /> Otp has been sent to your Phone Number </p>
            <div className="password__mainBox">
                <div className="logo">
                    <i className="fas fa-user fa-2x fasLogo "></i>
                    
                </div>
                <p>Account Verification</p>
                <form className="password__Box" onSubmit={handleSubmit}>
                    {error && <p style={{color:'red'}}>{error}</p>}
                    {success && <p style={{color:'green'}}>{success} please, <Link to="/login">Login</Link></p>}
                    <div className="input__div">
                        <input  placeholder="Enter your opt"
                            name="otp" 
                            name={otp} 
                            value={otp} 
                            onChange={(e) =>setOtp(e.target.value)}
                            className="input" id="inputID"  />

                       
                    </div>
                    
                    <div className="input__div">

                        <input type="submit" value="Submit" className="resetBtn" />
                    </div>
                </form>
            </div>
            </div>
            
        </div>
    )
    
}

export default VerifyScreen

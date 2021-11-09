import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { CircularProgress} from '@material-ui/core'
import Navbar from '../components/Navbar'



const ForgotPasswordScreen = ({history}) => {
    const [phone, setPhone] =useState()
    const [error, setError]  =useState()
    const [isFetching, setIsFetching]  =useState(false)

    const [success, setSuccess] = useState()

    

    const handleSubmit = async(e) =>{
        e.preventDefault()

        try {
            const res = await axios.post(`/api/auth/forgot`, { phone });
            setSuccess(res.data)


            setTimeout(()=>{
                setSuccess(" ")
            }, 5000)
            



        } catch (error) {
            setError(error.response.data.error);
            setPhone("")

            setTimeout(()=>{
                setError("")
            }, 5000)
        }
    }
   

    return (
        <div className="updateContainer">
            <div className="password__container">
            <div className="password__mainBox">
                <div className="logo">
                    <i className="fas fa-user fa-2x fasLogo "></i>
                    
                </div>
                <p>Forgot Password</p>
                <form className="password__Box" onSubmit={handleSubmit}>
                    {error && <p style={{color:'red'}}>{error}</p>}
                    {success && <p style={{color:'green'}}>{success}</p>}
                    <div className="input__div">
                        <input  placeholder="+2347012345678"
                            name="phone" 
                            name={phone} 
                            onChange={(e) =>setPhone(e.target.value)}
                            className="input" id="inputID"  />

                        {/* <input type="password" placeholder="Confirm Password" 
                            name="confirmPassword"
                            onChange={handleOnChange}
                            className="input"  id="inputID" /> */}
                    </div>
                    
                    <div className="input__div">
                    {/* <button className="resetBtn">{isFetching ? <CircularProgress color="inherit" size="20px" /> : 'Submit'}</button> */}

                        <input type="submit" value="Submit" className="resetBtn" />
                    </div>
                </form>
            </div>
            </div>
            
        </div>
    )
    
}

export default ForgotPasswordScreen

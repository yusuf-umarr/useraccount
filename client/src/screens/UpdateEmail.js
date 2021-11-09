import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { CircularProgress} from '@material-ui/core'
import Navbar from '../components/Navbar'


const UpdateEmail = ({history}) => {
    const [email, setEmail] =useState()
    const [error, setError]  =useState()
    const [isFetching, setIsFetching]  =useState(false)

    const [success, setSuccess] = useState()

    

    const handleSubmit = async(e) =>{
        e.preventDefault()

        try {
            let token = localStorage.getItem("authToken")
            const res = await axios.put(`/api/auth/update?token=${token}`, { email });
            setSuccess(res.data)

            setTimeout(()=>{
                setIsFetching(true)
            }, 2000)

            setIsFetching(false)


            setTimeout(()=>{
                setSuccess(" ")
            }, 5000)


           

            

        } catch (error) {
            setError(error.response.data.error);
            setEmail("")

            setTimeout(()=>{
                setError("")
            }, 5000)
        }
    }

    return (
        <div className="updateContainer">
            <Navbar />
            <div className="password__container">
            <div className="password__mainBox">
                <div className="logo">
                    <i className="fas fa-user fa-2x fasLogo "></i>
                    
                </div>
                <p>Update Email</p>
                <form className="password__Box" onSubmit={handleSubmit}>
                    {error && <p style={{color:'red'}}>{error}</p>}
                    {success && <p style={{color:'green'}}>{success}</p>}

                    <div className="input__div">
                        <input  placeholder="Email"
                            name="email" 
                            value={email} 
                            
                            onChange={(e) =>setEmail(e.target.value)}
                            className="input" id="inputID"  />

                        {/* <input type="password" placeholder="Confirm Password" 
                            name="confirmPassword"
                            onChange={handleOnChange}
                            className="input"  id="inputID" /> */}
                    </div>
                    
                    <div className="input__div">
                        {/* <input type="submit" value="Submit" className="resetBtn" /> */}
                        <button className="resetBtn">{isFetching ? <CircularProgress color="inherit" size="20px" /> : 'Submit'}</button>

                    </div>
                </form>
            </div>
            </div>
            
        </div>

    )

}

export default UpdateEmail

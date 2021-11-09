import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { CircularProgress} from '@material-ui/core'
import Navbar from '../components/Navbar'



const UpdateUsernsame = ({history}) => {
    const [username, setUsername] =useState()
    const [error, setError]  =useState()
    const [isFetching, setIsFetching]  =useState(false)


    const [success, setSuccess] = useState()

    

    const handleSubmit = async(e) =>{
        e.preventDefault()

        try {
            let token = localStorage.getItem("authToken")
            const res = await axios.put(`/api/auth/update?token=${token}`, { username });
            setSuccess(res.data)

            setTimeout(()=>{
                setIsFetching(true)
            }, 2000)

            // setIsFetching(false)
            setTimeout(()=>{
                setIsFetching(false)
            }, 2000)

            setTimeout(()=>{
                setSuccess(" ")
            }, 5000)
            

            


        } catch (error) {
            setError(error.response.data.error);
            setUsername("")

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
                <p>Update Username</p>
                <form className="password__Box" onSubmit={handleSubmit}>
                    {error && <p style={{color:'red'}}>{error}</p>}
                    {success && <p style={{color:'green'}}>{success}</p>}

                    <div className="input__div">
                        <input  placeholder="Username"
                            name="username" 
                            value={username} 
                            onChange={(e) =>setUsername(e.target.value)}
                            className="input" id="inputID"  />

                        {/* <input type="password" placeholder="Confirm Password" 
                            name="confirmPassword"
                            onChange={handleOnChange}
                            className="input"  id="inputID" /> */}
                    </div>
                    
                    <div className="input__div">
                    <button className="resetBtn">{isFetching ? <CircularProgress color="inherit" size="20px" /> : 'Submit'}</button>

                        {/* <input type="submit" value="Submit" className="resetBtn" /> */}
                    </div>
                </form>
            </div>
            </div>
            
        </div>
    )
    
}

export default UpdateUsernsame

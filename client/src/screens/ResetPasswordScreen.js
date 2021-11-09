import {useEffect, useState} from 'react'
import './ResetPasswordScreen.css'
import {useLocation} from "react-router"
import { useHistory } from "react-router-dom";

import queryString from 'query-string'
import axios from 'axios'
import { CircularProgress} from '@material-ui/core'


function ResetPasswordScreen({history}) {
    const [newPassword, setNewPassword ] =useState({
        password: '',
        confirmPassword: ''
    })
    const [success, setSuccess ] =useState(false)
    const [invalidUser, setInvalidUser ] =useState('')
    const [busy, setBusy ] =useState(true)
    const [error, setError ] =useState('')
    const location = useLocation()
    // const history = useHistory()
    // const navigate = useNavigate();


    const {token, id} =  queryString.parse(location.search)

    const verifyToken = async () =>{
        try {
            //validating the token by sending it to the back-end
            const { data } = await axios.get(`api/auth/verify-token?token=${token}&id=${id}`)
            //localhost has been added to the proxy in package json

            setBusy(false)

        } catch (error) {
            if(error?.response?.data){
                const { data } = error.response
                if(!data.success) return setInvalidUser(data.error)
                return console.log(error.response.data)
            }
            console.log(error)
        }
       
    }

    useEffect(() => {
        verifyToken()
    }, [])

    //set input value (password and confirm password)
    const handleOnChange = ({target}) =>{
        const {name, value} = target
        setNewPassword({...newPassword, [name]: value})
    }

//sending new password to the back-end
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const {password, confirmPassword} = newPassword
        //validating password
        if(password.trim().length < 8  ){
            return setError('Password must be minimum of 8 characters')
        }
        if(password !== confirmPassword  ){
            return setError('Password does not match')
        }

        try {
            // setBusy(true)
            const { data } = await axios.post(`api/auth/reset-password?token=${token}&id=${id}`, {password})

            setBusy(false)

            if(data.success){
                setSuccess(true)
                history.reset('/reset-password') // this will clear the both token and the id
                // setSuccess(true)
            }
            setNewPassword({
                password: '',
                confirmPassword: ''
            })

        } catch (error) {
            setBusy(false)
            if(error?.response?.data){
                const { data } = error.response
                if(!data.success) return setError(data.error)
                return console.log(error.response.data)
            }
            console.log(error)
            setNewPassword({
                password: '',
                confirmPassword: ''
            })
        }
        setNewPassword({
            password: '',
            confirmPassword: ''
        })
       


    }

    if(success) return <div className="errorAlert">
        <h1 style={{color:'green'}}>Password Reset Successfully</h1>
    </div>

    if(invalidUser) return <div className="errorAlert">
        <h1 style={{color:'red'}}>{invalidUser}</h1>
    </div>

    if(busy) return <div className="errorAlert">
        <h1 >loading...</h1>
    </div>

    return (
        <div className="password__container">
            <div className="password__mainBox">
                <div className="logo">
                    <i className="fas fa-lock fa-2x fasLogo "></i>
                    
                </div>
                <p>Reset Password</p>
                <form className="password__Box" onSubmit={handleSubmit}>
                    {error && <p style={{color:'red'}}>{error}</p>}
                    <div className="input__div">
                        <input type="password" placeholder="Password"
                            name="password" 
                            onChange={handleOnChange}
                            className="input" id="inputID"  />

                        <input type="password" placeholder="Confirm Password" 
                            name="confirmPassword"
                            onChange={handleOnChange}
                            className="input"  id="inputID" />
                    </div>
                    
                    <div className="input__div">
                        <input type="submit" value="Reset Password" className="resetBtn" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordScreen

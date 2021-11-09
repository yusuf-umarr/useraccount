import {useState, useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './PrivateScreen.css'
import Navbar from '../components/Navbar'


const PrivateScreen = ({history}) => {
    const [error, setError] = useState()
    const [user, setUser] = useState()
    const [privateData, setPrivateData] = useState()


    useEffect(()=>{
        let token = localStorage.getItem("authToken")

        const userProfile = async () =>{
            try {
                const res = await axios.get(`/api/auth/profile?token=${token}`);
                setUser(res.data)
            } catch (error) {
                setError("You are not authorized, please login")
                history.push("/login")
            }
        }

        userProfile()

    }, [ ])

    useEffect(() =>{
        if(!localStorage.getItem("authToken")){
            history.push("/login")
        }
    
        const fetchPrivateData = async () =>{
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("authToken")}`
                }
            }
            try {
                const { data } = await axios.get("/api/private", config);
                setPrivateData(data.data)
            } catch (error) {
                localStorage.removeItem("authToken");
                setError("You are not authorized, please login")
                history.push("/login")
            }
        }

        fetchPrivateData()
    }, [ history])

    const logOut = () =>{
        localStorage.removeItem("authToken")
        history.push("/login")
    }
    return (
        error ? <span>{error}</span> : 
        <div className="home__container">
            {/* =============navbar============== */}
            <Navbar onLogOut={logOut}  />
            <div className="homeScreen">
                <h1>Welcome { user && user.username}</h1>
            </div>

        </div>
    )
}

export default PrivateScreen

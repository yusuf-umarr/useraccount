import React from 'react'
import { useState, useEffect } from 'react'
import './ProfileScreen.css'
import axios from 'axios'
import defaultCover from './defaultCover.jpg'
import defaultImg from './defaultImg.jpg'
import Navbar from '../components/Navbar'
import { CircularProgress} from '@material-ui/core'


const ProfileScreen = ({history}) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const [user, setUser] = useState()


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


    return (
        <div>
            {/* {userInformation && userInformation.map((user) =>( */}
                <div  className="profile">
                <Navbar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img src={user && user.coverPicture ? PF + user.coverPicture : defaultCover} alt="" className="profileCoverImg" />
                            <img src={user && user.avatar ? PF +user.avatar : defaultImg} alt="" className="profileUserImg" />
                        </div>
                        
                    </div>
                    <div className="profileInfo">
                        <h4 className="profleInfoName">Username: {user && user.username}</h4>
                        <span className="profleInfoDesc">Email: {user && user.email}</span>
                        <span className="profleInfoDesc">Phone: {user && user.phone}</span>
                        <span className="profleInfoDesc">Interest: {user && user.interest}</span>
                    </div>
                    <div className="profileRightBottom">
                        {/* <Feed username={username}/> */}
                        {/* <Rightbar user={user} /> */}
                    </div>
                </div>
            </div>
            {/* ))} */}
        </div>
    )
}

export default ProfileScreen

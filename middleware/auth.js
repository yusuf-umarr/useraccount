const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendError, createrandomBytes } = require('../utils/helper')

// const ErrorResponse = require('../utils/errorResponse')

exports.protect = async (req, res, next) =>{  
    let token;

    // if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    //     token = req.headers.authorization.split(" ")[1] //split them(bearer and token) and set the second part to token
    // }
    if(req.headers.authorization){
        token = req.headers.authorization
    }

    if(!token){
        return sendError(res, "Not authorized to access this route")
    }

    try {
        

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)

        if(!user){
            return sendError(res, "No user found with this id")

        }

        req.user = user;
        next()

    } catch (error) {
        return sendError(res, "Not authorized to access this route")

    }

}
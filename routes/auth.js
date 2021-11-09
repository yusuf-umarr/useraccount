const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const crypto = require('crypto')
require('dotenv').config()
const path = require("path")
const jwt = require('jsonwebtoken')

// const sendEmail = require('../utils/sendEmail')


const {validateUser, validate} = require('../middleware/validator')

const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const ResetToken = require('../models/ResetToken');
const { sendError, createrandomBytes } = require('../utils/helper')
const { generateOTP, mailTransport } = require('../utils/mail')
const { isValidObjectId } = require('mongoose')
const { isResetTokenValid } = require('../middleware/user')
// const ErrorResponse = require('../utils/errorResponse')

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
// console.log(accountSid)
const authToken = process.env.TWILIO_AUTH_TOKEN;

//require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

//Register new user=================================================
router.post('/register', validateUser, validate,   async (req, res) =>{ 
    
    try {
       
        //create new user
        const { username, email, phone, password, interest } = req.body;
        //validating email
        const currentEmail = await User.findOne({email})
        if(currentEmail) 
            return sendError(res, 'email already exist')

        //validating phone
        const currentPhone = await User.findOne({phone})
        if(currentPhone) 
            return sendError(res, 'phone already exist')

        //validating username
        const currentUsername = await User.findOne({username})
        if(currentUsername) 
            return sendError(res, 'username taken')
        


        const newUser = await new User({
            username,
            email,
            phone,
            password,
            interest
        });

        const OTP = generateOTP()
        const verificationToken =  new VerificationToken({
            owner: newUser._id,
            token: OTP
        })

        const user = await newUser.save();
        const userToken = await verificationToken.save();


        //sending otp to the registered user
        client.messages.create({
            to: newUser.phone,
            from: '+13368919848',
            body:  `Your OTP is: ${OTP}`,
        }, function (err, message) {
            // console.log(err.message);
        });

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error + 'error saving data')
    }
} );

//verifyEmail ============================================================
router.post('/verify', async(req, res)=>{
    try {
        const { otp } = req.body
    const {userId } = req.query
    if(!userId || !otp.trim() ) return sendError(res, " missing parameters")

    if(!isValidObjectId(userId)) return sendError(res, " invalid user ID")

    const user = await User.findById(userId)
    if(!user) return sendError(res, "user not found")

    if(user.verified) return sendError(res, "Account already Verified")

    const token = await VerificationToken.findOne({owner: user._id})
    if(!token) return sendError(res, "user not found")

    const isMatched = await token.compareToken(otp)
    if(!isMatched) return sendError(res, "please provide a valid token")

    user.verified = true;

    await VerificationToken.findByIdAndDelete(token._id)

    await user.save()

    client.messages.create({
        to: user.phone,
        from: '+13368919848',
        body:  `Account verified Successfully!`,
    }, function (err, message) {
        // console.log(message);
    });

    res.json({success: true, message: "Account verified Successfully.", user:{
        username:user.username, email: user.email, id: user._id
    }})

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        }) 
    }

})

//Login ============================================================================
router.post('/login', async(req, res, next) =>{
    const { emailPhone, password} = req.body
    try {

        if(!password || !emailPhone) return sendError(res, "Please provide the required details")

        const user = await User.findOne({
            $or: [{
              "email": emailPhone
            }, {
              "phone": emailPhone
            }, ]
          });

        if(!user){
            return sendError(res, "user not found")
        }
    
        const isMatched = await user.comparePassword(password)
        if(!isMatched){
            return sendError(res, "invalid Email/Password")
        }

        sendToken(user, 200, res)



    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

//forgot password link ================================================================
router.post('/forgot', async (req, res)=>{
    try {
        const {phone} = req.body;
    if(!phone) return sendError(res, 'invalid phone number')

    const user = await User.findOne({ phone })
    if(!user) return sendError(res, 'user not found')

    const token = await ResetToken.findOne({ owner: user._id})
    if(token) return sendError(res, 'you can request for another token after an hour')

    const newToken = await createrandomBytes()
    const resetToken = new ResetToken({ owner: user._id, token: newToken})

    await resetToken.save()

    //send new reset token password to the user 
    client.messages.create({
        to: user.phone,
        from: '+13368919848',
        body:  `Password Reset Request 
        http://localhost:3000/reset-password?token=${newToken}&id=${user._id}
        `,
    }, function (err, message) {
        // console.log(message);
    });

    res.json({success: true, message: 'password reset link sent.'})
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }


})

//Reset password =================================================================
router.post('/reset-password', isResetTokenValid, async(req, res) =>{
    const {password} = req.body

    const user = await User.findById(req.user._id)
    if(!user) return sendError(res, 'user not found')

    const isSamePassword = await user.comparePassword(password)
    if(isSamePassword) return sendError(res, 'new password must be different')

    if(password.trim().length < 8 )
    return sendError(res, 'password must be minimum of 8 characters')

    user.password = password.trim()
    await user.save()

    await ResetToken.findOneAndDelete({ owner: user._id})

    //password reset success 
    client.messages.create({
        to: user.phone,
        from: '+13368919848',
        body:  `Password Reset Successfully, now you can login with your new password`,
    }, function (err, message) {
        // console.log(message);
    });

    res.json({success: true, message: 'Password Reset Successfully'})

})

//verify token ==============================================================
router.get('/verify-token', isResetTokenValid, async (req, res) =>{ 
    res.json({success: true});
})

//update user ================================================================
router.put('/update', async (req, res) =>{
    const { token } = req.query;
    try {
        if(!token){
            return sendError(res, "Not authorized to update ")
        }
        
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findByIdAndUpdate(decoded.id, {
                $set: req.body
            });
            res.status(200).json('Account has been updated')

            req.user = user;
            next()

           
    } catch (error) {
        return sendError(res, "Not authorized to update!!!")
    }
    
} )

//get user profile ============================================================
router.get("/profile", async (req, res) =>{
    const {token} = req.query;
    try {
        if(!token){
            return sendError(res, "User not authorized  ")
        }
        
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded.id);
            res.status(200).json(user)
            

            req.user = user;
            next()

           
    } catch (error) {
        return sendError(res, "User not authorized")
    }

})

//reuseable function to generate token ===================================
const sendToken = (user, statusCode, res) =>{
    const token = user.getSignedToken()
    res.status(statusCode).json({ success: true, token})
}







module.exports = router

//validating password reset token

const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");
const User = require('../models/User')
const ResetToken = require('../models/ResetToken');

exports.isResetTokenValid = async (req, res, next) =>{
    const { token, id} = req.query;
    if(!token || !id) return sendError(res, 'invalid request')

    if(!isValidObjectId(id)) return sendError(res, 'invalid user')

    const user = await User.findById(id)
    if(!user) return sendError(res, 'user not found')

    const resetToken = await ResetToken.findOne({ owner: user._id})
    if(!resetToken) return sendError(res, 'Token not found')

    const isValid  = await resetToken.compareToken(token)
    if(!isValid) return sendError(res, 'invalid token')

    req.user = user
    next()


}
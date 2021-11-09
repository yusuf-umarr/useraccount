const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    phone: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
       
    },
    avatar:{
        type: String,
        default: ""
    },
    interest:{
        type: String,
        default: ""
    },
    coverPicture:{
        type: String,
        default: ""
    },
    verified: {
        type: Boolean,
        default: false,
        require: true,
    }
    
},
    // { timestamps: true}
);

UserSchema.pre('save', async function(next){  // pre..>> perform this ftn before saving 
    if(this.isModified('password')){
        const hash = await bcrypt.hash(this.password, 8)
        this.password = hash
    }
    next()
})

UserSchema.methods.comparePassword =async function(password){
    const result = await bcrypt.compareSync(password, this.password)
    return result;
}

UserSchema.methods.getSignedToken = function() {
    return jwt.sign({id : this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE})
}
// UserSchema.methods.getResetPasswordToken = function(){
//     //creating reset token of 25hex
//     const resetToken = crypto.randomBytes(20).toString("hex")
//     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

//     this.resetPasswordExpire = Date.now() + 10 *( 60 *1000) //10min, 60=>1min, 1000=>1sec
//     return resetToken
// }

module.exports = mongoose.model('User', UserSchema)
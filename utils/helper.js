const crypto = require('crypto')

//error message
exports.sendError = (res, error, status=401) =>{
    res.status(status).json({success: false, error})
}

//generating random token
exports.createrandomBytes = () => new Promise((resolve, reject)=>{
    crypto.randomBytes(30, (err, buff) =>{
        if(err) reject(err);

        const token = buff.toString('hex');
        resolve(token)
    });

});
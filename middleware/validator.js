const { check, validationResult } = require("express-validator")

exports.validateUser = [
check('username').trim().not()
.isEmpty().withMessage('invalid Username')
.isLength({min: 3, max: 20})
.withMessage('Username must be min of 3 characters'),

check('email').normalizeEmail().isEmail()
.withMessage('Invalid Email'),

check('password').trim().not()
.isEmpty().withMessage('invalid password')
.isLength({min: 8, max: 20})
.withMessage('password must be min of 8 characters'),

check('phone').trim().not()
.isEmpty().withMessage('invalid phone')
.isLength({min: 10})
.withMessage('invalid phone. eg +2348012345678 '),
];

exports.validate = (req, res, next) =>{
    const error = validationResult(req).array()
    if(!error.length) return next()

    res.status(400).json({success: false, error: error[0].msg})
}


const express = require('express')

const router = express.Router()
const {protect} = require('../middleware/auth')


router.get("/", protect, (req, res, next) =>{
    res.status(200).json({
        success: true,
        data: "You got access to the private data in this route"
    })
})


module.exports = router
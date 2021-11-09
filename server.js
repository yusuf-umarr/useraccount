const express = require('express')
const app = express()
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const path = require("path")
const connectDB = require('./connection/db');

require('dotenv').config()
// const errorHandler = require('./middleware/error');

connectDB();


const PORT = process.env.PORT || 8800

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors())



app.use('/api/auth', require('./routes/auth'))
app.use('/api/private', require('./routes/private'))

// Error handler shoule be last piece of middleware
// app.use(errorHandler)



app.listen(PORT, () =>{
    console.log(`Server running on Port ${PORT}`);
})

// server.setTimeout( 0)
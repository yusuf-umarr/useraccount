
require('dotenv').config()

const mongoose = require('mongoose')
const connectDB = async ()=>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            // useFindAndModify:false,
            // useCreateIndex:true
        })
        console.log(`MongoDB connected successfull`)
    }catch(err){
        console.log(err)
        // process.exit(1)
    }
}

module.exports = connectDB
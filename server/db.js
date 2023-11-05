const mongoose=require("mongoose")
require("dotenv").config()

const connection=mongoose.connect(`mongodb+srv://prabhat:${process.env.pas}@cluster0.nob5hjt.mongodb.net/Email_scheduling?retryWrites=true&w=majority`)


module.exports={
    connection
}
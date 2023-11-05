const mongoose=require("mongoose")
const userSchema =  mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
  });
  

const UserModel= mongoose.model("user",userSchema)
module.exports={
    UserModel
}
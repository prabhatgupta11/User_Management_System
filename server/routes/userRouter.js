const express=require("express")

  const {userRegister,userlogin,userdetails,filteruser}=require("../controller/userController")

const userRouter = express.Router();
// userRouter=app.use(express)


//registration

userRouter.post("/register",userRegister)
userRouter.post("/login",userlogin)
userRouter.post("/details",userdetails)
// userRouter.post("/details",userdetails)
userRouter.get("/userfilter",filteruser)


module.exports={
    userRouter
}

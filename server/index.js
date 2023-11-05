const express=require("express")
const mongoose=require("mongoose")
require("dotenv").config()
const {connection}=require("./db");
const { userRouter } = require("./routes/userRouter");
const app=express();

app.use(express.json())


app.use("/api/user",userRouter)


app.listen(process.env.PORT,  async () => {
  try{
     await connection
     console.log("connect to database")
  }catch(err)
  {
    console.log(err.message)
  }
  console.log(`Server is running at port ${process.env.PORT}`);
});

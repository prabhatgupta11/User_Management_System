const express=require("express")
const app=express();
app.use(express.json())


mongoose.connect(`mongodb+srv://prabhat:${process.env.pas}@cluster0.nob5hjt.mongodb.net/Email_scheduling?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });



app.listen(process.env.PORT, () => {
  console.log("Server is running at port 4500");
});

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

// convert json object to JS object
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const requestRouter = require("./routes/requests");
const profileRouter = require("./routes/profile");

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);

connectDB()
  .then(() => {
    console.log("Database Connected!!!");
    app.listen(7777, () => {
      console.log("Server is running on port 7777...");
    });
  })
  .catch((err) => {
    console.log("Something Error...");
  });

//Middleware
//handle auth middleware for all routes
// app.use("/admin", adminAuth);

// app.get("/user",userAuth, (req,res)=>{
// res.send("User data sent")
// })

//handle auth middleware for get routes
// app.get("/admin/getAll", (req, res) => {
//   res.send("get all data");
// });

// app.get("/admin/delete", (req, res) => {
//   res.send("All data Deleted");
// });

// middleware for error handling
// app.use("/",(err,req,res,next)=>{
//   if(err){
//     res.status(500).send("Something went wrong")
//   }
// })

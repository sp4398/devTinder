const express = require("express");

const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

//Middleware
//handle auth middleware for all routes
app.use("/admin", adminAuth);

app.get("/user",userAuth, (req,res)=>{
  res.send("User data sent")
})

//handle auth middleware for get routes
app.get("/admin/getAll", (req, res) => {
  res.send("get all data");
});

app.get("/admin/delete", (req, res) => {
  res.send("All data Deleted");
});

// middleware for error handling
// app.use("/",(err,req,res,next)=>{
//   if(err){
//     res.status(500).send("Something went wrong")
//   }
// })

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

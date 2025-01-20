const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

// convert json object to JS object
app.use(express.json());

app.post("/signup", async (req, res) => {
  //Creating a new instance of the user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error while Adding user" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database Connected!!!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
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

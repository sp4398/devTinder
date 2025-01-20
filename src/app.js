const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

// convert json object to JS object
app.use(express.json());

//Adding data to database
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

//getting data of one user from database
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//getting all user information from database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//deleting data from database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Deleted");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//updating data in database
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["firstName", "lastName", "about", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if(data?.skills.length>20){
      throw new Error("Skills cannot be more than 20")
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User Updated");
  } catch (err) {
    res.status(400).send("Update Failed:" + err.message);
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

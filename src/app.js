const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

// convert json object to JS object
app.use(express.json());
app.use(cookieParser());

//Adding data to database
app.post("/signup", async (req, res) => {
  try {
    //validation of Data
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;

    // Encrypting password
    const passwordHash = await bcrypt.hash(password, 10);

    //Creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User Does not exist");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create jwt token
      const token = await user.getJWT();

      // add token to cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login Successful!!!");
    } else {
      throw new Error("User Does not exist");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});



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

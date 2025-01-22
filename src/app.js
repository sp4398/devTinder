const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // create jwt token
      const token = await jwt.sign({ _id: user._id }, "DevTinder@1234");

      // add token to cookie
      res.cookie("token", token);

      res.send("Login Successful!!!");
    } else {
      throw new Error("User Does not exist");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Token not found");
    }

    //validate token
    const decoded = await jwt.verify(token, "DevTinder@1234");

    const { _id } = decoded;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
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
    if (data?.skills.length > 20) {
      throw new Error("Skills cannot be more than 20");
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

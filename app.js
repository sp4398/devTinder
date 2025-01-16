const express = require("express");

const app = express();

//Middleware
//handle auth middleware for all routes
app.use((req, res, next) => {
  const token = "xyzfdf";
  const isAdminAuthrized = token === "xyz";
  if (isAdminAuthrized) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
});

//handle auth middleware for get routes
app.get("/admin/getAll", (req, res) => {
  res.send("get all data");
});

app.get("/admin/delete", (req, res) => {
  res.send("All data Deleted");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

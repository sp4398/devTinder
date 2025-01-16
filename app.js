const express = require("express");

const app = express();

//Middleware
//handle auth middleware for get routes
app.get("/admin/getAll", (req, res) => {
  const token = "xyz";
  const isAdminAuthrized = token === "xyz";
  if (isAdminAuthrized) {
    res.send("All data sent to admin");
  } else {
    res.status(401).send("Unauthorized");
  }
});

app.get("/admin/delete", (req, res) => {
    const token = "xyz";
    const isAdminAuthrized = token === "xyz";
    if (isAdminAuthrized) {
      res.send("All data Deleted");
    } else {
      res.status(401).send("Unauthorized");
    }
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

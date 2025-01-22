const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendRequest", userAuth, async (req, res)=>{
    const user = req.user;
    res.send("Request Sent Successfully to " + user.firstName);
})

module.exports = requestRouter;


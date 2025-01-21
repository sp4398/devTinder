const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First Name  and Last Name are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email Address : " + emailId);
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a Strong Password");
  }
};

module.exports = { validateSignupData };

const adminAuth = (req, res, next) => {
  const token = "xydz";
  const isAdminAuthrized = token === "xyz";
  if (!isAdminAuthrized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthrized = token === "xyz";
  if (!isAdminAuthrized) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

module.exports = { 
    adminAuth,
    userAuth,
 };

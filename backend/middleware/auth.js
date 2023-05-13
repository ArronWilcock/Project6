// json web token package required.
const jwt = require("jsonwebtoken");

// This is the authentication middleware that checks the req.body user id against the users id in the decoded token
// using the jwt.verify method
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Unauthorized request!"),
    });
  }
};

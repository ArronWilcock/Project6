// Required packages and paths declared. bcrypt creates an encrypted hash of the password which is then stored on the database.
// Following password attempts will also be hashed with a different code however the package can detect if both unique hashes
// originated as the same password.

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// user sign up logic - using bcrypt.hash & salted 10 times to increase the security of the hash
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then(() => {
        res.status(201).json({
          message: "User added successfully",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  });
};

// User login logic - when a valid user signs in they are assigned a bearer token with an expiry to be used for authentication
// when sending requests
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error(),
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: new Error(),
            });
          }
          // Here the JWT is generated using the jwt.sign method with a payload of the users unique identifier
          // and assigning a secret key used to sign the jwt which expires in 24 hours
          const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          });
          res.status(200).json({
            userId: user._id,
            token: token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

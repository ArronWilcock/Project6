// Express, Mongoose & Mongodb Error Handler packages installed for this app

// Required packages and file paths declared
const express = require("express");
const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const path = require("path");

// User & Sauce routes imported with the app
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

// express app is declared by using express like a function
const app = express();

// middleware that takes incoming requests with content type application/json and makes its body available on the reponse object
app.use(express.json());

// middleware to connect to mongodb using mongoose package. Username and Password are stored as variables in the .env file
// which is not pushed to git hub for security
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@project6cluster.inokijf.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("successfully connected to mongo db atlas");
  })
  .catch((error) => {
    console.log("unable to connect to mongo db atlas");
    console.error(error);
  });

// mongoose error handler package called afetr the mongoose middleware declared
mongoose.plugin(mongodbErrorHandler);

// Middleware to create headers for CORS (cross origin resource sharing)
// access control for Origin, Headers & Methods declared for the response objects
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// express middleware function to serve static files from the images folder
app.use("/images", express.static(path.join(__dirname, "images")));

// User & sauce routes registered
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

// express app exported so that it can be accessed outside the js file
module.exports = app;

const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://arronwilcock:aNY9w8Blxag3dVos@project6cluster.inokijf.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("successfully connected to mongo db atlas");
  })
  .catch((error) => {
    console.log("unable to connect to mongo db atlas");
    console.error(error);
  });

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

app.use('/api/auth', userRoutes);

module.exports = app;
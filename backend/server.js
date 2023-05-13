// Nodemon package installed to listen for live changes and updating the running server

// required elements declared. Http is default node package so no need to add to package.json
require("dotenv").config();

const http = require("http");
const app = require("./app");

// normalize port function to return a valid port whether it is supplied as a number or string data type
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Port is declared to use either the port environment variable or 3000 as its parameters. App set is then used to tell the
// express app which port to listen on.
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Error handler function checks for server errors, handles them, then registers them to the server
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// The server is declared, requiring http and uses the express app
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);

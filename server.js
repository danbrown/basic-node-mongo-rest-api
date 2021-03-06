"use strict";

const app = require("./bin/express");

const server = require("http").Server(app);

let port = process.env.PORT || 3333;

server.listen(port, () => {
  console.log("Server is up!");
});

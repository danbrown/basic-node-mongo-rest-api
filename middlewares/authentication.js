const jwt = require("jsonwebtoken");
const variables = require("../bin/configuration/variables");
const user = require("../models/user-model");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  if (token) {
    try {
      let decoded = await jwt.verify(token, variables.Security.secretKey);
      req.loggedUser = decoded;

      let userExists = await user.findById(req.loggedUser.user._id);
      if (!userExists) {
        res.status(401).send("Invalid user");
        return;
      }
      next();
    } catch (error) {
      res.status(401).send("Invalid Token");
      return;
    }

    res.status(401).send("Token Required");
  }
};

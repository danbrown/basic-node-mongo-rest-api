"use strict";

const repository = require("../repositories/user-repository");
const validation = require("../bin/helpers/validation");
const controllerBase = require("../bin/base/controller-base");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const variables = require("../bin/configuration/variables");
const _repo = new repository();

function userController() {}

userController.prototype.post = async (req, res) => {
  let _validationContract = new validation();
  console.log(req.body);
  _validationContract.isRequired(req.body.name, "Name is required");
  _validationContract.isRequired(req.body.email, "Email is required");
  _validationContract.isRequired(req.body.password, "Password is required");
  _validationContract.isRequired(
    req.body.confirmedPassword,
    "Confirmed Password is required"
  );
  _validationContract.isTrue(
    req.body.confirmedPassword !== req.body.password,
    "Password and Confirmed Password must be the same"
  );
  _validationContract.isEmail(req.body.email, "Invalid email");

  let userEmailExists = await _repo.IsEmailExists(req.body.email);

  // check if user emails exists in database
  try {
    if (userEmailExists) {
      _validationContract.isTrue(
        userEmailExists.name != undefined,
        `Email ${req.body.email} already exists in database`
      );
    }
  
    var salt = await bcrypt.genSaltSync(10);
    req.body.password = await bcrypt.hashSync(req.body.password, salt);
  
    controllerBase.post(_repo, _validationContract, req, res);
  } catch (error) {
    res.status(500).send({ message: "Internal server error2", error });
  }
};

userController.prototype.put = async (req, res) => {
  let _validationContract = new validation();
  _validationContract.isRequired(req.body.name, "Name is required");
  _validationContract.isRequired(req.params.id, "Id is required");
  _validationContract.isRequired(req.body.email, "Email is required");
  _validationContract.isRequired(req.body.password, "Password is required");
  _validationContract.isRequired(
    req.body.confirmedPassword,
    "Confirmed Password is required"
  );
  _validationContract.isTrue(
    req.body.confirmedPassword !== req.body.password,
    "Password and Confirmed Password must be the same"
  );
  _validationContract.isEmail(req.body.email, "Invalid email");

  try {
    let userEmailExists = await _repo.IsEmailExists(req.body.email);

    // check if user emails exists in database
    if (userEmailExists) {
      _validationContract.isTrue(
        userEmailExists.name != undefined &&
          userEmailExists._id != req.params.id,
        `Email ${req.body.email} already exists in database`
      );
    }

    controllerBase.put(_repo, _validationContract, req, res);
  } catch (error) {
    res.status(500).send({ message: "Internal server error1", error });
  }
};

userController.prototype.get = async (req, res) => {
  controllerBase.get(_repo, req, res);
};

userController.prototype.delete = async (req, res) => {
  _validationContract.isRequired(req.params.id, "Id is required");
  controllerBase.delete(_repo, req, res);
};

userController.prototype.authenticate = async (req, res) => {
  let _validationContract = new validation();

  _validationContract.isRequired(req.body.email, "Email is required");
  _validationContract.isRequired(req.body.password, "Password is required");
  _validationContract.isRequired(
    req.body.confirmedPassword,
    "Confirmed Password is required"
  );
  _validationContract.isTrue(
    req.body.confirmedPassword !== req.body.password,
    "Password and Confirmed Password must be the same"
  );
  _validationContract.isEmail(req.body.email, "Invalid email");

  if (!_validationContract.isValid()) {
    res.status(400).send({
      message: "Can't login.",
      validation: _validationContract.errors,
    });
    return;
  }

  let foundUser = await _repo.authenticate(
    req.body.email,
    req.body.password,
    false
  );
  if (foundUser == null) {
    res.status(404).send({ message: "Invalid user or password" });
  }
  if (foundUser) {
    res.status(200).send({
      user: foundUser,
      token: jwt.sign({ user: foundUser }, variables.Security.secretKey),
    });
  } else {
    res.status(404).send({ message: "Invalid user or password" });
  }
};

module.exports = userController;

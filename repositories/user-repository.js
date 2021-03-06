require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const base = require("../bin/base/repository-base");

class userRepository {
  constructor() {
    this._base = new base("User");
    this._projection = "name email";
  }

  async authenticate(Email, Password, Flag) {
    let user = await this._base._model.findOne({ email: Email });
    let userR = await this._base._model.findOne(
      { email: Email },
      this._projection
    );

    if (await bcrypt.compareSync(Password, user.password)) {
      return userR;
    }
    return null;
  }

  async IsEmailExists(Email) {
    return await this._base._model.findOne({ email: Email  }, this._projection);
  }


  async create(data, req) {
    let createdUser = await this._base.create(data);
    let userR = await this._base._model.findOne(
      { _id: createdUser._id },
      this._projection
    );

    return userR;
  }

  async update(id, data, loggedUser) {
    if (loggedUser._id === id) {
      if (
        data.oldPassword !== data.password &&
        data.oldPassword &&
        data.password !== undefined &&
        data.confirmedPassword !== undefined &&
        data.password === data.confirmedPassword
      ) {
        let user = await this._base._model.findOne({ _id: id });
        if (await bcrypt.compareSync(data.oldPassword, user.password)) {
          var salt = await bcrypt.genSaltSync(10);
          let _hashPassword = await bcrypt.hashSync(data.password, salt);
          let name = user.name;
          let email = user.email;
          if (data.email) {
            email = data.email;
          }
          if (data.name) {
            name = data.name;
          }
          let updatedUser = await this._base.update(id, {
            name,
            email,
            passoword: _hashPassword,
          });
          return this._base._model.findById(updatedUser._id, this._projection);
        } else {
          return { message: "Invalid Password" };
        }
      }
    } else {
      return { message: "You don't have permission to update this user" };
    }
  }

  async getAll() {
    return await this._base.getAll();
  }

  async delete(id) {
    return await this._base.delete(id);
  }
}

module.exports = userRepository;

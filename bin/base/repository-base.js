"use strict";

const mongoose = require("mongoose");

class baseRepository {
  constructor(model) {
    this._model = mongoose.model(model);
  }

  async create(data) {
    let model = new this._model(data);
    let result = await model.save();

    return result;
  }

  async update(id, data, loggedUser) {
    await this._model.findByIdAndUpdate(id, { $set: data });

    let result = await this._model.findById(id);
    return result;
  }

  async getAll() {
    return await this._model.find();
  }

  async delete(id) {
    return await this._model.findByIdAndDelete(id);
  }
}

module.exports = baseRepository;

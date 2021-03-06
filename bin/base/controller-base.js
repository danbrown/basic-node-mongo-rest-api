exports.post = async (repository, validationContract, req, res, next) => {
  try {
    let data = req.body;
    if (!validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: "Existem dados inválidos na sua requisição",
          validation: validationContract.errors(),
        })
        .end();
      return;
    }

    let result = await repository.create(data, req);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal server error5", error });
  }
};

exports.put = async (repository, validationContract, req, res, next) => {
  try {
    let data = req.body;
    if (!validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: "Existem dados inválidos na sua requisição",
          validation: validationContract.errors(),
        })
        .end();
      return;
    }

    let result = await repository.update(
      req.params.id,
      data,
      req.loggedUser.user
    );
    res.status(202).send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal server error4", error });
  }
};

exports.get = async (repository, validationContract, req, res, next) => {
  try {
    let result = await repository.getAll();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal server error3", error });
  }
};

exports.delete = async (repository, validationContract, req, res, next) => {
  try {
    const id = req.params.id;
    if (id) {
      let result = await repository.delete(id, req.loggedUser);
      if (result !== "invalid") {
        res.status(200).send({ message: "Successful excluded" });
      } else {
        res.status(401).send({ message: "Invalid Operation" });
      }
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "ID parameter needs to be specified", error });
  }
};

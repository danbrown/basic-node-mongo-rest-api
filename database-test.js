const mongoose = require("mongoose");
mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  .then((result) => {
    console.log(result, "a");
  })
  .catch((err) => console.log(err));

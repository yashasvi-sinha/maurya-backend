const mongoose = require("mongoose");

const dB = process.env.DATABASE;

mongoose
  .connect(dB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => console.log(err));

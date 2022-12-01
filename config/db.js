const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`MongoDB connection succesfull :${data.connection.host}`);
    })
    .catch((err) => {
      console.log(`error connecting to the database ${err}`);
    });
};

module.exports = dbConnect;

const mongoose = require("mongoose");

const DB_URL = "mongodb+srv://AaooChale:DL11P7C5U22YSBzB@aaoochaledb.wxcfmcd.mongodb.net/aaoochale";
const dbConnect = () => {
  mongoose
    .connect(DB_URL)
    .then((data) => {
      console.log(`MongoDB connection succesfull :${data.connection.host}`);
    })
    .catch((err) => {
      console.log(`error connecting to the database ${err}`);
    });
};

module.exports = dbConnect;

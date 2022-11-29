const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "config.env") });
const dbConnect = require(path.join(__dirname, "..", "config", "db"));
const User = require(path.join(__dirname, "..", "model", "User"));

// const RecruiterNotification = require(path.join(__dirname, "..", "model", "RecruiterNotificationSchema"));
const deleteDb = async () => {
  try {
    dbConnect();
    console.log("DELETING ALL DATA FROM DB");
    await User.deleteMany({});

    console.log("ALL DATA DELETED FROM DB");
    process.exit(0);
  } catch (err) {
    console.log("SOMETHING WENT WRONG WHILE DELETING DB DATA", err);
  }
};

deleteDb();

var axios = require("axios");

// const FIREBASE_SERVER_KEY =
//   "AAAAAplvKTg:APA91bGc_LInW9CObKP5HE-yRaH_Y_-AcIOYsf5NeTAk-Zk-n9B_zRRjXjE1B00hnUEgASQ1SvFr-DZ_sxmZ6H28x2HihhZYB1KY7uS3Smyrs3mFU7q3MD1BqsWI-Xr2XX6EFQaD0ldk";

function sendNotification(token, notification) {
  // setting up data to sent
  var data = JSON.stringify({
    to: token,
    notification: notification,
  });

  //api configuration
  var config = {
    method: "post",
    url: "https://fcm.googleapis.com/fcm/send",
    headers: {
      Authorization: "key=" + process.env.FIREBASE_SERVER_KEY,
      "Content-Type": "application/json",
    },
    data: data,
  };

  console.log(config, "config");

  axios(config);
}

module.exports = { sendNotification };

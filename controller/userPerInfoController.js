const path = require("path");
const catchAsync = require(path.join(__dirname, "..", "utils", "catchAsync"));
const AppErr = require(path.join(__dirname, "..", "utils", "AppErr"));
const encryptPassword = require(path.join(__dirname, "..", "helpers", "encryptPassword"));
const User = require(path.join(__dirname, "..", "model", "userModel"));
const notificationController = require("../notification/notificationController");

////////////
const Token = require("../model/fireBaseSchema");
const firebase = require("../notification/firebase");

////

const GetToken = async (userId) => {
  const list = await Token.find({ user_id: userId });

  if (list.length > 0) {
    return list[0].token;
  } else {
    var token = "";
    return token;
  }
};

// add user personal info
exports.addUserPersoInfo = async (req, res, next) => {
  // const user = req.user;
  // console.log(user);
  const { id, firstName, lastName, emailId } = req.body;
  if (!id || !firstName || !lastName) {
    return next(new AppErr("Please Provide id, firstName, lastName", 200));
  }
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { ...req.body },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  user.email = { emailId };
  console.log(user);
  // save data
  await user.save();
  // await notificationController.postNotificationSelf(
  //   id,
  //   "Self",
  //   "Please verify your Govt ID people get more trust in verified IDs."
  // );

  ////

  // pushnotification single

  ////
  res.status(200).json({
    status: true,
    data: {
      message: "Add User Personal information",
      user,
    },
  });
};
// });

// user update personal info
exports.updateUserPersoInfo = catchAsync(async (req, res, next) => {
  // const user = req.user;
  // const { id } = req.body;
  const { id, firstName, lastName, emailId, gender, DOB, bio, mobileNumber } = req.body;
  if (!id) return next(new AppErr("Pelase Provide User Id"), 200);

  // // chake email present or mot
  // const data = await User.findOne({ "email.emailId": emailId });
  // if (data) return next(new AppErr("Account already exist please add new emailId"), 200);

  const user = await User.findByIdAndUpdate(
    { _id: id },
    { ...req.body },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  // user.name = name;
  // user.email = { emailId };
  console.log(user);
  // save data
  await user.save();
  res.status(200).json({
    status: true,
    data: {
      message: "Add User Personal information",
      user,
    },
  });
});

// get user personal info
exports.getUserPersoInfo = catchAsync(async (req, res, next) => {
  // const user = req.user;
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide User Id"), 200);

  // if (!user) return next(new AppErr("Please Login User"), 200);
  const user = await User.findOne({ _id: id }, "-__v");
  console.log(user);
  res.status(200).json({
    status: true,
    data: {
      message: "Get User Personal information",
      user,
    },
  });
});

// update personal information
exports.updateUserPreferences = catchAsync(async (req, res, next) => {
  // const user = req.user;
  // const { id } = req.body;
  const { id, chattiness, music, smoking, pets } = req.body;
  if (!id) return next(new AppErr("Pelase Provide User Id"), 200);

  // // chake email present or mot
  // const data = await User.findOne({ "email.emailId": emailId });
  // if (data) return next(new AppErr("Account already exist please add new emailId"), 200);

  const user = await User.findByIdAndUpdate(
    { _id: id },
    { ...req.body },
    { runValidator: true, useFindAndModify: false, new: true }
  );
  console.log(user);
  // save data
  await user.save();
  res.status(200).json({
    status: true,
    data: {
      message: "Add User Personal information",
      user,
    },
  });
});

// email agar verify nai to verify , aur agar email add nai kiyta to add karega uyska notuification
// notification
exports.notificationByEmail = catchAsync(async (req, res, next) => {
  // const user = req.user;
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide User Id"), 200);
  const user = await User.findOne({ _id: id });

  if (!user.email) {
    await notificationController.postNotificationSelf(id, "Self", "Please Add your EmailId.");

    if (id) {
      // console.log("okkkkkkkk");
      var content = {
        title: "You have new Notification please chake...",
        body: "Please Add your EmailId.",
        imageUrl: "http://res.cloudinary.com/dyetuvbqa/image/upload/v1672929153/r3pwo0x7wmrhjrfyuruz.jpg",
      };
      const key = await GetToken(id);
      // console.log(key, "key");

      if (key != "") {
        // console.log("okkkkkkkkkkkkkkkk");
        var firebaseres = await firebase.sendNotification(key, content);
      }
    }
    res.status(200).json({
      status: true,
      data: {
        message: "Please Add your EmailId",
      },
    });
  } else if (user?.email?.isEmailVerified == false) {
    await notificationController.postNotificationSelf(id, "Self", "Please Add verify your EmailId.");

    if (id) {
      // console.log("okkkkkkkk");
      var content = {
        title: "You have new Notification please chake...",
        body: "Please Add verify your EmailId.",
        imageUrl: "http://res.cloudinary.com/dyetuvbqa/image/upload/v1672929153/r3pwo0x7wmrhjrfyuruz.jpg",
      };
      const key = await GetToken(id);
      // console.log(key, "key");

      if (key != "") {
        // console.log("okkkkkkkkkkkkkkkk");
        var firebaseres = await firebase.sendNotification(key, content);
      }
    }
    res.status(200).json({
      status: true,
      data: {
        message: "Please Add verify your EmailId",
      },
    });
  } else {
    res.status(200).json({
      status: true,
      data: {
        message: "User EmailId already Updated",
      },
    });
  }
});

/// verify user pic

exports.notificationByprofilePicture = async (req, res, next) => {
  // const user = req.user;
  const { id } = req.body;
  if (!id) return next(new AppErr("Pelase Provide User Id"), 200);
  const user = await User.findOne({ _id: id });

  if (user.profilePicture == "") {
    await notificationController.postNotificationSelf(id, "Self", "Please Add your profilePicture.");

    //
    if (id) {
      // console.log("okkkkkkkk");
      var content = {
        title: "You have new Notification please chake...",
        body: "Please Add your profilePicture.",
        imageUrl: "http://res.cloudinary.com/dyetuvbqa/image/upload/v1672929153/r3pwo0x7wmrhjrfyuruz.jpg",
      };
      const key = await GetToken(id);
      // console.log(key, "key");

      if (key != "") {
        // console.log("okkkkkkkkkkkkkkkk");
        var firebaseres = await firebase.sendNotification(key, content);
      }
    }
    res.status(200).json({
      status: true,
      data: {
        message: "Please Add your profilePicture",
      },
    });
  } else {
    res.status(200).json({
      status: true,
      data: {
        message: "User profilePicture already uploaded",
      },
    });
  }
};

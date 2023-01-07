const { json } = require("express");
const path = require("path");
const catchAsync = require("../utils/catchAsync");
const AppErr = require("../utils/AppErr");
const Notification = require("../model/notificationSchema");
const getISTTime = require("../helpers/getISTTime");

const Firebase = require("../model/fireBaseSchema");
const User = require("../model/userModel");

// router.post("/save-token", function (req, res, next) {

exports.saveToken = async function (req, res, next) {
  const firebase = new Firebase(req.body);
  const err = firebase.joiValidate(req.body);

  if (err.error) {
    var final = {
      res: "error",
      msg: err.error.details[0].message,
    };
    res.status(400).send(final);
  } else {
    // verify user_id
    User.findById(req.body.user_id, function (err, user) {
      if (user) {
        // find by Id and update
        User.findByIdAndUpdate(req.body.user_id, { new: true }, function (err, result) {
          if (user) {
            Firebase.findOne({ user_id: req.body.user_id }, function (err, token) {
              if (token) {
                // do update by user_id
                Firebase.findOneAndUpdate(
                  { user_id: req.body.user_id },
                  { token: req.body.token },
                  { new: true },
                  function (err, result) {
                    if (result) {
                      var final = {
                        res: "success",
                        msg: "Token updated successfully!",
                        data: result,
                        user: user,
                      };
                      res.status(200).send(final);
                    } else {
                      console.log("!!!!!!!!!!!");
                      console.log(err);
                      var final = {
                        res: "error",
                        msg: "Something went wrong 1!",
                      };
                      res.status(400).send(final);
                    }
                  }
                );
              } else {
                firebase.save(function (err, result) {
                  if (result) {
                    var final = {
                      res: "success",
                      msg: "Token saved successfully!",
                      data: result,
                    };
                    res.status(200).send(final);
                  } else {
                    var final = {
                      res: "error",
                      msg: "Something went wrong 2!",
                    };
                    res.status(200).send(final);
                  }
                });
              }
            });
          } else {
            var final = {
              res: "error",
              msg: "Something went wrong 3!",
            };
            res.status(200).send(final);
          }
        });
      } else {
        var final = {
          res: "error",
          msg: "User ID is not valid!",
        };
        res.status(200).send(final);
      }
    });
  }
};

// module.exports = router;

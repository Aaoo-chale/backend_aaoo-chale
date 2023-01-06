const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;
const path = require("path");
const getISTTime = require(path.join(__dirname, "..", "helpers", "getISTTime"));
const NotificationSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please Provide sender Id"],
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: [false, "Please Provide receiver Id"],
    },
    type: {
      type: String,
      enum: [
        "ChangeStatus",
        "Rating",
        "Reply",
        "Report",
        "cancleBookedRide",
        "Self",
        "Booking Approval",
        "Booking Instant Approval",
      ],
    },
    message: {
      type: String,
    },
    // status: {
    //   type: String,
    //   default: "UNREAD",
    //   enum: ["READ", "UNREAD"],
    // },
    // webUrl: {
    //   type: String,
    // },
    // mobileUrl: {
    //   type: String,
    // },
    createdOn: {
      type: Date,
      default: getISTTime(new Date(Date.now())),
    },
  },
  { toJSON: { virtuals: true } }
);

NotificationSchema.methods.joiValidate = function (obj) {
  var schema = Joi.object({
    sender: Joi.string().required().label("Title").messages({
      "any.required": "Title name should not be empty!",
    }),
    receiver: Joi.string().required().label("Title").messages({
      "any.required": "Title name should not be empty!",
    }),
    message: Joi.string().required().label("Details").messages({
      "any.required": "Details should not be empty!",
      "String.empty": "Details should not be empty!",
    }),
  });

  const validation = schema.validate(obj);

  return validation;
};
const NotificationSchemas = mongoose.model("Notification", NotificationSchema);
module.exports = NotificationSchemas;

const mongoose = require("mongoose");
const path = require("path");
const getISTTime = require("../helpers/getISTTime");
const Schema = mongoose.Schema;
// const validateEmail = function (email) {
//   const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   return re.test(email);
// };

// HELPER FUNCTION
function monthDiff(d1, d2) {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

const userModel = new Schema(
  {
    firstName: {
      type: String,
      required: [false, "Please Provide First Name"],
    },
    lastName: {
      type: String,
      required: [false, "Please Provide First Name"],
    },
    userStatus: {
      type: String,
      enum: ["Verified", "Unverified"],
      required: [false, "Please Provide verified"],
    },

    profilePicture: String,
    createdOn: {
      type: Date,
      default: getISTTime(new Date(Date.now())),
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    DOB: {
      type: Date,
      default: getISTTime(new Date(Date.now())),
    },
    bio: {
      type: String,
    },

    email: {
      emailId: {
        type: String,
        unique: [false, "Email Id Already Exists"],
        required: [false, "Please Provide Email ID"],
        // trim: false,
        // validate: [validateEmail, "Please fill a valid email address"],
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
    },
    mobile: {
      mobileNumber: {
        type: String,
        unique: [true, "Mobile Number Already Exists"],
        required: [true, "Please Provide Mobile Number"],
      },
      isMobileVerified: {
        type: Boolean,
        default: false,
      },
    },
    verificationToken: {
      emailToken: String,
      emailTokenExpiry: Date,
      mobileToken: String,
      mobileTokenExpiry: Date,
      passwordToken: String,
      passwordTokenExpiry: Date,
    },
    chattiness: {
      type: String,
    },
    music: {
      type: String,
    },
    smoking: {
      type: String,
    },
    pets: {
      type: String,
    },
    documents: {
      aadharCard: {
        documentName: String,
        documentNumber: String,
        documentLink: String,
        isDocumentVerified: Boolean,
        documentExpiryDate: Date,
      },
      panCard: {
        documentName: String,
        documentNumber: String,
        documentLink: String,
        isDocumentVerified: Boolean,
        documentExpiryDate: Date,
      },
      drivingLicence: {
        documentName: String,
        documentNumber: String,
        documentLink: String,
        isDocumentVerified: Boolean,
        documentExpiryDate: Date,
      },
    },
  },
  { toJSON: { virtuals: true } }
);
userModel.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimeStamp;
  }
  return false; // false means password not change & no-error
};

const User = mongoose.model("User", userModel);
module.exports = User;

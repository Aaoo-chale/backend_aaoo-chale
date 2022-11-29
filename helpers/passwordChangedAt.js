const passwordChangedAt = function (JWTTimestamp, doc) {
  if (doc.passwordChangedAt) {
    const changedTimeStamp = parseInt(doc.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimeStamp;
  }
  // false means password not change & no-error
  return false;
};
module.exports = passwordChangedAt;

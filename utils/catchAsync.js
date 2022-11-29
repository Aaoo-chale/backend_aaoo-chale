const catchAsync = function (asyncfn) {
  return (req, res, next) => {
    asyncfn(req, res, next).catch((err) => {
      next(err);
    });
  };
};

module.exports = catchAsync;

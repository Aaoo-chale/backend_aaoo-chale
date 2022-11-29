const getISTTime = (d) => {
  return d.getTime() + 5.5 * 60 * 60 * 1000;
};
module.exports = getISTTime;

const winston = require("winston");
const requestBodyLogger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

module.exports = requestBodyLogger;

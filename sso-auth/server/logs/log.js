const { format } = require("winston");
const winston = require("winston");
const { combine, timestamp, prettyPrint } = format;

// Create info logger format
const loggerInfo = winston.createLogger({
  level: "info",
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new winston.transports.File({ filename: "logs/info.log", level: "info" }),
  ],
});

// Create debug logger format
const loggerDebug = winston.createLogger({
  level: "debug",
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new winston.transports.File({ filename: "logs/debug.log", level: "debug" }),
  ],
});

module.exports = {
  loggerDebug,
  loggerInfo,
};

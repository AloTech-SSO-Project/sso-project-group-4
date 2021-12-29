var JWT = require("jsonwebtoken");
const {ACCESS_TOKEN_SECRET_KEY} = require("../config");

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, function (err, user) {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });
};

module.exports = {
  verifyToken,
};

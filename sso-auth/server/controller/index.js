const httpStatus = require("http-status");
var JWT = require("jsonwebtoken");
const { loggerDebug, loggerInfo } = require("../logs/log");
const {
  getOneUser,
  getUserWithToken,
  getUserWithId,
  setToken,
  updateToken,
} = require("../models/Users");
const { generateAccessToken, verifyToken } = require("../utils/helper");

exports.IsAuthorized = async (req, res) => {
  // Logger
  loggerDebug.log({
    level: "debug",
    message: "isAuthorized called",
  });

  // Get username and hashed password from login screen
  const { username, salted_hash } = req.body;
  if (!username || !salted_hash) {
    // Logger
    loggerInfo.log({
      level: "info",
      message: "Username or password is missing",
    });
    return res
      .status(201)
      .json({ result: false, message: "username or password is missing" });
  }

  // Get one user from DB with username, hashed password
  const results = await getOneUser(username, salted_hash);

  // Defining the result of the database query into a variable
  let user = results[0];

  if (!user) {
    // Logger
    loggerInfo.log({
      level: "info",
      message: "Username or password is wrong",
    });
    return res
      .status(201)
      .json({ result: false, message: "username or password is wrong" });
  }
  // Generate JWT with user info
  const token = generateAccessToken(user);
  try {
    // if there is no user's token in DB, set user's token to DB
    await setToken(token, user.id);
  } catch (err) {
    // if there is user's token in DB, set user's new token to DB
    updateToken(token, user.id);
  }
  // Logger
  loggerInfo.log({
    level: "info",
    message: "User is authorized",
  });

  return res.status(httpStatus.OK).json({
    result: true,
    user_id: user.id,
    Access_Token: token,
  });
};

exports.isAccessTokenValid = async (req, res) => {
  // Logger
  loggerDebug.log({
    level: "debug",
    message: "isAcessTokenValid called",
  });
  let access_token;

  // Get token from axios body or cookie
  if (req.body.access_token) {
    access_token = req.body.access_token;
  }
  if (req.cookies.access_token) {
    access_token = req.cookies.access_token;
  }
  // Assign access token value to a variable
  const token = access_token;

  // Check token
  try {
    // if token not expired, resend
    const result = await verifyToken(token);
    return res.status(httpStatus.OK).json({
      access_token: token,
    });
  } catch (err) {
    // if token expired
    if (err.name === "TokenExpiredError") {
      // Logger
      loggerInfo.log({
        level: "info",
        message: `${token} : token is expired`,
      });
      // Get user info from DB with token. We will reach the user's id with the token
      const getUserWT = (await getUserWithToken(token)) || [];

      if (getUserWT.length === 0 || !getUserWT[0].user_id) {
        return res.status(httpStatus.NOT_FOUND).json({ result: false });
      }

      // Defining user's id into a variable
      const userID = getUserWT[0].user_id;

      // Get user info from DB with id
      const getUser = await getUserWithId(userID);

      // Generate new token with user's info
      const newToken = generateAccessToken(getUser[0]);

      // Update token in DB
      updateToken(newToken, getUser[0].id);
      // Logger
      loggerInfo.log({
        level: "info",
        message: `${token} : new access token generated`,
      });
      return res.status(httpStatus.OK).json({
        access_token: newToken,
      });
    }

    return res.status(httpStatus.NOT_FOUND).send({ result: false });
  }
};

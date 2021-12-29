const httpStatus = require("http-status");
var JWT = require("jsonwebtoken");
const { loggerDebug,
  loggerInfo } = require("../logs/log");

const {
  getOneUser,
  getUserWithToken,
  getUserWithId,
  setToken,
  updateToken,
} = require("../models/Users");
const { generateAccessToken, verifyToken } = require("../utils/helper");

exports.IsAuthorized = async (req, res) => {
    loggerDebug.log({
      level: "debug",
      message: "isAuthorized called",
  })

  const { username, salted_hash } = req.body;
  if (!username || !salted_hash) {
    loggerInfo.log({
      level: "info",
      message: "Username or password is missing"
    })
    return res
      .status(201)
      .json({ result: false, message: "username or password is missing" });
  }



  const results = await getOneUser(username, salted_hash);
  let user = results[0];

  if (!user) {
    loggerInfo.log({
      level: "info",
      message: "Username or password is wrong"
    })
    return res
      .status(201)
      .json({ result: false, message: "username or password is wrong" });
  }

  const token = generateAccessToken(user);
  try {
    await setToken(token, user.id);
  } catch (err) {
    updateToken(token, user.id);
  }

  loggerInfo.log({
    level: "info",
    message: "User is authorized"
  })
  return res.status(httpStatus.OK).json({
    result: true,
    user_id: user.id,
    Access_Token: token,
  });
};

exports.isAccessTokenValid = async (req, res) => {
  loggerDebug.log({
    level: "debug",
    message: "isAcessTokenValid called",
  })
  let access_token;
  if (req.body.access_token) {
    access_token = req.body.access_token;
  }
  if (req.cookies.access_token) {
    access_token = req.cookies.access_token;
  }

  const token = access_token;

  try {
    const result = await verifyToken(token);
    return res.status(httpStatus.OK).json({
      access_token: token,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      loggerInfo.log({
        level: "info",
        message: `${token} : token is expired`,
      })
      const getUserWT = (await getUserWithToken(token)) || [];

      if (getUserWT.length === 0 || !getUserWT[0].user_id) {
        return res.status(httpStatus.NOT_FOUND).json({ result: false });
      }
      const userID = getUserWT[0].user_id;

      const getUser = await getUserWithId(userID);
      const newToken = generateAccessToken(getUser[0]);
      updateToken(newToken, getUser[0].id);

      loggerInfo.log({
        level: "info",
        message: `${token} : new access token generated`,
      })
      return res.status(httpStatus.OK).json({
        access_token: newToken,
      });
    }

    return res.status(httpStatus.NOT_FOUND).send({ result: false });
  }
};

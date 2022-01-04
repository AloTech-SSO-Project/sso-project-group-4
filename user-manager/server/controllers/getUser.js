let mysql = require("mysql");
const axios = require("axios");
const express = require("express");
const cookieParser = require("cookie-parser");
const {
  getAllUsers,
  getUser,
  crtUser,
  updtUser,
  dltUser,
} = require("../models/Users");
const { verifyToken } = require("../utils/helper");

const app = express();

// Middleware
app.use(cookieParser());

exports.getListOfUsers = async (req, res) => {
  //get token
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Please sign in" });
  }
  try {
    //check token
    const verifyResult = await verifyToken(token);
    //if user's type is admin, allowed
    if (verifyResult.user_type == "Admin") {
      try {
        // get all users from DB
        const result = await getAllUsers();
        return res.status(200).json(result);
      } catch (err) {
        return res.json(err);
      }
    } else {
      //if user's type is not admin, not allowed
      return res.status(401).json({ message: "You are not authorized" });
    }
  } catch (err) {
    //if token expired
    if (err.name == "TokenExpiredError") {
      //Send request to SSO-auth for renew token
      axios
        .post("http://localhost:3010/isAccessTokenValid", {
          access_token: token,
        })
        .then((response) => {
          return res
            .status(200)
            .json({ access_token: response.data.access_token });
        })
        .catch((err) => console.log(err));
    } else {
      return res.status(401).json({ message: "Please sign in" });
    }
  }
};

exports.getUserInfo = async (req, res) => {
  //get token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Please sign in" });
  }
  try {
    //check token
    const verifyResult = await verifyToken(token);
    try {
      const userId = verifyResult.id;
      // get user info from DB with id
      const user = await getUser(userId);
      // send user's info
      return res.status(200).json({
        status: "success",
        data: user[0],
      });
    } catch (err) {
      if (err == "User not found") {
        res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: err,
        });
      }
    }
  } catch (err) {
    //if token expired
    if (err.name == "TokenExpiredError") {
      //Send request to SSO-auth for renew token
      axios
        .post("http://localhost:3010/isAccessTokenValid", {
          access_token: token,
        })
        .then((response) => {
          return res.status(401).json({
            message: "Your session refreshed try again.",
            access_token: response.data.access_token,
          });
        });
    } else {
      return res.status(401).json({ message: "Please sign in" });
    }
  }
};

exports.createUser = async (req, res) => {
  //get informations from body
  const {
    username,
    user_name,
    user_surname,
    user_email,
    user_password,
    user_type,
  } = req.body;
  //get token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "You are not authorized" });
  }
  try {
    //check token
    const verifyResult = await verifyToken(token);
    //if user's type is admin, allowed
    if (verifyResult.user_type == "Admin") {
      try {
        //add user to database
        await crtUser(
          username,
          user_name,
          user_surname,
          user_email,
          user_password,
          user_type
        );
        return res.status(201).json({
          status: "success",
        });
      } catch (err) {
        return res.status(404).json({
          message: "Failed Fields or Duplicate Error",
          status: "fail",
        });
      }
    } else {
      //if user's type is not admin, not allowed
      return res.status(401).json({ message: "You are not authorized" });
    }
  } catch (err) {
    //if token expired
    if (err.name == "TokenExpiredError") {
      //Send request to SSO-auth for renew token
      axios
        .post("http://localhost:3010/isAccessTokenValid", {
          access_token: token,
        })
        .then((response) => {
          return res.status(401).json({
            message: "Your session refreshed try again",
            access_token: response.data.access_token,
          });
        });
    } else {
      return res.status(401).json({ message: "You are not authorized" });
    }
  }
};

exports.updateUser = async (req, res) => {
  //get informations from body
  const {
    username,
    user_name,
    user_surname,
    user_email,
    user_password,
    user_type,
  } = req.body;
  //get token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Please sign in" });
  }
  try {
    //check token
    const verifyResult = await verifyToken(token);
    //if user's type is admin, allowed
    if (verifyResult.user_type == "Admin") {
      try {
        //get id from request url
        const { id } = req.params;
        //add user's new infomations to database
        await updtUser(
          id,
          username,
          user_name,
          user_surname,
          user_email,
          user_password,
          user_type
        );
        return res.status(200).json({
          status: "success",
        });
      } catch (err) {
        return res.status(404).json({
          message: err,
          status: "fail",
        });
      }
    } else {
      //if user's type is not admin, not allowed
      return res.status(401).json({ message: "You are not authorized" });
    }
  } catch (err) {
    //if token expired
    if (err.name == "TokenExpiredError") {
      //Send request to SSO-auth for renew token
      axios
        .post("http://localhost:3010/isAccessTokenValid", {
          access_token: token,
        })
        .then((response) => {
          return res.status(401).json({
            message: "Your session refreshed try again",
            access_token: response.data.access_token,
          });
        });
    } else {
      return res.status(401).json({ message: "Please sign in" });
    }
  }
};

exports.deleteUser = async (req, res) => {
  //get token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Please sign in" });
  }
  try {
    //check token
    const verifyResult = await verifyToken(token);
    if (verifyResult.user_type == "Admin") {
      try {
        //get id from request url
        const { id } = req.params;
        //delete user from database
        await dltUser(id);
        return res.status(200).json({
          status: "success",
        });
      } catch (err) {
        return res.status(404).json({
          message: err,
          status: "fail",
        });
      }
    } else {
      //if user's type is not admin, not allowed
      return res.status(401).json({ message: "You are not authorized" });
    }
  } catch (err) {
    //if token expired
    if (err.name == "TokenExpiredError") {
      //Send request to SSO-auth for renew token
      axios
        .post("http://localhost:3010/isAccessTokenValid", {
          access_token: token,
        })
        .then((response) => {
          return res.status(401).json({
            message: "Your session refreshed try again",
            access_token: response.data.access_token,
          });
        });
    } else {
      return res.status(401).json({ message: "Please sign in" });
    }
  }
};

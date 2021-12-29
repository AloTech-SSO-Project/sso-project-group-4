let mysql = require("mysql");
const axios = require("axios");
const {
  getAllUsers,
  getUser,
  crtUser,
  updtUser,
  dltUser,
} = require("../models/Users");

const { verifyToken } = require("../utils/helper");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

exports.getListOfUsers = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Please sign in" });
  }
  try {
    const verifyResult = await verifyToken(token);

    if (verifyResult.user_type == "Admin") {
      try {
        const result = await getAllUsers();
        return res.status(200).json(result);
      } catch (err) {
        return res.json(err);
      }
    } else {
      return res.status(401).json({ message: "You are not authorized" });
    }
  } catch (err) {
    if (err.name == "TokenExpiredError") {
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
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Please sign in" });
  }
  try {
    const verifyResult = await verifyToken(token);
    try {
      const userId = verifyResult.id;
      const user = await getUser(userId);
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
    if (err.name == "TokenExpiredError") {
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
  const {
    username,
    user_name,
    user_surname,
    user_email,
    user_password,
    user_type,
  } = req.body;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "You are not authorized" });
  }
  try {
    const verifyResult = await verifyToken(token);
    if (verifyResult.user_type == "Admin") {
      try {
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
      return res.status(401).json({ message: "You are not authorized" });
    }
  } catch (err) {
    if (err.name == "TokenExpiredError") {
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
  const {
    username,
    user_name,
    user_surname,
    user_email,
    user_password,
    user_type,
  } = req.body;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Please sign in" });
  }
  try {
    const verifyResult = await verifyToken(token);
    if (verifyResult.user_type == "Admin") {
      try {
        const { id } = req.params;
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
      return res.status(401).json({ message: "You are not authorized" });
    }
  } catch (err) {
    if (err.name == "TokenExpiredError") {
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
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Please sign in" });
  }
  try {
    const verifyResult = await verifyToken(token);
    if (verifyResult.user_type == "Admin") {
      try {
        const { id } = req.params;
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
      return res.status(401).json({ message: "You are not authorized" });
    }
  } catch (err) {
    if (err.name == "TokenExpiredError") {
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

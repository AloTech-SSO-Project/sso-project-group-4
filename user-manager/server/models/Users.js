const mysql = require("mysql");
var { DB_CONFIG } = require("../config.js");

// SQL prosedures
const crtUser = (
  username,
  user_name,
  user_surname,
  user_email,
  user_password,
  user_type
) => {
  const connection = mysql.createConnection(DB_CONFIG);
  let sql = `CALL createUser('${username}', '${user_name}','${user_surname}','${user_password}','${user_email}','${user_type}')`;
  return new Promise((resolve, reject) => {
    connection.query(sql, true, (error, results, fields) => {
      if (error) {
        reject(error);
      }
      resolve();
      connection.end();
    });
  });
};

const dltUser = (user_id) => {
  const connection = mysql.createConnection(DB_CONFIG);
  let sql = `CALL deleteUser(${user_id})`;
  return new Promise((resolve, reject) => {
    connection.query(sql, true, (error, results, fields) => {
      if (error) {
        reject(error);
      }
      resolve();
      connection.end();
    });
  });
};

const updtUser = (
  user_id,
  username,
  user_name,
  user_surname,
  user_email,
  user_password,
  user_type
) => {
  const connection = mysql.createConnection(DB_CONFIG);
  let sql = `CALL updateUser(${user_id},'${username}','${user_name}','${user_surname}','${user_email}','${user_password}','${user_type}')`;
  return new Promise((resolve, reject) => {
    connection.query(sql, true, (error, results, fields) => {
      if (error) {
        reject(error);
      }
      resolve();
      connection.end();
    });
  });
};

const getAllUsers = () => {
  const connection = mysql.createConnection(DB_CONFIG);
  let sql = `CALL getListOfUsers()`;
  return new Promise((resolve, reject) => {
    connection.query(sql, true, (error, results, fields) => {
      if (error) {
        reject(error.message);
      }
      resolve({
        status: "success",
        data: results[0],
      });
      connection.end();
    });
  });
};

const getUser = (user_id) => {
  const connection = mysql.createConnection(DB_CONFIG);
  let sql = `CALL getUserInfo(${user_id})`;
  return new Promise((resolve, reject) => {
    connection.query(sql, true, (error, results, fields) => {
      if (error) {
        reject(error);
      }
      if (results.length == 0) {
        reject("User not found");
      } else {
        resolve(results[0]);
      }
      connection.end();
    });
  });
};

module.exports = {
  getAllUsers,
  getUser,
  crtUser,
  updtUser,
  dltUser,
};

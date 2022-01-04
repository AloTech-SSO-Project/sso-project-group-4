let mysql = require("mysql");
var { DB_CONFIG } = require("../config.js");

// SQL connections
const getOneUser = (username, salted_hash) => {
  let sql = `SELECT * FROM Users WHERE username="${username}" AND user_password="${salted_hash}"`;
  let connection = mysql.createConnection(DB_CONFIG);

  return new Promise((resolve, reject) => {
    connection.query(sql, true, function (error, results, fields) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
      connection.end();
    });
  });
};

const getUserWithToken = (token) => {
  let sql = `SELECT user_id FROM Tokens WHERE token="${token}"`;
  let connection = mysql.createConnection(DB_CONFIG);

  return new Promise((resolve, reject) => {
    connection.query(sql, true, function (error, results, fields) {
      if (error) {
        throw error;
      }
      resolve(JSON.parse(JSON.stringify(results)));
      connection.end();
    });
  });
};

const getUserWithId = (id) => {
  let sql = `CALL getUserInfo(${id})`;
  let connection = mysql.createConnection(DB_CONFIG);

  return new Promise((resolve, reject) => {
    connection.query(sql, true, function (error, results, fields) {
      if (error) {
        throw error;
      }
      resolve(JSON.parse(JSON.stringify(results[0])));
      connection.end();
    });
  });
};

const setToken = (token, id) => {
  let sql = `INSERT INTO Tokens(token,user_id) VALUES ("${token}",${id})`;
  let connection = mysql.createConnection(DB_CONFIG);

  return new Promise((resolve, reject) => {
    connection.query(sql, true, function (error, results, fields) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
      connection.end();
    });
  });
};

const updateToken = (token, id) => {
  let sql = `UPDATE Tokens SET token="${token}" WHERE user_id=${id}`;
  let connection = mysql.createConnection(DB_CONFIG);

  return new Promise((resolve, reject) => {
    connection.query(sql, true, function (error, results, fields) {
      if (error) {
        throw error;
      }
      resolve();
      connection.end();
    });
  });
};

module.exports = {
  getOneUser,
  getUserWithToken,
  getUserWithId,
  setToken,
  updateToken,
};

import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import axios from "axios";
var SHA256 = require("crypto-js/sha256");

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = () => {
      axios
        .get("http://localhost:3000/listuser")
        .then((res) => {
          if (JSON.stringify(res.data.data) === JSON.stringify(users)) {
            return;
          } else {
            setUsers(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchUsers();
  }, [users]);

  const addUser = async (values) => {
    setUsers([...users, values]);
    axios
      .post("http://localhost:3000/createuser", {
        ...values,
        user_password: SHA256("alotech" + values.user_password).toString(),
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUser = (values) => {
    setUsers(
      users.map((user) => (user.id === parseInt(values.id) ? values : user))
    );
    axios
      .put(`http://localhost:3000/updateuser/${values.id}`, {
        ...values,
        user_password: SHA256("alotech" + values.user_password).toString(),
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteUser = (userid) => {
    axios.get(`http://localhost:3000/deleteuser/${userid}`);
    setUsers(users.filter((user) => user.id !== userid));
  };

  return (
    <div className="container">
      <Routes>
        <Route
          path="/"
          element={
            <UserList
              users={users}
              updateUser={updateUser}
              deleteUser={deleteUser}
            />
          }
        />
        <Route
          path="/adduser"
          element={<AddUser users={users} addUser={addUser} />}
        />
      </Routes>
    </div>
  );
};

export default App;

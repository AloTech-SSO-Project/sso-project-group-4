import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import axios from "axios";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

var SHA256 = require("crypto-js/sha256");
const App = () => {
  const [users, setUsers] = useState([]);
  const [cookies, setCookie] = useCookies([]);
  const [load, setLoad] = useState(false);
  const [admin, setAdmin] = useState("");

  const cookieref = useRef("");

  useEffect(async () => {
    if (!cookies.access_token) {
      // if token is not exist redirect to SSO-auth client (login page)
      window.location.href = `http://localhost:4000/`;
    } else {
      await axios
        // Check if token is valid
        .post("http://localhost:3010/isAccessTokenValid", {
          access_token: cookies.access_token,
        })
        .then((res) => {
          cookieref.current = res.data.access_token;
          setCookie("access_token", res.data.access_token, { path: "/" });
          // Decode token and get user type
          if (jwt_decode(res.data.access_token).user_type == "User") {
            // if user type is user, redirect to consumer
            window.location.href = "http://localhost:5001";
          } else {
            // if user type is admin, load page
            setAdmin(jwt_decode(res.data.access_token).id);
            setLoad(true);
          }
        });
    }

    await axios
      // Send get request to user-manager's server for get users list
      .get("http://localhost:3000/listuser", {
        headers: {
          Authorization: cookieref.current,
        },
      })
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
  }, [users]);
  const addUser = async (values) => {
    setUsers([...users, values]);
    axios
      // Send post request to user-manager's server for add user to DB
      .post(
        "http://localhost:3000/createuser",
        {
          ...values,
          user_password: SHA256("alotech" + values.user_password).toString(),
        },
        {
          headers: {
            Authorization: cookies.access_token,
          },
        }
      )
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUser = (values) => {
    setUsers(
      users.map((user) => (user.id === parseInt(values.id) ? values : user))
    );
    axios
      // Send put request to user-manager's server for update a user
      .put(
        `http://localhost:3000/updateuser/${values.id}`,
        {
          ...values,
        },
        {
          headers: {
            Authorization: cookies.access_token,
          },
        }
      )
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteUser = (userid) => {
    if (userid != admin) {
      // Send get request to user-manager's server for delete a user
      axios.get(`http://localhost:3000/deleteuser/${userid}`, {
        headers: {
          Authorization: cookies.access_token,
        },
      });
      setUsers(users.filter((user) => user.id !== userid));
    } else {
      alert("You Can't Delete Yourself");
    }
  };

  // Logout
  const logout = () => {
    setCookie("access_token", "", { path: "/" });
    window.location.href = "/";
  };

  return (
    <div className="container">
      {load && (
        <Routes>
          <Route
            path="/"
            element={
              <UserList
                users={users}
                updateUser={updateUser}
                deleteUser={deleteUser}
                logout={logout}
              />
            }
          />
          <Route
            path="/adduser"
            element={<AddUser users={users} addUser={addUser} />}
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
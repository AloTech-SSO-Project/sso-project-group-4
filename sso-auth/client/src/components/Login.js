import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./styles.css";

var SHA256 = require("crypto-js/sha256");

const Login = () => {
  const [values, setValues] = useState("");
  const [cookies, setCookie] = useCookies([]);
  const [load, setLoad] = useState(false);

  const { handleSubmit, handleChange, handleBlur, errors, touched } = useFormik(
    {
      initialValues: {
        username: "",
        user_password: "",
      },
      onSubmit: (values) => {
        axios
          // Hash password with SHA256
          .post("http://localhost:3010/", {
            username: values.username,
            salted_hash: SHA256("alotech" + values.user_password).toString(),
          })
          .then((res) => {
            // if user matched in DB, set token to cookie and redirect to consumer
            if (res.data.result === true) {
              setCookie("access_token", res.data.Access_Token);
              window.location.href = `http://localhost:5001/`;
            } else {
              alert(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      // Validation with formik
      validationSchema: Yup.object({
        username: Yup.string().min(5).max(20).required(),
        user_password: Yup.string()
          .required("password is a required field")
          .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.,:#?!@$%^&*-]).{8,}$/,
            "password must contain 8 characters, at least one letter, one number and one special character"
          ),
      }),
    }
  );

  return (
    <form className="box" onSubmit={handleSubmit}>
      <h1>Login</h1>
      <p className="text-muted">Please enter your username and password!</p>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        onBlur={handleBlur}
        className="mb-1"
      />
      {errors.username && touched.username && (
        <div className="text-danger">{errors.username}</div>
      )}
      <input
        type="password"
        name="user_password"
        placeholder="Password"
        onChange={handleChange}
        onBlur={handleBlur}
        className="mb-1"
      />
      {errors.user_password && touched.user_password && (
        <div className="text-danger">{errors.user_password}</div>
      )}
      <input type="submit" name="" value="Login" href="#" />
    </form>
  );
};

export default Login;

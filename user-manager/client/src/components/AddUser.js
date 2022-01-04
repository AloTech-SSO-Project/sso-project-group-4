import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

const AddUser = ({ addUser, users }) => {
  const navigate = useNavigate();
  // Create custom validation to formik for unique e-mail
  yup.addMethod(yup.string, "uniqueEmail", function (message) {
    return this.test("uniqueEmail", message, function (value) {
      if (users.filter((user) => user.user_email === value).length > 0) {
        return false;
      }
      return true;
    });
  });
  // Create custom validation to formik for unique username
  yup.addMethod(yup.string, "uniqueUsername", function (message) {
    return this.test("uniqueUsername", message, function (value) {
      if (users.filter((user) => user.username === value).length > 0) {
        return false;
      }
      return true;
    });
  });

  const { handleSubmit, handleChange, handleBlur, errors, touched } = useFormik(
    {
      initialValues: {
        user_type: "",
        username: "",
        user_name: "",
        user_surname: "",
        user_email: "",
        user_password: "",
      },
      onSubmit: (values) => {
        addUser(values);
        navigate("/");
      },
      validationSchema: yup.object().shape({
        user_type: yup.string().required("user type is a required field"),
        username: yup
          .string()
          .min(5)
          .required()
          .uniqueUsername("Username already exists"),
        user_name: yup
          .string()
          .min(5, "name must be at least 5 characters")
          .required("name is a required field"),
        user_surname: yup
          .string()
          .min(5, "surname must be at least 5 characters")
          .required("surname is a required field"),
        user_email: yup
          .string()
          .email("please enter a valid email")
          .required("email is a required field")
          .uniqueEmail("Email already exists"),
        user_password: yup
          .string()
          .required("password is a required field")
          .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.,:#?!@$%^&*-]).{8,}$/,
            "password must contain 8 characters, at least one letter, one number and one special character"
          ),
      }),
    }
  );

  return (
    <form style={{ padding: "50px 200px" }} onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <select
          name="user_type"
          className="form-control"
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Select user type</option>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        {errors.user_type && touched.user_type && (
          <div className="error">{errors.user_type}</div>
        )}
      </div>
      <div className="form-group">
        <input
          type="text"
          name="username"
          className="form-control"
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Username"
        />
        {errors.username && touched.username && (
          <div className="error">{errors.username}</div>
        )}
      </div>
      <div className="form-group">
        <input
          type="text"
          name="user_name"
          className="form-control"
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Name"
        />
        {errors.user_name && touched.user_name && (
          <div className="error">{errors.user_name}</div>
        )}
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          name="user_surname"
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Surname"
        />
        {errors.user_surname && touched.user_surname && (
          <div className="error">{errors.user_surname}</div>
        )}
      </div>
      <div className="form-group">
        <input
          type="email"
          name="user_email"
          className="form-control"
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {errors.user_email && touched.user_email && (
          <div className="error">{errors.user_email}</div>
        )}
      </div>
      <div className="form-group">
        <input
          type="password"
          id="exampleInputPassword"
          name="user_password"
          className="form-control"
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {errors.user_password && touched.user_password && (
          <div className="error">{errors.user_password}</div>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-block w-50 d-inline-block"
        style={{ maxWidth: "49%" }}
      >
        Add
      </button>
      <Link
        to="/"
        className="btn btn-danger btn-block mt-0 d-inline-block"
        style={{ maxWidth: "49%", float: "right" }}
      >
        Cancel
      </Link>
    </form>
  );
};

export default AddUser;

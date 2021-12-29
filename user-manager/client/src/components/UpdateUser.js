import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

const UpdateUser = ({ user, handleClose, updateUser, users }) => {
  yup.addMethod(yup.string, "uniqueEmail", function (message) {
    return this.test("uniqueEmail", message, function (value) {
      if (
        users
          .filter((u) => u.user_email == values.user_email)
          .filter((u) => u.id != user.id).length > 0
      ) {
        return false;
      }
      return true;
    });
  });

  yup.addMethod(yup.string, "uniqueUsername", function (message) {
    return this.test("uniqueUsername", message, function (value) {
      if (
        users
          .filter((u) => u.username == values.username)
          .filter((u) => u.id != user.id).length > 0
      ) {
        return false;
      }
      return true;
    });
  });

  const { handleSubmit, handleChange, handleBlur, errors, touched, values } =
    useFormik({
      initialValues: user,
      onSubmit: (values) => {
        updateUser(values);
        handleClose();
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
        user_password: yup.string().required("password is a required field"),
      }),
    });
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <select
          name="user_type"
          className="form-control"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.user_type}
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
          value={values.username}
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
          value={values.user_name}
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
          value={values.user_surname}
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
          value={values.user_email}
        />
        {errors.user_email && touched.user_email && (
          <div className="error">{errors.user_email}</div>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-success btn-block w-50 d-inline-block"
        style={{ maxWidth: "49%" }}
      >
        Update
      </button>
      <button
        type="button"
        className="btn btn-danger btn-block mt-0 d-inline-block"
        style={{ maxWidth: "49%", float: "right" }}
        onClick={handleClose}
      >
        Cancel
      </button>
    </form>
  );
};

export default UpdateUser;

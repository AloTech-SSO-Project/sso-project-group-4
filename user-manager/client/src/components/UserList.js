import React, { useState } from "react";
import { Link } from "react-router-dom";
import User from "./User";
import { v4 as uuidv4 } from "uuid";
import Pagination from "./Pagination";

const UserList = ({ users, deleteUser, updateUser, logout }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-responsive">
      <div className="table-wrapper">
        <div className="table-title" style={{ backgroundColor: "#6C7AE0" }}>
          <div className="row ">
            <div className="col-sm-6">
              <h2>
                <b>Users</b>
              </h2>
            </div>
            <div className="col-sm-6">
              <button className="btn btn-danger" onClick={() => logout()}>
                <i className="material-icons">logout</i> <span>Logout</span>
              </button>
              <Link to="/adduser" className="btn btn-success">
                <i className="material-icons">&#xE147;</i>{" "}
                <span>Add New User</span>
              </Link>
            </div>
          </div>
        </div>
        <table className="table table-striped table-hover">
          <thead>
            <tr className="text-center">
              <th>User Type</th>
              <th>Username</th>
              <th>Name</th>
              <th>Surname</th>
              <th>E-Mail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <User
                key={uuidv4()}
                user={user}
                deleteUser={deleteUser}
                updateUser={updateUser}
                users={users}
              />
            ))}
          </tbody>
        </table>
        <Pagination
          totalUsers={users.length}
          usersPerPage={usersPerPage}
          currentPage={currentPage}
          currentUsers={currentUsers}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default UserList;

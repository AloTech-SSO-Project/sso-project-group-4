import React, { useState } from "react";
import UpdateUser from "./UpdateUser";
import { Modal, ModalBody } from "reactstrap";

const User = ({ user, deleteUser, updateUser, users }) => {
  const userid = user.id;
  const handleDelete = () => {
    deleteUser(userid);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <tr className="text-center">
        <td>
          {user.user_type === "Admin" ? (
            <strong>{user.user_type}</strong>
          ) : (
            user.user_type
          )}
        </td>
        <td>{user.username}</td>
        <td>{user.user_name}</td>
        <td>{user.user_surname}</td>
        <td>{user.user_email}</td>
        <td width="110">
          <button className="btn text-warning btn-act" onClick={handleShow}>
            <i className="material-icons" title="Edit">
              &#xE254;
            </i>
          </button>
          <button className="btn text-danger btn-act" onClick={handleDelete}>
            <i className="material-icons" title="Delete">
              &#xE872;
            </i>
          </button>
        </td>
      </tr>
      <Modal fade={false} isOpen={show} toggle={handleClose}>
        <ModalBody>
          <UpdateUser
            user={user}
            handleClose={handleClose}
            updateUser={updateUser}
            users={users}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default User;

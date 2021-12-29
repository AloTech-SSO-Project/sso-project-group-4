import React, { useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

function App() {
  const [cookies, setCookie] = useCookies([]);
  const [user, setUser] = useState([]);
  const [load, SetLoad] = useState(false);
  const cookieref = useRef("");

  useEffect(() => {
    if (!cookies.access_token) {
      // if cookie is set, redirect to home
      window.location.href = `http://localhost:4000/?redirectURL=${window.location.href}`;
    } else {
      let index;
      const fetchData = async () => {
        const respGlobal = await axios
          .post("http://localhost:3010/isAccessTokenValid", {
            access_token: cookies.access_token,
          })
          .then((res) => {
            cookieref.current = res.data.access_token;
            setCookie("access_token", res.data.access_token, { path: "/" });
            if (jwt_decode(res.data.access_token).user_type == "Admin") {
              window.location.href = "http://localhost:3001";
            } else {
              SetLoad(true);
            }
            index = jwt_decode(res.data.access_token).id;
          });
        const x = await axios
          .get(`http://localhost:3000/user/${index}`, {
            headers: {
              Authorization: cookieref.current,
            },
          })
          .then((res) => {
            setUser(res.data.data);
          });
      };

      fetchData();
    }
  }, []);

  onsubmit = (e) => {
    e.preventDefault();
    setCookie("access_token", "", { path: "/" });
    window.location.href = "/";
  };

  return (
    <div>
      {load && (
        <div className="page-content page-container" id="page-content">
          <div className="padding">
            <div className="row container-fluid d-flex justify-content-center mt-5">
              <div className="col-xl-8 col-md-12">
                <div className="card user-card-full">
                  <div className="row m-l-0 m-r-0">
                    <div className="col-sm-4 bg-c-lite-green user-profile">
                      <div className="card-block text-center text-white">
                        <div className="mt-4">
                          {" "}
                          <img
                            src="https://img.icons8.com/bubbles/100/000000/user.png"
                            className="img-radius"
                            alt="User-Profile-Image"
                          />{" "}
                        </div>
                        <h5 className="f-w-600 mt-2">{user.username}</h5>
                        <i className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16" />
                        <button
                          onClick={onsubmit}
                          className="btn btn-danger btn-md mt-2"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                    <div className="col-sm-8">
                      <div className="card-block">
                        <h6 className="m-b-20 p-b-5 b-b-default f-w-600">
                          Information
                        </h6>
                        <div className="row">
                          <div className="col-sm-6">
                            <p className="m-b-10 f-w-600">Name</p>
                            <h6 className="text-muted f-w-400">
                              {user.user_name}
                            </h6>
                          </div>
                          <div className="col-sm-6">
                            <p className="m-b-10 f-w-600">Surname</p>
                            <h6 className="text-muted f-w-400">
                              {user.user_surname}
                            </h6>
                          </div>
                        </div>
                        <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600"></h6>
                        <div className="row">
                          <div className="col-sm-6">
                            <p className="m-b-10 f-w-600">Email</p>
                            <h6 className="text-muted f-w-400">
                              {user.user_email}
                            </h6>
                          </div>
                          <div className="col-sm-6">
                            <p className="m-b-10 f-w-600">User Type</p>
                            <h6 className="text-muted f-w-400">
                              {user.user_type}
                            </h6>
                          </div>
                        </div>
                        <ul className="social-link list-unstyled m-t-40 m-b-10">
                          <li>
                            <a
                              href="#!"
                              data-toggle="tooltip"
                              data-placement="bottom"
                              title
                              data-original-title="facebook"
                              data-abc="true"
                            >
                              <i
                                className="mdi mdi-facebook feather icon-facebook facebook"
                                aria-hidden="true"
                              />
                            </a>
                          </li>
                          <li>
                            <a
                              href="#!"
                              data-toggle="tooltip"
                              data-placement="bottom"
                              title
                              data-original-title="twitter"
                              data-abc="true"
                            >
                              <i
                                className="mdi mdi-twitter feather icon-twitter twitter"
                                aria-hidden="true"
                              />
                            </a>
                          </li>
                          <li>
                            <a
                              href="#!"
                              data-toggle="tooltip"
                              data-placement="bottom"
                              title
                              data-original-title="instagram"
                              data-abc="true"
                            >
                              <i
                                className="mdi mdi-instagram feather icon-instagram instagram"
                                aria-hidden="true"
                              />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

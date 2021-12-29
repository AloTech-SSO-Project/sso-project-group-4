import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import { useCookies } from "react-cookie";

const App = () => {
  const [load, setLoad] = useState(false);
  const [cookies, setCookie] = useCookies([]);

  useEffect(() => {
    if (cookies.access_token) {
      window.location.href = `http://localhost:5001`;
    } else {
      setLoad(true);
    }
  }, []);
  return (
    <div className="container">
      {load && (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <Login />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

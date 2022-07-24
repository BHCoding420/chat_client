import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotLoggedIn from "./NotLoggedIn/NotLoggedIn";
import LoggedIn from "./LoggedIn/LoggedIn";
import { jwtdecoder } from "../../utils/utils";
import axios from "axios";

const Homepage = () => {
  useEffect(() => {
    let x = document.cookie;
    if (x) {
      console.log(x);
      console.log(jwtdecoder(x).user);
      x &&
        axios
          .post(`${import.meta.env.VITE_APP_BACKEND}/users/jwt`, x)
          .then((res) => {
            console.log(res);
            if (!res.data.error) {
              setUser(jwtdecoder(x).user);
            } else {
              setjwthasexpired(true);
            }
          })
          .catch((err) => {
            console.log(err.response);
          });
    }
  }, []);

  const [User, setUser] = useState(null);
  const navigate = useNavigate();
  const [jwthasexpired, setjwthasexpired] = useState(false);

  return (
    <>
      {User ? (
        <LoggedIn User={User} />
      ) : (
        <NotLoggedIn jwthasexpired={jwthasexpired} />
      )}
    </>
  );
};

export default Homepage;

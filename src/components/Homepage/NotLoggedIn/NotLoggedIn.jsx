import React from "react";
// or less ideally
import { useNavigate } from "react-router-dom";
import "./NotLoggedIn.css";
import { Button } from "react-bootstrap";
import { styles } from "./NotLoggedIn.styles";

const NotLoggedIn = ({ jwthasexpired }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.notLoggedInMenu}>
      <div style={styles.notLoggedInMenuOptions}>
        {console.log(jwthasexpired)}
        {jwthasexpired && <p>session expired</p>}
        <Button
          className="btn-lg"
          style={styles.options}
          onClick={() => navigate("/login")}
        >
          Log in
        </Button>
        <Button
          className="btn-lg"
          style={styles.options}
          onClick={() => navigate("/signup")}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default NotLoggedIn;

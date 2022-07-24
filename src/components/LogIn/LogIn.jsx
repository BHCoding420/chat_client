import React, { useState } from "react";
import { styles } from "./LogIn.styles";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogIn = () => {
  const [UserData, setUserData] = useState({ Email: "", Password: "" });
  const [Error, setError] = useState("");
  const handleChange = (e) => {
    setUserData({ ...UserData, [e.target.name]: e.target.value });
  };
  const Msg = ({ closeToast, toastProps }) => (
    <div>
      <h5>Email successfully sent</h5>
      <p
        onClick={() => {
          axios
            .get(
              `${import.meta.env.VITE_APP_BACKEND}/users/sendEmail/${
                UserData.Email
              }`
            )
            .then((res) => {
              console.log(res);
              toast.success(<Msg />, {
                position: toast.POSITION.TOP_RIGHT,
              });
            });
        }}
      >
        resend mail
      </p>
    </div>
  );

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    await axios
      .post(`${import.meta.env.VITE_APP_BACKEND}/users/login`, {
        user: UserData,
      })
      .then((response) => {
        console.log(response);
        if (response.data.error) {
          const error = response.data.error;
          if (error) {
            setError(error);
          }
          return;
        }
        document.cookie = `user=${response.data.token}`;
        navigate("/");
      });
  };
  return (
    <form style={styles.SignUpForm} onSubmit={(e) => handleSubmit(e)}>
      <h3>{Error}</h3>
      <ToastContainer autoClose={false} />
      {Error === "user not verified,click the link to verify" && (
        <p
          onClick={() => {
            axios
              .get(
                `${import.meta.env.VITE_APP_BACKEND}/users/sendEmail/${
                  UserData.Email
                }`
              )
              .then((res) => {
                console.log(res);
                toast.success(<Msg />, {
                  position: toast.POSITION.TOP_RIGHT,
                });
              });
          }}
        >
          send verification email
        </p>
      )}
      <div className="form-group d-flex my-2" style={styles.SignUpFormOptions}>
        <label
          for="inputPassword"
          className="col-sm-2 col-form-label"
          style={styles.leftAlign}
        >
          E-mail
        </label>
        <div className="col-sm-6">
          <input
            type="Email"
            className="form-control"
            id="inputEmail"
            placeholder="your email here"
            name="Email"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
      {/*password entry*/}
      <div className="form-group d-flex my-2" style={styles.SignUpFormOptions}>
        <label
          for="inputPassword"
          className="col-sm-2 col-form-label"
          style={styles.leftAlign}
        >
          Password
        </label>
        <div className="col-sm-6">
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            placeholder="Password"
            name="Password"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
      ;<Button type="submit">Log in</Button>
    </form>
  );
};

export default LogIn;

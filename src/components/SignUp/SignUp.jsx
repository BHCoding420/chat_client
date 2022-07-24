import React, { useState } from "react";
import { styles } from "./SignUp.styles";
import { Button } from "react-bootstrap";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [error, seterror] = useState("");
  const [NewUser, setNewUser] = useState({
    ID: "",
    FirstName: "",
    LastName: "",
    Address: "",
    City: "",
    PLZ: "",

    Email: "",
    Password: "",
    isVerified: false,
  });
  const Msg = ({ closeToast, toastProps }) => (
    <div>
      <h5>Email successfully sent</h5>
      <p
        onClick={() => {
          axios
            .get(
              `${import.meta.env.VITE_APP_BACKEND}/users/sendEmail/${
                NewUser.Email
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

  const handleChange = (e) => {
    setNewUser({ ...NewUser, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    seterror("");
    const res = NewUser;

    res.ID = Math.round(Math.floor(Math.random() * 1000) / 10);
    NewUser.ID = res.ID;
    console.log(res);
    const data = axios
      .post(`${import.meta.env.VITE_APP_BACKEND}/users/add`, { user: res })
      .then((response) => {
        console.log("result of add :");
        console.log(response);

        const sendemail = axios
          .get(
            `${import.meta.env.VITE_APP_BACKEND}/users/sendEmail/${res.Email}`
          )
          .then((res) => {
            console.log(res);
            toast.success(<Msg />, {
              position: toast.POSITION.TOP_RIGHT,
            });
          });
      })
      .catch((err) => {
        console.log(err.response.data.error);
        seterror(err.response.data.error);
      });
    console.log(data);
  };

  return (
    <form style={styles.SignUpForm} onSubmit={(e) => handleSubmit(e)}>
      <h6>{error}</h6>
      <ToastContainer autoClose={false} />
      {/*Name entry*/}
      <div className="form-group d-flex my-2" style={styles.SignUpFormOptions}>
        <div className="d-flex">
          <label
            htmlFor="FirstName"
            className="col-sm-4 col-form-label"
            style={styles.leftAlign}
          >
            First Name
          </label>
          <div className="col-sm-6">
            <input
              type="text"
              className="form-control"
              id="staticEmail"
              placeHolder="name"
              name="FirstName"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="d-flex">
          <label
            htmlFor="LastName"
            className="col-sm-4 col-form-label"
            style={styles.leftAlign}
          >
            Last Name
          </label>
          <div className="col-sm-6">
            <input
              type="text"
              className="form-control"
              id="staticEmail"
              placeHolder="family"
              name="LastName"
              onChange={(e) => handleChange(e)}
            />
          </div>
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
      ;{/*address entry*/}
      <div className="form-group d-flex my-2" style={styles.SignUpFormOptions}>
        <label
          for="inputAddress"
          className="col-sm-2 col-form-label"
          style={styles.leftAlign}
        >
          Address
        </label>
        <div className="col-sm-6">
          <input
            type="text"
            className="form-control"
            id="inputPassword"
            placeholder="address"
            name="Address"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
      {/*email entry*/}
      <div className="form-group d-flex my-2" style={styles.SignUpFormOptions}>
        <label
          for="inputAddress"
          className="col-sm-2 col-form-label"
          style={styles.leftAlign}
        >
          Email
        </label>
        <div className="col-sm-6">
          <input
            type="text"
            className="form-control"
            id="inputPassword"
            placeholder="email"
            name="Email"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
      ;{/*City & PLZ entry*/}
      <div className="form-group d-flex my-2" style={styles.SignUpFormOptions}>
        <div className="d-flex">
          <label
            htmlFor="City"
            className="col-sm-4 col-form-label"
            style={styles.leftAlign}
          >
            City
          </label>
          <div className="col-sm-6">
            <input
              type="text"
              className="form-control"
              id="staticEmail"
              placeHolder="Beyrouth"
              name="City"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="d-flex">
          <label
            htmlFor="PLZ"
            className="col-sm-4 col-form-label"
            style={styles.leftAlign}
          >
            PLZ
          </label>
          <div className="col-sm-6">
            <input
              type="number"
              className="form-control"
              id="staticEmail"
              placeHolder="66600"
              name="PLZ"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
      </div>
      ;<Button type="submit">Register</Button>
    </form>
  );
};

export default SignUp;

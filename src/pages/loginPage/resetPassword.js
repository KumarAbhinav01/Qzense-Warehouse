import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import Button from "@mui/material/Button";
import agent from "../../agent";

import "react-phone-input-2/lib/material.css";

function ResetPassword({ setResetPassword, resetPassword }) {
  const [error, setError] = useState();
  const [phone, setPhone] = useState();
  const [loading, setLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    agent.Auth.resetPassword(phone)
      .then((res) => {
        console.log(res.data);
        setResetPassword("resetting");
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status !== 500) {
          setError(err.response.data);
        } else {
          setError("something went wrong");
        }
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="overlay overlay--popup">
      <div className="popup-form  login__forgot-password">
        <h2 className="popup-form__header">Reset Password</h2>
        <form onSubmit={submitHandler} className="login__forgot-password__form">
          <p>Enter Your Registered Phone Number:</p>
          <PhoneInput
            country={"in"}
            value={phone}
            onChange={(newPhone) => {
              setPhone(newPhone);
            }}
            className="phone-input phone-input--margin-dense"
            inputClass="phone-input__input"
            inputProps={{
              name: "phoneNumber",
              required: true,
              autoFocus: true,
            }}
            specialLabel="Phone *"
          />
          <div style={{ textAlign: "center" }}>
            <p>You will receive an OTP on your phone.</p>
          </div>
          <div className="popup-form__buttons">
            <Button
              variant="outlined"
              type="button"
              onClick={() => {
                setResetPassword(false);
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={resetPassword === "success" || loading}
            >
              {loading ? "Loading..." : "Confirm"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

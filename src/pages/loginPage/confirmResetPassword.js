import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import agent from "../../agent";

function ConfirmResetPassword({ setResetPassword }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();

    const submitData = {
      password: e.target.password.value,
      repassword: e.target.confirmPassword.value,
      code: e.target.otp.value,
    };

    agent.Auth.confirmResetPassowrd(submitData)
      .then((res) => {
        console.log(res.data);
        setResetPassword("success");
      })
      .catch((err) => {
        console.error(err);
        setError(err.response.data);
      });
  };

  return (
    <div className="overlay overlay--popup">
      <div className="popup-form  login__forgot-password">
        <h2 className="popup-form__header">Reset Password</h2>
        <form onSubmit={submitHandler} className="login__forgot-password__form">
          <FormHelperText error={error.message ? true : false} variant="filled">
            {error.message}
          </FormHelperText>
          <TextField
            variant="outlined"
            type="password"
            required
            fullWidth
            label="New Password"
            name="password"
            autoFocus
          />
          <TextField
            variant="outlined"
            type="password"
            required
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            label="OTP"
            name="otp"
          />
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
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Confirm"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmResetPassword;

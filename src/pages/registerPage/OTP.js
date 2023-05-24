import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import agent from "../../agent";

function OTP({ setRegisterState }) {
  const submitHandler = (e) => {
    e.preventDefault();

    agent.Auth.otp(e.target.otp.value)
      .then((res) => {
        console.log(res.data);
        setRegisterState("success");
      })
      .catch((err) => {
        console.error(err.response.data);
      });
  };
  return (
    <div className="overlay overlay--popup">
      <div className="popup-form">
        <h2 className="popup-form__header">Enter OTP</h2>
        <form onSubmit={submitHandler} style={{ width: "100%" }}>
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="OTP"
            name="otp"
            autoFocus
          />
          <div className="popup-form__buttons" style={{ marginTop: "10px" }}>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={() => {
                setRegisterState("registering");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OTP;

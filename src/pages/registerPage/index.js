import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import agent from "../../agent.js";

import Container from "@mui/material/Container";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import PhoneInput from "react-phone-input-2";

import "./styles.css";
import "react-phone-input-2/lib/material.css";
import logoPNG from "../../assets/qzense-logo.png";
import OTP from "./OTP.js";

function RegisterPage() {
  const [error, setError] = useState({});
  const [phone, setPhone] = useState();
  const [registerState, setRegisterState] = useState("registering");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    setRegisterState("loading");

    const registerData = {
      first_name: e.target.firstName.value,
      last_name: e.target.lastName.value,
      email: e.target.email.value,
      phone_number: `+${phone}`,
      password: e.target.password.value,
      password2: e.target.password2.value,
    };

    agent.Auth.register(registerData)
      .then((res) => {
        console.log(res.data);
        // alert("Please check your email to activate your account");
        setRegisterState("OTP");
      })
      .catch((err) => {
        setError(err.response.data);
        console.error(err.response.data);
        setRegisterState("registering");
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className="login">
        <img alt="Qzense logo" src={logoPNG} />
        <form onSubmit={submitHandler}>
          <FormHelperText
            error={error.loginError || error.phone_number ? true : false}
            variant="filled"
          >
            {error.loginError || error.phone_number}
          </FormHelperText>
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="First Name"
            name="firstName"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="Last Name"
            name="lastName"
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="Email Address"
            name="email"
            error={error.email ? true : false}
            helperText={error.email}
            autoComplete="email"
          />
          <PhoneInput
            country={"in"}
            value={phone}
            onChange={(newPhone) => {
              setPhone(newPhone);
            }}
            className="phone-input phone-input--margin-dense"
            inputClass="phone-input__input"
            inputProps={{ name: "phoneNumber", required: true }}
            specialLabel="Phone *"
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            error={error.password ? true : false}
            helperText={error.password}
          />
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            label="Confirm Password"
            name="password2"
            type="password"
            error={error.non_field_errors ? true : false}
            helperText={error.non_field_errors}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: "25px", mb: "15px" }}
            disabled={registerState === "loading"}
          >
            {registerState === "loading" ? "Loading..." : "Register"}
          </Button>
        </form>
        <div className="login__links">
          <Typography variant="body2" color="textSecondary">
            Already registered?{" "}
            <Link component={RouterLink} to="/login" underline="hover">
              Sign In
            </Link>
          </Typography>

          <Link
            component={RouterLink}
            to="/reset-password"
            underline="hover"
            variant="body2"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
      {registerState === "OTP" ? (
        <OTP setRegisterState={setRegisterState} />
      ) : null}
      <Dialog
        open={registerState === "success"}
        onClose={() => {
          setRegisterState("registering");
        }}
      >
        <DialogTitle>Registeration Successful</DialogTitle>
        <DialogContent>
          You may login now with your newly made account.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRegisterState("registering");
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setRegisterState("registering");
              navigate("/login");
            }}
          >
            Go To Login
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default RegisterPage;

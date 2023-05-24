import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import agent from "../../agent";
import { useDispatch } from "react-redux";
import { login } from "../../reducers/user";

import "./styles.css";
import logoPNG from "../../assets/qzense-logo.png";
import ResetPassword from "./resetPassword";
import ConfirmResetPassword from "./confirmResetPassword";

function LoginPage() {
  const [error, setError] = useState({});
  const [resetPassword, setResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    const loginData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    // agent.Auth.login(loginData)
    //   .then((res) => {
    //     console.log(res.data);
    //     agent.Auth.login(res.data.access)
    //       .then((res2) => {
    //         console.log(res2);
    //         dispatch(login({ ...res.data, ...res2.data }));
    //         setLoading(false);
    //         navigate("/");
    //       })
    //       .catch((err) => {
    //         console.error(err);
    //         setLoading(false);
    //       });
    //   })
      // .catch((err) => {
      //   console.log(err);
      //   setError(err.response.data);
      //   setLoading(false);
      // });
    agent.Auth.login(loginData)
      .then((res) => {
        console.log(res.data);
        dispatch(login(res.data));
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setError(err.response.data);
        setLoading(false);
      });
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <div className="login">
          <img alt="Qzense logo" src={logoPNG} />
          <form onSubmit={submitHandler}>
            <FormHelperText
              error={error.detail ? true : false}
              variant="filled"
            >
              {error.detail}
            </FormHelperText>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              error={error.email ? true : false}
              helperText={error.email}
              autoFocus
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: "25px", mb: "15px" }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </form>
          <div className="login__links">
            <Typography variant="body2" color="textSecondary">
              Not registered?{" "}
              <Link component={RouterLink} to="/register" underline="hover">
                Create an account
              </Link>
            </Typography>

            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              variant="body2"
              onClick={() => {
                setResetPassword("phone");
              }}
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </Container>
      {resetPassword === "phone" ? (
        <ResetPassword
          setResetPassword={setResetPassword}
          resetPassword={resetPassword}
        />
      ) : null}
      {resetPassword === "resetting" ? (
        <ConfirmResetPassword setResetPassword={setResetPassword} />
      ) : null}
      <Dialog
        open={resetPassword === "success"}
        onClose={() => {
          setResetPassword();
        }}
      >
        <DialogTitle>Reset Successful!</DialogTitle>
        <DialogContent>
          Your password has successfully been changed!
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setResetPassword();
            }}
          >
            Go To Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LoginPage;

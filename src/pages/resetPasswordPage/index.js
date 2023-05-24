import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import "./styles.css";
import logoPNG from "../../assets/qzense-logo.png";
import agent from "../../agent";

function ResetPasswordPage() {
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      uid,
      token,
      new_password: e.target.password.value,
      re_new_password: e.target.confirmPassword.value,
    };

    agent.Auth.confirmResetPassowrd(submitData)
      .then((res) => {
        console.log(res.data);
        setSuccess(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response.data);
      });
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
        <div className="reset-password">
          <img alt="Qzense logo" src={logoPNG} />
          <form onSubmit={submitHandler}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              label="New Password"
              name="password"
              error={error.password ? true : false}
              helperText={error.password}
              type="password"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              error={error.non_field_errors ? true : false}
              helperText={error.non_field_errors}
            />
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </div>
      </Container>
      <Dialog
        open={success}
        onClose={() => {
          setSuccess(false);
        }}
      >
        <DialogTitle>Reset Successful</DialogTitle>
        <DialogContent>
          Your password has successfully been reset!
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSuccess(false);
              navigate("/login");
            }}
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ResetPasswordPage;

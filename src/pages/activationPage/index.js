import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../../agent";
import Navbar from "../../components/navbar";
import { Link as RouterLink } from "react-router-dom";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import "./styles.css";

function ActivationPage() {
  const [activated, setActivated] = useState(false);
  const [dialog, setDialog] = useState(false);
  const { uid, token } = useParams();

  useEffect(() => {
    agent.Auth.activate(uid, token)
      .then((res) => {
        console.log(res);
        setActivated(true);
      })
      .catch((err) => {
        console.error(err);
        setDialog(true);
      });
  }, []);

  if (activated) {
    return (
      <>
        <Container className="activation">
          <div>Your account has been successfully activated!</div>
          <Button component={RouterLink} to="/login" variant="contained">
            Go to Login
          </Button>
        </Container>
      </>
    );
  } else {
    return (
      <Dialog
        open={dialog}
        onClose={() => {
          setDialog(false);
        }}
      >
        <DialogTitle>Activation Failed</DialogTitle>
        <DialogContent>
          Something went wrong, please check if this is the latest email we have
          sent
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialog(false);
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ActivationPage;

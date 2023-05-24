import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import agent from "./agent";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./reducers/user";

import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ActivationPage from "./pages/activationPage";
import PageNotFound from "./pages/pageNotFound";
import ResetPasswordPage from "./pages/resetPasswordPage";
import GateReporting from "./pages/homePage/GateReporting/GateReporting";
import TruckNumber from "./pages/homePage/TruckNumber/TruckNumber";

const theme = createTheme({
  palette: {
    primary: {
      main: "#164f5c",
    },
    secondary: {
      main: "#B9D0B5",
    },
    white: {
      main: "#FFFFFF",
    },
    good: {
      main: "#DFF2BF",
    },
    bad: {
      main: "#FFD2D2",
    },
  },
});

function App() {
  const [appLoading, setAppLoading] = useState(true);
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (access) {
      dispatch(
        login({
          access,
          refresh,
        })
      );
      setAppLoading(false);
    } else {
      setAppLoading(false);
      dispatch(logout());
    }
  }, []);
  
  // useEffect(() => {
  //   if (access) {
  //     agent.Auth.getUser(access)
  //       .then((res) => {
  //         dispatch(
  //           login({
  //             access,
  //             refresh: localStorage.getItem("refresh"),
  //             ...res.data,
  //           })
  //         );
  //         setAppLoading(false);
  //         console.log(res);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //         setAppLoading(false);
  //       });
  //   } else {
  //     setAppLoading(false);
  //     dispatch(logout());
  //   }
  // }, []);

  if (appLoading) {
    return <div>Loading</div>;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/activation/:uid/:token"
              element={<ActivationPage />}
            />
            <Route
              path="/password/reset/confirm/:uid/:token"
              element={<ResetPasswordPage />}
            />
            <Route
              path="/gate-reporting"
              element={<GateReporting />}
            />
            <Route
              path="/truck-number"
              element={<TruckNumber />}
            />
           
            {user.isAuthenticated ? (
              <>
                <Route path="/" element={<HomePage />} />
              </>
            ) : null}
            <Route
              path="*"
              element={
                user.isAuthenticated ? (
                  <PageNotFound />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;

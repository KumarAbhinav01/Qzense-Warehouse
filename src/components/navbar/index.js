import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reducers/user";
import AppBar from "@mui/material/AppBar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import "./styles.css";

function Navbar() {
  const user = useSelector((state) => state.user);
  const [userMenu, setUserMenu] = useState(null);
  const dispatch = useDispatch();

  return (
    <AppBar position="static" className="appbar">
      <div
        className="navbar-user"
        onClick={(e) => {
          setUserMenu(e.currentTarget);
        }}
      >
        {/* <div className="navbar-user__avatar">{user.user.firstName[0]}</div>
        <div className="navbar-user__name">Hello, {user.user.firstName}</div> */}
        <ArrowDropDownIcon />
      </div>
      <Menu
        sx={{ mt: "45px" }}
        anchorEl={userMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(userMenu)}
        onClose={() => {
          setUserMenu(null);
        }}
      >
        <MenuItem
          onClick={() => {
            dispatch(logout());
          }}
        >
          <Typography textAlign="center">Logout</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Navbar;

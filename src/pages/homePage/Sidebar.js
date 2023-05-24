import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import agent from "../../agent";
import { deleteField } from "../../reducers/user";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import EditField from "./EditField";
import Weather from "./Weather";
import About from "./About";
import SoilMoisture from "./SoilMoisture";
import SatelliteData from "./SatelliteData";
import UVI from "./UVI";

function Sidebar({ viewport, setViewport, activeField, setActiveField }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editField, setEditField] = useState();
  const [confirmDelete, setConfirmDelete] = useState();
  const [sidebarTab, setSidebarTab] = useState("Weather");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fieldDeleteHandler = (field) => {
    agent.Field.delete(field.id, localStorage.getItem("access"))
      .then((res) => {
        console.log(res);
        dispatch(deleteField(field));
        setConfirmDelete();
      })
      .catch((err) => {
        console.error(err);
        setConfirmDelete();
      });
  };

  if (window.innerWidth > 600) {
    return (
      <>
        <div className="home-sidebar">
          <div className="home-sidebar__tabs">
            <Tabs
              value={sidebarTab}
              onChange={(e, value) => {
                setSidebarTab(value);
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value="My Fields" label="My Fields" />
              <Tab value="Weather" label="Weather" />
              <Tab value="Satellite Data" label="Satellite Data" />
              <Tab value="UVI" label="UVI" />
              <Tab value="Soil Moisture" label="Soil Moisture" />
            </Tabs>
          </div>
          {sidebarTab === "Weather" ? (
            <Weather activeField={activeField} />
          ) : null}
          {sidebarTab === "My Fields" ? (
            <About activeField={activeField} />
          ) : null}
          {sidebarTab === "Soil Moisture" ? (
            <SoilMoisture activeField={activeField} />
          ) : null}
          {sidebarTab === "Satellite Data" ? (
            <SatelliteData activeField={activeField} />
          ) : null}
          {sidebarTab === "UVI" ? <UVI activeField={activeField} /> : null}
          <div className="home-sidebar__fields">
            <h2>My Fields</h2>
            {user.field.map((field) => (
              <div key={field.id} className="home-sidebar__fields__card">
                <span
                  className="home-sidebar__fields__card__name"
                  onClick={() => {
                    setViewport({
                      ...viewport,
                      longitude: field.center_coordinates[0],
                      latitude: field.center_coordinates[1],
                      zoom: 16,
                    });
                    setActiveField(field);
                  }}
                  style={field === activeField ? { color: "#72A06A" } : null}
                >
                  {field.field_name}
                </span>
                <div className="home-sidebar__fields__card__buttons">
                  <EditIcon
                    color="primary"
                    onClick={() => {
                      setEditField(field);
                    }}
                  />
                  <DeleteIcon
                    color="error"
                    onClick={() => {
                      setConfirmDelete(field);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {editField ? (
          <EditField editField={editField} setEditField={setEditField} />
        ) : null}
        <Dialog
          open={Boolean(confirmDelete)}
          onClose={() => {
            setConfirmDelete();
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete your field '
            {confirmDelete ? confirmDelete.field_name : null}'
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setConfirmDelete();
              }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                fieldDeleteHandler(confirmDelete);
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  } else {
    return (
      <>
        <Button
          className="home-mobile-sidebar-open-button"
          variant="contained"
          onClick={() => {
            setMobileOpen(true);
          }}
        >
          Open Drawer
        </Button>
        <Drawer
          anchor="bottom"
          open={mobileOpen}
          onClose={() => {
            setMobileOpen(false);
          }}
        >
          <div className="home-mobile-sidebar">
            {/* <Weather activeField={activeField} /> */}
            <div className="home-sidebar__tabs">
              <Tabs
                value={sidebarTab}
                onChange={(e, value) => {
                  setSidebarTab(value);
                }}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab value="My Fields" label="My Fields" />
                <Tab value="Weather" label="Weather" />
                <Tab value="Satellite Data" label="Satellite Data" />
                <Tab value="UVI" label="UVI" />
                <Tab value="Soil Moisture" label="Soil Moisture" />
              </Tabs>
            </div>
            {sidebarTab === "Weather" ? (
              <Weather activeField={activeField} />
            ) : null}
            {sidebarTab === "My Fields" ? (
              <About activeField={activeField} />
            ) : null}
            {sidebarTab === "Soil Moisture" ? (
              <SoilMoisture activeField={activeField} />
            ) : null}
            {sidebarTab === "Satellite Data" ? (
              <SatelliteData activeField={activeField} />
            ) : null}
            {sidebarTab === "UVI" ? <UVI activeField={activeField} /> : null}
            <div className="home-sidebar__fields">
              <h2>My Fields</h2>
              {user.field.map((field) => (
                <div key={field.id} className="home-sidebar__fields__card">
                  <span
                    className="home-sidebar__fields__card__name"
                    onClick={() => {
                      setViewport({
                        ...viewport,
                        longitude: field.field_coordinates.coordinates[0][0],
                        latitude: field.field_coordinates.coordinates[0][1],
                        zoom: 16,
                      });
                      setActiveField(field);
                    }}
                    style={field === activeField ? { color: "#72A06A" } : null}
                  >
                    {field.field_name}
                  </span>
                  <div className="home-sidebar__fields__card__buttons">
                    <EditIcon
                      color="primary"
                      onClick={() => {
                        setEditField(field);
                      }}
                    />
                    <DeleteIcon
                      color="error"
                      onClick={() => {
                        setConfirmDelete(field);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Drawer>
        {editField ? (
          <EditField editField={editField} setEditField={setEditField} />
        ) : null}
        <Dialog
          open={Boolean(confirmDelete)}
          onClose={() => {
            setConfirmDelete();
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete your field '
            {confirmDelete ? confirmDelete.field_name : null}'
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setConfirmDelete();
              }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                fieldDeleteHandler(confirmDelete);
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default Sidebar;

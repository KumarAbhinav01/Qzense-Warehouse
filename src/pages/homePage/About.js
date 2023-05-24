import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import AddHarvest from "./AddHarvest";
import AddFertiliser from "./AddFertiliser";
import AddPesticide from "./AddPesticide";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import agent from "../../agent";
import { useDispatch } from "react-redux";
import {
  deleteFertilizer,
  deleteHarvest,
  deletePesticide,
} from "../../reducers/user";

function About({ activeField }) {
  const [currentTab, setCurrentTab] = useState("Harvest");
  const [add, setAdd] = useState(false);

  if (activeField) {
    return (
      <>
        <div className="home-sidebar__top-box">
          <h2 className="home-sidebar__top-box__header">
            About {activeField.field_name}
          </h2>
          <p>Crop: {activeField.field_crop}</p>
          <p>Address: {activeField.field_address}</p>
          <p>Area: {Math.floor(activeField.field_area * 10) / 10} Hectares</p>
          <p>Bud Break: {activeField.bud_break}</p>
        </div>
        <div className="home-sidebar__about">
          <div className="home-sidebar__about__tabs-container">
            <Tabs
              value={currentTab}
              onChange={(e, value) => {
                setCurrentTab(value);
              }}
              variant="scrollable"
              scrollButtons="auto"
              className="home-sidebar__about__tabs"
            >
              <Tab value="Harvest" label="Harvest" />
              <Tab value="Pesticides" label="Pesticides" />
              <Tab value="Fertilisers" label="Fertilisers" />
            </Tabs>
          </div>
          {currentTab === "Harvest" ? (
            <Harvest activeField={activeField} setAdd={setAdd} />
          ) : null}
          {currentTab === "Pesticides" ? (
            <Pesticide activeField={activeField} setAdd={setAdd} />
          ) : null}
          {currentTab === "Fertilisers" ? (
            <Fertiliser activeField={activeField} setAdd={setAdd} />
          ) : null}
        </div>
        {add && currentTab === "Harvest" ? (
          <AddHarvest activeField={activeField} setAdd={setAdd} />
        ) : null}
        {add && currentTab === "Pesticides" ? (
          <AddPesticide activeField={activeField} setAdd={setAdd} />
        ) : null}
        {add && currentTab === "Fertilisers" ? (
          <AddFertiliser activeField={activeField} setAdd={setAdd} />
        ) : null}
      </>
    );
  } else return null;
}

function Pesticide({ activeField, setAdd }) {
  const [expand, setExpand] = useState();
  const dispatch = useDispatch();

  const pesticideDeleteHandler = (pesticide) => {
    agent.Pesticide.delete(pesticide.id, localStorage.getItem("access"))
      .then((res) => {
        dispatch(deletePesticide(pesticide));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (activeField.pesticide[0]) {
    return (
      <div className="home-sidebar__about__list-container">
        {activeField.pesticide.map((current) => {
          return (
            <Accordion
              className="home-sidebar__about__list-card"
              key={current.id}
              expanded={expand === current}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    onClick={() => {
                      if (expand === current) {
                        setExpand();
                      } else {
                        setExpand(current);
                      }
                    }}
                  />
                }
              >
                <span
                  onClick={() => {
                    if (expand === current) {
                      setExpand();
                    } else {
                      setExpand(current);
                    }
                  }}
                >
                  {current.spray_date}
                </span>
                <div className="home-sidebar__about__list-card__buttons">
                  <DeleteIcon
                    color="error"
                    onClick={() => {
                      pesticideDeleteHandler(current);
                    }}
                  />
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <p>Pesticide Type: {current.spray_type}</p>
                <p>Pesticide Quantity: {current.spray_quantity}</p>
              </AccordionDetails>
            </Accordion>
          );
        })}
        <Button
          variant="contained"
          className="home-sidebar__about__add-button"
          onClick={() => {
            setAdd(true);
          }}
        >
          Add Pesticide
        </Button>
      </div>
    );
  } else {
    return (
      <div className="home-sidebar__about__list-container">
        <p
          style={{
            margin: "20px 0px 10px 0px",
            padding: "0px 10px",
            textAlign: "center",
          }}
        >
          No Pesticide info added. please press the button below
        </p>
        <Button
          variant="contained"
          className="home-sidebar__about__add-button"
          onClick={() => {
            setAdd(true);
          }}
        >
          Add Pesticide
        </Button>
      </div>
    );
  }
}

function Harvest({ activeField, setAdd }) {
  const [expand, setExpand] = useState();
  const dispatch = useDispatch();

  const harvestDeleteHandler = (harvest) => {
    agent.Harvest.delete(harvest.id, localStorage.getItem("access"))
      .then((res) => {
        console.log(res.data);
        dispatch(deleteHarvest(harvest));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (activeField.harvest[0]) {
    return (
      <div className="home-sidebar__about__list-container">
        {activeField.harvest.map((current) => {
          return (
            <Accordion
              expanded={expand === current}
              className="home-sidebar__about__list-card"
              key={current.id}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    onClick={() => {
                      if (expand === current) {
                        setExpand();
                      } else {
                        setExpand(current);
                      }
                    }}
                  />
                }
              >
                <span
                  onClick={() => {
                    if (expand === current) {
                      setExpand();
                    } else {
                      setExpand(current);
                    }
                  }}
                >
                  {current.harvest_date}
                </span>
                <div className="home-sidebar__about__list-card__buttons">
                  <DeleteIcon
                    color="error"
                    onClick={() => {
                      harvestDeleteHandler(current);
                    }}
                  />
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <p>Yield Quantity: {current.yield_quantity}</p>
              </AccordionDetails>
            </Accordion>
          );
        })}
        <Button
          variant="contained"
          className="home-sidebar__about__add-button"
          onClick={() => {
            setAdd(true);
          }}
        >
          Add Harvest
        </Button>
      </div>
    );
  } else {
    return (
      <div className="home-sidebar__about__list-container">
        <p
          style={{
            margin: "20px 0px 10px 0px",
            padding: "0px 10px",
            textAlign: "center",
          }}
        >
          No Harvest info added. please press the button below
        </p>
        <Button
          variant="contained"
          className="home-sidebar__about__add-button"
          onClick={() => {
            setAdd(true);
          }}
        >
          Add Harvest
        </Button>
      </div>
    );
  }
}

function Fertiliser({ activeField, setAdd }) {
  const [expand, setExpand] = useState();
  const dispatch = useDispatch();

  const fertilizerDeleteHandler = (fertilizer) => {
    agent.Fertilizer.delete(fertilizer.id, localStorage.getItem("access"))
      .then((res) => {
        console.log(res.data);
        dispatch(deleteFertilizer(fertilizer));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (activeField.fertiliser[0]) {
    return (
      <div className="home-sidebar__about__list-container">
        {activeField.fertiliser.map((current) => {
          return (
            <Accordion
              expanded={expand === current}
              className="home-sidebar__about__list-card"
              key={current.id}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    onClick={() => {
                      if (expand === current) {
                        setExpand();
                      } else {
                        setExpand(current);
                      }
                    }}
                  />
                }
              >
                <span
                  onClick={() => {
                    if (expand === current) {
                      setExpand();
                    } else {
                      setExpand(current);
                    }
                  }}
                >
                  {current.date}
                </span>
                <div className="home-sidebar__about__list-card__buttons">
                  <DeleteIcon
                    color="error"
                    onClick={() => {
                      fertilizerDeleteHandler(current);
                    }}
                  />
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <p>Fertilizer Type: {current.fertilizer_type}</p>
                <p>Fertilizer Quantity: {current.fertilizer_quantity}</p>
              </AccordionDetails>
            </Accordion>
          );
        })}
        <Button
          variant="contained"
          className="home-sidebar__about__add-button"
          onClick={() => {
            setAdd(true);
          }}
        >
          Add Fertiliser
        </Button>
      </div>
    );
  } else {
    return (
      <div className="home-sidebar__about__list-container">
        <p
          style={{
            margin: "20px 0px 10px 0px",
            padding: "0px 10px",
            textAlign: "center",
          }}
        >
          No Fertiliser info added. please press the button below
        </p>
        <Button
          variant="contained"
          className="home-sidebar__about__add-button"
          onClick={() => {
            setAdd(true);
          }}
        >
          Add Fertiliser
        </Button>
      </div>
    );
  }
}

export default About;

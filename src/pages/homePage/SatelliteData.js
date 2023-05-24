import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import loadingGIF from "../../assets/loading.gif";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SatelliteData({ activeField }) {
  const [NDVIData, setNDVIData] = useState();
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("ndvi");
  const [imageryData, setImageryData] = useState();
  const [statData, setStatData] = useState();
  const [from, setFrom] = useState(
    new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
  );
  const [to, setTo] = useState(new Date());

  useEffect(() => {
    if (activeField) {
      setLoading(true);
      axios
        .get(
          `https://api.agromonitoring.com/agro/1.0/ndvi/history?polyid=${
            activeField.polygon_id
          }&start=${Math.floor(from.getTime() / 1000)}&end=${Math.floor(
            to.getTime() / 1000
          )}&appid=c9596a75d34e80a739f4dfbce2d00b0b`
        )
        .then((res) => {
          console.log(res.data);
          setNDVIData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [activeField, to, from]);

  useEffect(() => {
    if (activeField) {
      axios
        .get(
          `http://api.agromonitoring.com/agro/1.0/image/search?start=${Math.floor(
            from.getTime() / 1000
          )}&end=${Math.floor(to.getTime() / 1000)}&polyid=${
            activeField.polygon_id
          }&appid=c9596a75d34e80a739f4dfbce2d00b0b`
        )
        .then((res) => {
          console.log(res.data);
          setImageryData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [activeField]);

  useEffect(() => {
    if (imageryData && currentTab !== "ndvi" && activeField) {
      setLoading(true);
      axios
        .all(
          imageryData.map((curr) =>
            axios
              .get(curr.stats[currentTab])
              .then((res) => ({ ...res.data, date: curr.dt }))
          )
        )
        .then((res) => {
          setStatData(
            res.map((curr) => ({
              ...curr,
            }))
          );
          setLoading(false);
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [currentTab, imageryData]);

  const NDVIChartData = NDVIData
    ? {
        labels: NDVIData.map((current) => {
          const temp = new Date(current.dt * 1000);
          return `${temp.getDate()}-${
            temp.getMonth() + 1
          }-${temp.getFullYear()}`;
        }),
        datasets: [
          {
            id: "max",
            label: "Max",
            data: NDVIData.map(
              (current) => Math.floor(current.data.max * 100) / 100
            ),
            borderColor: "#ff3224",
            backgroundColor: "#ff3224",
          },
          {
            id: "mean",
            label: "Mean",
            data: NDVIData.map(
              (current) => Math.floor(current.data.mean * 100) / 100
            ),
            borderColor: "#ffc524",
            backgroundColor: "#ffc524",
          },
          {
            id: "min",
            label: "Min",
            data: NDVIData.map(
              (current) => Math.floor(current.data.min * 100) / 100
            ),
            borderColor: "#004cff",
            backgroundColor: "#004cff",
          },
        ],
      }
    : null;

  const statChartData = statData
    ? {
        labels: statData.map((current) => {
          const temp = new Date(current.date * 1000);
          return `${temp.getDate()}-${
            temp.getMonth() + 1
          }-${temp.getFullYear()}`;
        }),
        datasets: [
          {
            id: "max",
            label: "Max",
            data: statData.map(
              (current) => Math.floor(current.max * 100) / 100
            ),
            borderColor: "#ff3224",
            backgroundColor: "#ff3224",
          },
          {
            id: "mean",
            label: "Mean",
            data: statData.map(
              (current) => Math.floor(current.mean * 100) / 100
            ),
            borderColor: "#ffc524",
            backgroundColor: "#ffc524",
          },
          {
            id: "min",
            label: "Min",
            data: statData.map(
              (current) => Math.floor(current.min * 100) / 100
            ),
            borderColor: "#004cff",
            backgroundColor: "#004cff",
          },
        ],
      }
    : null;

  const options = {
    responsive: true,
    aspectRatio: 1.2,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      title: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          display: true,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          align: "center",
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  if (loading && activeField) {
    return (
      <div className="home-sidebar__top-box">
        <h2 className="home-sidebar__top-box__header">
          Satellite Data for {activeField.field_name}
        </h2>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From"
                value={from}
                onChange={(newDate) => {
                  setFrom(newDate);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To"
                value={to}
                onChange={(newDate) => {
                  setTo(newDate);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <div className="home-sidebar__satellite-data__tabs">
          <Tabs
            value={currentTab}
            onChange={(e, value) => {
              setCurrentTab(value);
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value="ndvi" label="NDVI" />
            <Tab value="evi" label="EVI" />
            <Tab value="evi2" label="EVI2" />
            <Tab value="nri" label="NRI" />
            <Tab value="dswi" label="DSWI" />
            <Tab value="ndwi" label="NDWI" />
          </Tabs>
        </div>
        <img src={loadingGIF} alt="" className="loading-gif" />
      </div>
    );
  } else if ((activeField && NDVIData) || statData) {
    return (
      <div className="home-sidebar__top-box">
        <h2 className="home-sidebar__top-box__header">
          Satellite Data for {activeField.field_name}
        </h2>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From"
                value={from}
                onChange={(newDate) => {
                  setFrom(newDate);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To"
                value={to}
                onChange={(newDate) => {
                  setTo(newDate);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <div className="home-sidebar__satellite-data__tabs">
          <Tabs
            value={currentTab}
            onChange={(e, value) => {
              setCurrentTab(value);
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value="ndvi" label="NDVI" />
            <Tab value="evi" label="EVI" />
            <Tab value="evi2" label="EVI2" />
            <Tab value="nri" label="NRI" />
            <Tab value="dswi" label="DSWI" />
            <Tab value="ndwi" label="NDWI" />
          </Tabs>
        </div>
        {NDVIData && currentTab === "ndvi" ? (
          <Line data={NDVIChartData} options={options} />
        ) : null}
        {statData && currentTab !== "ndvi" ? (
          <Line data={statChartData} options={options} />
        ) : null}
      </div>
    );
  } else return null;
}

export default SatelliteData;

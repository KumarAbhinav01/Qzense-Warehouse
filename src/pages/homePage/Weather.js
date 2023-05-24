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
import ChartDataLabels from "chartjs-plugin-datalabels";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import loadingGIF from "../../assets/loading.gif";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function Weather2({ activeField }) {
  const [weather, setWeather] = useState();
  const [currentTab, setCurrentTab] = useState("Temperature");
  const [loading, setLoading] = useState(true);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const temperatureData = weather
    ? {
        labels: weather.reduce((result, current) => {
          if (current !== weather[0]) {
            result.push(weekday[new Date(current.datetime).getDay()]);
          }
          return result;
        }, []),
        datasets: [
          {
            id: "max",
            label: "Max",
            data: weather.reduce((result, current) => {
              if (current !== weather[0]) {
                result.push(Math.floor(current.max_temp));
              }
              return result;
            }, []),
            borderColor: "#ff4d00",
            backgroundColor: "#ff4d00",
            datalabels: {
              color: "#ff4d00",
            },
          },
          {
            id: "min",
            label: "Min",
            data: weather.reduce((result, current) => {
              if (current !== weather[0]) {
                result.push(Math.floor(current.min_temp));
              }
              return result;
            }, []),
            borderColor: "#004cff",
            backgroundColor: "#004cff",
            datalabels: {
              color: "#004cff",
            },
          },
        ],
      }
    : null;

  const precipitationData = weather
    ? {
        labels: weather.reduce((result, current) => {
          if (current !== weather[0]) {
            result.push(weekday[new Date(current.datetime).getDay()]);
          }
          return result;
        }, []),
        datasets: [
          {
            id: "prec",
            label: "",
            data: weather.reduce((result, current) => {
              if (current !== weather[0]) {
                result.push(Math.floor(current.pop));
              }
              return result;
            }, []),
            borderColor: "#72A06A",
            backgroundColor: "#72A06A",
            datalabels: {
              formatter: (value) => value + "%",
            },
          },
        ],
      }
    : null;

  const rainData = weather
    ? {
        labels: weather.reduce((result, current) => {
          if (current !== weather[0]) {
            result.push(weekday[new Date(current.datetime).getDay()]);
          }
          return result;
        }, []),
        datasets: [
          {
            id: "max",
            label: "",
            data: weather.reduce((result, current) => {
              if (current !== weather[0]) {
                result.push(Math.floor(current.precip * 100) / 100);
              }
              return result;
            }, []),
            borderColor: "#72A06A",
            backgroundColor: "#72A06A",
          },
        ],
      }
    : null;

  const options = {
    responsive: true,
    aspectRatio: 2,
    layout: {
      padding: {
        top: 30,
      },
    },
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: currentTab === "Temperature" ? true : false,
        position: "bottom",
      },
      title: {
        display: false,
      },
      datalabels: {
        color: "#72A06A",
        labels: {
          title: {
            font: {
              weight: "bold",
            },
          },
        },
        align: "end",
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          align: "center",
        },
      },
    },
  };

  useEffect(() => {
    if (activeField) {
      setLoading(true);
      axios
        .get(
          `https://api.weatherbit.io/v2.0/forecast/daily?key=26b60c2f6541434aa0febceda4f2467f&lat=${activeField.field_coordinates.coordinates[0][1]}&lon=${activeField.field_coordinates.coordinates[0][0]}`
        )
        .then((res) => {
          console.log(res.data);
          setWeather(res.data.data.slice(0, 8));
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setWeather();
    }
  }, [activeField]);

  if (loading && activeField) {
    return (
      <div className="home-sidebar__top-box">
        <h2 className="home-sidebar__top-box__header">
          Weather for {activeField.field_name}
        </h2>
        <img src={loadingGIF} alt="" className="loading-gif" />
      </div>
    );
  } else if (weather && activeField) {
    return (
      <div className="home-sidebar__top-box">
        <h2 className="home-sidebar__top-box__header">
          Weather for {activeField.field_name}
        </h2>
        <div className="home-sidebar__weather__main">
          <div className="home-sidebar__weather__main__subdiv1">
            <img
              src={`https://www.weatherbit.io/static/img/icons/${weather[0].weather.icon}.png`}
              alt=""
            />
            <h3>{Math.floor(weather[0].temp)}&deg;C</h3>
          </div>
          <div className="home-sidebar__weather__main__subdiv2">
            <p>{weather[0].weather.description}</p>
            <p>Wind: {weather[0].wind_spd} km/h</p>
            <p>Precipitation: {weather[0].pop}%</p>
          </div>
        </div>
        <div className="home-sidebar__weather__other-days">
          <Tabs
            value={currentTab}
            onChange={(e, value) => {
              setCurrentTab(value);
            }}
            variant="scrollable"
            scrollButtons="auto"
            className="home-sidebar__weather__tabs"
          >
            <Tab value="Temperature" label="Temperature" />
            <Tab value="Precipitation" label="Precipitation" />
            <Tab value="Rain" label="Rain (mm)" />
          </Tabs>
          {currentTab === "Temperature" ? (
            <Line data={temperatureData} options={options} />
          ) : null}
          {currentTab === "Precipitation" ? (
            <Line options={options} data={precipitationData} />
          ) : null}
          {currentTab === "Rain" ? (
            <Line options={options} data={rainData} />
          ) : null}
        </div>
      </div>
    );
  } else return null;
}

export default Weather2;

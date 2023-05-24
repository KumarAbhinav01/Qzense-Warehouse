import React, { useState } from "react";
import mapboxgl from "mapbox-gl";
import ReactMapGL, {
  GeolocateControl,
  Layer,
  Marker,
  Source,
} from "react-map-gl";
import { useSelector } from "react-redux";

import Button from "@mui/material/Button";
import "./styles.css";
import Search from "./Search";
import FieldSubmit from "./FieldSubmit";
import AdjustIcon from "@mui/icons-material/Adjust";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Imagery from "./Imagery";

/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved */
mapboxgl.workerClass =
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
/* eslint-enable import/no-webpack-loader-syntax, import/no-unresolved */

function Maps({ viewport, setViewport, activeField, setActiveField }) {
  const [fieldSelect, setFieldSelect] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [searchMarker, setSearchMarker] = useState();
  const [imageryType, setImageryType] = useState("ndvi");
  const user = useSelector((state) => state.user);

  // --------------field select functions START------------
  const selectionGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates:
            fieldSelect === "selecting"
              ? selectedPoints
              : fieldSelect
              ? [...selectedPoints, selectedPoints[0]]
              : [],
        },
      },
    ],
  };

  const selectionLineStyle = {
    id: "point",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "lightgray",
      "line-width": 8,
    },
  };

  const fieldSelectHandler = (event) => {
    if (fieldSelect === "selecting") {
      setSelectedPoints([
        ...selectedPoints,
        [event.lngLat.lng, event.lngLat.lat],
      ]);
    }
    console.log(selectedPoints);
  };
  // --------------field select functions END------------

  // -------------all field sources and layers START -----------------
  const fieldGeoJSON = {
    type: "FeatureCollection",
    features: user.field.map(
      (field) =>
        field !== activeField && {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [field.field_coordinates.coordinates],
          },
        }
    ),
  };

  const fieldFillStyle = {
    id: "fill",
    type: "fill",
    layout: {},
    paint: {
      "fill-color": "#FF70C5",
      "fill-opacity": 0.5,
    },
  };

  const fieldBorderStyle = {
    id: "outline",
    type: "line",
    layout: {},
    paint: {
      "line-color": "#FF70C8",
      "line-width": 3,
    },
  };
  // -------------all field sources and layers END-----------------

  // -------------selected field source and layers START ----------------
  const activeFieldGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: activeField
            ? [activeField.field_coordinates.coordinates]
            : [],
        },
      },
    ],
  };

  const activeFieldFillStyle = {
    id: "activeFill",
    type: "fill",
    layout: {},
    paint: {
      "fill-color": "#0096c7",
      "fill-opacity": 0.5,
    },
  };

  const activeFieldBorderStyle = {
    id: "activeOutline",
    type: "line",
    layout: {},
    paint: {
      "line-color": "#00b4d8",
      "line-width": 3,
    },
  };
  // -------------selected field source and layers END ----------------

  const getLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setViewport({
          ...viewport,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 16,
        });
        setSearchMarker({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        alert(
          "Unable to retrieve your location, please enable location permission in your settings"
        );
      }
    );
  };

  return (
    <>
      <div className="home-maps">
        <ReactMapGL
          {...viewport}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onMove={(e) => {
            setViewport(e.viewState);
          }}
          onClick={fieldSelectHandler}
          mapStyle="mapbox://styles/qzenselabs/cl3c0r5zi000t14thdz63skxv"
        >
          {/* <GeolocateControl
            position="bottom-right"
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            auto
            onViewportChange={() => {
              return viewport;
            }}
          /> */}
          {selectedPoints.map((point) => {
            return (
              <Marker
                longitude={point[0]}
                latitude={point[1]}
                key={selectedPoints.indexOf(point)}
                onClick={() => {
                  if (selectedPoints[0] === point && selectedPoints[2]) {
                    setFieldSelect("selected");
                  }
                }}
              >
                <AdjustIcon className="field-select-marker" />
              </Marker>
            );
          })}
          {searchMarker && (
            <Marker
              longitude={searchMarker.longitude}
              latitude={searchMarker.latitude}
            >
              <LocationOnIcon
                color="error"
                className="home-maps__locationPin"
              />
            </Marker>
          )}
          <Source type="geojson" data={selectionGeoJSON}>
            <Layer {...selectionLineStyle} />
          </Source>
          <Source type="geojson" data={fieldGeoJSON}>
            <Layer {...fieldFillStyle} />
            <Layer {...fieldBorderStyle} />
          </Source>

          <Source type="geojson" data={activeFieldGeoJSON}>
            <Layer {...activeFieldFillStyle} />
            <Layer {...activeFieldBorderStyle} />
          </Source>
          <Imagery activeField={activeField} imageryType={imageryType} />
        </ReactMapGL>
        <div className="home-maps__top-left">
          <Search
            setViewport={setViewport}
            viewport={viewport}
            searchMarker={searchMarker}
            setSearchMarker={setSearchMarker}
          />
          <Button
            color="white"
            variant="contained"
            onClick={getLocationHandler}
          >
            My location
          </Button>

          {fieldSelect ? (
            <Button
              color="white"
              variant="contained"
              onClick={() => {
                setFieldSelect(false);
                setSelectedPoints([]);
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button
              color="white"
              variant="contained"
              onClick={() => {
                setFieldSelect("selecting");
                setSelectedPoints([]);
              }}
            >
              Add Field
            </Button>
          )}
        </div>
        <div className="home-maps__imagery-type">
          <select
            value={imageryType}
            onChange={(e) => {
              console.log(e.target.value);
              setImageryType(e.target.value);
            }}
          >
            <option value="ndvi">NDVI</option>
            <option value="evi">EVI</option>
            <option value="evi2">EVI2</option>
            <option value="dswi">DSWI</option>
            <option value="ndwi">NDWI</option>
            <option value="nri">NRI</option>
            <option value="truecolor">True Color</option>
            <option value="falsecolor">False Color</option>
          </select>
        </div>
      </div>
      {fieldSelect === "selected" ? (
        <FieldSubmit
          setFieldSelect={setFieldSelect}
          selectedPoints={selectedPoints}
          setSelectedPoints={setSelectedPoints}
        />
      ) : null}
    </>
  );
}

export default Maps;

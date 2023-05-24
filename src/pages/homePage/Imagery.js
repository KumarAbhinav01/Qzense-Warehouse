import React, { useEffect, useState } from "react";
import axios from "axios";
import { Source, Layer } from "react-map-gl";

function Imagery({ activeField, imageryType }) {
  const [imageryData, setImageryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const date = new Date();

  useEffect(() => {
    if (activeField) {
      setLoading(true);
      axios
        .get(
          `http://api.agromonitoring.com/agro/1.0/image/search?start=${Math.floor(
            new Date(date - 1000 * 60 * 60 * 24 * 10).getTime() / 1000
          )}&end=${Math.floor(date.getTime() / 1000)}&polyid=${
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

  const getSquareCoordinates = () => {
    let maxLon = -180;
    let maxLat = -90;
    let minLon = 180;
    let minLat = 90;

    activeField.field_coordinates.coordinates.forEach((coordinate) => {
      if (coordinate[0] > maxLon) {
        maxLon = coordinate[0];
      }
      if (coordinate[0] < minLon) {
        minLon = coordinate[0];
      }
      if (coordinate[1] > maxLat) {
        maxLat = coordinate[1];
      }
      if (coordinate[1] < minLat) {
        minLat = coordinate[1];
      }
    });

    return [
      [minLon, maxLat],
      [maxLon, maxLat],
      [maxLon, minLat],
      [minLon, minLat],
    ];
  };

  const layerStyle = {
    id: "radar-layer",
    type: "raster",
    paint: {
      "raster-fade-duration": 0,
    },
  };

  if (activeField && imageryData[0] && !loading) {
    return (
      <Source
        type="image"
        url={imageryData[0].image[imageryType]}
        coordinates={getSquareCoordinates()}
      >
        <Layer {...layerStyle} />
      </Source>
    );
  } else return null;
}

export default Imagery;

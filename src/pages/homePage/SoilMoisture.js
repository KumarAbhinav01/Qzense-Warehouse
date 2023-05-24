import axios from "axios";
import React, { useEffect, useState } from "react";

function SoilMoisture({ activeField }) {
  const [soilData, setSoilData] = useState();
  useEffect(() => {
    axios
      .get(
        `http://api.agromonitoring.com/agro/1.0/soil?polyid=${activeField.polygon_id}&appid=c9596a75d34e80a739f4dfbce2d00b0b`
      )
      .then((res) => {
        console.log(res.data);
        setSoilData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [activeField]);

  if (soilData) {
    return (
      <div className="home-sidebar__top-box">
        <h2 className="home-sidebar__top-box__header">
          Soil Moisture for {activeField.field_name}
        </h2>
        <p>
          <b>Moisture </b>: {soilData.moisture}
        </p>
        <p>
          <b>Surface Temperature :</b> {Math.floor(soilData.t0 - 273.15)}&deg;C
        </p>
        <p>
          <b>Temperature under 10cm depth :</b>{" "}
          {Math.floor(soilData.t10 - 273.15)}&deg;C
        </p>
      </div>
    );
  } else return null;
}

export default SoilMoisture;

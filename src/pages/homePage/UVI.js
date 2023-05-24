import axios from "axios";
import React, { useEffect, useState } from "react";
import loadingGIF from "../../assets/loading.gif";

function UVI({ activeField }) {
  const [current, setCurrent] = useState(false);
  const [loading, setLoading] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `http://api.agromonitoring.com/agro/1.0/uvi?polyid=${activeField.polygon_id}&appid=${process.env.REACT_APP_AGROMONITORING_TOKEN}`
      )
      .then((res) => {
        setLoading(false);
        setCurrent(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [activeField]);

  if (loading && activeField) {
    return (
      <div className="home-sidebar__top-box">
        <h2 className="home-sidebar__top-box__header">
          UVI for {activeField.field_name}
        </h2>
        <img src={loadingGIF} alt="" className="loading-gif" />
      </div>
    );
  } else if (activeField && current) {
    return (
      <div className="home-sidebar__top-box">
        <h2 className="home-sidebar__top-box__header">
          UVI for {activeField.field_name}
        </h2>
        <p style={{ margin: "15px 0px" }}>
          <b>Current UVI : </b>
          {current.uvi}
        </p>
      </div>
    );
  } else return null;
}

export default UVI;

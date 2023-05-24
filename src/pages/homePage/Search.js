import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

function Search({ setViewport, viewport, searchMarker, setSearchMarker }) {
  const [suggestions, setSuggestions] = useState([]);

  const searchHandler = (e) => {
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.target.value}.json?country=in&proximity=ip&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      )
      .then((res) => {
        console.log(res.data);
        setSuggestions(res.data.features);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="home-maps__search-container">
      <div className="home-maps__search">
        <SearchIcon />
        <input type="text" placeholder="Search" onChange={searchHandler} />
      </div>
      {suggestions.map((suggestion) => {
        return (
          <div
            className="home-maps__search-suggestions"
            onClick={() => {
              setViewport({
                ...viewport,
                longitude: suggestion.center[0],
                latitude: suggestion.center[1],
                zoom: 16,
              });
              setSuggestions([]);
              setSearchMarker({
                longitude: suggestion.center[0],
                latitude: suggestion.center[1],
              });
            }}
          >
            {suggestion.place_name}
          </div>
        );
      })}
    </div>
  );
}

export default Search;

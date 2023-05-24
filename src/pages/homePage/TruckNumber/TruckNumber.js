import React, { useState } from 'react';
import axios from 'axios';
import agent from "../../../agent";

const TruckNumber = () => {
  const [file, setFile] = useState(null);
  const [truckNumber, setTruckNumber] = useState(null);
  
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleGetTruckNumber = async () => {
    try {
      const number = await agent.Truck.number(file);
      setTruckNumber(number);
      console.log(number);
    } catch (error) {
      // Handle the error
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleGetTruckNumber}>Get Truck Number</button>
      {TruckNumber != null ? <p>{truckNumber}</p> : null}
    </div>
  );
};

export default TruckNumber;

import React from "react";
import Navbar from "../../components/navbar";

import Button from '@mui/material/Button';

function HomePage() {
  
  return (
    <>
      <Navbar />
      <Button variant="contained" href="/gate-reporting">Gate Reporting</Button>
    </>
  );
}

export default HomePage;

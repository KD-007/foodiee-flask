import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import MetaData from "../MetaData";

const NotFound = () => {
  return (<>
    <MetaData title={"Foodiee"} />
    <div className="d-flex p-5 m-5 flex-column align-items-center h-50">
      <i class="bi bi-exclamation-circle-fill fs-1 text-center m-2" ></i>
      <Typography>Page Not Found </Typography>
      <Link className="text-decoration-none" to="/">Home</Link>
    </div>
    </>
  );
};

export default NotFound;

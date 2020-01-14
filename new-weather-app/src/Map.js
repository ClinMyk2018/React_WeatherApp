// import React from "react";
import apiConfig from "./apiKeys";
import ReactMapboxGl from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken: apiConfig.mpBoxKey
});

export default Map;

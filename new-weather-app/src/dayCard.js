import React from "react";
import moment from "moment";

const DayCard = ({ reading, degreeType }) => {
  let newDate = new Date();
  const weekday = reading.dt * 1000;
  newDate.setTime(weekday);

  const imgURL = `owf owf-${reading.weather[0].id} owf-5x`;

  return (
    <div className="col-sm-2 mb-4">
      <div className="card">
        <h3 className="card-title">{moment(newDate).format("dddd")}</h3>
        <p className="text-muted">
          {moment(newDate).format("MMMM Do, h:mm a")}
        </p>
        <i className={imgURL}></i>
        <h2>
          {Math.round(reading.main.temp)}{" "}
          {degreeType === "metric" ? `°C` : `°F`}
        </h2>
        <div className="card-body">
          <p className="card-text">{reading.weather[0].description}</p>
        </div>
      </div>
    </div>
  );
};

export default DayCard;

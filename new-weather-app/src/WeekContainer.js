import React from "react";
import DayCard from "./dayCard";
import apiConfig from "./apiKeys";
import DegreeToggle from "./DegreeToggle";
import SearchableMap from "./SearchableMap";
// import { Layer, Feature } from "react-mapbox-gl";

class WeekContainer extends React.Component {
  state = {
    name: "",
    fullData: [],
    dailyData: [],
    degreeType: "imperial",
    longitude: -96,
    latitude: 32
  };

  componentDidMount = () => {
    window.navigator.geolocation.getCurrentPosition(
      position =>
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
      err => this.setState({ errorMsg: err.message })
    );

    this.fetchWeather();
  };

  componentDidUpdate(prepProps, prevState) {
    if (
      this.state.degreeType !== prevState.degreeType ||
      (this.state.latitude !== prevState.latitude &&
        this.state.longitude !== prevState.longitude)
    ) {
      this.fetchWeather();
    }
  }

  onSearch = (latitude, longitude) => {
    this.setState({ latitude, longitude });
  };

  updateForecastDegree = event => {
    this.setState({
      degreeType: event.target.value
    });
  };

  fetchWeather() {
    const weatherURL =
      // api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
      // ** this will come from search bar **
      `http://api.openweathermap.org/data/2.5/forecast?lat=${this.state.latitude}&lon=${this.state.longitude}&units=${this.state.degreeType}&APPID=${apiConfig.owmKey}`;

    fetch(weatherURL)
      .then(res => res.json())
      .then(data => {
        const dailyData = data.list.filter(reading =>
          reading.dt_txt.includes("18:00:00")
        );
        this.setState(
          {
            fullData: data.list,
            dailyData: dailyData,
            name: `${data.city.name}, ${data.city.country}`
          },
          () => console.log(data)
        );
      });
  }

  formatDayCards = () => {
    return this.state.dailyData.map((reading, index) => (
      <DayCard
        reading={reading}
        key={index}
        degreeType={this.state.degreeType}
      />
    ));
  };

  render() {
    return (
      <div className="container">
        <h1 className="display-1 jumbotron mt-2">5-Day Forecast</h1>
        <SearchableMap
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          onSearch={this.onSearch}
        />
        <h2 className="display-5 text-muted mb-2">{this.state.name}</h2>
        <DegreeToggle
          updateForecastDegree={this.updateForecastDegree}
          degreeType={this.degreeType}
        />
        <div className="row justify-content-center">
          {this.formatDayCards()}
        </div>
      </div>
    );
  }
}

export default WeekContainer;

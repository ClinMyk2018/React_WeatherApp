import React from "react";
import DayCard from "./dayCard";
import apiConfig from "./apiKeys";
import DegreeToggle from "./DegreeToggle";
import SearchBar from "./SearchBar";
import Map from "./Map";
import { Layer, Feature } from "react-mapbox-gl";

class WeekContainer extends React.Component {
  state = {
    name: "",
    fullData: [],
    dailyData: [],
    degreeType: "imperial",
    term: "Boston"
  };

  componentDidMount = () => {
    this.fetchWeather();
  };

  componentDidUpdate(prepProps, prevState) {
    if (this.state.degreeType !== prevState.degreeType) {
      this.fetchWeather();
    }
  }

  updateSearchTerm = event => {
    this.setState({
      term: event.target.value
    });
  };

  updateForecastDegree = event => {
    this.setState({
      degreeType: event.target.value
    });
  };

  onFormSubmit = event => {
    event.preventDefault();

    this.fetchWeather();
  };

  fetchWeather() {
    const weatherURL =
      // api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
      // ** this will come from search bar **
      `http://api.openweathermap.org/data/2.5/forecast?q=${this.state.term}&units=${this.state.degreeType}&APPID=${apiConfig.owmKey}`;

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
        <Map
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "50vh",
            width: "auto"
          }}
        >
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}
          >
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
          </Layer>
        </Map>
        <SearchBar
          updateSearchTerm={this.updateSearchTerm}
          term={this.term}
          onFormSubmit={this.onFormSubmit}
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

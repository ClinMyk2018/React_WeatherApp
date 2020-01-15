import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import apiConfig from "./apiKeys";
import React, { Component } from "react";
import MapGL from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";

const token = apiConfig.mpBoxKey;

class SearchableMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        latitude: this.props.latitude,
        longitude: this.props.longitude,
        zoom: 1
      },
      searchResultLayer: null,
      errorMsg: null
    };
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    window.navigator.geolocation.getCurrentPosition(
      position =>
        this.setState({
          viewport: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 7
          }
        }),
      err => this.setState({ errorMsg: err.message })
    );
  }

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
    this.props.onSearch(
      this.state.viewport.latitude,
      this.state.viewport.longitude
    );
  };
  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 0 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleOnResult = event => {
    this.setState({
      searchResultLayer: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10
      })
    });
  };

  render() {
    const { viewport, searchResultLayer } = this.state;
    console.log(viewport);
    return (
      <div style={{ height: "50vh" }}>
        <MapGL
          ref={this.mapRef}
          {...viewport}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          width="100%"
          height="90%"
          onViewportChange={this.handleViewportChange}
          mapboxApiAccessToken={token}
        >
          <Geocoder
            mapRef={this.mapRef}
            onResult={this.handleOnResult}
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={token}
            position="top-left"
          />
        </MapGL>
        <DeckGL {...viewport} layers={[searchResultLayer]} />
      </div>
    );
  }
}

export default SearchableMap;

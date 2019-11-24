import React, { Component } from 'react';

import Weather from './components/Weather';
import Form from './components/Form';

import "bootstrap/dist/css/bootstrap.min.css";
import "weather-icons/css/weather-icons.css";
import './App.css';

const API_key = 'cb96a81148c5702669c9a1520eb75d3f';
const mapsKey = 'AIzaSyC4GatwY4tdnGNxGXREv2diHovCu-Doet8';

class App extends Component {
  constructor(){
    super();

    this.state = {
      city: "",
      country: "",
      userCity: "",
      userCountry: "",
      local: "",
      icon: undefined,
      celsius: undefined,
      tempMax: undefined,
      tempMin: undefined,
      description: "",
      error: false,
      latitude: undefined,
      longitude: undefined,
      userAddr: "",
      btnName: "Weather Forecast"
      
    };

    this.getLocation = this.getLocation.bind(this);
    this.getUserAddress = this.getUserAddress.bind(this)

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Fog: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog"
    };

  };


  componentDidMount(){
    this.getLocation();
  }

  getLocation () {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition( position => {
        this.setState({
          ...this.state,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        this.getUserAddress();
      }, this.showError);
      
    } else {
      alert('ops, não é possível');
    };
    console.log('getLocation', this.state)
  };

  showError(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.")
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.")
        break;
      default: alert('An unkown error ocrrured')
    };
  };


  getUserAddress = async () => {
    const { latitude, longitude } = this.state
    const googleAPI = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${mapsKey}`
    
    const apiCall = await fetch(googleAPI);
    const response = await apiCall.json();
    this.setState( {
      ...this.state,
      userCity: response.results[0].address_components[3].long_name,
      userCountry: response.results[0].address_components[5].long_name,
    });
    this.getWeather();
  };

  handleChange(evt){
    //evt.preventDefault();
    this.setState({
      ...this.state,
      [evt.target.name]: evt.target.value,
      btnName: "Buscar"
    });
  };

  calCelsius(temp){
    let cell = Math.floor(temp - 273.15);
    return cell
  };

  getWeather = async () => {
    const { userCity, city, country , userCountry } = this.state
    let apiCall, resCity, resCountry

    if( city && country ){
      resCity = city;
      resCountry = country
    } else {
      resCity = userCity;
      resCountry = userCountry;
    }

    if(resCity && resCountry){
      const API= `http://api.openweathermap.org/data/2.5/weather?q=${resCity},${resCountry}&appid=${API_key}`;
      apiCall = await fetch(API);
      const response = await apiCall.json();

      this.setState({
        ...this.state,
        local: `${response.name}, ${response.sys.country}`,
        city: "",
        country: "",
        btnName: `Weather Forecast for ${userCity}`,
        icon: this.weatherIcon.Fog,
        celsius: this.calCelsius(response.main.temp),
        tempMax: this.calCelsius(response.main.temp_max),
        tempMin: this.calCelsius(response.main.temp_min),
        description: response.weather[0].description,
        error: false
      });
      console.log('icon', response.weather[0].id)

      this.getWeatherIcon(this.weathericon, response.weather[0].id);
      

    } else {
      this.setState({error: true})
    }
  };

  getWeatherIcon(icons, rangeId ){
    switch(true){
      case rangeId >= 200 && rangeId <= 232:
        this.setState({icon: this.weatherIcon.Thunderstorm});
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({icon: this.weatherIcon.Drizzle});
        break;
      case rangeId >= 500 && rangeId <= 531:
        this.setState({icon: this.weatherIcon.Rain});
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({icon: this.weatherIcon.Snow});
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({icon: this.weatherIcon.Fog});
        break;
      case rangeId === 800:
        this.setState({icon: this.weatherIcon.Clear});
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({icon: this.weatherIcon.Clouds});
        break;
      default: this.setState({icon: this.weatherIcon.Drizzle});
    };
  };
  
  render(){

    const { 
      local,
      city,
      country,
      icon,
      celsius,
      tempMin,
      tempMax,
      description,
      error,
      btnName
    } = this.state;
    console.log('state', this.state);
    return(
      <div className="App">
        <Form 
          handleChange={this.handleChange.bind(this)}
          city={city}
          country={country}
          getWeather={this.getWeather.bind(this)} 
          error={error}
          btnName={ btnName }
        />
        <Weather 
          local={ local } 
          celsius={ celsius }
          icon={ icon }
          tempMax={ tempMax }
          tempMin={ tempMin }
          description={ description }
        />
    </div>
    );
  };
};


export default App;

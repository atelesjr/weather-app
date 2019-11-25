import React, { Component } from 'react';
import moment from 'moment';

import Weather from './components/Weather';
import Form from './components/Form';

import "bootstrap/dist/css/bootstrap.min.css";
import "weather-icons/css/weather-icons.css";
import "./styles/app.css"
import Spinner from './components/spinner';

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
      userAddress: "",
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
      btnName: "Local Weather Forecast",
      sunset: "",
      sunrise: "",
      hide: false,
      changeIcon: false,
      loading: false,
      bkgClass: ""
      
    };

    this.btnIcon = {
      Gps: "fas fa-map-marker-alt",
      Search: "fas fa-search"
    }

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Fog: "wi-fog",
      dayClear: "wi-day-sunny",
      nightClear: "wi-night-clear",
      dayClouds: "wi-day-fog",
      nightClouds: "wi-night-fog"
    };

  };

  componentDidMount(){
    this.getLocation();
  }

  //To get device location
  getLocation () {
    this.setState({
      ...this.state, loading: true
    })
    
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

  //To get device address using coordinates from getLocation()
  getUserAddress = async () => {
    const { latitude, longitude } = this.state
    const googleAPI = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${mapsKey}`
    
    const apiCall = await fetch(googleAPI);
    const response = await apiCall.json();
    //console.log('getAddress: ', response )
    this.setState( {
      ...this.state,
      userCity: response.results[0].address_components[3].long_name,
      userCountry: response.results[0].address_components[5].long_name,
      userAddress: response.results[0].formatted_address
    });
    this.getWeather();
  };

  handleChange(evt){
    this.setState({
      ...this.state,
      [evt.target.name]: evt.target.value,
      btnName: "Search for Weather",
      changeIcon: true
    });
  };

  //to change API data to Celsius
  calCelsius(temp){
    let cell = Math.floor(temp - 273.15);
    return cell
  };

  //To get weather by device location or sent by application form
  getWeather = async () => {
    const { userCity, city, country , userCountry } = this.state
    let apiCall, resCity, resCountry

    if( city && country ){
      //by form
      resCity = city;
      resCountry = country
      this.setState({
        ...this.state, hide: true,
      })
    } else {
      //by user device
      resCity = userCity;
      resCountry = userCountry;
      this.setState({
        ...this.state, hide: false
      })
    }

    if(resCity && resCountry){
      const API= `http://api.openweathermap.org/data/2.5/weather?q=${resCity},${resCountry}&appid=${API_key}`;
      apiCall = await fetch(API);
      const response = await apiCall.json();

      this.calcSunriseSunset(response.sys.sunrise, 'sunrise'); 
      this.calcSunriseSunset(response.sys.sunset, 'sunset'); 
     
      this.setState({
        ...this.state,
        local: `${response.name}, ${response.sys.country}`,
        city: "",
        country: "",
        btnName: "Local Weather Forecast",
        //icon:     this.weatherIcon.Fog,
        celsius:  this.calCelsius(response.main.temp),
        tempMax:  this.calCelsius(response.main.temp_max),
        tempMin:  this.calCelsius(response.main.temp_min),
        description: response.weather[0].description,
        changeIcon: false,
        loading: false
      });
      
      this.getWeatherIcon(this.weathericon, response.weather[0].id);
    } else {
      this.setState({...this.state, error: true})
    }
  };

  //To change API data to proper device time.
  calcSunriseSunset(sunPosition, name ){
    const dataUTC = new Date(sunPosition * 1000);
    const getTime = moment(dataUTC).format('HH:mm');

    this.setState({
      ...this.state,
      [name]: getTime,
    });
  }

  //To provide icon and background image according to weather.
  getWeatherIcon(icons, rangeId ){
    const { sunrise, sunset} = this.state;
    const now = moment(new Date()).format('HH:mm')
    let nocturn, bkgClass;

    if (now > sunrise && now < sunset ){
      nocturn = true;
    } else {
      nocturn = false;
    }
  
    switch(true){
      case rangeId >= 200 && rangeId <= 232:
        nocturn 
        ? bkgClass = "weather__bkg-thunderstorm" 
        : bkgClass = "weather__bkg-thunderstorm-night"
        this.setState({
          icon: this.weatherIcon.Thunderstorm,
          bkgClass
        });
        break;
      case rangeId >= 300 && rangeId <= 321:
        nocturn 
        ? bkgClass = "weather__bkg-rain" 
        : bkgClass = "weather__bkg-rain-night"
        this.setState({
          icon: this.weatherIcon.Drizzle,
          bkgClass  
        });
        break;
      case rangeId >= 500 && rangeId <= 531:
        nocturn 
        ? bkgClass = "weather__bkg-rain" 
        : bkgClass = "weather__bkg-rain-night"
        this.setState({
          icon: this.weatherIcon.Rain,
          bkgClass
        });
        break;
      case rangeId >= 600 && rangeId <= 622:
        nocturn 
        ? bkgClass = "weather__bkg-snow" 
        : bkgClass = "weather__bkg-snow-night"
        this.setState({
          icon: this.weatherIcon.Snow,
          bkgClass
        });
        break;
      case rangeId >= 701 && rangeId <= 781:
        nocturn 
        ? bkgClass = "weather__bkg-fog" 
        : bkgClass = "weather__bkg-fog-night"
        this.setState({
          icon: this.weatherIcon.Fog,
          bkgClass
        })
        break;
      case rangeId === 800:
        nocturn
        ? this.setState({
            icon: this.weatherIcon.dayClear,
            bkgClass: "weather__bkg-clear"
          })
        : this.setState({
            icon: this.weatherIcon.nightClear,
            bkgClass: "weather__bkg-clear-night"
          });
        break;
      case rangeId >= 801 && rangeId <= 804:
        nocturn 
        ? this.setState({
            icon: this.weatherIcon.dayClouds,
            bkgClass: "weather__bkg-cloudy"
          })
        : this.setState({
            icon: this.weatherIcon.nightClouds,
            bkgClass: "weather__bkg-cloudy-night"
          });
        break;
      default: this.setState({icon: this.weatherIcon.Drizzle});
    };
  };

  render(){

    const { 
      local,
      city,
      country,
      userAddress,
      icon,
      celsius,
      tempMin,
      tempMax,
      description,
      error,
      btnName,
      btnIcon,
      hide,
      changeIcon,
      sunrise,
      sunset,
      loading,
      bkgClass
    } = this.state;

    //console.log('state', bkgClass);

    return(
      <div className={`app ${bkgClass}`}>
        <Form 
          handleChange={this.handleChange.bind(this)}
          city={city}
          country={country}
          getWeather={this.getWeather.bind(this)} 
          getLocation={this.getLocation.bind(this)}
          error={error}
          btnName={ btnName }
          btnIcon={btnIcon}
          changeIcon={changeIcon}
          hide={hide}
        />
        {
          loading 
          ? <Spinner />
          : <Weather 
            hide={hide}
            address={ userAddress }
            local={ local } 
            sunrise={ sunrise }
            sunset={ sunset }
            celsius={ celsius }
            icon={ icon }
            tempMax={ tempMax }
            tempMin={ tempMin }
            description={ description }
          />
        }
      </div>
    );
  };
};


export default App;

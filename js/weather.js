"use strict";
let $ = require('jquery'),
    login = require("./user"),
    firebase = require("./fb-config");

var change = document.getElementById("change");
var set = document.getElementById("set");
set.addEventListener("click", printZip);
change.addEventListener("click", changeZip);


function printZip(){
  var zipCode = document.getElementById("setZip");
  var code = document.getElementById("zip").value;
  $(set).hide();
  $(change).show();
  

  zipCode.innerHTML = code;

  if ($('#setZip').is(':empty')) {
    console.log("empty");
  } else {
      weather(code).then((resolve) => {
        weatherPrint(resolve);
      });
  }
}

function changeZip(){
  var zipCode = document.getElementById("setZip");
  var code = document.getElementById("zip").value;

  zipCode.innerHTML = code;

  if ($('#setZip').is(':empty')) {
    console.log("empty");
  } else {
      weather(code).then((resolve) => {
        weatherPrint(resolve);
      });
  }
}

// call weather data

function weather(code){

  return new Promise((resolve,reject) => {
    var info = `https://api.openweathermap.org/data/2.5/weather?zip=${code},us&appid=6b19bec2b5b47af4fb4a80fdc0a1ef6c`;
    console.log(info);
    var weatherData = new XMLHttpRequest();
    
    weatherData.addEventListener('load', function(){
      var weather = JSON.parse(this.responseText);
      resolve(weather);
    });
    weatherData.addEventListener('error', function(){
      reject();
    });
    weatherData.open("GET", info);
    weatherData.send();
  });
  }

  function weatherPrint(weather){
    console.log(weather);
    var kel = weather.main.temp;
    var degrees = kel*9/5 - 459.67;
    var fahrenheit = Math.round(degrees);
    console.log(Math.round(degrees));
    console.log(`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`);
    var wImage = document.getElementById("weatherImage");
    wImage.innerHTML = `<div id="temp">${fahrenheit}°F</div><img src="http://openweathermap.org/img/w/${weather.weather[0].icon}.png" alt="weather image">`;
    var location = document.getElementById("setLocation");
    location.innerHTML = `<div id="currentLocation">${weather.name}</div>`;
    saveWeather(weather);
  }

////////////////////////////////
/// SECTION 1 SAVING WEATHER ///
////////////////////////////////

//start line
function saveWeather(weatherData){
  let weatherObj = buildWeatherObj(weatherData);
  console.log(weatherObj);
  addWeather(weatherObj).then((resolve) => {
    console.log("DONE!");
  });
}

//data builder
function buildWeatherObj(data){
  var code = document.getElementById("zip").value;
  let weatherObj = {
    lat: data.coord.lon,
    lon: data.coord.lat,
    zipCode: code,
    uid: login.getUser()
  };
  return weatherObj;
}

//data poster
function addWeather(bookFormObj){
  return $.ajax({
      url: `${firebase.getFBsettings().databaseURL}/locations.json`,
      type: 'POST',
      data: JSON.stringify(bookFormObj),
      dataType: 'json'
  }).done((bookID) => {
      return bookID;
  });
}
    module.exports = {printZip};


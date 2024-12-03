const input = document.getElementById("search-input");
const description = document.getElementById("description-text");
const img = document.getElementById("description-img");
const locBtn = document.getElementById("loc-btn");
const section = document.querySelector(".weather-info");
const form = document.querySelector("form");

// Replace the API key with the one you provided
const apiKey = "a13985651d74ca9d9dac2ed8e66b5aa7";

function getData(e) {
  e.preventDefault();
  if (!input.value.trim()) {
    alert("Please enter a city name.");
    return;
  }
  fetchWeatherData(input.value.trim());
}

function getLocationData() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported!");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherData(null, latitude, longitude);
    },
    () => alert("Unable to retrieve your location.")
  );
}

function fetchWeatherData(city, lat = null, lon = null) {
  const weatherURL = city
    ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(weatherURL)
    .then((res) => res.json())
    .then((data) => {
      displayWeather(data);
      fetchForecast(data.coord.lat, data.coord.lon);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Unable to fetch weather data. Please try again.");
    });
}

function fetchForecast(lat, lon) {
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=${apiKey}`;

  fetch(forecastURL)
    .then((res) => res.json())
    .then((data) => {
      displayForecast(data);
    })
    .catch((error) => console.error("Error fetching forecast:", error));
}

function displayWeather(data) {
  const cityName = document.getElementById("city");
  const temperatureDegree = document.getElementById("temperature-degree");
  const humidityDegree = document.getElementById("humidity-degree");
  const feelslikeDegree = document.getElementById("feelslike-degree");
  const windSpeedDegree = document.getElementById("wind-speed-degree");
  const pressureDegree = document.getElementById("pressure-degree");
  const sunriseDegree = document.getElementById("sunrise-degree");
  const sunsetDegree = document.getElementById("sunset-degree");
  const weatherDesc = data.weather[0];
  const iconURL = `http://openweathermap.org/img/wn/${weatherDesc.icon}.png`;

  cityName.textContent = data.name;
  temperatureDegree.textContent = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius
  humidityDegree.textContent = data.main.humidity + "%";
  feelslikeDegree.textContent = Math.round(data.main.feels_like - 273.15) + "°C";
  windSpeedDegree.textContent = data.wind.speed + " m/s";
  pressureDegree.textContent = data.main.pressure + " hPa";
  sunriseDegree.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  sunsetDegree.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  description.textContent = weatherDesc.description;
  img.src = iconURL;

  section.style.display = "block";
}

function displayForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  data.list.forEach((day) => {
    const forecastDay = document.createElement("div");
    forecastDay.className = "forecast-day";
    const date = new Date(day.dt * 1000);
    forecastDay.innerHTML = `
      <h5>${date.toLocaleDateString()}</h5>
      <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
      <div>${Math.round(day.temp.day - 273.15)}°C</div>
    `;
    forecastContainer.appendChild(forecastDay);
  });
}

form.addEventListener("submit", getData);

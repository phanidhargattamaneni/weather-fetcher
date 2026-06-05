let isCelsius = true;
let lastTempCelsius = 20;
let lastWindKmh = 10;

// search button click handler
document.getElementById('search-btn').addEventListener('click', () => {
  const city = document.getElementById('city-input').value.trim();
  if (city) {
    getWeather(city);
  } else {
    alert("Please enter a city name");
  }
});

// trigger search on Enter key press
document.getElementById('city-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = document.getElementById('city-input').value.trim();
    if (city) getWeather(city);
  }
});

// unit switch button
document.getElementById('unit-btn').addEventListener('click', () => {
  isCelsius = !isCelsius;
  
  if (isCelsius) {
    document.getElementById('unit-btn').textContent = "Switch to °F";
    document.getElementById('temp-val').textContent = Math.round(lastTempCelsius) + "°";
    document.getElementById('wind-val').textContent = Math.round(lastWindKmh) + " km/h";
  } else {
    document.getElementById('unit-btn').textContent = "Switch to °C";
    const tempF = (lastTempCelsius * 9) / 5 + 32;
    const windMph = lastWindKmh * 0.621371;
    document.getElementById('temp-val').textContent = Math.round(tempF) + "°";
    document.getElementById('wind-val').textContent = Math.round(windMph) + " mph";
  }
});

// main function to fetch data from weather API
async function getWeather(city) {
  try {
    // get latitude and longitude for the city
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found");
      return;
    }

    const result = geoData.results[0];
    const cityLabel = `${result.name}, ${result.country || ""}`;

    // fetch current weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    // save values so we can toggle C/F later
    lastTempCelsius = current.temperature_2m;
    lastWindKmh = current.wind_speed_10m;

    // insert text in HTML elements
    document.getElementById('city-name').textContent = cityLabel;
    document.getElementById('date-time').textContent = new Date().toDateString();
    
    // choose matching emoji and description
    let emoji = "☀️";
    let desc = "Clear Sky";
    const code = current.weather_code;

    if (code === 0 || code === 1) {
      emoji = "☀️";
      desc = "Clear Sky";
    } else if (code === 2 || code === 3) {
      emoji = "☁️";
      desc = "Cloudy";
    } else if (code >= 45 && code <= 48) {
      emoji = "🌫️";
      desc = "Foggy";
    } else if (code >= 51 && code <= 67) {
      emoji = "🌧️";
      desc = "Rainy";
    } else if (code >= 71 && code <= 77) {
      emoji = "❄️";
      desc = "Snowy";
    } else if (code >= 80 && code <= 82) {
      emoji = "🌧️";
      desc = "Rain Showers";
    } else if (code >= 95 && code <= 99) {
      emoji = "⚡";
      desc = "Thunderstorm";
    }

    document.getElementById('weather-emoji').textContent = emoji;
    document.getElementById('weather-desc').textContent = desc;
    document.getElementById('humidity-val').textContent = current.relative_humidity_2m + "%";
    
    // update temperature and wind display
    if (isCelsius) {
      document.getElementById('temp-val').textContent = Math.round(lastTempCelsius) + "°";
      document.getElementById('wind-val').textContent = Math.round(lastWindKmh) + " km/h";
    } else {
      const tempF = (lastTempCelsius * 9) / 5 + 32;
      const windMph = lastWindKmh * 0.621371;
      document.getElementById('temp-val').textContent = Math.round(tempF) + "°";
      document.getElementById('wind-val').textContent = Math.round(windMph) + " mph";
    }

    // display the weather result panel
    document.getElementById('weather-result').style.display = 'block';
  } catch (err) {
    alert("Error fetching weather data");
  }
}

// load London weather on startup
getWeather("London");

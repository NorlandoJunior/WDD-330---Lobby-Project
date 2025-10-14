const weatherContainer = document.getElementById("weather-container");
const forecastContainer = document.getElementById("forecast-container") || null;

function showLoading() {
  weatherContainer.innerHTML = `<p>Loading weather...</p>`;
  if (forecastContainer) forecastContainer.innerHTML = "";
}

function showError(msg = "Unable to load weather.") {
  weatherContainer.innerHTML = `<p>${msg}</p>`;
  if (forecastContainer) forecastContainer.innerHTML = `<p>${msg}</p>`;
}

// Actual
function renderWeather(data) {
  const forecast = data.list[0];
  const name = data.city?.name || "Location";
  const desc = forecast.weather[0].description || "";
  const temp = Math.round(forecast.main.temp);
  const feels = Math.round(forecast.main.feels_like);
  const iconCode = forecast.weather[0].icon;

  const iconImg = iconCode
    ? `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${desc}" />`
    : "";

  weatherContainer.innerHTML = `
    <div class="weather-card">
      <div class="weather-left">
        <h3>${name}</h3>
        <p style="text-transform: capitalize;">${desc}</p>
        <p>Temperature: ${temp}°C (feels like ${feels}°C)</p>
      </div>
      <div class="weather-right">
        ${iconImg}
      </div>
    </div>
  `;
}

// Weather Forecast (5 days, daily at 12:00)
function renderForecast(data) {
  if (!forecastContainer) return; 

  forecastContainer.innerHTML = "";
  const daily = data.list.filter((_, i) => i % 8 === 0).slice(0, 5);

  daily.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;
    const desc = item.weather[0].description;

    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
      <p>${day}</p>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}">
      <p>${temp}°C</p>
    `;
    forecastContainer.appendChild(card);
  });
}

//  Call data from server
async function fetchWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(`/weather?lat=${lat}&lon=${lon}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Weather API error");

    renderWeather(data);
    renderForecast(data);
    localStorage.setItem("lastWeather", JSON.stringify(data));
  } catch (err) {
    console.error("fetchWeatherByCoords:", err);
    showError("Error fetching weather.");
  }
}

// Fallback geolocation with IP
async function getCoordsFromIP() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    if (data && data.latitude && data.longitude) {
      return { lat: data.latitude, lon: data.longitude };
    }
    return null;
  } catch (err) {
    console.warn("IP fallback failed:", err);
    return null;
  }
}

// inicializing
async function loadWeatherAutomatic() {
  showLoading();

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      async (err) => {
        console.warn("Geolocation denied or failed:", err);
        const ipCoords = await getCoordsFromIP();
        if (ipCoords) {
          await fetchWeatherByCoords(ipCoords.lat, ipCoords.lon);
        } else showError("Cannot obtain your location for weather.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  } else {
    const ipCoords = await getCoordsFromIP();
    if (ipCoords) {
      await fetchWeatherByCoords(ipCoords.lat, ipCoords.lon);
    } else showError("Browser does not support geolocation.");
  }
}

loadWeatherAutomatic();

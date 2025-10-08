const weatherContainer = document.getElementById("weather-container");

function showLoading() {
  weatherContainer.innerHTML = `<p>Loading weather...</p>`;
}

function showError(msg = "Unable to load weather.") {
  weatherContainer.innerHTML = `<p>${msg}</p>`;
}

function renderWeather(data) {
  const name = data.name || "Location";
  const desc = (data.weather && data.weather[0] && data.weather[0].description) || "";
  const temp = data.main ? Math.round(data.main.temp) : "--";
  const feels = data.main ? Math.round(data.main.feels_like) : "--";
  const iconCode = (data.weather && data.weather[0] && data.weather[0].icon) || null;

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

// fetch weather from your server endpoint
async function fetchWeatherByCoords(lat, lon) {
  try {
    const url = `/weather?lat=${lat}&lon=${lon}`; // server-side endpoint
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Weather API error");
    renderWeather(data);
  } catch (err) {
    console.error("fetchWeatherByCoords:", err);
    showError("Error fetching weather.");
  }
}

// fallback using IP geolocation
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

async function loadWeatherAutomatic() {
  showLoading();

  if ("geolocation" in navigator) {
    const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 };
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        await fetchWeatherByCoords(lat, lon);
      },
      async (err) => {
        console.warn("Geolocation denied or failed:", err);
        const ipCoords = await getCoordsFromIP();
        if (ipCoords) {
          await fetchWeatherByCoords(ipCoords.lat, ipCoords.lon);
        } else {
          showError("Cannot obtain your location for weather.");
        }
      },
      options
    );
  } else {
    const ipCoords = await getCoordsFromIP();
    if (ipCoords) {
      await fetchWeatherByCoords(ipCoords.lat, ipCoords.lon);
    } else {
      showError("Browser does not support geolocation.");
    }
  }
}

// initialize automatically
loadWeatherAutomatic();

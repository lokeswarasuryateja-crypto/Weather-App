const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();

    cityInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    getWeather(city);
});

async function getWeather(city) {
    
    
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = "";

    document.getElementById("description").textContent = "Loading...";


    try {
        // Step 1: Find city location
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const location = geoData.results[0];

        // Step 2: Get weather details
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=6`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Step 5: Display 5-day forecast

const daily = weatherData.daily;

const forecastContainer = document.getElementById("forecast");

forecastContainer.innerHTML = "";

for (let i = 1; i < 6; i++) {

    const date = new Date(daily.time[i]);

    const day = date.toLocaleDateString("en-US", {
        weekday: "short"
    });

    const dateNumber = date.getDate();
    const month = date.toLocaleDateString("en-US", {
    month: "short"
    });

    const maxTemp = Math.round(daily.temperature_2m_max[i]);
    const minTemp = Math.round(daily.temperature_2m_min[i]);

    const code = daily.weather_code[i];

    let icon = "🌤️";

    if (code === 0) {
        icon = "☀️";
    } else if (code <= 3) {
        icon = "🌤️";
    } else if (code <= 48) {
        icon = "🌫️";
    } else if (code <= 67) {
        icon = "🌧️";
    } else if (code <= 77) {
        icon = "❄️";
    } else if (code <= 82) {
        icon = "🌦️";
    } else {
        icon = "⛈️";
    }

    const forecastCard = document.createElement("div");

    forecastCard.className = "forecast-day";

    forecastCard.innerHTML = `
    <p>${day}</p>
    <p>${dateNumber} ${month}</p>
    <p class="forecast-icon">${icon}</p>
    <p>${maxTemp}° / ${minTemp}°</p>
`;

    forecastContainer.appendChild(forecastCard);
}

        // Step 3: Display weather
        document.getElementById("cityName").textContent = location.name;

        document.getElementById("temperature").textContent =
            Math.round(current.temperature_2m) + "°C";

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m + "%";

        document.getElementById("wind").textContent =
            current.wind_speed_10m + " km/h";

        // Step 4: Weather condition
        const code = current.weather_code;
        let description = "Unknown";
        let icon = "🌤️";

        if (code === 0) {
            description = "Clear Sky";
            icon = "☀️";
        } else if (code <= 3) {
            description = "Partly Cloudy";
            icon = "🌤️";
        } else if (code <= 48) {
            description = "Foggy";
            icon = "🌫️";
        } else if (code <= 67) {
            description = "Rainy";
            icon = "🌧️";
        } else if (code <= 77) {
            description = "Snowy";
            icon = "❄️";
        } else if (code <= 82) {
            description = "Rain Showers";
            icon = "🌦️";
        } else if (code <= 86) {
            description = "Snow Showers";
            icon = "🌨️";
        } else {
            description = "Thunderstorm";
            icon = "⛈️";
        }

        document.getElementById("description").textContent = description;
        document.querySelector(".weather-icon").textContent = icon;

} catch (error) {
    errorMessage.textContent = "City not found. Please enter a valid city name.";
    console.log(error);
}
}